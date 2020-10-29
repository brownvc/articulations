from utils_points import *
from dsl import *
import trimesh

def update_region(region):
    region.box = compute_box(region.pc)

def build_subpart(id, mesh_ids, mesh):
    subpart = Subpart()
    subpart.id = id
    subpart.mesh_ids = mesh_ids
    subpart.mesh = mesh 
    return subpart

def build_part(id, subparts, mesh, mesh_dict):
    part = Part()
    part.id = id
    
    part.pc, part.pc_normals, face_indices = compute_pc(mesh, PART_POINT_NUM)

    pc_list = part.pc.tolist()
    pc_normals_list = part.pc_normals.tolist()

    subpart_pc_dict = defaultdict(list)
    subpart_pc_normals_dict = defaultdict(list)
    for i in range(len(pc_list)):
        point = pc_list[i]
        point_normal = pc_normals_list[i]
        face_index = face_indices[i]
        subpart_index = mesh_dict[face_index]
        subpart_pc_dict[subpart_index].append(point)
        subpart_pc_normals_dict[subpart_index].append(point_normal)


    subpart_sample_num = 6
    for i in range(len(subparts)):
        subparts[i].pc = np.array(subpart_pc_dict[i])
        subparts[i].pc_normals = np.array(subpart_pc_normals_dict[i])
        if subparts[i].pc.shape[0] < subpart_sample_num:
            subparts[i].pc, subparts[i].pc_normals, face_indices = compute_pc(subparts[i].mesh, subpart_sample_num)

    '''
    smallest_subpart_area = np.Inf
    smallest_subpart_index = 0
    total_area = 0

    for i in range(len(subparts)):
        area = subparts[i].mesh.area
        total_area += area
        if area < smallest_subpart_area:
            smallest_subpart_area = area
            smallest_subpart_index = i
    
    least_point_num = 3
    total_point_num = 1000

    while (least_point_num / (smallest_subpart_area / total_area)) > total_point_num:
        total_point_num += 100
        if total_point_num > 2000:
            break

    print('total_point_num', total_point_num)
    print('number of subparts', len(subparts))

    for sp in subparts:
        subpart_sample_num = int(max(3, total_point_num * (sp.mesh.area / total_area)))
        print('subpart_sample_num', subpart_sample_num)
        sp.pc, sp.pc_normals, face_indices = compute_pc(sp.mesh, subpart_sample_num)

    # sample subpart propotional to the area of triangles, the smallest gets 10 or somehing like that, still a fixed number of part, like 1000, but iterate 
    # each supart and take corresponding sample, if  
    '''

    part.subparts = subparts
    return part

def build_joint(moving_part, base_part):
    joint = Joint()
    point2idx = defaultdict()

    pc = []
    pc_labels = []
    pc_normals = []

    index = 0
    while index < len(moving_part.pc):
        point = moving_part.pc[index]
        point2idx[tuple(point)] = index
        pc.append(point)
        pc_normals.append(moving_part.pc_normals[index])
        pc_labels.append(0)
        index += 1

    #print('start pc2 building...')

    while index < len(moving_part.pc) + len(base_part.pc):
        shifted_index = index - len(moving_part.pc)
        point = base_part.pc[shifted_index]
        point2idx[tuple(point)] = index
        pc.append(point)
        pc_normals.append(base_part.pc_normals[shifted_index])
        pc_labels.append(1)
        index += 1

    #print('start contact building...')
    pc_nn_distances = generate_nn_distances(moving_part, base_part)

    #for point in contact_pc:
        #pc_labels[point2idx[tuple(point)]] = 0
    
    #joint.pc = np.array(np.concatenate((moving_part.pc, base_part.pc)))
    #joint.pc_normals = np.array(np.concatenate((moving_part.pc_normals, base_part.pc_normals)))
    #joint.pc_labels = np.array(np.concatenate((np.zeros(moving_part.pc.shape[0]), np.ones(base_part.pc.shape[0]))))
    
    joint.pc = np.array(pc)
    joint.pc_normals = np.array(pc_normals)
    joint.pc_labels = np.array(pc_labels)
    joint.pc_nn_distances = np.array(pc_nn_distances)
    
    joint.moving_part_id = moving_part.id
    joint.base_part_id = base_part.id

    return joint

def build_object(parts, graph):
    obj = Object()
    obj.parts = parts

    for e in graph.edges:
        joint = build_joint(obj.parts[e[0]], obj.parts[e[1]])
        obj.joints.append(joint)
        joint = build_joint(obj.parts[e[1]], obj.parts[e[0]])
        obj.joints.append(joint)

    return obj

def generate_nn_distances(moving_part, base_part):
    
    pc1 = moving_part.pc
    pc2 = base_part.pc

    dist = cdist(pc1, pc2)

    pc_nn_distances = []
    for i in range(dist.shape[0]):
        d = min(dist[i, :])    
        pc_nn_distances.append(d)

    for i in range(dist.shape[1]):
        d = min(dist[:, i])    
        pc_nn_distances.append(d)

    return pc_nn_distances

# operators ------------------------------------------------------------------------------------------

def get_contact(region1, region2):

    pc1 = region1.pc
    pc1_point_number = pc1.shape[0]
    pc2 = region2.pc
    pc2_point_number = pc2.shape[0]

    dist = cdist(pc1, pc2)

    max_dist = dist.max(axis=0)
    max_dist = max_dist.max()
    min_dist = dist.min(axis=0)
    min_dist = min_dist.min()
    dis_tor = 1.5 * min_dist

    flat_dist = dist.flatten()
    
    k = JOINT_POINT_NUM_MAX
    idx = np.argpartition(flat_dist, k)

    index1_set = set()
    index2_set = set()
    for i in idx[:k]:
        index1 = i // pc2_point_number
        index2 = i % pc2_point_number
        index1_set.add(index1)
        index2_set.add(index2)

    pc1_idx = np.array(list(index1_set))
    pc_region_1 = pc1[pc1_idx]
    #pc_region_1_normals = pc1_normals[pc1_idx]

    pc2_idx = np.array(list(index2_set))
    pc_region_2 = pc2[pc2_idx]
    #pc_region_2_normals = pc2_normals[pc2_idx]

    contact_pc = np.concatenate((pc_region_1, pc_region_2), axis=0)
    #contact_pc_normals = np.concatenate((pc_region_1_normals, pc_region_2_normals), axis=0)

    region = Region()
    
    region.pc = contact_pc
    region.update()

    return region

def proj_on_plane(input_vec, normal):
    normal = np.array(normal)
    normal = normal / np.linalg.norm(normal)
    proj_input_on_normal = np.dot(normal, input_vec) * normal
    proj_on_plane = input_vec - proj_input_on_normal
    return proj_on_plane

def axis_closest_to_dir(region, dir):
    dot1 = abs(np.dot(region.axis1.direction, dir))
    dot2 = abs(np.dot(region.axis2.direction, dir))
    dot3 = abs(np.dot(region.axis3.direction, dir))
    index = np.argmax([dot1, dot2, dot3])
    if index == 0:
        return region.axis1
    if index == 1:
        return region.axis2
    if index == 2:
        return region.axis3

def default_lever_arm(region, rot_axis, origin):
    
    axis1 = region.axis1.direction * region.axis1.length
    dist_top = np.linalg.norm(region.axis1.top - origin)
    dist_bot = np.linalg.norm(region.axis1.bottom - origin)
    if dist_top < dist_bot:
        axis1 = -axis1
    
    projected_axis1 = proj_on_plane(axis1, rot_axis)
    print('axis1 direction', region.axis1.direction)
    print('axis1 length', region.axis1.length)
    print('projected axis1 direction', projected_axis1)
    print('projected_axis1 length', np.linalg.norm(projected_axis1))

    axis2 = region.axis2.direction * region.axis2.length
    dist_top = np.linalg.norm(region.axis2.top - origin)
    dist_bot = np.linalg.norm(region.axis2.bottom - origin)
    if dist_top < dist_bot:
        axis2 = -axis2

    projected_axis2 = proj_on_plane(axis2, rot_axis)
    print('axis2 direction', region.axis2.direction)
    print('axis2 length', region.axis2.length)
    print('projected axis2 direction', projected_axis2)
    print('projected_axis2 length', np.linalg.norm(projected_axis2))

    axis3 = region.axis3.direction * region.axis3.length
    dist_top = np.linalg.norm(region.axis2.top - origin)
    dist_bot = np.linalg.norm(region.axis3.bottom - origin)
    if dist_top < dist_bot:
        axis3 = -axis3

    projected_axis3 = proj_on_plane(axis3, rot_axis)
    print('axis3 direction', region.axis3.direction)
    print('axis3 length', region.axis3.length)
    print('projected axis3 direction', projected_axis3)
    print('projected_axis3 length', np.linalg.norm(projected_axis3))

    if np.linalg.norm(projected_axis1) > np.linalg.norm(projected_axis2) and np.linalg.norm(projected_axis1) > np.linalg.norm(projected_axis3):
        print('axis1 as lever')
        return projected_axis1
    
    if np.linalg.norm(projected_axis2) > np.linalg.norm(projected_axis1) and np.linalg.norm(projected_axis2) > np.linalg.norm(projected_axis3):
        print('axis2 as lever')
        return projected_axis2

    if np.linalg.norm(projected_axis3) > np.linalg.norm(projected_axis1) and np.linalg.norm(projected_axis3) > np.linalg.norm(projected_axis2):
        print('axis3 as lever')
        return projected_axis3

def default_reference_vector(base_part, moving_lever, rot_axis, origin):
    
    base_axis1 = base_part.axis1.direction * base_part.axis1.length
    dist_top = np.linalg.norm(base_part.axis1.top - origin)
    dist_bot = np.linalg.norm(base_part.axis1.bottom - origin)
    if dist_top < dist_bot:
        base_axis1 = -base_axis1

    projected_base_axis1 = proj_on_plane(base_axis1, rot_axis)
    print('base_axis1 direction', base_axis1)
    print('base axis1 length', base_part.axis1.length)
    print('projected base axis1 direction', projected_base_axis1)
    print('projected base axis1 length', np.linalg.norm(projected_base_axis1))

    base_axis2 = base_part.axis2.direction * base_part.axis2.length
    dist_top = np.linalg.norm(base_part.axis2.top - origin)
    dist_bot = np.linalg.norm(base_part.axis2.bottom - origin)
    if dist_top < dist_bot:
        base_axis2 = -base_axis2

    projected_base_axis2 = proj_on_plane(base_axis2, rot_axis)
    print('base_axis2 direction', base_axis2)
    print('base axis2 length', base_part.axis2.length)
    print('projected base axis2 direction', projected_base_axis2)
    print('projected base axis2 length', np.linalg.norm(projected_base_axis2))

    base_axis3 = base_part.axis3.direction * base_part.axis3.length

    dist_top = np.linalg.norm(base_part.axis3.top - origin)
    dist_bot = np.linalg.norm(base_part.axis3.bottom - origin)
    if dist_top < dist_bot:
        base_axis3 = -base_axis3

    projected_base_axis3 = proj_on_plane(base_axis3, rot_axis)
    print('base_axis3 direction', base_axis3)
    print('base axis3 length', base_part.axis3.length)
    print('projected base axis3 direction', projected_base_axis3)
    print('projected base axis3 length', np.linalg.norm(projected_base_axis3))

    distance_1 = abs(np.linalg.norm(projected_base_axis1) - np.linalg.norm(moving_lever))
    distance_2 = abs(np.linalg.norm(projected_base_axis2) - np.linalg.norm(moving_lever))
    distance_3 = abs(np.linalg.norm(projected_base_axis3) - np.linalg.norm(moving_lever))

    if distance_1 <= distance_2 and distance_1 <= distance_3:
        print('base axis1 as lever')
        ref = projected_base_axis1
    
    if distance_2 <= distance_1 and distance_2 <= distance_3:
        print('base axis2 as lever')
        ref = projected_base_axis2

    if distance_3 <= distance_1 and distance_3 <= distance_2:
        print('base axis3 as lever')
        ref = projected_base_axis3


    ref = ref / np.linalg.norm(ref)


    return ref

def signed_angle_between(lever, ref, axis):
    
    ref = ref / np.linalg.norm(ref)
    lever = lever / np.linalg.norm(lever)
    angle = math.acos(np.dot(ref, lever))

    if np.dot(np.cross(ref, lever), axis) > 0:
        current_pose = angle
    else:
        current_pose = -angle
    
    return current_pose

'''
def get_attribute(attribute_name, region):
    return {
        'center': region.center,
        'center.x': region.center.x,
        'center.y': region.center.y,
        'center.z': region.center.z,
        'axis1.direction': region.axis1.direction,
        'axis1.length': region.axis1.length,
        'axis1.top': region.axis1.top,
        'axis1.bottom': region.axis1.bottom,
        'axis2.direction': region.axis2.direction,
        'axis2.length': region.axis2.length,
        'axis2.top': region.axis2.top,
        'axis2.bottom': region.axis2.bottom,
        'axis3.direction': region.axis3.direction,
        'axis3.length': region.axis3.length,
        'axis3.top': region.axis3.top,
        'axis3.bottom': region.axis3.bottom
    }.get(attribute_name, None)
'''


def get_attribute(attribute_name, region):
    variable = "region." + attribute_name
    print('variable', variable)
    val = eval(variable)
    print('val', val)
    return val


def filter(regions, attribute_name, range, ref=None):
    print('filtering')
    filtered_regions = []
    
    if ref is None:
        for r in regions:
            attribute = get_attribute(attribute_name, r)
            if np.isscalar(attribute) is True:
                if range[0] < attribute < range[1]:
                    filtered_regions.append(r)
            else:
                if range[0][0] < attribute[0] < range[1][0] and range[0][1] < attribute[1] < range[1][1] and range[0][2] < attribute[2] < range[1][2]:
                    filtered_regions.append(r)
    else:
        for r in regions:
            attribute = get_attribute(attribute_name, r)
            if range[0] < np.linalg.norm(attribute - ref) < range[1]:
                filtered_regions.append(r)

    return filtered_regions


def sort(regions, attribute_name, ref=None):
    print('sorting')
    if ref is None:
        return sorted(regions, key=lambda r: np.linalg.norm(get_attribute(attribute_name, r)))

    else:
        return sorted(regions, key=lambda r: np.linalg.norm(get_attribute(attribute_name, r) - ref))

def group(regions, n_groups, attribute_name, ref=None):

    print('grouping')
    data = []

    if ref is None:
        for r in regions:
            attribute = get_attribute(attribute_name, r)
            data.append(attribute)
            
    else:
        for r in regions:
            attribute = get_attribute(attribute_name, r)
            data.append(np.linalg.norm(attribute - ref))
    
    data = np.array(data)
    data = np.expand_dims(data, axis=1)
    print('data shape', data.shape)
    kmeans = KMeans(n_clusters=n_groups, random_state=0).fit(data)

    groups = []
    for i in range(0, n_groups):
        groups.append([])

    for i in range(len(regions)):
        groups[kmeans.labels_[i]].append(regions[i])

    return groups

def merge(regions):
    print('merging')
    merged_r = Region()

    merged_r.pc = regions[0].pc
    for i in range(1, len(regions)):
        merged_r.pc = np.concatenate((merged_r.pc, regions[i].pc))

    '''
    merged_r.pc_normals = regions[0].pc_normals
    for i in range(1, len(regions)):
        print('merged_r.pc_normals', merged_r.pc_normals)
        print('regions[i].pc_normals', regions[i].pc_normals)
        merged_r.pc_normals = np.concatenate((merged_r.pc_normals, regions[i].pc_normals))
    '''
    merged_r.update()
    return merged_r

def symmetries(regions, sym_type):
    pass



if __name__ == "__main__":
    pass
