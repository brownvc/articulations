from learning import *
from itertools import islice


CM = CollectionManager()


#--collection----------------------------------

def create_collection(info):
    CM.create_collection(info)

def delete_collection(info):
    CM.delete_collection(info)

#---joint---------------------------------------

def add_joint(info):
    CM.add_joint(info)    

def remove_joint(info):
    CM.remove_joint(info)

def reject_joint(info):
    CM.reject_joint(info)

def judge_joint(info):
    return CM.judge_joint(info)

def get_joint_attributes(info):
    
    object_name = info['object_id']
    moving_part_id = int(info['moving_part_index'])
    base_part_id = int(info['base_part_index'])

    joint = get_joint(object_name, moving_part_id, base_part_id)

    contact = get_contact(joint.moving_part, joint.base_part)

    moving_dict = {}
    
    moving_dict["center"] = joint.moving_part.center.tolist()

    moving_dict["axis1_direction"] = joint.moving_part.axis1.direction.tolist()
    moving_dict["axis1_length"] = joint.moving_part.axis1.length
    moving_dict["axis1_top"] = joint.moving_part.axis1.top.tolist()
    moving_dict["axis1_bottom"] = joint.moving_part.axis1.bottom.tolist()

    moving_dict["axis2_direction"] = joint.moving_part.axis2.direction.tolist()
    moving_dict["axis2_length"] = joint.moving_part.axis2.length
    moving_dict["axis2_top"] = joint.moving_part.axis2.top.tolist()
    moving_dict["axis2_bottom"] = joint.moving_part.axis2.bottom.tolist()

    moving_dict["axis3_direction"] = joint.moving_part.axis3.direction.tolist()
    moving_dict["axis3_length"] = joint.moving_part.axis3.length
    moving_dict["axis3_top"] = joint.moving_part.axis3.top.tolist()
    moving_dict["axis3_bottom"] = joint.moving_part.axis3.bottom.tolist()

    base_dict = {}
    
    base_dict["center"] = joint.base_part.center.tolist()

    base_dict["axis1_direction"] = joint.base_part.axis1.direction.tolist()
    base_dict["axis1_length"] = joint.base_part.axis1.length
    base_dict["axis1_top"] = joint.base_part.axis1.top.tolist()
    base_dict["axis1_bottom"] = joint.base_part.axis1.bottom.tolist()

    base_dict["axis2_direction"] = joint.base_part.axis2.direction.tolist()
    base_dict["axis2_length"] = joint.base_part.axis2.length
    base_dict["axis2_top"] = joint.base_part.axis2.top.tolist()
    base_dict["axis2_bottom"] = joint.base_part.axis2.bottom.tolist()

    base_dict["axis3_direction"] = joint.base_part.axis3.direction.tolist()
    base_dict["axis3_length"] = joint.base_part.axis3.length
    base_dict["axis3_top"] = joint.base_part.axis3.top.tolist()
    base_dict["axis3_bottom"] = joint.base_part.axis3.bottom.tolist()

    contact_dict = {}
    
    contact_dict["center"] = contact.center.tolist()

    ret_dict = {}
    ret_dict["moving"] = moving_dict
    ret_dict["base"] = base_dict
    ret_dict["contact"] = contact_dict

    return ret_dict

#---axis_rule----------------------------------

def run_axis_rule(info):
    return CM.run_axis_rule(info, False)

def reject_axis_rule(info):
    CM.reject_axis_rule(info)

def judge_axis_rule(info):
    return CM.judge_axis_rule(info)

def confirm_axis_rule(info):
    CM.confirm_axis_rule(info)

#---range_rule----------------------------------

def run_range_rule(info):
    return CM.run_range_rule(info, False)

def reject_range_rule(info):
    CM.reject_range_rule(info)

def judge_range_rule(info):
    return CM.judge_range_rule(info)

def confirm_range_rule(info):
    CM.confirm_range_rule(info)

#--------------------------------------------support-----------------------------------------------------------

def test_create_collection():

    test_json = {
                "collection_id": 0
            }

    create_collection(test_json)
    print('create_collection() complete')

def test_delete_collection():

    test_json = {
                "collection_id": 0
            }

    delete_collection(test_json)
    print('delete_collection() complete')

def test_add_joint():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "moving_part_index": "0",
                "base_part_index": "1",
                "name": "Sample Program",
                "version": 1,
            }

    add_joint(test_json)
    print('add_joint() complete')

def test_add_joint2():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.149",
                "moving_part_index": "0",
                "base_part_index": "3",
                "name": "Sample Program",
                "version": 1,
            }

    add_joint(test_json)
    print('add_joint() complete')

def test_remove_joint():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "moving_part_index": 0,
                "base_part_index": 1,
                "name": "Sample Program",
                "version": 1,
            }

    remove_joint(test_json)
    print('remove_joint() complete')

def test_reject_joint():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "moving_part_index": 1,
                "base_part_index": 0,
                "name": "Sample Program",
                "version": 1,
            }

    reject_joint(test_json)
    print('reject_joint() complete')

def test_judge_joint():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "moving_part_index": 0,
                "base_part_index": 1,
                "name": "Sample Program",
                "version": 1,
            }

    res = judge_joint(test_json)
    print('judge_joint() output:', res)

def test_run_axis_rule():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "motion_type": "translation",
                "moving_part_index": 0,
                "base_part_index": 1,
                "name": "Sample Program",
                "version": 1,
                "motion_type": "rotation",
                "axis_rule": "def func(joint):\n     return [1, 0, 0], [0, 0, 0]"
            }

    res = run_axis_rule(test_json)
    print('run_axis_rule() output', res)

def test_reject_axis_rule():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "motion_type": "translation",
                "moving_part_index": 0,
                "base_part_index": 1,
                "name": "Sample Program",
                "version": 1,
                "motion_type": "rotation",
                "axis_rule": "def func(joint):\n     return [1, 0, 0], [0, 0, 0]"
            }

    res = reject_axis_rule(test_json)
    print('reject_axis_rule() complete')

def test_judge_axis_rule():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "motion_type": "translation",
                "moving_part_index": 0,
                "base_part_index": 1,
                "name": "Sample Program",
                "version": 1,
                "motion_type": "rotation",
                "axis_rule": "def func(joint):\n     return [1, 0, 0], [0, 0, 0]"
            }

    res = judge_axis_rule(test_json)
    print('judge_axis_rule() output', res)

def test_confirm_axis_rule():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "motion_type": "translation",
                "moving_part_index": 0,
                "base_part_index": 1,
                "name": "Sample Program",
                "version": 1,
                "motion_type": "rotation",
                "axis_rule": "def func(joint):\n     return [1, 0, 0], [0, 0, 0]"
            }

    res = confirm_axis_rule(test_json)
    print('confirm_axis_rule() output', res)


def test_run_range_rule():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "motion_type": "translation",
                "moving_part_index": 0,
                "base_part_index": 1,
                "name": "Sample Program",
                "version": 1,
                "motion_type": "rotation",
                "axis_rule": "def func(joint):\n     return [1, 0, 0], [0, 0, 0]",
                "range_rule": "def func(joint, axis, origin):\n     return 0, 1"
            }

    res = run_range_rule(test_json)
    print('run_range_rule() output:', res)

def test_reject_range_rule():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "motion_type": "translation",
                "moving_part_index": 0,
                "base_part_index": 1,
                "name": "Sample Program",
                "version": 1,
                "motion_type": "rotation",
                "axis_rule": "def func(joint):\n     return [1, 0, 0], [0, 0, 0]",
                "range_rule": "def func(joint, axis, origin):\n     return 0, 1"
            }

    res = reject_range_rule(test_json)
    print('reject_range_rule() output', res)

def test_judge_range_rule():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "motion_type": "translation",
                "moving_part_index": 0,
                "base_part_index": 1,
                "name": "Sample Program",
                "version": 1,
                "motion_type": "rotation",
                "axis_rule": "def func(joint):\n     return [1, 0, 0], [0, 0, 0]",
                "range_rule": "def func(joint, axis, origin):\n     return 0, 1"
            }

    res = judge_range_rule(test_json)
    print('judge_range_rule() output', res)


def test_confirm_range_rule():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "motion_type": "translation",
                "moving_part_index": 0,
                "base_part_index": 1,
                "name": "Sample Program",
                "version": 1,
                "motion_type": "rotation",
                "axis_rule": "def func(joint):\n     return [1, 0, 0], [0, 0, 0]",
                "range_rule": "def func(joint, axis, origin):\n     return [1, 0, 0], [0, 0, 0], 0, 0"
            }

    res = confirm_range_rule(test_json)
    print('confirm_range_rule() output', res)

def test_get_joint_attributes():

    test_json = {
                "id": 43,
                "collection_id": 0,
                "object_id": "partnetsim.148",
                "motion_type": "translation",
                "moving_part_index": 0,
                "base_part_index": 1,
            }

    res = get_joint_attributes(test_json)
    print('get_joint_attributes() output', res)


if __name__ == "__main__":

    #test_get_joint_attributes()
    '''
    test_create_collection()
    
    test_add_joint()
    test_add_joint2()
    test_reject_joint()
    
    test_judge_joint()
    
    test_run_axis_rule()
    test_confirm_axis_rule()
    test_reject_axis_rule()
    test_judge_axis_rule()
    test_confirm_axis_rule()
    
    test_run_range_rule()
    test_confirm_axis_rule()
    test_reject_range_rule()
    test_judge_range_rule()
    test_confirm_range_rule()
    
    test_remove_joint()
    test_delete_collection()
    '''
    

    