# Aim : Implement following activation functions using python to build simple neural network. a. ReLU b. Sigmoid c. Tanh

import numpy as np

# Activation functions
def relu(x):
    return np.maximum(0, x)

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def tanh(x):
    return np.tanh(x)

# Sample data
data = np.array([-2, -1, 0, 1, 2])

# Applying activation functions to the sample data
relu_output = relu(data)
sigmoid_output = sigmoid(data)
tanh_output = tanh(data)

# Print the outputs
print("ReLU Output:", relu_output)
print("Sigmoid Output:", sigmoid_output)
print("Tanh Output:", tanh_output)

print("(2)")#Now, let's create a simple neural network with one hidden layer using these activation functions:


# Sample data
input_data = np.array([[0.1, 0.2, 0.3],
                       [0.4, 0.5, 0.6]])

# Initialize weights and biases for the hidden layer
hidden_layer_weights = np.array([[0.1, 0.2],
                                 [0.3, 0.4],
                                 [0.5, 0.6]])
hidden_layer_biases = np.array([0.1, 0.2])

# Initialize weights and biases for the output layer
output_layer_weights = np.array([[0.7],
                                 [0.8]])
output_layer_biases = np.array([0.3])

# Feedforward computation
hidden_layer_output = relu(np.dot(input_data, hidden_layer_weights) + hidden_layer_biases)
output_layer_output = sigmoid(np.dot(hidden_layer_output, output_layer_weights) + output_layer_biases)

# Print the output of the neural network
print("Output:", output_layer_output)
