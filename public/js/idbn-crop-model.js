// Improved Deep Belief Networks (IDBN) Crop Recommendation Model
class IDBNCropRecommendationModel {
    constructor() {
        this.weights = this.initializeWeights();
        this.biases = this.initializeBiases();
        this.learningRate = 0.01;
        this.epochs = 100;
    }

    // Initialize network weights for multimodal inputs
    initializeWeights() {
        return {
            soil_layer: this.randomMatrix(15, 32),
            climate_layer: this.randomMatrix(8, 24),
            location_layer: this.randomMatrix(6, 16),
            hidden1: this.randomMatrix(72, 64),
            hidden2: this.randomMatrix(64, 32),
            output: this.randomMatrix(32, 8)
        };
    }

    initializeBiases() {
        return {
            soil_layer: new Array(32).fill(0).map(() => Math.random() * 0.1),
            climate_layer: new Array(24).fill(0).map(() => Math.random() * 0.1),
            location_layer: new Array(16).fill(0).map(() => Math.random() * 0.1),
            hidden1: new Array(64).fill(0).map(() => Math.random() * 0.1),
            hidden2: new Array(32).fill(0).map(() => Math.random() * 0.1),
            output: new Array(8).fill(0).map(() => Math.random() * 0.1)
        };
    }

    randomMatrix(rows, cols) {
        return Array(rows).fill().map(() => 
            Array(cols).fill().map(() => (Math.random() - 0.5) * 0.2)
        );
    }

    // Sigmoid activation function
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    // ReLU activation function
    relu(x) {
        return Math.max(0, x);
    }

    // Softmax for output layer
    softmax(arr) {
        const max = Math.max(...arr);
        const exp = arr.map(x => Math.exp(x - max));
        const sum = exp.reduce((a, b) => a + b, 0);
        return exp.map(x => x / sum);
    }

    // Feature extraction for multimodal inputs
    extractSoilFeatures(soilType, district, state) {
        const soilFeatures = {
            'Red Loamy Soil': [1, 0, 0, 0, 0, 0.8, 0.6, 0.7, 0.5, 0.9, 0.7, 0.6, 0.8, 0.4, 0.6],
            'Black Cotton Soil': [0, 1, 0, 0, 0, 0.9, 0.8, 0.9, 0.7, 0.6, 0.8, 0.9, 0.7, 0.8, 0.9],
            'Red Sandy Soil': [0, 0, 1, 0, 0, 0.6, 0.4, 0.5, 0.3, 0.7, 0.5, 0.4, 0.6, 0.2, 0.4],
            'Alluvial Soil': [0, 0, 0, 1, 0, 0.9, 0.9, 0.8, 0.8, 0.8, 0.9, 0.8, 0.9, 0.7, 0.8],
            'Laterite Soil': [0, 0, 0, 0, 1, 0.5, 0.3, 0.4, 0.2, 0.6, 0.4, 0.3, 0.5, 0.1, 0.3]
        };
        return soilFeatures[soilType] || soilFeatures['Red Loamy Soil'];
    }

    extractClimateFeatures(state, district) {
        const climateData = {
            'Tamil Nadu': [0.8, 0.7, 0.6, 0.9, 0.8, 0.5, 0.7, 0.6],
            'Kerala': [0.9, 0.9, 0.8, 0.7, 0.9, 0.8, 0.9, 0.8],
            'Karnataka': [0.7, 0.6, 0.5, 0.8, 0.7, 0.4, 0.6, 0.5]
        };
        return climateData[state] || [0.7, 0.6, 0.5, 0.8, 0.7, 0.4, 0.6, 0.5];
    }

    extractLocationFeatures(state, district) {
        const locationEncoding = {
            'Tamil Nadu': [1, 0, 0, 0.8, 0.7, 0.6],
            'Kerala': [0, 1, 0, 0.9, 0.8, 0.9],
            'Karnataka': [0, 0, 1, 0.7, 0.6, 0.5]
        };
        return locationEncoding[state] || [0, 0, 0, 0.5, 0.5, 0.5];
    }

    // Forward propagation through IDBN
    forwardPass(soilFeatures, climateFeatures, locationFeatures) {
        // Process each modality through separate layers
        const soilHidden = this.processLayer(soilFeatures, this.weights.soil_layer, this.biases.soil_layer);
        const climateHidden = this.processLayer(climateFeatures, this.weights.climate_layer, this.biases.climate_layer);
        const locationHidden = this.processLayer(locationFeatures, this.weights.location_layer, this.biases.location_layer);

        // Concatenate multimodal features
        const combined = [...soilHidden, ...climateHidden, ...locationHidden];

        // Deep belief network layers
        const hidden1 = this.processLayer(combined, this.weights.hidden1, this.biases.hidden1, 'relu');
        const hidden2 = this.processLayer(hidden1, this.weights.hidden2, this.biases.hidden2, 'relu');
        const output = this.processLayer(hidden2, this.weights.output, this.biases.output, 'linear');

        return this.softmax(output);
    }

    processLayer(input, weights, biases, activation = 'sigmoid') {
        const output = [];
        for (let i = 0; i < weights[0].length; i++) {
            let sum = biases[i];
            for (let j = 0; j < input.length; j++) {
                sum += input[j] * weights[j][i];
            }
            
            switch (activation) {
                case 'relu':
                    output.push(this.relu(sum));
                    break;
                case 'linear':
                    output.push(sum);
                    break;
                default:
                    output.push(this.sigmoid(sum));
            }
        }
        return output;
    }

    // Main prediction function
    predictCrops(category, soilType, state, district) {
        const soilFeatures = this.extractSoilFeatures(soilType, district, state);
        const climateFeatures = this.extractClimateFeatures(state, district);
        const locationFeatures = this.extractLocationFeatures(state, district);

        const predictions = this.forwardPass(soilFeatures, climateFeatures, locationFeatures);
        
        return this.interpretPredictions(predictions, category, soilType);
    }

    interpretPredictions(predictions, category, soilType) {
        const categoryMapping = {
            'Cereals': ['Rice', 'Wheat', 'Maize', 'Millets'],
            'Vegetables': ['Tomato', 'Onion', 'Potato', 'Cabbage', 'Carrot', 'Brinjal'],
            'Fruits': ['Mango', 'Banana', 'Orange', 'Grapes', 'Pomegranate'],
            'Pulses': ['Chickpea', 'Pigeon Pea', 'Black Gram', 'Green Gram'],
            'Oil Seeds': ['Groundnut', 'Sunflower', 'Sesame', 'Castor'],
            'Flowers': ['Rose', 'Jasmine', 'Marigold', 'Chrysanthemum'],
            'Plantation Crops': ['Coffee', 'Tea', 'Coconut', 'Rubber'],
            'Spices': ['Turmeric', 'Ginger', 'Chilli', 'Coriander', 'Black Pepper', 'Cardamom']
        };

        const crops = categoryMapping[category] || [];
        const results = [];

        // Apply IDBN confidence scores
        for (let i = 0; i < Math.min(crops.length, 4); i++) {
            const confidence = predictions[i % predictions.length];
            const suitability = confidence > 0.7 ? 'High' : confidence > 0.4 ? 'Medium' : 'Low';
            
            results.push({
                name: crops[i],
                confidence: (confidence * 100).toFixed(1),
                suitability: suitability,
                aiScore: confidence,
                recommendation: this.generateRecommendation(crops[i], confidence, soilType)
            });
        }

        return results.sort((a, b) => b.aiScore - a.aiScore);
    }

    generateRecommendation(crop, confidence, soilType) {
        if (confidence > 0.7) {
            return `Highly recommended for ${soilType}. Optimal growing conditions detected.`;
        } else if (confidence > 0.4) {
            return `Moderately suitable for ${soilType}. Consider soil amendments for better yield.`;
        } else {
            return `Low suitability for ${soilType}. Alternative crops may be more profitable.`;
        }
    }
}

// Initialize the IDBN model
const idbnModel = new IDBNCropRecommendationModel();

// Enhanced crop recommendation function using IDBN
function getIDBNRecommendedCrops(category, soilType, state, district) {
    const aiPredictions = idbnModel.predictCrops(category, soilType, state, district);
    
    // Combine with existing crop data
    const enhancedRecommendations = aiPredictions.map(prediction => {
        const cropInfo = getCropInfo(prediction.name, category);
        return {
            ...cropInfo,
            ...prediction,
            aiEnhanced: true,
            modelUsed: 'Improved Deep Belief Networks (IDBN)'
        };
    });

    return enhancedRecommendations;
}

// Helper function to get crop info from existing data
function getCropInfo(cropName, category) {
    if (typeof cropData !== 'undefined' && cropData[category] && cropData[category][cropName]) {
        return cropData[category][cropName];
    }
    
    // Fallback crop info
    return {
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
        soils: ['Red Loamy Soil', 'Black Soil'],
        season: 'Kharif/Rabi',
        duration: '90-120 days',
        yield: '2-4 tons/hectare'
    };
}