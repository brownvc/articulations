from utils_math import *
from utils_points import *
import json
import numpy as np
from sklearn.cluster import KMeans

class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj,'toJSON'):
            return obj.toJSON()
        else:
            return json.JSONEncoder.default(self, obj)

class Axis:
    def __init__(self):
        self._direction = None
        self._length = None
        self._top = None
        self._bottom = None

    @property
    def direction(self):
        return self._direction

    @direction.setter
    def direction(self, input):
        self._direction = input

    @property
    def length(self):
        return self._length

    @length.setter
    def length(self, input):
        self._length = input

    @property
    def top(self):
        return self._top

    @top.setter
    def top(self, input):
        self._top = input

    @property
    def bottom(self):
        return self._bottom

    @bottom.setter
    def bottom(self, input):
        self._bottom = input

    def toJSON(self):

        json_dict = dict()

        if self._direction is not None:
            json_dict['direction'] = self._direction.tolist()

        if self._length is not None:
            json_dict['length'] = self._length
        
        if self._top is not None:
            json_dict['top'] = self._top.tolist()
        
        if self._bottom is not None:
            json_dict['bottom'] = self._bottom.tolist()

        return json_dict

    def fromJSON(self, json_dict):

        if 'direction' in json_dict:
            self._direction = np.array(json_dict['direction'])

        if 'length' in json_dict:
            self._length = json_dict['length']

        if 'top' in json_dict:
            self._top = np.array(json_dict['top'])

        if 'bottom' in json_dict:
            self._bottom = np.array(json_dict['bottom'])


class Region:
    def __init__(self):

        self.__box = None

        self._pc = None
        self._pc_normals = None

        self._center = None
        self._axis1 = None
        self._axis2 = None
        self._axis3 = None

    def update(self):

        box = compute_box(self._pc)

        self._center = box.center

        self.axis1.top = box.dir_1_top
        self.axis1.bottom = box.dir_1_bottom
        self.axis1.direction = box.dir_1
        self.axis1.length = box.size_1

        self.axis2.top = box.dir_2_top
        self.axis2.bottom = box.dir_2_bottom
        self.axis2.direction = box.dir_2
        self.axis2.length = box.size_2

        self.axis3.top = box.dir_3_top
        self.axis3.bottom = box.dir_3_bottom
        self.axis3.direction = box.dir_3
        self.axis3.length = box.size_3

    @property
    def pc(self):
        return self._pc

    @pc.setter
    def pc(self, input):
        self._pc = input

    @property
    def pc_normals(self):
        return self._pc_normals

    @pc_normals.setter
    def pc_normals(self, input):
        self._pc_normals = input

    @property
    def axis1(self):
        if self._axis1 is None:
            if self.__box is None:
                self.__box = compute_box(self._pc)
            self._axis1 = Axis()
            self._axis1.direction = self.__box.dir_1
            self._axis1.length = self.__box.size_1
            self._axis1.top = self.__box.dir_1_top
            self._axis1.bottom = self.__box.dir_1_bottom
        return self._axis1

    @property
    def axis2(self):
        if self._axis2 is None:
            if self.__box is None:
                self.__box = compute_box(self._pc)
            self._axis2 = Axis()
            self._axis2.direction = self.__box.dir_2
            self._axis2.length = self.__box.size_2
            self._axis2.top = self.__box.dir_2_top
            self._axis2.bottom = self.__box.dir_2_bottom
        return self._axis2

    @property
    def axis3(self):
        if self._axis3 is None:
            if self.__box is None:
                self.__box = compute_box(self._pc)
            self._axis3 = Axis()
            self._axis3.direction = self.__box.dir_3
            self._axis3.length = self.__box.size_3
            self._axis3.top = self.__box.dir_3_top
            self._axis3.bottom = self.__box.dir_3_bottom
        return self._axis3

    @property
    def center(self):
        if self._center is None:
            if self.__box is None:
                self.__box = compute_box(self._pc)
            self._center = self.__box.center
        
        return self._center

    def toJSON(self):

        json_dict = dict()

        if self.pc is not None:
            json_dict['pc'] = self._pc.tolist()

        if self.pc_normals is not None:
            json_dict['pc_normals'] = self._pc_normals.tolist()

        if self._axis1 is not None:
            json_dict['axis1'] = self._axis1.toJSON()

        if self._axis2 is not None:
            json_dict['axis2'] = self._axis2.toJSON()
        
        if self._axis3 is not None:
            json_dict['axis3'] = self._axis3.toJSON()

        if self._center is not None:
            json_dict['center'] = self._center.tolist()

        return json_dict

    def fromJSON(self, json_dict):
        if 'pc' in json_dict:
            self._pc = np.array(json_dict['pc'])

        if 'pc_normals' in json_dict:
            self._pc_normals = np.array(json_dict['pc_normals'])

        if 'axis1' in json_dict:
            self._axis1 = Axis()
            self._axis1.fromJSON(json_dict['axis1'])

        if 'axis2' in json_dict:
            self._axis2 = Axis()
            self._axis2.fromJSON(json_dict['axis2'])  

        if 'axis3' in json_dict:
            self._axis3 = Axis()
            self._axis3.fromJSON(json_dict['axis3'])  

        if 'center' in json_dict:
            self._center = np.array(json_dict['center'])    

class Subpart(Region):
    def __init__(self):
        Region.__init__(self)
        self.object_id = None
        self.id = None
        self.parent_id = None
        self.mesh_ids = []
        self.mesh = None
    
    def update(self):
        super().update()

    def toJSON(self):
        json_dict = Region.toJSON(self)

        if self.id is not None:
            json_dict['id'] = self.id

        if self.mesh_ids is not None:
            json_dict['mesh_ids'] = self.mesh_ids

        return json_dict

    def fromJSON(self, json_dict):
        Region.fromJSON(self, json_dict)

        if 'id' in json_dict:
            self.id = json_dict['id']

        if 'mesh_ids' in json_dict:
            self.mesh_ids = json_dict['mesh_ids']
    
class Part(Region):
    def __init__(self):
        Region.__init__(self)
        self.object_id = None
        self.id = None
        self.subparts = []

    def load_pc(self):
        if self._pc is None:
            self._pc = np.zeros((1, 3))
            for i in range(0, len(self.subparts)):
                if self.subparts[i].pc is not None:
                    self._pc = np.concatenate((self._pc, self.subparts[i].pc), axis=0)
            self._pc = self._pc[1:]

    def update(self):
        super().update()
        for sp in self.subparts:
            sp.update()

    @property
    def pc(self):
        if self._pc is None:
            self._pc = np.zeros((1, 3))
            for i in range(0, len(self.subparts)):
                if self.subparts[i].pc is not None:
                    self._pc = np.concatenate((self._pc, self.subparts[i].pc), axis=0)
            self._pc = self._pc[1:]
        
        return self._pc

    @Region.pc.setter
    def pc(self, value):
        Region.pc.fset(self, value)

    @property
    def pc_normals(self):
        if self._pc_normals is None:
            self._pc_normals = np.zeros((1,3)) 
            for i in range(0, len(self.subparts)):
                if self.subparts[i].pc_normals is not None:
                    self._pc_normals = np.concatenate((self._pc_normals, self.subparts[i].pc_normals), axis=0)
            self._pc_normals = self._pc_normals[1:]
        
        return self._pc_normals

    @Region.pc_normals.setter
    def pc_normals(self, value):
        Region.pc_normals.fset(self, value)

    def toJSON(self):
        json_dict = Region.toJSON(self)

        if self.id is not None:
            json_dict['id'] = self.id

        if self.subparts is not None:
            json_dict['subparts'] = self.subparts

        return json_dict

    def fromJSON(self, json_dict):
        Region.fromJSON(self, json_dict)

        if 'id' in json_dict:
            self.id = json_dict['id']

        if 'subparts' in json_dict:
            subpart_json_list = json_dict['subparts']
            for subpart_json in subpart_json_list:
                subpart = Subpart()
                subpart.fromJSON(subpart_json)
                self.subparts.append(subpart)

class Joint():
    def __init__(self):
        self.moving_part_id = None
        self.moving_part = None
        self.base_part_id = None
        self.base_part = None
        self.pc_labels = None
        self.pc_nn_distance = None
        self.features = None
        self.contacts = []

    def toJSON(self):

        json_dict = dict()

        if self.moving_part_id is not None:
            json_dict['moving_part_id'] = self.moving_part_id

        if self.base_part_id is not None:
            json_dict['base_part_id'] = self.base_part_id

        if self.features is not None:
            json_dict['features'] = self.features.tolist()

        if self.pc_labels is not None:
            json_dict['pc_labels'] = self.pc_labels.tolist()

        if self.pc_nn_distances is not None:
            json_dict['pc_nn_distances'] = self.pc_nn_distances.tolist()

        return json_dict

    def fromJSON(self, json_dict):

        if 'moving_part_id' in json_dict:
            self.moving_part_id = json_dict['moving_part_id']

        if 'base_part_id' in json_dict:
            self.base_part_id = json_dict['base_part_id']

        if 'pc_labels' in json_dict:
            self.pc_labels = np.array(json_dict['pc_labels'])
        
        if 'pc_nn_distances' in json_dict:
            self.pc_nn_distances = np.array(json_dict['pc_nn_distances'])

        if 'features' in json_dict:
            self.features = np.array(json_dict['features'])

class Object:
    def __init__(self):
        self.id = None
        self.parts = []
        self.joints = []

    def update(self):
        for p in self.parts:
            p.update()
        
    def toJSON(self):

        json_dict = dict()

        if self.id is not None:
            json_dict['id'] = self.id

        if self.parts is not None:
            json_dict['parts'] = self.parts

        if self.joints is not None:
            json_dict['joints'] = self.joints

        return json_dict

    def fromJSON(self, json_dict):
        if json_dict is not None:

            if 'id' in json_dict:
                self.id = json_dict['id']

            if 'parts' in json_dict:
                part_json_list = json_dict['parts']
                for part_json in part_json_list:
                    part = Part()
                    part.fromJSON(part_json)
                    self.parts.append(part)

            if 'joints' in json_dict:
                joint_jos = json_dict['joints']
                for joint_jo in joint_jos:
                    joint = Joint()
                    joint.fromJSON(joint_jo)
                    self.joints.append(joint)


def obj_to_json(obj, path, id):
    if os.path.exists(path) is False:
        os.makedirs(path)

    out = json.dumps(obj.toJSON(), cls=ComplexEncoder, indent=4)
    open(path + "/" + str(id) + ".json", "w").write(out)

def json_to_obj(filename):
    obj = Object()
    with open(filename) as json_file:
        object_json_dict = json.load(json_file)

    obj.fromJSON(object_json_dict)
    return obj


if __name__ == "__main__":
    pass





