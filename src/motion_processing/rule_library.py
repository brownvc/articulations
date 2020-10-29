from server_sys import *

axis_rules = [

#====================================================================================================
{
    "name": "x, moving axis1 top",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis [1, 0, 0] through the top of the longest principal axis of moving part
    '''

    origin = joint.moving_part.axis1.top
    axis = [1, 0, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "y, moving axis1 top",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive y axis [0, 1, 0] through the top of longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis1.top
    axis = [0, 1, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "z, moving axis1 top",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive z axis [0, 0, 1] through the top of longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis1.top
    axis = [0, 0, 1]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "x, moving axis1 bottom",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis [1, 0, 0] through the bottom of longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis1.bottom
    axis = [1, 0, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "y, moving axis1 bottom",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive y axis [0, 1, 0] through the bottom of longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis1.bottom
    axis = [0, 1, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "z, moving axis1 bottom",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive z axis [0, 0, 1] through the bottom of longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis1.bottom
    axis = [0, 0, 1]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "x, moving axis2 top",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis [1, 0, 0] through the top of second longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis2.top
    axis = [1, 0, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "y, moving axis2 top",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive y axis [0, 1, 0] through the top of second longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis2.top
    axis = [0, 1, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "z, moving axis2 top",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive z axis [0, 0, 1] through the top of second longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis2.top
    axis = [0, 0, 1]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "x, moving axis2 bottom",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis [1, 0, 0] through the bottom of second longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis2.bottom
    axis = [1, 0, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "y, moving axis2 bottom",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive y axis [0, 1, 0] through the bottom of second longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis2.bottom
    axis = [0, 1, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "z, moving axis2 bottom",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive z axis [0, 0, 1] through the bottom of second longest principal axis  of moving part
    '''

    origin = joint.moving_part.axis1.bottom
    axis = [0, 0, 1]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "x, moving axis3 top",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis [1, 0, 0] through the top of shortest principal axis  of moving part
    '''

    origin = joint.moving_part.axis3.top
    axis = [1, 0, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "y, moving axis3 top",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive y axis [0, 1, 0] through the top of shortest principal axis  of moving part
    '''

    origin = joint.moving_part.axis3.top
    axis = [0, 1, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "z, moving axis3 top",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive z axis [0, 0, 1] through the top of shortest principal axis  of moving part
    '''

    origin = joint.moving_part.axis3.top
    axis = [0, 0, 1]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "x, moving axis3 bottom",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis [1, 0, 0] through the bottom of shortest principal axis  of moving part
    '''

    origin = joint.moving_part.axis3.bottom
    axis = [1, 0, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "y, moving axis3 bottom",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive y axis [0, 1, 0] through the bottom of shortest principal axis  of moving part
    '''

    origin = joint.moving_part.axis3.bottom
    axis = [0, 1, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "z, moving axis3 bottom",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive z axis [0, 0, 1] through the bottom of shortest principal axis  of moving part
    '''

    origin = joint.moving_part.axis3.bottom
    axis = [0, 0, 1]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "x, contact center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis direction [1, 0, 0] through the center of the contact region between moving part and base part
    '''

    contact = get_contact(joint.moving_part, joint.base_part)
    origin = contact.center
    axis = [1, 0, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "y, contact center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive y axis direction [0,1,0] through the center of the contact region between moving part and base part
    '''

    contact = get_contact(joint.moving_part, joint.base_part)
    origin = contact.center
    axis = [0, 1, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "z, contact center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive z axis direction [0, 0, 1] through the center of the contact region between moving part and base part
    '''
    contact = get_contact(joint.moving_part, joint.base_part)
    origin = contact.center
    axis = [0, 0, 1]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "x, moving center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis direction [1, 0, 0] through the center of moving part
    '''
    origin = joint.moving_part.center
    axis = [1, 0, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "y, moving center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global negative x axis direction [-1, 0, 0] through the center of moving part
    '''
    origin = joint.moving_part.center
    axis = [0, 1, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "z, moving center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive z axis direction [0, 0, 1] through the center of moving part
    '''
    origin = joint.moving_part.center
    axis = [0, 0, 1]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "x, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis direction [1, 0, 0] through the center of base part
    '''
    origin = joint.base_part.center
    axis = [1, 0, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "y, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive y axis direction [0, 1, 0] through the center of base part
    '''
    origin = joint.base_part.center
    axis = [0, 1, 0]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "z, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive z axis direction [0, 0, 1] through the center of base part
    '''
    origin = joint.base_part.center
    axis = [0, 0, 1]
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis1, contact center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    longest principal axis  of the moving part through the center of the contact region of moving part and base part
    '''
    contact = get_contact(joint.moving_part, joint.base_part)
    origin = contact.center 
    axis = joint.moving_part.axis1.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis2, contact center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    second longest principal axis  of the moving part through the center of the contact region of moving part and base part
    '''
    contact = get_contact(joint.moving_part, joint.base_part)
    origin = contact.center 
    axis = joint.moving_part.axis2.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis3, contact center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    shortest principal axis  of the moving part through the center of the contact region of moving part and base part
    '''
    contact = get_contact(joint.moving_part, joint.base_part)
    origin = contact.center 
    axis = joint.moving_part.axis3.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "base axis1, contact center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    longest principal axis  of the base part through the center of the contact region of moving part and base part
    '''
    contact = get_contact(joint.moving_part, joint.base_part)
    origin = contact.center 
    axis = joint.base_part.axis1.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "base axis2, contact center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    second longest principal axis  of the base part through the center of the contact region of moving part and base part
    '''
    contact = get_contact(joint.moving_part, joint.base_part)
    origin = contact.center 
    axis = joint.base_part.axis2.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "base axis3, contact center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    shortest principal axis  of the base part through the center of the contact region of moving part and base part
    '''
    contact = get_contact(joint.moving_part, joint.base_part)
    origin = contact.center 
    axis = joint.base_part.axis3.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis1, moving center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    longest principal axis  of the moving part through the center of moving part
    '''
    origin = joint.moving_part.center 
    axis = joint.moving_part.axis1.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis2, moving center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    second longest principal axis  of the moving part through the center of moving part
    '''
    origin = joint.moving_part.center 
    axis = joint.moving_part.axis2.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis3, moving center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    shortest principal axis of the moving part through the center of moving part
    '''
    origin = joint.moving_part.center 
    axis = joint.moving_part.axis3.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "base axis1, moving center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    longest principal axis  of the base part through the center of moving part
    '''
    origin = joint.moving_part.center 
    axis = joint.base_part.axis1.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "base axis2, moving center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    second longest principal axis  of the base part through the center of moving part
    '''
    origin = joint.moving_part.center 
    axis = joint.base_part.axis2.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "base axis3, moving center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    shortest principal axis of the base part through the center of moving part
    '''
    origin = joint.moving_part.center 
    axis = joint.base_part.axis3.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "base axis1, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    longest principal axis  of the base part through the center of base part
    '''
    origin = joint.base_part.center 
    axis = joint.base_part.axis1.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "base axis2, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    second longest principal axis  of the base part through the center of base part
    '''
    origin = joint.base_part.center 
    axis = joint.base_part.axis2.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "base axis3, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    shortest principal axis  of the base part through the center of base part
    '''
    origin = joint.base_part.center 
    axis = joint.base_part.axis3.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis1, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    longest principal axis  of the moving part through the center of base part
    '''
    origin = joint.base_part.center 
    axis = joint.moving_part.axis1.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis2, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    second longest principal axis  of the moving part through the center of base part
    '''
    origin = joint.base_part.center 
    axis = joint.moving_part.axis2.direction
    return axis, origin
""",
"motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis3, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''
    '''
    shortest principal axis  of the moving part the center of base part
    '''
    origin = joint.base_part.center 
    axis = joint.moving_part.axis3.direction
    return axis, origin
""",
    "motion_type": "rotation"
}

]


rotation_range_rules = [

#====================================================================================================

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    '''
    Range rule function to generate motion range 

    Args:
        joint: Joint
            The joint containg the moving part and the base part
        axis: [float, float, float]
            A unit vector indicating the rotation axis direction
        origin: [float, float, float]
            One point on the rotation axis

    Return:
        ref: [float, float, float]
            A unit vector indicating the reference direction of the motion ("0" direction), this vector should be perpendicular to the rotation axis
        current_pose: float
            The angle between the vector indicating the current orientation of the moving part and the ref vector
        min_range: float
            The minimum rotation range with respected to the ref
        max_range: float
            The maximum rotation range with respected to the ref
    '''

    '''
    (0, 0.5pi) ref to default ref
    '''

    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    '''
    Range rule function to generate motion range 

    Args:
        joint: Joint
            The joint containg the moving part and the base part
        axis: [float, float, float]
            A unit vector indicating the rotation axis direction
        origin: [float, float, float]
            One point on the rotation axis

    Return:
        ref: [float, float, float]
            A unit vector indicating the reference direction of the motion ("0" direction), this vector should be perpendicular to the rotation axis
        current_pose: float
            The angle between the vector indicating the current orientation of the moving part and the ref vector
        min_range: float
            The minimum rotation range with respected to the ref
        max_range: float
            The maximum rotation range with respected to the ref
    '''

    '''
    (0, 0.5pi) ref to default ref
    '''

    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    '''
    Range rule function to generate motion range 

    Args:
        joint: Joint
            The joint containg the moving part and the base part
        axis: [float, float, float]
            A unit vector indicating the rotation axis direction
        origin: [float, float, float]
            One point on the rotation axis

    Return:
        ref: [float, float, float]
            A unit vector indicating the reference direction of the motion ("0" direction), this vector should be perpendicular to the rotation axis
        current_pose: float
            The angle between the vector indicating the current orientation of the moving part and the ref vector
        min_range: float
            The minimum rotation range with respected to the ref
        max_range: float
            The maximum rotation range with respected to the ref
    '''

    '''
    (0, 0.5pi) ref to default ref
    '''

    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    '''
    Range rule function to generate motion range 

    Args:
        joint: Joint
            The joint containg the moving part and the base part
        axis: [float, float, float]
            A unit vector indicating the rotation axis direction
        origin: [float, float, float]
            One point on the rotation axis

    Return:
        ref: [float, float, float]
            A unit vector indicating the reference direction of the motion ("0" direction), this vector should be perpendicular to the rotation axis
        current_pose: float
            The angle between the vector indicating the current orientation of the moving part and the ref vector
        min_range: float
            The minimum rotation range with respected to the ref
        max_range: float
            The maximum rotation range with respected to the ref
    '''

    '''
    (0, 0.5pi) ref to default ref
    '''

    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0048
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0047
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0046
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0045
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0044
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0043
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0042
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0041
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0040
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0039
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0037
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0036
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0035
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0034
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0033
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0032
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0031
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0030
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0029
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0028
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0027
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0026
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0025
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0024
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0023
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0022
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0021
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0020
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0019
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0018
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0017
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0016
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0015
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0014
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0013
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0012
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0011
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.0010
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.009
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.008
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.007
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.006
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.005
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.004
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.003
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.002
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
},

{
    "name": "0, 0.5pi",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)

    min_range = 0.001
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range
""",
"motion_type": "rotation"
}

]

translation_range_rules = [

#====================================================================================================
{
    "name": "moving, - proj length, proj length",
    "type": "range",
    "text": 
"""
def func(joint, axis, origin):
    '''
    Range rule function to generate motion range 

    Args:
        joint: Joint
            The joint containg the moving part and the base part
        axis: [float, float, float]
            A unit vector indicating the translation axis direction
        origin: [float, float, float]
            One point on the translation axis

    Return:
        ref: [float, float, float]
            The reference position of the motion ("0" position), a position on the translation axis line. 
        current_pose: float
            The distance between the current position and the reference position.
        min_range: float
            The minimum translation range with respected to the ref.
        max_range: float
            The maximum translation range with respected to the ref.
    '''

    '''
    (- proj length of moving, + proj length of moving) ref to the position of the moving part 
    '''


    ref = joint.moving_part.center
    current_pose = 0
    length, start, end = get_length_along_dir(joint.moving_part, axis)
    min_range = -1.0 * length
    max_range = 1.0 * length

    return ref, current_pose, min_range, max_range
""",
"motion_type": "translation"
},


]

# empty translation axis rule
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis direction [1, 0, 0] through the center moving part
    '''

    origin = joint.moving_part.center 
    axis = [1, 0, 0]
    return axis, origin



# empty rotation axis rule
def func(joint):
    '''
    Axis rule function to generate motion axis 

    Args:
        joint: Joint
            The joint containg the moving part and the base part

    Return:
        axis: [float, float, float]
            A unit vector indicating the direction of the motion axis
        origin: [float, float, float]
            A point on the line of the motion axis
    '''

    '''
    Global positive x axis direction [1, 0, 0] through the center moving part
    '''

    origin = joint.moving_part.center
    axis = [1, 0, 0]
    return axis, origin

#empty translation range rule:
def func(joint, axis, origin):
    '''
    Range rule function to generate motion range 

    Args:
        joint: Joint
            The joint containg the moving part and the base part
        axis: [float, float, float]
            A unit vector indicating the translation axis direction
        origin: [float, float, float]
            One point on the translation axis

    Return:
        ref: [float, float, float]
            The reference position of the motion ("0" position), a position on the translation axis line. 
        current_pose: float
            The distance between the current position and the reference position.
        min_range: float
            The minimum translation range with respected to the ref.
        max_range: float
            The maximum translation range with respected to the ref.
    '''

    '''
    (0, 1) ref to the current moving part center 
    '''
    
    ref = joint.moving_part.center
    current_pose = 0
    min_range = 0
    max_range = 1

    return ref, current_pose, min_range, max_range


#empty rotaion range rule:
def func(joint, axis, origin):
    '''
    Range rule function to generate motion range 

    Args:
        joint: Joint
            The joint containg the moving part and the base part
        axis: [float, float, float]
            A unit vector indicating the rotation axis direction
        origin: [float, float, float]
            One point on the rotation axis

    Return:
        ref: [float, float, float]
            A unit vector indicating the reference direction of the motion ("0" direction), this vector should be perpendicular to the rotation axis
        current_pose: float
            The angle between the vector indicating the current orientation of the moving part and the ref vector
        min_range: float
            The minimum rotation range with respected to the ref
        max_range: float
            The maximum rotation range with respected to the ref
    '''

    '''
    (0, 0.5pi) ref to the default ref 
    '''
    
    moving_lever = default_lever_arm(joint.moving_part, axis, origin)
    ref = default_reference_vector(joint.base_part, moving_lever, axis, origin)
    current_pose = signed_angle_between(moving_lever, ref, axis)
    min_range = 0
    max_range = 0.5 * np.pi

    return ref, current_pose, min_range, max_range

operator_rules = [
#====================================================================================================
{
    "name": "moving axis3, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    regions = [joint.moving_part, joint.base_part, get_contact(joint.moving_part, joint.base_part)]
    ret = sort(regions, "center[0]")
    origin = ret[0].center
    axis = [0, 1, 0]
    return axis, origin
""",
    "motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis3, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    regions = [joint.moving_part, joint.base_part, get_contact(joint.moving_part, joint.base_part)]
    ret = filter(regions, "center[0]", (0, 1))
    origin = ret[0].center
    axis = [0, 1, 0]
    return axis, origin
""",
    "motion_type": "rotation"
},

#====================================================================================================
{
    "name": "moving axis3, base center",
    "type": "axis",
    "text": 
"""
def func(joint):
    regions = [joint.moving_part, joint.base_part, get_contact(joint.moving_part, joint.base_part)]
    ret = group(regions, 2, "center[0]")
    origin = ret[0][0].center
    axis = [0, 1, 0]
    return axis, origin
""",
    "motion_type": "rotation"
},

#====================================================================================================
{
    "name": "merge",
    "type": "axis",
    "text": 
"""
def func(joint):
    regions = [joint.moving_part, joint.base_part, get_contact(joint.moving_part, joint.base_part)]
    ret = merge(regions)
    origin = ret.center
    axis = [0, 1, 0]
    return axis, origin
""",
    "motion_type": "rotation"
}

]

def test_all_rules():

    test_create_collection()
    test_add_joint()

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
                "range_rule": "def func(joint, axis, origin):\n     return [0, 0, 0], 0, 0, 1"
            }

    #----------------------------------------------------rule syntex correctness check-----------------------------------
    
    for axis_rule in axis_rules:
        code = axis_rule["text"]
        print('rule name:', axis_rule["name"])
        test_json['axis_rule'] = axis_rule["text"]
        print('test_json', test_json)
        run_axis_rule(test_json)
        confirm_axis_rule(test_json)
        reject_axis_rule(test_json)
        judge_axis_rule(test_json)
        confirm_axis_rule(test_json)
    
    for axis_rule in operator_rules:
        code = axis_rule["text"]
        print('rule name:', axis_rule["name"])
        test_json['axis_rule'] = axis_rule["text"]
        print('test_json', test_json)
        run_axis_rule(test_json)
        confirm_axis_rule(test_json)
        reject_axis_rule(test_json)
        judge_axis_rule(test_json)
        confirm_axis_rule(test_json)
    
    for range_rule in rotation_range_rules:
        print('rule name:', axis_rule["name"])
        test_json['range_rule'] = range_rule["text"]
        print('test_json', test_json)
        run_range_rule(test_json)
        confirm_axis_rule(test_json)
        reject_range_rule(test_json)
        judge_range_rule(test_json)
        confirm_range_rule(test_json)

    for range_rule in translation_range_rules:
        print('rule name:', axis_rule["name"])
        test_json['range_rule'] = range_rule["text"]
        print('test_json', test_json)
        run_range_rule(test_json)
        confirm_axis_rule(test_json)
        reject_range_rule(test_json)
        judge_range_rule(test_json)
        confirm_range_rule(test_json)

#----------------------------------------------------rule syntex correctness check-----------------------------------
    
    test_remove_joint()
    test_delete_collection()








    



if __name__ == '__main__':

    #test_all_rules()
    '''
    rule_library_path = 'rule_library'
    if os.path.exists(rule_library_path) is False:
        os.makedirs(rule_library_path)

    rotation_axis_rules_json = {}
    rotation_axis_rules_json["rules"] = axis_rules
    out = json.dumps(rotation_axis_rules_json, indent=4)
    open(os.path.join(rule_library_path, "rotation_axis_rules.json"), "w").write(out)

    translation_axis_rules_json = {}
    translation_axis_rules_json["rules"] = axis_rules
    for rule in axis_rules:
        rule["motion_type"] = "translation"

    out = json.dumps(translation_axis_rules_json, indent=4)
    open(os.path.join(rule_library_path, "translation_axis_rules.json"), "w").write(out)

    rotation_range_rules_json = {}
    rotation_range_rules_json["rules"] = rotation_range_rules
    out = json.dumps(rotation_range_rules_json, indent=4)
    open(os.path.join(rule_library_path, "rotation_range_rules.json"), "w").write(out)

    translation_range_rules_json = {}
    translation_range_rules_json["rules"] = translation_range_rules
    out = json.dumps(translation_range_rules_json, indent=4)
    open(os.path.join(rule_library_path, "translation_range_rules.json"), "w").write(out)
    '''
    test_time()
    
