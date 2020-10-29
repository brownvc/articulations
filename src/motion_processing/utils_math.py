import numpy as np
import math
import os
import sys

import random

def normalize(vec):
    return vec / np.linalg.norm(vec)

def cal_vec_length(vec):

    sum = 0
    for v in vec:
        sum += v * v

    return math.sqrt(sum)

def cartesian_to_spherical(x, y, z):
    r = math.sqrt(x * x + y * y + z * z)
    theta = math.atan(y / x)
    phi = math.acos(z / r)

    return theta, phi, r


def spherical_to_cartesian(theta, phi, r):
    x = r * math.cos(theta) * math.sin(phi)
    y = r * math.sin(theta) * math.sin(phi)
    z = r * math.cos(phi)

    return x, y, z


def get_cartesian_distance(p1, p2):
    dis_vec = p1 - p2
    return cal_vec_length(dis_vec)


def get_spherical_distance(p1, p2):
    theta_p1, phi_p1, r_p1 = cartesian_to_spherical(p1[0], p1[1], p1[2])
    theta_p2, phi_p2, r_p2 = cartesian_to_spherical(p2[0], p2[1], p2[2])

    dis_theta = theta_p1 - theta_p2
    dis_phi = phi_p1 - phi_p2
    dis_r = r_p1 - r_p2

    return math.sqrt(dis_theta * dis_theta + dis_phi * dis_phi + dis_r * dis_r)

def get_rot_mat_from_vecs(vec1, vec2):

    angle = math.acos(np.dot(vec1, vec2))
    if abs(angle) < 0.00001:
        return np.eye(3)

    rot_axis = normalize(np.cross(vec1, vec2))

    s = np.sin(angle)
    c = np.cos(angle)
    nx = rot_axis[0]
    ny = rot_axis[1]
    nz = rot_axis[2]

    rotmat = np.array([[c + (1 - c) * nx * nx, (1 - c) * nx * ny - s * nz, (1 - c) * nx * nz + s * ny], \
                       [(1 - c) * nx * ny + s * nz, c + (1 - c) * ny * ny, (1 - c) * ny * nz - s * nx], \
                       [(1 - c) * nx * nz - s * ny, (1 - c) * ny * nz + s * nx, c + (1 - c) * nz * nz]],
                      dtype=np.float32)

    return rotmat


def get_rot_mat_from_axis_and_angle(rot_axis, rot_angle):
    rot_mat_init = np.zeros((3, 3))
    rot_mat_init[0, 1] = -rot_axis[2]
    rot_mat_init[0, 2] = rot_axis[1]
    rot_mat_init[1, 0] = rot_axis[2]
    rot_mat_init[1, 2] = -rot_axis[0]
    rot_mat_init[2, 0] = -rot_axis[1]
    rot_mat_init[2, 1] = rot_axis[0]

    I_mat = np.zeros((3, 3))
    I_mat[0, 0] = 1
    I_mat[1, 1] = 1
    I_mat[2, 2] = 1

    final_rot_mat = I_mat + math.sin(rot_angle) * rot_mat_init + (
            2 * math.sin(rot_angle / 2) * math.sin(rot_angle / 2)) * np.matmul(rot_mat_init, rot_mat_init)

    return final_rot_mat

def pad_pc_to_homo(arr):
    arr = np.pad(arr, ((0, 0), (0, 1)), 'constant', constant_values=(0, 1))
    return arr

def apply_homo_mat_to_pc(mat, pc):
    return np.matmul(mat, pad_pc_to_homo(pc).transpose()).transpose()

def get_trans_mat_homo(dis, axis):
    axis = axis / cal_vec_length(axis)

    transmat = np.eye(4)[:3, :]
    transmat[:, 3] = axis * dis

    return transmat

def get_rot_mat_homo(angle, axis, center):
    s = np.sin(angle)
    c = np.cos(angle)

    axis = axis / cal_vec_length(axis)
    nx = axis[0]
    ny = axis[1]
    nz = axis[2]

    tmpmat = np.array([[c + (1 - c) * nx * nx, (1 - c) * nx * ny - s * nz, (1 - c) * nx * nz + s * ny], \
                       [(1 - c) * nx * ny + s * nz, c + (1 - c) * ny * ny, (1 - c) * ny * nz - s * nx], \
                       [(1 - c) * nx * nz - s * ny, (1 - c) * ny * nz + s * nx, c + (1 - c) * nz * nz]],
                      dtype=np.float32)

    rotmat = np.zeros([3, 4], dtype=np.float32)
    rotmat[:3, :3] = tmpmat
    rotmat[:, 3] = np.dot(np.eye(3) - tmpmat, center)

    return rotmat

def project_point_to_plane(normal, point_on_plane, point):
    ori_point_vec = point - point_on_plane
    projected_length_on_normal = np.dot(normal, ori_point_vec)

    projected_point = point - projected_length_on_normal * normal

    return projected_point

def project_point_to_dir(dir, center, point):
    point_vec = point - center
    projected_length_on_dir = np.dot(dir, point_vec)
    return projected_length_on_dir

