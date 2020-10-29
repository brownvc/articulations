import trimesh
from sklearn.decomposition import PCA
from scipy.spatial.distance import cdist
from scipy.spatial import ConvexHull
from collections import defaultdict
from utils_math import *
#from utils_vis import *
#import open3d as o3d

PART_POINT_NUM = 1000
JOINT_POINT_NUM_MAX = int(PART_POINT_NUM * 0.05)
JOINT_POINT_NUM_MIN = int(PART_POINT_NUM * 0.01)

class BoundingBox:
    def __init__(self):
        self.pos = None
        self.dir_1 = None
        self.dir_2 = None
        self.dir_3 = None
        self.size_1 = None
        self.size_2 = None  
        self.size_3 = None
        self.center = None
        self.dir_1_top = None
        self.dir_1_bottom = None
        self.dir_2_top = None
        self.dir_2_bottom = None
        self.dir_3_top = None
        self.dir_3_bottom = None

def compute_scale(pc):
    obb_pca = compute_box(pc)
    scale = max(max(obb_pca.x_size, obb_pca.y_size), obb_pca.z_size)
    return scale

def sample_mesh(mesh, sample_count):
    # tri_mesh = trimesh.Trimesh(mesh.get_vertex_positions(), mesh.get_face_indices())
    pc, face_indices = trimesh.sample.sample_surface(mesh, sample_count)
    return pc, face_indices

def compute_pc(mesh, pc_num):
    pc, face_indices = sample_mesh(mesh, pc_num)

    pc_normals = []
    for i in range(len(pc)):
        point = pc[i]
        face_index = face_indices[i]
        point_normal = get_point_normal(point, face_index, mesh)
        pc_normals.append(point_normal)

    pc_normals = np.array(pc_normals)

    # view_points_with_arrows([pc], [pc_normals])

    return pc, pc_normals, face_indices


def is_touching_pc_to_pc(pc1, pc2):
    obb_pca_1 = compute_box(pc1)
    obb_pca_2 = compute_box(pc2)

    scale1 = max(max(obb_pca_1.size_0, obb_pca_1.size_1), obb_pca_1.size_2)
    scale2 = max(max(obb_pca_2.size_0, obb_pca_2.size_1), obb_pca_2.size_2)

    touching_tor = 0.03 * max(scale1, scale2)
    dis = get_spatial_distance(pc1, pc2)
    if dis < touching_tor:
        return True
    else:
        return False

def is_touching_point_to_pc(p, pc):
    obb_pca = compute_box(pc)

    scale = max(max(obb_pca.size_x, obb_pca.size_y), obb_pca.size_z)

    touching_tor = 0.05 * scale
    dis = get_spatial_distance(p, pc)
    if dis < touching_tor:
        return True
    else:
        return False

def get_spatial_distance(pc1, pc2):
    dist = cdist(pc1, pc2)
    min_dist = dist.min(axis=0)
    min_dist = min_dist.min()

    return min_dist

def get_area(p0, p1, p2):

    a = cal_vec_length(p0 - p1)
    b = cal_vec_length(p1 - p2)
    c = cal_vec_length(p2 - p0)
    p = (a + b + c) / 2

    tmp = p * (p - a) * (p - b) * (p - c)

    tmp = max(0, tmp)

    area = math.sqrt(tmp)
    return area


def get_point_normal(point, face_index, mesh):

    f = mesh.faces[face_index]

    normal_0 = mesh.vertex_normals[f[0]]
    normal_1 = mesh.vertex_normals[f[1]]
    normal_2 = mesh.vertex_normals[f[2]]

    p0 = mesh.vertices[f[0]]
    p1 = mesh.vertices[f[1]]
    p2 = mesh.vertices[f[2]]

    area_2 = get_area(point, p0, p1)
    area_0 = get_area(point, p1, p2)
    area_1 = get_area(point, p2, p0)

    weight_0 = area_0 / (area_0 + area_1 + area_2)
    weight_1 = area_1 / (area_0 + area_1 + area_2)
    weight_2 = area_2 / (area_0 + area_1 + area_2)

    point_normal = normal_0 * weight_0 + normal_1 * weight_1 + normal_2 * weight_2

    return normalize(point_normal)


def get_length_along_dir(region, direction):
    pc = region.pc
    return get_length_along_dir_pcversion(pc, direction)

def get_length_along_dir_pcversion(pc, direction):
    direction = direction / np.linalg.norm(direction)
    projections = np.matmul(direction, pc.transpose()).transpose()
    min_coord = projections.min()
    max_coord = projections.max()
    length = max_coord - min_coord

    bottom = direction * min_coord
    top = direction * max_coord

    print('length', length)
    print('top', top)
    print('bottom', bottom)

    return length, bottom, top 

def get_region_bound_centers(region, dir1, dir2, dir3):
    return get_region_bound_centers_pcversion(region.pc, dir1, dir2, dir3)
    
def get_region_bound_centers_pcversion(pc, dir1, dir2, dir3):
    length1, bottom1, top1 = get_length_along_dir_pcversion(pc, dir1)
    length2, bottom2, top2 = get_length_along_dir_pcversion(pc, dir2) 
    length3, bottom3, top3 = get_length_along_dir_pcversion(pc, dir3)

    dir1_region_vec = dir1 * length1
    dir2_region_vec = dir2 * length2
    dir3_region_vec = dir3 * length3

    base_corner = bottom1 + bottom2 + bottom3

    dir1_face_center1 = base_corner + 0.5 * dir2_region_vec + 0.5 * dir3_region_vec
    dir1_face_center2 = base_corner + 0.5 * dir2_region_vec + 0.5 * dir3_region_vec + dir1_region_vec

    dir2_face_center1 = base_corner + 0.5 * dir1_region_vec + 0.5 * dir3_region_vec
    dir2_face_center2 = base_corner + 0.5 * dir1_region_vec + 0.5 * dir3_region_vec + dir2_region_vec

    dir3_face_center1 = base_corner + 0.5 * dir1_region_vec + 0.5 * dir2_region_vec
    dir3_face_center2 = base_corner + 0.5 * dir1_region_vec + 0.5 * dir2_region_vec + dir3_region_vec

    region_center = base_corner + 0.5 * dir2_region_vec + 0.5 * dir3_region_vec + 0.5 * dir1_region_vec

    return (region_center, dir1_face_center2, dir1_face_center1, dir2_face_center2, dir2_face_center1, dir3_face_center2, dir3_face_center1)


def compute_box(points):

    box_pca = compute_box_pca(points)
    return box_pca
    '''
    box_minvol = None
    box_pca = None

    try:
        box_minvol = compute_box_minvol(points)
    except:
        print('min vol box computation fails, initiating pca box computation', 'number of points', points.shape[0])
        box_pca = compute_box_pca(points)
    
    if box_pca is None:
        box_pca = compute_box_pca(points)
    
    if box_minvol is not None and box_pca is not None:
        vol_box_minvol = box_minvol.size_1 * box_minvol.size_2 * box_minvol.size_3
        vol_box_pca = box_pca.size_1 * box_pca.size_2 * box_pca.size_3
        if vol_box_minvol < vol_box_pca:
            box_final = box_minvol
        else:
            box_final = box_pca
    else:
        box_final = box_pca

    tmp = [box_final.center, box_final.dir_1_top, box_final.dir_1_bottom, box_final.dir_2_top, box_final.dir_2_bottom, box_final.dir_3_top, box_final.dir_3_bottom]
    pc = np.array(tmp)
    vis_list = [pc, points]
    view_points_3d(vis_list)
    
    return box_final
    '''

def decide_dir(indir):
    
    dot1 = np.dot(indir, [1, 0, 0])
    dot2 = np.dot(indir, [0, 1, 0])
    dot3 = np.dot(indir, [0, 0, 1])

    indir_val = max(dot1, max(dot2, dot3))
    
    negative_indir = -indir

    dot1 = np.dot(negative_indir, [1, 0, 0])
    dot2 = np.dot(negative_indir, [0, 1, 0])
    dot3 = np.dot(negative_indir, [0, 0, 1])

    negative_indir_val = max(dot1, max(dot2, dot3))

    if indir_val > negative_indir_val:
        return indir
    else:
        return negative_indir


import time
def compute_box_pca(points):
    
    center = points.mean(axis=0, keepdims=True)
    points_centered = points - center
    center = center[0, :]

    pca = PCA()
    pca.fit(points_centered)
    pcomps = pca.components_

    points_local = np.matmul(pcomps, points_centered.transpose()).transpose()
    size = points_local.max(axis=0) - points_local.min(axis=0)

    xdir = pcomps[0, :]
    xdir /= np.linalg.norm(xdir)
    size1, bot, top = get_length_along_dir_pcversion(points_centered, xdir)
    xdir = decide_dir(xdir)
    print('size1', size1)

    ydir = pcomps[1, :]
    ydir /= np.linalg.norm(ydir)
    size2, bot, top = get_length_along_dir_pcversion(points_centered, ydir)
    ydir = decide_dir(ydir)    
    print('size2', size2)

    zdir = np.cross(xdir, ydir)
    zdir /= np.linalg.norm(zdir)
    size3, bot, top = get_length_along_dir_pcversion(points_centered, zdir)
    zdir = decide_dir(zdir)

    axes = [(xdir, size1), (ydir, size2), (zdir, size3)]
    sorted_axes = sorted(axes, key=lambda v: v[1], reverse=True)
    print('sorted_axes', sorted_axes)

    box = BoundingBox()
    box.pos = center
    box.dir_1 = sorted_axes[0][0]
    box.size_1 = sorted_axes[0][1]

    box.dir_2 = sorted_axes[1][0]
    box.size_2 = sorted_axes[1][1]

    box.dir_3 = sorted_axes[2][0]
    box.size_3 = sorted_axes[2][1] 

    ret = get_region_bound_centers_pcversion(points, box.dir_1, box.dir_2, box.dir_3)
    box.center = ret[0]
    box.dir_1_top = ret[1]
    box.dir_1_bottom = ret[2]
    box.dir_2_top = ret[3]
    box.dir_2_bottom = ret[4]
    box.dir_3_top = ret[5]
    box.dir_3_bottom = ret[6]

    
    return box

def compute_box_minvol(points):
    
    box = BoundingBox()

    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(points)
    box_minvol = o3d.geometry.OrientedBoundingBox.create_from_points(pcd.points)
        
    corners = box_minvol.get_box_points()
    corners = np.asarray(corners)

    filtered_corners = [corners[0], corners[1], corners[2]]

    dir1 = corners[1] - corners[0]
    dir1 = dir1 / np.linalg.norm(dir1)
    size1, bot, top = get_length_along_dir_pcversion(points, dir1)
    dir1 = decide_dir(dir1)
    
    dir2 = corners[2] - corners[0]
    dir2 = dir2 / np.linalg.norm(dir2)
    size2, bot, top = get_length_along_dir_pcversion(points, dir2)
    dir2 = decide_dir(dir2)
    
    dir3 = np.cross(dir1, dir2)
    dir3 = dir3 / np.linalg.norm(dir3)
    size3, bot, top = get_length_along_dir_pcversion(points, dir2)
    dir3 = decide_dir(dir3)
    
    axes = [(dir1, size1), (dir2, size2), (dir3, size3)]
    sorted_axes = sorted(axes, key=lambda v: v[1], reverse=True)

    box.dir_1 = sorted_axes[0][0]
    box.size_1 = sorted_axes[0][1]
    box.dir_2 = sorted_axes[1][0]
    box.size_2 = sorted_axes[1][1]
    box.dir_3 = sorted_axes[2][0]
    box.size_3 = sorted_axes[2][1]
    
    ret = get_region_bound_centers_pcversion(points, box.dir_1, box.dir_2, box.dir_3)
    box.center = ret[0]
    box.dir_1_top = ret[1]
    box.dir_1_bottom = ret[2]
    box.dir_2_top = ret[3]
    box.dir_2_bottom = ret[4]
    box.dir_3_top = ret[5]
    box.dir_3_bottom = ret[6]

    return box

if __name__ == "__main__":

    
    np_points = np.random.rand(100, 3)
    compute_box_minvol(np_points)