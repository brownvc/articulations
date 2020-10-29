
import numpy as np
from vis_common import *

def generate_diagnoal():
    
    diagnoal_file = "object_diagnoals.txt"
    open(diagnoal_file, 'w').close()
    with open(diagnoal_file, 'w') as f:
        path = Path(partnet_json_intermediate_dir)
        for obj_json in path.iterdir():
            tmp = (str(obj_json).split("/"))[-1]
            objId = (tmp.split("."))[0]
            obj = json_to_obj(obj_json)
            obj.update()

            obj_pc = np.zeros((1, 3))
            for part in obj.parts:
                obj_pc = np.concatenate((obj_pc, part.pc), axis=0)
            obj_pc = obj_pc[1:]

            box = compute_box(obj_pc)
            obj_diagnal_length = np.sqrt(box.size_1 * box.size_1 + box.size_2 * box.size_2 + box.size_3 * box.size_3)

            for mov_index in range(len(obj.parts)):
                for base_index in range(len(obj.parts)):
                    if mov_index != base_index:
                        f.write(str(objId) + ' ' + str(mov_index) + ' ' + str(base_index) + ' ' + str(obj_diagnal_length) + '\n')



if __name__ == "__main__":
   generate_diagnoal()