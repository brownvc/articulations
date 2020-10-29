from modAL.models import ActiveLearner
from modAL.uncertainty import uncertainty_sampling
from modAL.utils.selection import multi_argmax, shuffled_argmax
import joblib
import os
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import weakref
from scipy.integrate import quad
from dsl import *
from objects import *
import json as json_module
from utils_math import *
import hashlib

learning_sys_type = 'd' 

class LearnerD():
    def __init__(self):
    
        self.is_ready_to_predict = False

        self.learner = ActiveLearner(
            estimator=RandomForestClassifier(n_estimators=100),
            query_strategy=uncertainty_sampling,
        )

    def predict_prob(self, point):
        if self.is_ready_to_predict is False:
            print('predict prob abort, learner is not ready to predict')
            return True, 0

        X = point
        positive_prob = self.learner.predict_proba(X)[0][1]
        negative_prob = self.learner.predict_proba(X)[0][0]
        #print('D learner proba', self.learner.predict_proba(X))
        return True, positive_prob

    def update(self, positive_points, negative_points):
        if len(positive_points) == 0 or len(negative_points) == 0:
            print('update abort, not enough data to update')
            self.is_ready_to_predict = False
            return False

        X = positive_points[0]
        y = np.ones(1)

        for i in range(1, len(positive_points)):
            X = np.concatenate((X, positive_points[i]), axis=0)
            y = np.concatenate((y, np.ones(1)), axis=0)

        for i in range(0, len(negative_points)):
            X = np.concatenate((X, negative_points[i]), axis=0)
            y = np.concatenate((y, np.zeros(1)), axis=0)
        
        self.learner.fit(X, y)
        self.is_ready_to_predict = True
        return True
        

        

    
    

    



