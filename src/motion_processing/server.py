from flask import Flask, jsonify, request
import server_sys as serv
import sys
import concurrent.futures
import math
import time
from itertools import islice
import shutil
import os 

app = Flask(__name__)
while_learner_queue = []

@app.route('/program-runtime/collection', methods=['POST'])
def create_collection():
    
    incoming_json = request.get_json(silent=True)
    print('create_collection::')
    try:
        #print(incoming_json)
        serv.create_collection(incoming_json)
                
        return jsonify({"results": "success"})
    
    except:
        print("Unexpected error:", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr
    
@app.route('/program-runtime/collection', methods=['DELETE'])
def delete_collection():
    
    incoming_json = request.get_json(silent=True)
    print('delete_collection::')
    try:
        #print(incoming_json)
        serv.delete_collection(incoming_json)
                
        return jsonify({"results": "success"})
    
    except:
        print("Unexpected error:", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr
    
@app.route('/program-runtime/joint', methods=['POST'])
def add_joint():
    
    incoming_json = request.get_json(silent=True)
    print('add_joint::')
    try:
        #print(incoming_json)
        serv.add_joint(incoming_json)
                
        return jsonify({"results": "success"})
    
    except:
        print("Unexpected error:", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr
    
@app.route('/program-runtime/joint', methods=['DELETE'])
def remove_joint():
    
    incoming_json = request.get_json(silent=True)
    print('remove_joint::')
    try:
        #print(incoming_json)
        serv.remove_joint(incoming_json)
                
        return jsonify({"results": "success"})
    
    except:
        print("Unexpected error:", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr

@app.route('/program-runtime/joint/reject', methods=['POST'])
def reject_joint():
    
    incoming_json = request.get_json(silent=True)
    print('reject_joint::')
    try:
        #print(incoming_json)

        collection_id = incoming_json.get('collection_id')
        part = incoming_json.get('part')

        input_json = {}
        input_json['collection_id'] = collection_id
        input_json['object_id'] = part['full_id']
        input_json['moving_part_index'] = part['moving_part_index']
        input_json['base_part_index'] = part['base_part_index']

        serv.reject_joint(input_json)
                
        return jsonify({"results": "success"})
    
    except:
        print("Unexpected error:", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr

@app.route('/program-runtime/rule/reject', methods=['POST'])
def reject_rule():
    
    incoming_json = request.get_json(silent=True)
    print('reject_rule::')
    try:
        #print(incoming_json)

        collection_id = incoming_json.get('collection_id')
        part = incoming_json.get('part')
        axis_rule = incoming_json.get('axis_rule')
        range_rule = incoming_json.get('range_rule')

        input_json = {}
        input_json['collection_id'] = collection_id
        input_json['object_id'] = part['full_id']
        input_json['moving_part_index'] = part['moving_part_index']
        input_json['base_part_index'] = part['base_part_index']

        if range_rule is None:
            if axis_rule != None:
                input_json['motion_type'] = axis_rule['motion_type']
                input_json['axis_rule'] = axis_rule['rule_text']
                serv.reject_axis_rule(input_json)

        else:
            input_json['motion_type'] = range_rule['motion_type']
            input_json['axis_rule'] = axis_rule['rule_text']
            input_json['range_motion_type'] = range_rule['motion_type']
            input_json['range_rule'] = range_rule['rule_text']
            serv.reject_range_rule(input_json)
                
        return jsonify({"results": "success"})
    
    except:
        print("Unexpected error:", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr
    
@app.route('/program-runtime/joint/suggestions', methods=['POST'])
def suggest_joint_concurrent():
    incoming_json = request.get_json(silent=True)
    
    collection_id = incoming_json.get('collection_id')
    parts = incoming_json.get('parts')
  
    input_jsons = []
    for part in parts:
        input_json = part
        input_json['collection_id'] = collection_id
        input_json['object_id'] = input_json['full_id']
        input_jsons.append(input_json)

    results = []

    '''
    for input_json in input_jsons:
        result_json = suggest_joint_func(input_json)
        if type(result_json) == dict and 'decision' in result_json and 'score' in result_json:
                results.append(result_json)
    '''

    with concurrent.futures.ProcessPoolExecutor() as executor:
        for result_json in executor.map(suggest_joint_func, input_jsons):  
            if type(result_json) == dict and 'decision' in result_json and 'score' in result_json:
                results.append(result_json)

    if len(results) <= 0:
        return jsonify({"results": results})

    results = sorted(results, key=lambda res: res['score'], reverse=True)        
    return jsonify({"results": results})

def suggest_joint_func(input_json):
    result_json = dict(input_json)
    try:
        decision, score = serv.judge_joint(input_json)
        # Add to results only if the joint is a suggestion
        if decision:
            result_json['decision'] = decision
            result_json['score'] = score
            return result_json
        else:
            return None
        
    except:
        # If exception for one joint, then continue
        print("Unexpected error:", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr

@app.route('/program-runtime/rule/axis/suggestions', methods=['POST'])
def suggest_axis_rule_concurrent():
    
    incoming_json = request.get_json(silent=True)
    print('suggest_axis_rules::')
    
    print(incoming_json)
    selected_axis_rules = []
    selected_axis_rule = {}
    collection_id = incoming_json.get('collection_id')
    rules = incoming_json.get('rules')
    parts = incoming_json.get('parts')

    input_jsons = []
    
    for part in parts:
        results = []
        for rule in rules:
            input_json = {}
            input_json['collection_id'] = collection_id
            input_json['object_id'] = part['full_id']
            input_json['moving_part_index'] = part['moving_part_index']
            input_json['base_part_index'] = part['base_part_index']
            input_json['rule_id'] = rule['rule_id']
            input_json['axis_rule'] = rule['rule_text']
            input_json['motion_type'] = rule['rule_motion_type']
            result_json = suggest_axis_rule_func(input_json)
            results.append(result_json)

        selected_axis_rule = get_selected_axis_rule_func(results)
        if selected_axis_rule:
            #if "results" in selected_axis_rule and "error" in selected_axis_rule["results"]:
                #return selected_axis_rule
            #else:
            selected_axis_rules.append(selected_axis_rule)

    
    '''
    with concurrent.futures.ProcessPoolExecutor() as executor:
        for result_json in executor.map(suggest_axis_rule_func, input_jsons):
            # no condition should comes here
            results.append(result_json)
    
    if len(results) <= 0:
        return jsonify({"results": selected_axis_rules})
        
    length_list = [len(rules)] * len(parts)
    it = iter(results)
    sliced_results = [list(islice(it, i)) for i in length_list]
    
    with concurrent.futures.ProcessPoolExecutor() as executor:
        for selected_axis_rule in executor.map(get_selected_axis_rule_func, sliced_results):
            if selected_axis_rule:
                #if "results" in selected_axis_rule and "error" in selected_axis_rule["results"]:
                    #return selected_axis_rule
                #else:
                selected_axis_rules.append(selected_axis_rule)
    '''

    #print('results', selected_axis_rules)
    return jsonify({"results": selected_axis_rules})

def suggest_axis_rule_func(input_json):
    try:
        ret = serv.judge_axis_rule(input_json)
        if 'decision' not in ret:
            returnStr = dict()
            returnStr["results"] = ret
            return returnStr

        decision = ret['decision']
        score = ret['score']
        result_json = dict(input_json)
        result_json['decision'] = decision
        result_json['score'] = score
        return result_json

    except:
        # If exception for one rule, then continue
        print("Unexpected error:", sys.exc_info())
        #returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        #return returnStr

def get_selected_axis_rule_func(rule_results):

    try:
        filtered_results = []
        for rule in rule_results:
            if type(rule) == dict and 'decision' in rule and 'score' in rule and rule['decision'] is True:
                filtered_results.append(rule)
        
        if len(filtered_results) > 0:
            rule_results = sorted(filtered_results, key=lambda res: res['score'], reverse=True)
            selected_axis_rule = rule_results[0]
            # Run the selected axis rule
            ret = serv.run_axis_rule(selected_axis_rule)
            
            if 'axis' not in ret:
                returnStr = dict()
                returnStr["results"] = ret
                return returnStr

            axis = ret['axis']
            origin = ret['origin']
            
            selected_axis_rule["axis"] = axis
            selected_axis_rule["origin"] = origin
            selected_axis_rule["min_range"] = 0
            selected_axis_rule["max_range"] = 0
            selected_axis_rule["ref"] = [0, 0, 0]
            selected_axis_rule["current_pose"] = 0
            return selected_axis_rule
        else:
            return None

    except:
        print("Unexpected error:", sys.exc_info())
        #returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        #return returnStr

@app.route('/program-runtime/rule/range/suggestions', methods=['POST'])
def suggest_range_rule_concurrent():
    
    incoming_json = request.get_json(silent=True)
    print('suggest_range_rules::')
    
    print(incoming_json)
    selected_range_rule = {}
    selected_range_rules  = []
    collection_id = incoming_json.get('collection_id')
    rules = incoming_json.get('rules')
    parts = incoming_json.get('parts')

    input_jsons = []

    for part in parts:
        axis_rule = part['axis_rule']
        results = []
        for rule in rules:
            
            if rule['rule_motion_type'] and axis_rule["motion_type"].lower() != rule['rule_motion_type'].lower():
                # Do not consider range rules whose motion type don't match with
                # that of the assigned axis rule
                continue

            input_json = {}
            input_json['collection_id'] = collection_id
            input_json['object_id'] = part['full_id']
            input_json['moving_part_index'] = part['moving_part_index']
            input_json['base_part_index'] = part['base_part_index']

            # Range rule properties
            input_json['rule_id'] = rule['rule_id']
            input_json['range_rule'] = rule['rule_text']
            input_json['range_motion_type'] = rule['rule_motion_type']

            # Axis rule properties
            input_json['axis_rule'] = axis_rule["rule_text"]
            input_json['motion_type'] = axis_rule["motion_type"]
            input_json['axis'] = axis_rule["axis"]
            input_json['origin'] = axis_rule["origin"]

            result_json = suggest_range_rule_func(input_json)
            results.append(result_json)

        selected_range_rule = get_selected_range_rule_func(results)
        if selected_range_rule:
            #if "results" in selected_range_rule and "error" in selected_range_rule["results"]:
                #return selected_range_rule
            #else:
            selected_range_rules.append(selected_range_rule)

    '''

    with concurrent.futures.ProcessPoolExecutor() as executor:
        for result_json in executor.map(suggest_range_rule_func, input_jsons):
            # no condition should come here
            results.append(result_json)
    
    if len(results) <= 0:
        return jsonify({"results": selected_range_rules})

    length_list = [len(rules)] * len(parts) 
    it = iter(results)
    sliced_results = [list(islice(it, i)) for i in length_list]

    with concurrent.futures.ProcessPoolExecutor() as executor:
        for selected_range_rule in executor.map(get_selected_range_rule_func, sliced_results):
            if selected_range_rule:
                #if "results" in selected_range_rule and "error" in selected_range_rule["results"]:
                    #return selected_range_rule
                #else:
                selected_range_rules.append(selected_range_rule)
    '''

    #print('results', selected_range_rule)
    return jsonify({"results": selected_range_rules})

def suggest_range_rule_func(input_json):
    try:
        ret = serv.judge_range_rule(input_json)
        if 'decision' not in ret:
            returnStr = dict()
            returnStr["results"] = ret
            return returnStr

        decision = ret['decision']
        score = ret['score']

        result_json = dict(input_json)
        result_json['decision'] = decision
        result_json['score'] = score
        return result_json
    except:
        # If exception for one rule, then continue
        print("Unexpected error:", sys.exc_info())
        #returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        #return returnStr

def get_selected_range_rule_func(rule_results):
    try:
        filtered_results = []
        for rule in rule_results:
            if type(rule) == dict and 'decision' in rule and 'score' in rule and rule['decision'] is True:
                filtered_results.append(rule)
        
        if len(filtered_results) > 0:
            rule_results = sorted(filtered_results, key=lambda res: res['score'], reverse=True)
            selected_range_rule = rule_results[0]
            
            # Run the selected range rule
            ret = serv.run_range_rule(selected_range_rule)
            if 'ref' not in ret:
                return ret
            
            ref = ret['ref']
            current_pose = ret['current_pose']
            min_range = ret['min_range']
            max_range = ret['max_range']
            selected_range_rule["ref"] = ref
            selected_range_rule["current_pose"] = current_pose
            selected_range_rule["min_range"] = min_range
            selected_range_rule["max_range"] = max_range

            return selected_range_rule
        else:
            return None
    except:
        print("Unexpected error:", sys.exc_info())
        #returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        #return returnStr


@app.route('/program-runtime/collection/joints/rule', methods=['POST'])
def apply_and_confirm_rule_to_joints():
    
    incoming_json = request.get_json(silent=True)
    incoming_json = incoming_json.get('rules')
    print('apply_and_confirm_rule_to_joints_concurrent::')
    #print(incoming_json)
    try:
        results = []
        for item in incoming_json:
            result_json = apply_and_confirm_rule_to_joints_func(item)
            
            if result_json and "results" in result_json and "error" in result_json["results"]:
                return jsonify({"results": result_json})

            if result_json is not None:
                    results.append(result_json)


        return jsonify({"results": results})
    except:
        print("Unexpected error in run_rule():", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr

def apply_and_confirm_rule_to_joints_func(rule):
    print("apply_and_confirm_rule_to_joints_func")
    #print(rule)
    collection_id = rule.get('collection_id')
    object_id = rule.get('full_id')
    moving_part_index = rule.get('moving_part_index')
    base_part_index = rule.get('base_part_index')
    axis_rule = rule.get('axis_rule')
    range_rule = rule.get('range_rule')
    axis_rule_id = rule.get('axis_rule_id')
    range_rule_id = rule.get('range_rule_id')
    motion_type = rule.get('motion_type')
    range_motion_type = rule.get('range_motion_type')
    moving_part_id = rule.get('moving_part_id')
    base_part_id = rule.get('base_part_id')
    axis = rule.get('axis')
    origin = rule.get('origin')
    
    axis_rule_old = rule.get('axis_rule_old')
    range_rule_old = rule.get('range_rule_old')
    motion_type_old = rule.get('motion_type_old')
    range_motion_type_old = rule.get('range_motion_type_old')

    axis_rule_json = {}
    range_rule_json = {}
    
    result = {}
    if axis_rule != None and range_rule == None:
        print('running axis rule')
        axis_rule_json["collection_id"] = collection_id
        axis_rule_json["object_id"] = object_id
        axis_rule_json["moving_part_index"] = moving_part_index
        axis_rule_json["base_part_index"] = base_part_index

        # Reject old axis rule
        if axis_rule_old != None:
            axis_rule_json['motion_type'] = motion_type_old
            axis_rule_json["axis_rule"] = axis_rule_old
            #print(axis_rule_json)
            serv.reject_axis_rule(axis_rule_json)
            #print('axis rule rejected--------')

            if motion_type and range_motion_type_old and motion_type.lower() != range_motion_type_old.lower():
                # Reject old range rule if the new axis rule has different motion type than the old range rule
                if range_rule_old != None:
                    axis_rule_json['range_rule'] = range_rule_old
                    axis_rule_json['range_motion_type_old'] = range_motion_type_old
                    #print(range_rule_json)
                    serv.reject_range_rule(axis_rule_json)
                    #print('range rule rejected--------')

        # Apply and confirm new axis rule
        axis_rule_json['motion_type'] = motion_type
        axis_rule_json["axis_rule"] = axis_rule
        #print('-----new axis rule')
        #print(axis_rule_json)
        ret = serv.run_axis_rule(axis_rule_json)
        if 'axis' not in ret:
            return ret

        axis = ret['axis']
        origin = ret['origin']

        serv.confirm_axis_rule(axis_rule_json)
        
        result = dict(axis_rule_json)
        result['moving_part_id'] = moving_part_id
        result['base_part_id'] = base_part_id
        result['axis_rule_id'] = axis_rule_id
        result['range_rule_id'] = range_rule_id
        result["axis"] = axis
        result["origin"] = origin

        min_range = rule.get('min_range')
        if min_range != None:
            result["min_range"] = min_range
        else:
            result["min_range"] = 0

        max_range = rule.get('max_range')
        if max_range != None:
            result["max_range"] = max_range
        else:
            result["max_range"] = 0

        ref = rule.get('ref')
        if ref != None:
            result["ref"] = ref
        else:
            result["ref"] = [0, 0, 0]

        current_pose = rule.get('current_pose')
        if current_pose != None:
            result["current_pose"] = current_pose
        else:
            result["current_pose"] = 0

    if range_rule != None:
        print('running range rule')
        range_rule_json["collection_id"] = collection_id
        range_rule_json["object_id"] = object_id
        range_rule_json["moving_part_index"] = moving_part_index
        range_rule_json["base_part_index"] = base_part_index

        # Reject old range rule
        if range_rule_old != None:
            range_rule_json['motion_type'] = motion_type_old
            range_rule_json["axis_rule"] = axis_rule_old
            range_rule_json['range_rule'] = range_rule_old
            range_rule_json['range_motion_type_old'] = range_motion_type_old
            #print(range_rule_json)
            serv.reject_range_rule(range_rule_json)
            #print('rejected--------')
        
        # Apply and confirm new range rule
        range_rule_json['motion_type'] = motion_type
        range_rule_json["axis_rule"] = axis_rule
        range_rule_json["range_rule"] = range_rule
        range_rule_json['range_motion_type'] = range_motion_type
        #print('-----new range rule')
        #print(range_rule_json)
        ret = serv.run_range_rule(range_rule_json)
        if 'ref' not in ret:
            return ret
            
        ref = ret['ref']
        current_pose = ret['current_pose']
        min_range = ret['min_range']
        max_range = ret['max_range']
        serv.confirm_range_rule(range_rule_json)

        result = dict(range_rule_json)
        result['motion_type'] = motion_type
        result['moving_part_id'] = moving_part_id
        result['base_part_id'] = base_part_id
        result['axis_rule_id'] = axis_rule_id
        result['range_rule_id'] = range_rule_id
        result["axis"] = axis
        result["origin"] = origin
        result["ref"] = ref
        result["current_pose"] = current_pose
        result["min_range"] = min_range
        result["max_range"] = max_range

    return result

@app.route('/program-runtime/collection/joint/rule/motion', methods=['POST'])
def apply_rule_to_joints_concurrent():
    try:
        incoming_json = request.get_json(silent=True)
        incoming_json = incoming_json.get('rules')
        print('apply_rule_to_joints_concurrent::')
        #print(incoming_json)
        results = []
        error_result = None
    
        for rule in incoming_json:
            result_json = apply_rule_to_joints_func(rule)
            if result_json:
                if "results" in result_json and "error" in result_json["results"]:
                    error_result = jsonify({"results": result_json})
                else:
                    results.append(result_json)
        '''
        with concurrent.futures.ProcessPoolExecutor() as executor:
            for result_json in executor.map(apply_rule_to_joints_func, incoming_json):
                if result_json:
                    if "results" in result_json and "error" in result_json["results"]:
                        error_result = jsonify({"results": result_json})
                    else:
                        results.append(result_json)
        '''

        if error_result is not None:
            return error_result

        #print('results', results)
        return jsonify({"results": results})
    except:
        print("Unexpected error in run_rule():", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr

def apply_rule_to_joints_func(rule):
    
    collection_id = rule.get('collection_id')
    object_id = rule.get('full_id')
    moving_part_index = rule.get('moving_part_index')
    base_part_index = rule.get('base_part_index')
    axis_rule = rule.get('axis_rule')
    range_rule = rule.get('range_rule')
    axis_rule_id = rule.get('axis_rule_id')
    range_rule_id = rule.get('range_rule_id')
    motion_type = rule.get('motion_type')
    range_motion_type = rule.get('range_motion_type')
    moving_part_id = rule.get('moving_part_id')
    base_part_id = rule.get('base_part_id')
    axis = rule.get('axis')
    origin = rule.get('origin')

    axis_rule_json = {}
    range_rule_json = {}
    result = {}
    if axis_rule != None:
        print('running axis rule')
        axis_rule_json["collection_id"] = collection_id
        axis_rule_json["object_id"] = object_id
        axis_rule_json["moving_part_index"] = moving_part_index
        axis_rule_json["base_part_index"] = base_part_index
        axis_rule_json['motion_type'] = motion_type
        axis_rule_json["axis_rule"] = axis_rule
        
        ret = serv.run_axis_rule(axis_rule_json)
        if 'axis' not in ret:
            return ret

        axis = ret['axis']
        origin = ret['origin']
        
        result = dict(axis_rule_json)
        result['moving_part_id'] = moving_part_id
        result['base_part_id'] = base_part_id
        result['axis_rule_id'] = axis_rule_id
        result['range_rule_id'] = range_rule_id
        result["axis"] = axis
        result["origin"] = origin

        result["min_range"] = 0
        result["max_range"] = 0
        result["ref"] = [0, 0, 0]
        result["current_pose"] = 0

    if range_rule != None:
        print('running range rule')
        range_rule_json["collection_id"] = collection_id
        range_rule_json["object_id"] = object_id
        range_rule_json["moving_part_index"] = moving_part_index
        range_rule_json["base_part_index"] = base_part_index
        range_rule_json['motion_type'] = motion_type
        range_rule_json["axis_rule"] = axis_rule
        range_rule_json["range_rule"] = range_rule
        range_rule_json['range_motion_type'] = range_motion_type
        
        ret = serv.run_range_rule(range_rule_json)
        if 'ref' not in ret:
            return ret
            
        ref = ret['ref']
        current_pose = ret['current_pose']
        min_range = ret['min_range']
        max_range = ret['max_range']

        result = dict(range_rule_json)
        result['motion_type'] = motion_type
        result['moving_part_id'] = moving_part_id
        result['base_part_id'] = base_part_id
        result['axis_rule_id'] = axis_rule_id
        result['range_rule_id'] = range_rule_id
        result["axis"] = axis
        result["origin"] = origin
        result["ref"] = ref
        result["current_pose"] = current_pose
        result["min_range"] = min_range
        result["max_range"] = max_range

    return result
    

@app.route('/program-runtime/learning/backup', methods=['POST'])
def resetLearning():

    CACHE_FOLDER_NAME = "caches"
    
    incoming_json = request.get_json(silent=True)
    destination_folder = incoming_json.get('destination_folder')
    reset = incoming_json.get('reset')
    
    print('[/learning/backup] reset flag is ', reset)

    try:
        cache_folder = os.path.join(os.getcwd(), CACHE_FOLDER_NAME)

        # Move the caches folder to the back-up folder
        if reset and "true" in reset.lower():
            shutil.move(cache_folder, destination_folder)
            
            # re-creating cache folder
            if not os.path.exists(cache_folder):
                print("re-creating cache folder..")
                os.makedirs(cache_folder)
        else:
            shutil.copytree(cache_folder, os.path.join(destination_folder, CACHE_FOLDER_NAME))

        return jsonify({"results": destination_folder})
    
    except:
        print("Unexpected error in resetLearning():", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr

@app.route('/program-runtime/joint/attributes', methods=['POST'])
def get_joint_attributes():
    
    incoming_json = request.get_json(silent=True)
    parts = incoming_json.get("parts")
    print('get_joint_attributes')

    try:
        results = []
        for part in parts:
            result = dict(part)
            #print(incoming_json)
            input_json = {}
            input_json['object_id'] = part['full_id']
            input_json['moving_part_index'] = part['moving_part_index']
            input_json['base_part_index'] = part['base_part_index']

            result["attributes"] = serv.get_joint_attributes(input_json)
            results.append((result))

        #print('results', results)
        return jsonify({"results": results})

    except:
        print("Unexpected error in get_joint_attributes():", sys.exc_info())
        returnStr = {"results": {"results": "error", "msg": str(sys.exc_info()[1])}}
        return returnStr

if __name__ == '__main__':
    # The server can be run by uncommenting the following line, as it is now
    # it just runs the test code below it
    app.run(host='localhost', port=8880)
    #with app.test_client() as c:
    #    rv = c.post('/runJointProgram', json={
    #        'joint': 0, 'program': 0, 'object' : 0,
    #        })
    #    print(rv.get_json())
