from learning_G_learner import *
from learning_D_learner import *
from pathlib import Path
import os
import math
import shutil
from process_partnet import *
import time

cache_path = "caches"

class Cache:
    def __init__(self):
        if os.path.isfile(os.path.join(cache_path, 'axis_cache.joblib')) and os.path.isfile(os.path.join(cache_path, 'range_cache.joblib')):
            self.axis_cache = joblib.load(os.path.join(cache_path, 'axis_cache.joblib'))
            self.range_cache = joblib.load(os.path.join(cache_path, 'range_cache.joblib'))
        else:
            self.axis_cache = dict()
            self.range_cache = dict()

        self._finalizer = weakref.finalize(self, self.__save_state)
        self.object_dict = dict()

    def __save_state(self):
        #print('save state')
        joblib.dump(self.axis_cache, os.path.join(cache_path, 'axis_cache.joblib'))
        joblib.dump(self.range_cache, os.path.join(cache_path, 'range_cache.joblib'))

    def get_object(self, object_id):
        if object_id in self.object_dict:
            obj = self.object_dict[object_id]
            return obj
        else:
            return None

    def set_object(self, object_id, obj):
         self.object_dict[object_id] = obj
    
    def get_axis_rule_res(self, object_id, moving_part_id, base_part_id, rule_str):

        hash_object = hashlib.md5(rule_str.encode('utf-8'))
        value = hash_object.hexdigest()
        key = (object_id, moving_part_id, base_part_id, value)
        if key in self.axis_cache:
            return self.axis_cache[key]
        else:
            return None 

    def set_axis_rule_res(self, object_id, moving_part_id, base_part_id, rule_str, result):
        hash_object = hashlib.md5(rule_str.encode('utf-8'))
        value = hash_object.hexdigest()
        key = (object_id, moving_part_id, base_part_id, value)
        self.axis_cache[key] = result

    def get_range_rule_res(self, object_id, moving_part_id, base_part_id, rule_str):
        hash_object = hashlib.md5(rule_str.encode('utf-8'))
        value = hash_object.hexdigest()
        key = (object_id, moving_part_id, base_part_id, value)
        if key in self.axis_cache:
            return self.axis_cache[key]
        else:
            return None

    def set_range_rule_res(self, object_id, moving_part_id, base_part_id, rule_str, result):
        hash_object = hashlib.md5(rule_str.encode('utf-8'))
        value = hash_object.hexdigest()
        key = (object_id, moving_part_id, base_part_id, value)
        self.axis_cache[key] = result

class LearningSys:
    def __init__(self):        
        self.joint_learner_g = LearnerG()        
        self.axis_learner_g = LearnerG()
        self.range_learner_g = LearnerG()
        self.joint_learner_d = LearnerD()        
        self.axis_learner_d = LearnerD()
        self.range_learner_d = LearnerD()

class LearningData:
    def __init__(self):
        self.positive_joints = dict()
        self.negative_joints = dict()
        self.positive_axis_points = []
        self.negative_axis_points = []
        self.positive_range_points = []
        self.negative_range_points = []

class Collection:
    def __init__(self, id):
        self.id = id
        self.is_valid = True
        self.collection_folder_dir = os.path.join(cache_path, str(self.id))
        self.learning_sys_path = os.path.join(self.collection_folder_dir, 'learning_sys.joblib')
        self.learning_data_path = os.path.join(self.collection_folder_dir, 'learning_data.joblib')

        if os.path.isfile(self.learning_sys_path):
            self.learning_sys = joblib.load(self.learning_sys_path)
        else:
            self.learning_sys = LearningSys()

        if os.path.isfile(self.learning_data_path):
            self.learning_data = joblib.load(self.learning_data_path)
        else:
            self.learning_data = LearningData()

        self.joint_learner_update = True
        self.axis_learner_update = True
        self.range_learner_update = True

        self._finalizer = weakref.finalize(self, self.__save_state)

    def __save_state(self):
        print('save state')
        if self.is_valid:
            if os.path.exists(self.collection_folder_dir) is False:
                os.makedirs(self.collection_folder_dir)

            joblib.dump(self.learning_sys, self.learning_sys_path)
            joblib.dump(self.learning_data, self.learning_data_path)

    def add_joint(self, key, joint):
        print('add joint', 'collection:', self.id, 'joints in collecton:', len(self.learning_data.positive_joints))
        self.learning_data.positive_joints[key] = joint
        print('add joint succ', 'collection:', self.id, 'joints in collecton:', len(self.learning_data.positive_joints))
        if key in self.learning_data.negative_joints:
            self.learning_data.negative_joints.pop(key)
        self.joint_learner_update = True

    def remove_joint(self, key):
        print('remove joint', 'collection:', self.id, 'joints in collecton:', len(self.learning_data.positive_joints))
        joint_point = self.learning_data.positive_joints[key]
        embedding_size = joint_point.shape[1]
        print('embedding size', embedding_size)

        axis_points_to_remove = []
        for p in self.learning_data.positive_axis_points:
            if (p[0][:embedding_size] == joint_point[0]).all():
                print('remove axis point because of joint removal')
                axis_points_to_remove.append(p)
        
        for p in axis_points_to_remove:
            for i in range(len(self.learning_data.positive_axis_points)):
                if (p == self.learning_data.positive_axis_points[i]).all():
                    self.learning_data.positive_axis_points.pop(i)
                    break

        axis_points_to_remove = []
        for p in self.learning_data.negative_axis_points:
            if (p[0][:embedding_size] == joint_point[0]).all():
                print('remove axis point because of joint removal')
                axis_points_to_remove.append(p)
        
        for p in axis_points_to_remove:
            for i in range(len(self.learning_data.negative_axis_points)):
                if (p == self.learning_data.negative_axis_points[i]).all():
                    self.learning_data.negative_axis_points.pop(i)
                    break
        
        range_points_to_remove = []
        for p in self.learning_data.positive_range_points:
            if (p[0][:embedding_size] == joint_point[0]).all():
                print('remove axis point because of joint removal')
                range_points_to_remove.append(p)

        for p in range_points_to_remove:
            for i in range(len(self.learning_data.positive_range_points)):
                if (p == self.learning_data.positive_range_points[i]).all():
                    self.learning_data.positive_range_points.pop(i)
                    break

        range_points_to_remove = []
        for p in self.learning_data.negative_range_points:
            if (p[0][:embedding_size] == joint_point[0]).all():
                print('remove axis point because of joint removal')
                range_points_to_remove.append(p)

        for p in range_points_to_remove:
            for i in range(len(self.learning_data.negative_range_points)):
                if (p == self.learning_data.negative_range_points[i]).all():
                    self.learning_data.negative_range_points.pop(i)
                    break
        
        self.learning_data.positive_joints.pop(key)
        print('remove joint succ', 'collection:', self.id, 'joints in collecton:', len(self.learning_data.positive_joints))
        self.joint_learner_update = True
        
    def reject_joint(self, key, joint):
        print('reject joint', 'collection:', self.id, 'negative joints in collecton:', len(self.learning_data.negative_joints))
        self.learning_data.negative_joints[key] = joint
        print('reject joint succ', 'collection:', self.id, 'negative joints in collecton:', len(self.learning_data.negative_joints))
        self.joint_learner_update = True

    def predict_joint_prob(self, key, point):
        print('len of negative joints', len(self.learning_data.negative_joints))
        if key in self.learning_data.negative_joints:
            return False, -1

        self.update_joint_learner()

        if len(self.learning_data.negative_joints) != 0 and len(self.learning_data.positive_joints) != 0:
            mark, prob = self.learning_sys.joint_learner_d.predict_prob(point)
        else:
            mark, prob = self.learning_sys.joint_learner_g.predict_prob(point)

        print('predicted prob', prob)
        return mark, prob

    def update_joint_learner(self):
        if self.joint_learner_update is True:
            print('update joint learner', 'collection:', self.id, 'positive joints in collecton:', len(self.learning_data.positive_joints))
            print('update joint learner', 'collection:', self.id, 'negative joints in collecton:', len(self.learning_data.negative_joints))
            positive_points = []
            for key, joint_point in self.learning_data.positive_joints.items():
                positive_points.append(joint_point)
            negative_points = []
            for key, joint_point in self.learning_data.negative_joints.items():
                negative_points.append(joint_point)

            self.learning_sys.joint_learner_d.update(positive_points, negative_points)
            self.learning_sys.joint_learner_g.update(positive_points, negative_points)
            self.joint_learner_update = False

    def confirm_axis(self, p):
        print('add axis point', 'collection:', self.id, 'positive axis points in collecton:', len(self.learning_data.positive_axis_points))
        if any((p == x).all() for x in self.learning_data.positive_axis_points) is False:
            self.learning_data.positive_axis_points.append(p)
            self.axis_learner_update = True
            print('add axis point succ', 'collection:', self.id, 'positive axis points in collecton:', len(self.learning_data.positive_axis_points))
        
        for i in range(len(self.learning_data.negative_axis_points)):
            if (p == self.learning_data.negative_axis_points[i]).all():
                self.learning_data.negative_axis_points.pop(i)
                break
        
    def reject_axis(self, p):
        print('reject axis point', 'collection:', self.id, 'negative axis points in collecton:', len(self.learning_data.negative_axis_points))
        if any((p == x).all() for x in self.learning_data.negative_axis_points) is False:
            self.learning_data.negative_axis_points.append(p)
            self.axis_learner_update = True
            print('reject axis point succ', 'collection:', self.id, 'negative axis points in collecton:', len(self.learning_data.negative_axis_points))

        for i in range(len(self.learning_data.positive_axis_points)):
            if (p == self.learning_data.positive_axis_points[i]).all():
                self.learning_data.positive_axis_points.pop(i)
                break

    def predict_axis_prob(self, point):
        if any((point == x).all() for x in self.learning_data.negative_axis_points) is True:
            return False, -1
        print('predict axis point prob', 'collection:', self.id, 'positive axis points in collecton:', len(self.learning_data.positive_axis_points))
        print('predict axis point prob', 'collection:', self.id, 'negative axis points in collecton:', len(self.learning_data.negative_axis_points))
        self.update_axis_learner()

        if len(self.learning_data.negative_axis_points) != 0 and len(self.learning_data.positive_axis_points) != 0:
            mark, prob = self.learning_sys.axis_learner_d.predict_prob(point)
        else:
            mark, prob = self.learning_sys.axis_learner_g.predict_prob(point)

        print('predicted prob', prob)
        return mark, prob
    
    def update_axis_learner(self):
        if self.axis_learner_update is True:
            print('predict axis point prob', 'collection:', self.id, 'positive axis points in collecton:', len(self.learning_data.positive_axis_points))
            print('predict axis point prob', 'collection:', self.id, 'negative axis points in collecton:', len(self.learning_data.negative_axis_points))
            self.learning_sys.axis_learner_g.update(self.learning_data.positive_axis_points, self.learning_data.negative_axis_points)
            self.learning_sys.axis_learner_d.update(self.learning_data.positive_axis_points, self.learning_data.negative_axis_points)
            self.axis_learner_update = False

    def confirm_range(self, p):
        print('add range point', 'collection:', self.id, 'positive range points in collecton:', len(self.learning_data.positive_range_points))
        if any((p == x).all() for x in self.learning_data.positive_range_points) is False:
            self.learning_data.positive_range_points.append(p)
            self.range_learner_update = True
        print('add range point succ', 'collection:', self.id, 'positive range points in collecton:', len(self.learning_data.positive_range_points))

        for i in range(len(self.learning_data.negative_range_points)):
            if (p == self.learning_data.negative_range_points[i]).all():
                self.learning_data.negative_range_points.pop(i)
                break

    def reject_range(self, p):
        print('reject range point', 'collection:', self.id, 'negative range points in collecton:', len(self.learning_data.negative_range_points))
        if any((p == x).all() for x in self.learning_data.negative_range_points) is False:
            self.learning_data.negative_range_points.append(p)
            self.range_learner_update = True
            print('reject range point succ', 'collection:', self.id, 'negative range points in collecton:', len(self.learning_data.negative_range_points))
            
        for i in range(len(self.learning_data.positive_range_points)):
            if (p == self.learning_data.positive_range_points[i]).all():
                self.learning_data.positive_range_points.pop(i)
                break

    def predict_range_prob(self, point):
        if any((point == x).all() for x in self.learning_data.negative_range_points) is True:
            return False, -1

        self.update_range_learner()

        if len(self.learning_data.negative_range_points) != 0 and len(self.learning_data.positive_range_points) != 0:
            mark, prob = self.learning_sys.range_learner_d.predict_prob(point)
        else:
            mark, prob = self.learning_sys.range_learner_g.predict_prob(point)

        print('predicted prob', prob)
        return mark, prob

    def update_range_learner(self):
        if self.range_learner_update is True:
            print('update range learner', 'collection:', self.id, 'positive range points in collecton:', len(self.learning_data.positive_range_points))
            print('update range learner', 'collection:', self.id, 'negative range points in collecton:', len(self.learning_data.negative_range_points))
            self.learning_sys.range_learner_g.update(self.learning_data.positive_range_points, self.learning_data.negative_range_points)
            self.learning_sys.range_learner_d.update(self.learning_data.positive_range_points, self.learning_data.negative_range_points)
            print('update learner succ')
            self.range_learner_update = False

cache = Cache()
class CollectionManager:
    def __init__(self):

        self.id2collection = dict()

        if os.path.exists(cache_path) is True:
            path = Path(cache_path)
            for collection_dir in path.iterdir():
                if os.path.isdir(collection_dir) is True:
                    collection_id = int(str(collection_dir).split('/')[-1])
                    print('collection id', collection_id)
                    self.id2collection[collection_id] = Collection(collection_id)
        else:
            os.makedirs(cache_path) 

    def create_collection(self, info):
        id = int(info['collection_id'])
        self.id2collection[id] = Collection(id)

    def delete_collection(self, info):
        collection_id = int(info['collection_id'])
        if collection_id in self.id2collection:
            collection = self.id2collection.pop(collection_id)
            collection.is_valid = False
            if os.path.exists(collection.collection_folder_dir) is True: 
                shutil.rmtree(collection.collection_folder_dir)
                print('delete file', os.path.join(cache_path, str(collection_id)))

    def log_collections(self):
        log_path = "log"
        if os.path.exists(log_path) is False:
            os.makedirs(log_path)
        
        log_file = os.path.join(log_path, "joints")
        '''
        open(log_file, 'w').close()
        with open(log_file, 'w') as the_file: 
            for ki, c in self.id2collection.items():
                for joint_key, joint in c.learning_data.positive_joints.items():        
                    print('joint info', joint_key)
                    the_file.write(str(joint_key) + ",")
        '''

    def add_joint(self, info):

        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        object_id = int(object_name.split('.')[1])
    
        joint = get_joint(object_name, moving_part_id, base_part_id)
        X = joint.features
        X = np.expand_dims(X, axis=0)

        self.id2collection[collection_id].add_joint((object_id, moving_part_id, base_part_id), X)
        #self.log_collections()

    def remove_joint(self, info):

        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        object_id = int(object_name.split('.')[1])

        self.id2collection[collection_id].remove_joint((object_id, moving_part_id, base_part_id))

    def reject_joint(self, info):


        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        object_id = int(object_name.split('.')[1])

        joint = get_joint(object_name, moving_part_id, base_part_id)
        X = joint.features
        X = np.expand_dims(X, axis=0)

        self.id2collection[collection_id].reject_joint((object_id, moving_part_id, base_part_id), X)

    def judge_joint(self, info):

        object_name = info['object_id']
        collection_id = int(info['collection_id'])
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        object_id = int(object_name.split('.')[1])

        joint = get_joint(object_name, moving_part_id, base_part_id)

        X = joint.features
        X = np.expand_dims(X, axis=0)
        print('judge joint, point shape', X.shape)
        mark, prob = self.id2collection[collection_id].predict_joint_prob((object_id, moving_part_id, base_part_id), X)
        return mark, prob

    def run_axis_rule(self, info, update_cache=False):

        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        motion_type = info['motion_type']
        axis_operation_code = info['axis_rule']

        object_id = int(object_name.split('.')[1])
        
        res = cache.get_axis_rule_res(object_id, moving_part_id, base_part_id, axis_operation_code)
        if res is not None:
            print('from axis rule cache')
            return res
        
        joint = get_joint(object_name, moving_part_id, base_part_id)

        ret = execute_axis_operation_code(axis_operation_code, joint)
        if 'axis' not in ret:
            return ret

        axis = ret['axis']
        origin = ret['origin']

        if type(axis) != list:
            axis = axis.tolist()

        if type(origin) != list:
            origin = origin.tolist()

        ret = dict()
        ret['axis'] = axis
        ret['origin'] = origin
        
        cache.set_axis_rule_res(object_id, moving_part_id, base_part_id, axis_operation_code, ret)
        
        return ret

    def reject_axis_rule(self, info):
        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        motion_type = info['motion_type']
        axis_operation_code = info['axis_rule']

        motion_type_label = 0
        if motion_type != 'translation':
            motion_type_label = 1

        motion_type_label = np.expand_dims(motion_type_label, axis=0)

        joint = get_joint(object_name, moving_part_id, base_part_id)

        ret = self.run_axis_rule(info, True)
        if 'axis' not in ret:
            return ret
        axis = ret['axis']
        origin = ret['origin']

        axis = np.array(axis)
        origin = np.array(origin)

        X = np.concatenate((joint.features, motion_type_label, axis, origin))
        X = np.expand_dims(X, axis=0)
        self.id2collection[collection_id].reject_axis(X)

    def confirm_axis_rule(self, info):

        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        motion_type = info['motion_type']
        axis_operation_code = info['axis_rule']

        motion_type_label = 0
        if motion_type != 'translation':
            motion_type_label = 1

        motion_type_label = np.expand_dims(motion_type_label, axis=0)

        joint = get_joint(object_name, moving_part_id, base_part_id)

        ret = self.run_axis_rule(info, True)
        if 'axis' not in ret:
            return ret
        axis = ret['axis']
        origin = ret['origin']

        axis = np.array(axis)
        origin = np.array(origin)

        X = np.concatenate((joint.features, motion_type_label, axis, origin))
        X = np.expand_dims(X, axis=0)
        self.id2collection[collection_id].confirm_axis(X)

    def judge_axis_rule(self, info):

        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        motion_type = info['motion_type']
        axis_operation_code = info['axis_rule']

        joint = get_joint(object_name, moving_part_id, base_part_id)

        motion_type_label = 0
        if motion_type != 'translation':
            motion_type_label = 1
        
        motion_type_label = np.expand_dims(motion_type_label, axis=0)

        ret = self.run_axis_rule(info, False)
        if 'axis' not in ret:
            return ret
        axis = ret['axis']
        origin = ret['origin']

        axis = np.array(axis)
        origin = np.array(origin)

        X = np.concatenate((joint.features, motion_type_label, axis, origin))
        X = np.expand_dims(X, axis=0)
        mark, prob = self.id2collection[collection_id].predict_axis_prob(X)
        print('judge_axis_rule return')

        ret = dict()
        ret['decision'] = mark
        ret['score'] = prob

        return ret


    def run_range_rule(self, info, update_cache=False):

        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        motion_type = info['motion_type']
        axis_operation_code = info['axis_rule']
        range_operation_code = info['range_rule']
        object_id = int(object_name.split('.')[1])

        ret = self.run_axis_rule(info, update_cache)
        if 'axis' not in ret:
            return ret
        axis = ret['axis']
        origin = ret['origin']
        
        res = cache.get_range_rule_res(object_id, moving_part_id, base_part_id, range_operation_code)
        if res is not None:
            print('from range rule cache')
            return res

        joint = get_joint(object_name, moving_part_id, base_part_id)

        ret = execute_range_operation_code(range_operation_code, joint, axis, origin)
        if 'ref' not in ret:
            return ret

        ref = ret['ref']
        current_pose = ret['current_pose']
        min_range = ret['min_range']
        max_range = ret['max_range']

        if type(ref) != list:
            ref = ref.tolist()

        ret = dict()
        ret['ref'] = ref
        ret['current_pose'] = current_pose
        ret['min_range'] = min_range
        ret['max_range'] =  max_range
        
        cache.set_range_rule_res(object_id, moving_part_id, base_part_id, range_operation_code, ret)
        
        return ret
    
    def reject_range_rule(self, info):
        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        motion_type = info['motion_type']
        axis_operation_code = info['axis_rule']
        range_operation_code = info['range_rule']
        object_id = int(object_name.split('.')[1])

        joint = get_joint(object_name, moving_part_id, base_part_id)

        ret = self.run_axis_rule(info, True)
        if 'axis' not in ret:
            return ret
        axis = ret['axis']
        origin = ret['origin']

        axis = np.array(axis)
        origin = np.array(origin)

        ret = self.run_range_rule(info, True)
        if 'ref' not in ret:
            return ret
            
        ref = ret['ref']
        current_pose = ret['current_pose']
        min_range = ret['min_range']
        max_range = ret['max_range']

        ref = np.array(ref)
        min_range = np.expand_dims(min_range, axis=0)
        max_range = np.expand_dims(max_range, axis=0)

        motion_type_label = 0
        if motion_type != 'translation':
            motion_type_label = 1

        motion_type_label = np.expand_dims(motion_type_label, axis=0)

        X = np.concatenate((joint.features, motion_type_label, axis, origin, ref, min_range, max_range))
        X = np.expand_dims(X, axis=0)
        #print('reject range rule, range X', X.shape)
        self.id2collection[collection_id].reject_range(X)


    def confirm_range_rule(self, info):

        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        motion_type = info['motion_type']
        axis_operation_code = info['axis_rule']
        range_operation_code = info['range_rule']
        object_id = int(object_name.split('.')[1])

        joint = get_joint(object_name, moving_part_id, base_part_id)

        ret = self.run_axis_rule(info, True)
        if 'axis' not in ret:
            return ret
        axis = ret['axis']
        origin = ret['origin']

        axis = np.array(axis)
        origin = np.array(origin)

        ret = self.run_range_rule(info, True)
        if 'ref' not in ret:
            return ret
            
        ref = ret['ref']
        current_pose = ret['current_pose']
        min_range = ret['min_range']
        max_range = ret['max_range']

        ref = np.array(ref)
        min_range = np.expand_dims(min_range, axis=0)
        max_range = np.expand_dims(max_range, axis=0)

        motion_type_label = 0
        if motion_type != 'translation':
            motion_type_label = 1

        motion_type_label = np.expand_dims(motion_type_label, axis=0)

        X = np.concatenate((joint.features, motion_type_label, axis, origin, ref, min_range, max_range))
        X = np.expand_dims(X, axis=0)
        #print('confirm range rule, range X', X.shape)
        self.id2collection[collection_id].confirm_range(X)


    def judge_range_rule(self, info):
        collection_id = int(info['collection_id'])
        object_name = info['object_id']
        moving_part_id = int(info['moving_part_index'])
        base_part_id = int(info['base_part_index'])
        motion_type = info['motion_type']
        axis_operation_code = info['axis_rule']
        range_operation_code = info['range_rule']
        object_id = int(object_name.split('.')[1])

        joint = get_joint(object_name, moving_part_id, base_part_id)

        ret = self.run_axis_rule(info, False)
        if 'axis' not in ret:
            return ret
        axis = ret['axis']
        origin = ret['origin']

        axis = np.array(axis)
        origin = np.array(origin)

        ret = self.run_range_rule(info, False)
        if 'ref' not in ret:
            return ret

        ref = ret['ref']
        current_pose = ret['current_pose']
        min_range = ret['min_range']
        max_range = ret['max_range']

        ref = np.array(ref)
        min_range = np.expand_dims(min_range, axis=0)
        max_range = np.expand_dims(max_range, axis=0)

        motion_type_label = 0
        if motion_type != 'translation':
            motion_type_label = 1

        motion_type_label = np.expand_dims(motion_type_label, axis=0)

        X = np.concatenate((joint.features, motion_type_label, axis, origin, ref, min_range, max_range))
        X = np.expand_dims(X, axis=0)
        #print('judge range rule, range X', X.shape)
        mark, prob = self.id2collection[collection_id].predict_range_prob(X)

        ret = dict()
        ret['decision'] = mark
        ret['score'] = prob

        return ret

def get_joint(object_name, moving_part_id, base_part_id):

    dataset_name = object_name.split('.')[0]
    object_id = int(object_name.split('.')[1])
    print('get joint', moving_part_id, base_part_id)
    
    obj = cache.get_object(object_id)
    if obj is not None:
        print('number of parts in obj:', len(obj.parts))
        for joint in obj.joints:
            if joint.moving_part_id == moving_part_id and joint.base_part_id == base_part_id:
                joint.moving_part = obj.parts[moving_part_id]
                joint.moving_part.load_pc()
                joint.base_part = obj.parts[base_part_id]
                joint.base_part.load_pc()
                return joint
    
    
    #partnet_json_intermediate_dir
    json_filename = os.path.join(partnet_json_dir, str(object_id) + '.json')
    obj = json_to_obj(json_filename)
    cache.set_object(object_id, obj)
    
    print('number of parts in obj:', len(obj.parts))
    for joint in obj.joints:
        if joint.moving_part_id == moving_part_id and joint.base_part_id == base_part_id:
            joint.moving_part = obj.parts[moving_part_id]
            joint.moving_part.load_pc()
            joint.base_part = obj.parts[base_part_id]
            joint.base_part.load_pc()
            return joint        

    return None


def execute_axis_operation_code(code, joint):
    global ret
    full_operation_code = "global ret\n" + code + "\nret = func(joint)"
    #print('full code:', full_operation_code)
    try:
        exec(full_operation_code)
    except:
        ret_dict = {"results": "error", "msg": str(sys.exc_info()), "axis_error": True, "range_error": False}
        #time.sleep(10)
        #print('error !', err)
        #print('full_code:')
        #print(full_operation_code)
        return ret_dict

    ret_dict = dict()
    ret_dict['axis'] = ret[0]
    ret_dict['origin'] = ret[1]
    return ret_dict

def execute_range_operation_code(code, joint, axis, origin):
    global ret
    full_operation_code = "global ret\n" + code + "\nret = func(joint, axis, origin)"
    try:
        exec(full_operation_code)
    except:
        ret_dict = {"results": "error", "msg": str(sys.exc_info()), "axis_error": False, "range_error": True}
        #time.sleep(10)
        #print('error !', err)
        #print('full_code:')
        #print(full_operation_code)
        return ret_dict

    ret_dict = dict()
    ret_dict['ref'] = ret[0]
    ret_dict['current_pose'] = ret[1]
    ret_dict['min_range'] = ret[2]
    ret_dict['max_range'] = ret[3]
    return ret_dict


def test_learner():
    kde = KernelDensity(kernel='gaussian', bandwidth=0.5)
    X = [[1], [2], [2.5], [2.6], [3]]
    kde.fit(X)
    start = 1
    end = 3
    probability = quad(lambda x: np.exp(kde.score_samples([[x]])), start, end)[0]
    #print('prob', probability)
    #return probability
    #print('res', l.predict_prob(Y))


if __name__ == "__main__":
    test_learner()
        
        

    
    

    



