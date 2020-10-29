from modAL.models import ActiveLearner
from modAL.uncertainty import uncertainty_sampling
from modAL.utils.selection import multi_argmax, shuffled_argmax
import joblib
import os
import numpy as np
from sklearn.neighbors import KernelDensity
import weakref
from scipy.integrate import quad
from dsl import *
from objects import *
import json as json_module
from utils_math import *
import hashlib

learning_sys_type = 'g' 

class LearnerG():
    def __init__(self):
        self.is_positive_ready_to_predict = False
        self.is_negative_ready_to_predict = False
        self.positive_kde = KernelDensity(kernel='gaussian', bandwidth=0.5)
        self.negative_kde = KernelDensity(kernel='gaussian', bandwidth=0.5)

    def predict_prob(self, point):

        if self.is_positive_ready_to_predict is True and self.is_negative_ready_to_predict is True:
            X = point
            positive_prob = np.exp(self.positive_kde.score_samples(X))[0]
            #negative_prob = np.exp(self.negative_kde.score_samples(X))[0]
            return True, positive_prob

        if self.is_positive_ready_to_predict is True and self.is_negative_ready_to_predict is False:
            X = point
            positive_prob = np.exp(self.positive_kde.score_samples(X))[0]
            return True, positive_prob

        if self.is_positive_ready_to_predict is False and self.is_negative_ready_to_predict is True:
            X = point
            negative_prob = np.exp(self.negative_kde.score_samples(X))[0]
            return True, -negative_prob

        if self.is_positive_ready_to_predict is False and self.is_negative_ready_to_predict is False:
            return True, 0   

    def update(self, positive_points, negative_points):
        if len(positive_points) == 0 and len(negative_points) == 0: 
            self.is_positive_ready_to_predict = False
            self.is_negative_ready_to_predict = False

        if len(positive_points) == 0 and len(negative_points) != 0:
            X = negative_points[0]
            for i in range(1, len(negative_points)):
                X = np.concatenate((X, negative_points[i]), axis=0)
            self.negative_kde.fit(X) 
            self.is_negative_ready_to_predict = True
            self.is_positive_ready_to_predict = False

        if len(positive_points) != 0 and len(negative_points) == 0:
            X = positive_points[0]
            for i in range(1, len(positive_points)):
                X = np.concatenate((X, positive_points[i]), axis=0)
            self.positive_kde.fit(X)
            self.is_positive_ready_to_predict = True
            self.is_negative_ready_to_predict = False

        if len(positive_points) != 0 and len(negative_points) != 0:
            X = positive_points[0]
            for i in range(1, len(positive_points)):
                X = np.concatenate((X, positive_points[i]), axis=0)

            self.positive_kde.fit(X)
            self.is_positive_ready_to_predict = True

            #X = negative_points[0]
            #for i in range(1, len(negative_points)):
                #X = np.concatenate((X, negative_points[i]), axis=0)

            #self.negative_kde.fit(X)
            self.is_negative_ready_to_predict = True