
from mayavi import mlab
from utils_math import *
from mayavi.mlab import *

def view_points_3d(pc_list):
    mlab.figure(size=(1000, 1000), bgcolor = (1,1,1))

    pos_list = []
    color_list = []

    count = 0
    for pc in pc_list:
        print('pc shape', pc.shape)
        if count == 0:
            color_red = 1.0
            color_green = 0.0
            color_blue = 0.0
        if count == 1:
            color_red = 0.0
            color_green = 1.0
            color_blue = 0.0
        if count == 2:
            color_red = 0.0
            color_green = 0.0
            color_blue = 1.0
        count += 1

        xpos = np.array(pc[:, 0])
        ypos = np.array(pc[:, 1])
        zpos = np.array(pc[:, 2])

        mlab.points3d(xpos, ypos, zpos, color=(color_red, color_green, color_blue), scale_factor = 0.01)

    mlab.show()

def view_meshes(meshes):
    mlab.figure(size=(1000, 1000), bgcolor = (1,1,1))
    for m in meshes:
        color_red = random.random()
        color_green = random.random()
        color_blue = random.random()

        vertex_positions = m.vertices
        face_indices = m.faces

        x = []
        y = []
        z = []
        for v in vertex_positions:
            x.append(v[0])
            y.append(v[1])
            z.append(v[2])

        tris = []
        for f in face_indices:
            tri = []
            tri.append(f[0])
            tri.append(f[1])
            tri.append(f[2])
            tris.append(tri)

        mlab.triangular_mesh(x, y, z, tris, color = (color_red , color_green, color_blue))

    mlab.show()

def view_points_with_arrows(point_cloud_list, point_cloud_normals_list):
    pos_list = []
    dirt_list = []
    color_list = []

    for i in range(len(point_cloud_list)):

        point_cloud = point_cloud_list[i]
        normals = point_cloud_normals_list[i]

        color_red = random.random()
        color_green = random.random()
        color_blue = random.random()

        for j in range(len(point_cloud)):
            pos = point_cloud[j]
            dirt = normals[j]
            pos_list.append(pos)
            dirt_list.append(dirt)
            color_list.append([color_red, color_green, color_blue])

        pos_arr = np.asarray(pos_list)
        xpos = np.array(pos_arr[:, 0])
        ypos = np.array(pos_arr[:, 1])
        zpos = np.array(pos_arr[:, 2])

        dirt_arr = np.asarray(dirt_list)
        xdirt = np.array(dirt_arr[:, 0])
        ydirt = np.array(dirt_arr[:, 1])
        zdirt = np.array(dirt_arr[:, 2])

        mlab.quiver3d(xpos, ypos, zpos, xdirt, ydirt, zdirt, scale_factor=0.01)
        mlab.points3d(xpos, ypos, zpos, scale_factor=0.002, color=(color_red, color_green, color_blue))

    mlab.show()







