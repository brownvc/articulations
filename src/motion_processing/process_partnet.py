from pathlib import Path
import json
import trimesh
from objects import *
import networkx as nx
from dsl import *
from collections import defaultdict
import copy


partnet_dataset_dir = '../data/partnet/partnet-mobility-v0/dataset'
partnet_precomputed_json_dir = '../data/partnet/precomputed'
partnet_json_dir = '../../../server_jsons/partnetsim/'
partnet_json_intermediate_dir = 'server_jsons_intermediate/partnetsim/'
partnet_embedding_dir = 'charlesq34_ae/data/partnet/embedding_results'

def merge_mesh(mesh, input_mesh):

    new_mesh = copy.deepcopy(input_mesh)
    if mesh is None:
        mesh = new_mesh
    else:
        new_mesh.faces = new_mesh.faces + mesh.vertices.shape[0]
        mesh.faces = np.concatenate((mesh.faces, new_mesh.faces))
        mesh.vertices = np.concatenate((mesh.vertices, new_mesh.vertices))

    return mesh

def load_mesh(obj_filename):
    tri_obj = trimesh.load_mesh(obj_filename)
    if tri_obj.is_empty:
        return None
    if type(tri_obj) is trimesh.scene.scene.Scene:
        tri_mesh = tri_obj.dump(True)
    else:
        tri_mesh = tri_obj

    return tri_mesh

def build_parts_adj_graph(precomputed_json_file):

    graph = nx.Graph()

    with open(precomputed_json_file) as json_file:
        conn_graph = json.load(json_file)['connectivityGraph']
        for si in range(len(conn_graph)):
            graph.add_node(si)
            for ei in conn_graph[si]:
                e_tuple = (si, ei)
                graph.add_edge(*e_tuple)

    return graph

def build_parts(precomputed_json_file, mesh_dir, id2node):
    all_parts = []
    with open(precomputed_json_file) as json_file:
         part_jos = json.load(json_file)['parts']
         for part_jo in part_jos:
             node_jos = part_jo['ids']
             subparts = []
             subpart_id = 0
             part_mesh = None
             part_mesh_dict = dict()
             acc_i = 0
             for node_id in node_jos:
                node = id2node[node_id]
                mesh = None
                for obj in node.objs:
                    new_mesh = load_mesh(os.path.join(mesh_dir, obj + '.obj'))
                    mesh = merge_mesh(mesh, new_mesh)
                subpart = build_subpart(subpart_id, node.objs, mesh)
                part_mesh = merge_mesh(part_mesh, mesh)
                for i in range(mesh.faces.shape[0]):
                    part_mesh_dict[acc_i] = subpart_id
                    acc_i = acc_i + 1 
                subpart_id += 1
                subparts.append(subpart)

             part = build_part(part_jo['pid'], subparts, part_mesh, part_mesh_dict)
             all_parts.append(part)
    return all_parts

class Node:
    def __init__(self):
        self.id = None
        self.objs = []

def recur_build_dict(node_jo, id2node):

    if 'children' not in node_jo:
        if 'objs' in node_jo:
            node = Node()
            node.id = node_jo['id']
            node.objs = node_jo['objs']
            id2node[node.id] = node
        return 

    for c_jo in node_jo['children']:
        recur_build_dict(c_jo, id2node) 


def build_dict(json_filename):

    print('json filename', json_filename)
    id2node = defaultdict()
    with open(json_filename) as json_file:
        jo = json.load(json_file)
        if 'children' not in jo[0]:
            if 'objs' in jo[0]:
                node = Node()
                node.id = jo[0]['id']
                node.objs = jo[0]['objs']
                id2node[node.id] = node
            return id2node

        for c_jo in jo[0]['children']:
            recur_build_dict(c_jo, id2node)

    return id2node

def process_object(data_root, obj_id):

    print('processing object:', obj_id)

    id2node = build_dict(os.path.join(str(data_root), 'result.json'))
    parts = build_parts(os.path.join(partnet_precomputed_json_dir, str(obj_id) + '.artpre.json'), os.path.join(str(data_root), 'textured_objs'), id2node)
    
    #for p in parts:
        #print(p.id)
        #for sp in p.subparts:
            #print(sp.id)
    
    graph = build_parts_adj_graph(os.path.join(partnet_precomputed_json_dir, str(obj_id) + '.artpre.json'))

    #print('graph edges', graph.edges)
    #for e in graph.edges:
        #print(e[0].id, e[1].id)

    obj = build_object(parts, graph)
    obj.id = obj_id

    return obj

def process_objects_partnet():
    path = Path(partnet_dataset_dir)
    for obj_dir in path.iterdir():
        if os.path.isfile(os.path.join(partnet_precomputed_json_dir, str(int(str(obj_dir).split('/')[-1])) + '.artpre.json')) is False:
            continue
        #if os.path.isfile(os.path.join(partnet_json_intermediate_dir, str(int(str(obj_dir).split('/')[-1])) + '.json')) is True:
            #continue
        obj = process_object(obj_dir, int(str(obj_dir).split('/')[-1]))
        obj_to_json(obj, partnet_json_intermediate_dir, str(obj.id))

if __name__ == '__main__':
    process_objects_partnet()