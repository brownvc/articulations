from process_partnet import *
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--dataset_option', type=int, default=1, help='1 for shape2motion, 2 for rpmnet, 3 for partnet')
parser.add_argument('--phase', type=int, default=1, help='1 for pass1 & pass2, 2 for pass4')
FLAGS = parser.parse_args()

DATASET_OPTION = FLAGS.dataset_option
PHASE = FLAGS.phase

def generate_ae_files(objects):

    root_path = 'charlesq34_ae/data/partnet/'

    if os.path.exists(root_path) is False:
        os.makedirs(root_path)

    joint_count = 0

    split_folder_path = root_path + 'train_test_split/'

    if os.path.exists(split_folder_path) is False:
        os.makedirs(split_folder_path)

    split_file_test_name = 'shuffled_test_file_list.json'
    split_file_train_name = 'shuffled_train_file_list.json'
    split_file_val_name = 'shuffled_val_file_list.json'
    split_file_encode_name = 'shuffled_encode_file_list.json'
    open(split_folder_path + split_file_test_name, 'w').close()
    open(split_folder_path + split_file_train_name, 'w').close()
    open(split_folder_path + split_file_val_name, 'w').close()
    open(split_folder_path + split_file_encode_name, 'w').close()
    with open(split_folder_path + split_file_test_name, 'w') as split_file_test, open(split_folder_path + split_file_train_name, 'w') as split_file_train, open(split_folder_path + split_file_val_name, 'w') as split_file_val, open(split_folder_path + split_file_encode_name, 'w') as split_file_encode:
        split_file_test.write('[')
        split_file_train.write('[')
        split_file_val.write('[')
        split_file_encode.write('[')
        for obj in objects:
            for joint in obj.joints:

                point_positions = joint.pc
                point_labels = joint.pc_labels
                point_nn_distances = joint.pc_nn_distances

                path_points = root_path + 'all/points'
                if os.path.exists(path_points) is False:
                    os.makedirs(path_points)

                path_points_label = root_path + 'all/points_label'
                if os.path.exists(path_points_label) is False:
                    os.makedirs(path_points_label)

                file_name = str(obj.id) + '_' + str(joint.moving_part_id) + '_' + str(joint.base_part_id)
                split_file_encode.write('"' + file_name + '"' + ', ')
                if joint_count % 10 == 0:
                    split_file_test.write('"' + file_name + '"' + ', ')
                else:
                    split_file_train.write('"' + file_name + '"' + ', ')
                    split_file_val.write('"' + file_name + '"' + ', ')

                file_pts = path_points + "/" + file_name + ".pts"
                open(file_pts, 'w').close()
                with open(file_pts, 'w') as the_file:
                    for i in range(len(point_positions)):
                        pos = point_positions[i]
                        label = int(point_labels[i])
                        distance = point_nn_distances[i]
                        the_file.write(str(pos[0]) + ' ' + str(pos[1]) + ' ' + str(pos[2]) + ' ' + str(label) + ' ' + str(distance) + '\n')

                file_seg = path_points_label + "/" + file_name + ".seg"
                open(file_seg, 'w').close()
                with open(file_seg, 'w') as the_file:
                    for label in point_labels:
                        the_file.write(str(label) + '\n')

                joint_count += 1

        split_file_encode.seek(split_file_encode.tell() - 2, os.SEEK_SET)
        split_file_encode.write('')
        split_file_encode.write(']')

        split_file_test.seek(split_file_test.tell() - 2, os.SEEK_SET)
        split_file_test.write('')
        split_file_test.write(']')

        split_file_train.seek(split_file_train.tell() - 2, os.SEEK_SET)
        split_file_train.write('')
        split_file_train.write(']')

        split_file_val.seek(split_file_val.tell() - 2, os.SEEK_SET)
        split_file_val.write('')
        split_file_val.write(']')

def encode_features(obj):
    for joint in obj.joints:
        embedding = []
        filename = str(obj.id) + '_' + str(joint.moving_part_id) + '_' + str(joint.base_part_id)
        with open(os.path.join(partnet_embedding_dir, filename), 'r') as f:
            content = f.readlines()
            for line in content:
                embedding.append(float(line))
        joint.features = np.array(embedding)
        
def process_dataset():
    process_objects_partnet()

def generate_sup_files():

    print('generating sup files')

    objects = []
    path = Path(partnet_json_dir)
    for obj_json in path.iterdir():
        obj = json_to_obj(obj_json)
        objects.append(obj)
    
    generate_ae_files(objects)

def generate_final_jsons():

    print('generating final jsons')

    objects = []
    path = Path(partnet_json_intermediate_dir)
    for obj_json in path.iterdir():
        print('obj_json', obj_json)
        obj = json_to_obj(obj_json)
        obj.update()

        encode_features(obj)

        for part in obj.parts:
            part.pc = None
            part.pc_normals = None
            for subpart in part.subparts:
                subpart.pc_normals = None
                #subpart.pc = None
        
        for joint in obj.joints:
            joint.pc_labels = None
            joint.pc_nn_distances = None

        obj_to_json(obj, partnet_json_dir, str(obj.id))
    
if __name__ == '__main__':

    #process_dataset()
    #generate_sup_files()

    # trigger autoencoder feature encoding here

    generate_final_jsons()