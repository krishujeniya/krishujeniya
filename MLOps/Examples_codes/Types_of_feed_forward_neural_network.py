# AIM :  Implement following feed forward neural network using python programming: a. Single layer feed forward neural network. b. Multi-layer feed forward neural network.

import numpy as np


# Sample data (2 input features)
input_data = np.array([[0.1, 0.2],
                       [0.3, 0.4]])

# ReLU activation function for hidden layers
def relu(x):
    return np.maximum(0, x)

# Sigmoid activation function for the output layer
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Single Layer Feed Forward Neural Network
class SingleLayerFeedForwardNN:
    def __init__(self, input_size, output_size):
        self.input_size = input_size
        self.output_size = output_size
        self.weights = np.random.rand(input_size, output_size)
        self.biases = np.random.rand(output_size)

    def forward(self, input_data):
        z = np.dot(input_data, self.weights) + self.biases
        output = sigmoid(z)
        return output


# Initialize single-layer feedforward neural network
single_layer_nn = SingleLayerFeedForwardNN(input_size=2, output_size=1)

# Perform forward pass
output = single_layer_nn.forward(input_data)

# Print the output of the single-layer feedforward neural network
print("Single Layer Feed Forward Neural Network Output:")
print(output)




# Multi-layer Feed Forward Neural Network
class MultiLayerFeedForwardNN:
    def __init__(self, input_size, hidden_sizes, output_size):
        self.input_size = input_size
        self.hidden_sizes = hidden_sizes
        self.output_size = output_size
        self.weights = []
        self.biases = []
        # Initialize weights and biases for each layer
        layer_sizes = [input_size] + hidden_sizes + [output_size]
        for i in range(len(layer_sizes) - 1):
            self.weights.append(np.random.rand(layer_sizes[i], layer_sizes[i+1]))
            self.biases.append(np.random.rand(layer_sizes[i+1]))

    def forward(self, input_data):
        layer_output = input_data
        for weight, bias in zip(self.weights, self.biases):
            z = np.dot(layer_output, weight) + bias
            if weight is self.weights[-1]:  # Output layer (use sigmoid)
                layer_output = sigmoid(z)
            else:  # Hidden layers (use ReLU)
                layer_output = relu(z)
        return layer_output

# Initialize multi-layer feedforward neural network
hidden_sizes = [3, 2]  # Two hidden layers with 3 and 2 neurons respectively
multi_layer_nn = MultiLayerFeedForwardNN(input_size=2, hidden_sizes=hidden_sizes, output_size=1)

# Perform forward pass
output = multi_layer_nn.forward(input_data)

# Print the output of the multi-layer feedforward neural network
print("Multi-Layer Feed Forward Neural Network Output:")
print(output)
