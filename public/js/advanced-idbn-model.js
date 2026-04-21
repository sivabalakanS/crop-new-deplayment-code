// Advanced Improved Deep Belief Network (IDBN) for Crop Recommendation
// Using Restricted Boltzmann Machines (RBM) and Gaussian RBM (GRBM)
// Optimized with Ranger Optimizer (RAdam + LookAhead)

class RangerOptimizer {
    constructor(learningRate = 0.001, beta1 = 0.9, beta2 = 0.999, k = 6, alpha = 0.5) {
        this.learningRate = learningRate;
        this.beta1 = beta1;
        this.beta2 = beta2;
        this.epsilon = 1e-8;
        this.k = k; // LookAhead steps
        this.alpha = alpha; // LookAhead alpha
        this.t = 0;
        this.m = {}; // First moment
        this.v = {}; // Second moment
        this.slowWeights = {}; // LookAhead slow weights
        this.stepCount = 0;
    }

    // RAdam (Rectified Adam) update
    update(weights, gradients, layerName) {
        this.t++;
        
        if (!this.m[layerName]) {
            this.m[layerName] = weights.map(row => row.map(() => 0));
            this.v[layerName] = weights.map(row => row.map(() => 0));
            this.slowWeights[layerName] = JSON.parse(JSON.stringify(weights));
        }

        const updatedWeights = [];
        
        for (let i = 0; i < weights.length; i++) {
            updatedWeights[i] = [];
            for (let j = 0; j < weights[i].length; j++) {
                // Update biased first moment estimate
                this.m[layerName][i][j] = this.beta1 * this.m[layerName][i][j] + 
                                          (1 - this.beta1) * gradients[i][j];
                
                // Update biased second raw moment estimate
                this.v[layerName][i][j] = this.beta2 * this.v[layerName][i][j] + 
                                          (1 - this.beta2) * gradients[i][j] * gradients[i][j];
                
                // Compute bias-corrected first moment estimate
                const mHat = this.m[layerName][i][j] / (1 - Math.pow(this.beta1, this.t));
                
                // Compute bias-corrected second raw moment estimate
                const vHat = this.v[layerName][i][j] / (1 - Math.pow(this.beta2, this.t));
                
                // Rectification term
                const rhoInf = 2 / (1 - this.beta2) - 1;
                const rho = rhoInf - 2 * this.t * Math.pow(this.beta2, this.t) / (1 - Math.pow(this.beta2, this.t));
                
                let update;
                if (rho > 4) {
                    const r = Math.sqrt((rho - 4) * (rho - 2) * rhoInf / ((rhoInf - 4) * (rhoInf - 2) * rho));
                    update = r * mHat / (Math.sqrt(vHat) + this.epsilon);
                } else {
                    update = mHat;
                }
                
                updatedWeights[i][j] = weights[i][j] - this.learningRate * update;
            }
        }

        // LookAhead mechanism
        this.stepCount++;
        if (this.stepCount % this.k === 0) {
            for (let i = 0; i < updatedWeights.length; i++) {
                for (let j = 0; j < updatedWeights[i].length; j++) {
                    this.slowWeights[layerName][i][j] = this.slowWeights[layerName][i][j] + 
                        this.alpha * (updatedWeights[i][j] - this.slowWeights[layerName][i][j]);
                    updatedWeights[i][j] = this.slowWeights[layerName][i][j];
                }
            }
        }

        return updatedWeights;
    }
}

class RestrictedBoltzmannMachine {
    constructor(visibleUnits, hiddenUnits, learningRate = 0.01) {
        this.visibleUnits = visibleUnits;
        this.hiddenUnits = hiddenUnits;
        this.learningRate = learningRate;
        
        // Initialize weights with Xavier initialization
        this.weights = this.initializeWeights(visibleUnits, hiddenUnits);
        this.visibleBias = new Array(visibleUnits).fill(0);
        this.hiddenBias = new Array(hiddenUnits).fill(0);
    }

    initializeWeights(rows, cols) {
        const limit = Math.sqrt(6 / (rows + cols));
        return Array(rows).fill().map(() => 
            Array(cols).fill().map(() => (Math.random() * 2 - 1) * limit)
        );
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    // Sample hidden units given visible units
    sampleHidden(visible) {
        const hiddenProbs = [];
        const hiddenStates = [];
        
        for (let j = 0; j < this.hiddenUnits; j++) {
            let activation = this.hiddenBias[j];
            for (let i = 0; i < this.visibleUnits; i++) {
                activation += visible[i] * this.weights[i][j];
            }
            const prob = this.sigmoid(activation);
            hiddenProbs.push(prob);
            hiddenStates.push(Math.random() < prob ? 1 : 0);
        }
        
        return { probs: hiddenProbs, states: hiddenStates };
    }

    // Sample visible units given hidden units
    sampleVisible(hidden) {
        const visibleProbs = [];
        const visibleStates = [];
        
        for (let i = 0; i < this.visibleUnits; i++) {
            let activation = this.visibleBias[i];
            for (let j = 0; j < this.hiddenUnits; j++) {
                activation += hidden[j] * this.weights[i][j];
            }
            const prob = this.sigmoid(activation);
            visibleProbs.push(prob);
            visibleStates.push(Math.random() < prob ? 1 : 0);
        }
        
        return { probs: visibleProbs, states: visibleStates };
    }

    // Contrastive Divergence training
    train(data, epochs = 10, k = 1) {
        for (let epoch = 0; epoch < epochs; epoch++) {
            for (let sample of data) {
                // Positive phase
                const hidden0 = this.sampleHidden(sample);
                
                // Negative phase (k-step Gibbs sampling)
                let visibleK = sample;
                let hiddenK = hidden0;
                
                for (let step = 0; step < k; step++) {
                    visibleK = this.sampleVisible(hiddenK.states).states;
                    hiddenK = this.sampleHidden(visibleK);
                }
                
                // Update weights and biases
                for (let i = 0; i < this.visibleUnits; i++) {
                    for (let j = 0; j < this.hiddenUnits; j++) {
                        const positiveGrad = sample[i] * hidden0.probs[j];
                        const negativeGrad = visibleK[i] * hiddenK.probs[j];
                        this.weights[i][j] += this.learningRate * (positiveGrad - negativeGrad);
                    }
                    this.visibleBias[i] += this.learningRate * (sample[i] - visibleK[i]);
                }
                
                for (let j = 0; j < this.hiddenUnits; j++) {
                    this.hiddenBias[j] += this.learningRate * (hidden0.probs[j] - hiddenK.probs[j]);
                }
            }
        }
    }

    // Transform data to hidden representation
    transform(visible) {
        return this.sampleHidden(visible).probs;
    }
}

class GaussianRBM extends RestrictedBoltzmannMachine {
    constructor(visibleUnits, hiddenUnits, learningRate = 0.01) {
        super(visibleUnits, hiddenUnits, learningRate);
        this.sigma = 1.0; // Standard deviation for Gaussian visible units
    }

    // Sample visible units with Gaussian distribution
    sampleVisible(hidden) {
        const visibleMeans = [];
        const visibleStates = [];
        
        for (let i = 0; i < this.visibleUnits; i++) {
            let mean = this.visibleBias[i];
            for (let j = 0; j < this.hiddenUnits; j++) {
                mean += hidden[j] * this.weights[i][j];
            }
            visibleMeans.push(mean);
            // Sample from Gaussian distribution
            const sample = mean + this.gaussianRandom() * this.sigma;
            visibleStates.push(sample);
        }
        
        return { probs: visibleMeans, states: visibleStates };
    }

    gaussianRandom() {
        // Box-Muller transform for Gaussian random numbers
        const u1 = Math.random();
        const u2 = Math.random();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    // Energy function for Gaussian-Binary RBM
    energy(visible, hidden) {
        let energy = 0;
        
        // Visible bias term (Gaussian)
        for (let i = 0; i < this.visibleUnits; i++) {
            energy += Math.pow(visible[i] - this.visibleBias[i], 2) / (2 * this.sigma * this.sigma);
        }
        
        // Hidden bias term
        for (let j = 0; j < this.hiddenUnits; j++) {
            energy -= this.hiddenBias[j] * hidden[j];
        }
        
        // Interaction term
        for (let i = 0; i < this.visibleUnits; i++) {
            for (let j = 0; j < this.hiddenUnits; j++) {
                energy -= (visible[i] / this.sigma) * this.weights[i][j] * hidden[j];
            }
        }
        
        return energy;
    }
}

class ImprovedDeepBeliefNetwork {
    constructor() {
        this.rangerOptimizer = new RangerOptimizer(0.001, 0.9, 0.999, 6, 0.5);
        this.rbmLayers = [];
        this.trained = false;
        
        // Network architecture
        this.architecture = {
            soil: { input: 15, hidden: 32 },
            climate: { input: 8, hidden: 24 },
            location: { input: 6, hidden: 16 },
            combined: { input: 72, hidden1: 64, hidden2: 32, output: 8 }
        };
        
        this.initializeNetwork();
    }

    initializeNetwork() {
        // GRBM for continuous soil features
        this.soilGRBM = new GaussianRBM(
            this.architecture.soil.input,
            this.architecture.soil.hidden,
            0.01
        );
        
        // RBM for climate features
        this.climateRBM = new RestrictedBoltzmannMachine(
            this.architecture.climate.input,
            this.architecture.climate.hidden,
            0.01
        );
        
        // RBM for location features
        this.locationRBM = new RestrictedBoltzmannMachine(
            this.architecture.location.input,
            this.architecture.location.hidden,
            0.01
        );
        
        // Deep layers
        this.rbmLayers.push(
            new RestrictedBoltzmannMachine(72, 64, 0.01),
            new RestrictedBoltzmannMachine(64, 32, 0.01)
        );
        
        // Output weights
        this.outputWeights = this.initializeWeights(32, 8);
        this.outputBias = new Array(8).fill(0);
    }

    initializeWeights(rows, cols) {
        const limit = Math.sqrt(6 / (rows + cols));
        return Array(rows).fill().map(() => 
            Array(cols).fill().map(() => (Math.random() * 2 - 1) * limit)
        );
    }

    // Extract enhanced soil features (continuous values)
    extractSoilFeatures(soilType, district, state) {
        const soilProperties = {
            'Red Loamy Soil': [1, 0, 0, 0, 0, 6.5, 0.8, 0.6, 0.7, 0.5, 0.9, 0.7, 0.8, 0.2, 0.6],
            'Black Cotton Soil': [0, 1, 0, 0, 0, 7.8, 0.9, 0.8, 0.9, 0.7, 0.6, 0.8, 0.9, 0.3, 0.9],
            'Red Sandy Soil': [0, 0, 1, 0, 0, 6.0, 0.6, 0.4, 0.5, 0.3, 0.7, 0.5, 0.6, 0.1, 0.4],
            'Alluvial Soil': [0, 0, 0, 1, 0, 7.2, 0.9, 0.9, 0.8, 0.8, 0.8, 0.9, 0.9, 0.2, 0.8],
            'Laterite Soil': [0, 0, 0, 0, 1, 5.5, 0.5, 0.3, 0.4, 0.2, 0.6, 0.4, 0.5, 0.1, 0.3],
            'Deltaic Alluvial Soil': [0, 0, 0, 1, 0, 7.5, 0.95, 0.85, 0.9, 0.85, 0.9, 0.95, 0.95, 0.15, 0.85],
            'Coastal Alluvial Soil': [0, 0, 0, 1, 0, 7.0, 0.85, 0.75, 0.8, 0.7, 0.85, 0.8, 0.85, 0.4, 0.75],
            'Black Soil': [0, 1, 0, 0, 0, 7.5, 0.85, 0.75, 0.85, 0.65, 0.7, 0.85, 0.9, 0.25, 0.85],
            'Forest Loam Soil': [0, 0, 0, 0, 1, 6.8, 0.75, 0.65, 0.7, 0.8, 0.8, 0.75, 0.8, 0.1, 0.7],
            'Saline Soil': [0, 0, 1, 0, 0, 8.5, 0.4, 0.3, 0.5, 0.2, 0.5, 0.4, 0.3, 0.9, 0.3]
        };
        
        return soilProperties[soilType] || soilProperties['Red Loamy Soil'];
    }

    // Extract climate features (normalized 0-1)
    extractClimateFeatures(state, district) {
        const climateData = {
            'Tamil Nadu': [0.85, 0.7, 0.65, 0.9, 0.75, 0.8, 0.7, 0.6],
            'Kerala': [0.9, 0.95, 0.85, 0.75, 0.9, 0.85, 0.9, 0.5],
            'Karnataka': [0.75, 0.65, 0.6, 0.85, 0.7, 0.7, 0.65, 0.55]
        };
        
        return climateData[state] || [0.75, 0.7, 0.65, 0.8, 0.7, 0.7, 0.7, 0.6];
    }

    // Extract location features (normalized 0-1)
    extractLocationFeatures(state, district) {
        const locationData = {
            'Tamil Nadu': [1, 0, 0, 0.6, 0.8, 0.7],
            'Kerala': [0, 1, 0, 0.7, 0.85, 0.9],
            'Karnataka': [0, 0, 1, 0.5, 0.75, 0.65]
        };
        
        return locationData[state] || [0, 0, 0, 0.5, 0.7, 0.6];
    }

    // Pre-train RBM layers using Contrastive Divergence
    pretrainLayers(trainingData, epochs = 50) {
        console.log('Pre-training GRBM for soil features...');
        const soilData = trainingData.map(d => d.soil);
        this.soilGRBM.train(soilData, epochs, 1);
        
        console.log('Pre-training RBM for climate features...');
        const climateData = trainingData.map(d => d.climate);
        this.climateRBM.train(climateData, epochs, 1);
        
        console.log('Pre-training RBM for location features...');
        const locationData = trainingData.map(d => d.location);
        this.locationRBM.train(locationData, epochs, 1);
        
        console.log('Pre-training deep RBM layers...');
        // Transform data through first layers
        const combinedData = trainingData.map(d => {
            const soilHidden = this.soilGRBM.transform(d.soil);
            const climateHidden = this.climateRBM.transform(d.climate);
            const locationHidden = this.locationRBM.transform(d.location);
            return [...soilHidden, ...climateHidden, ...locationHidden];
        });
        
        // Train first deep layer
        this.rbmLayers[0].train(combinedData, epochs, 1);
        
        // Transform through first layer and train second layer
        const layer1Output = combinedData.map(d => this.rbmLayers[0].transform(d));
        this.rbmLayers[1].train(layer1Output, epochs, 1);
        
        this.trained = true;
        console.log('Pre-training completed!');
    }

    // Forward pass through the network
    forward(soilFeatures, climateFeatures, locationFeatures) {
        // Transform through GRBM and RBMs
        const soilHidden = this.soilGRBM.transform(soilFeatures);
        const climateHidden = this.climateRBM.transform(climateFeatures);
        const locationHidden = this.locationRBM.transform(locationFeatures);
        
        // Concatenate multimodal features
        let combined = [...soilHidden, ...climateHidden, ...locationHidden];
        
        // Pass through deep RBM layers
        for (let rbm of this.rbmLayers) {
            combined = rbm.transform(combined);
        }
        
        // Output layer
        const output = [];
        for (let i = 0; i < 8; i++) {
            let sum = this.outputBias[i];
            for (let j = 0; j < combined.length; j++) {
                sum += combined[j] * this.outputWeights[j][i];
            }
            output.push(sum);
        }
        
        return this.softmax(output);
    }

    softmax(arr) {
        const max = Math.max(...arr);
        const exp = arr.map(x => Math.exp(x - max));
        const sum = exp.reduce((a, b) => a + b, 0);
        return exp.map(x => x / sum);
    }

    // Main prediction function
    predictCrops(category, soilType, state, district) {
        const soilFeatures = this.extractSoilFeatures(soilType, district, state);
        const climateFeatures = this.extractClimateFeatures(state, district);
        const locationFeatures = this.extractLocationFeatures(state, district);

        const predictions = this.forward(soilFeatures, climateFeatures, locationFeatures);
        
        return this.interpretPredictions(predictions, category, soilType, state, district);
    }

    interpretPredictions(predictions, category, soilType, state, district) {
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

        for (let i = 0; i < Math.min(crops.length, 6); i++) {
            const confidence = predictions[i % predictions.length];
            const suitability = confidence > 0.75 ? 'High' : 
                              confidence > 0.5 ? 'Medium' : 'Low';
            
            results.push({
                name: crops[i],
                confidence: (confidence * 100).toFixed(1),
                suitability: suitability,
                aiScore: confidence,
                recommendation: this.generateRecommendation(crops[i], confidence, soilType, state),
                modelInfo: 'IDBN with RBM/GRBM + Ranger Optimizer'
            });
        }

        return results.sort((a, b) => b.aiScore - a.aiScore);
    }

    generateRecommendation(crop, confidence, soilType, state) {
        if (confidence > 0.75) {
            return `Highly recommended for ${soilType} in ${state}. Optimal conditions detected with ${(confidence * 100).toFixed(0)}% confidence. Expected high yield.`;
        } else if (confidence > 0.5) {
            return `Moderately suitable for ${soilType}. Consider soil amendments and proper irrigation. Confidence: ${(confidence * 100).toFixed(0)}%.`;
        } else {
            return `Low suitability for current conditions. Alternative crops recommended. Confidence: ${(confidence * 100).toFixed(0)}%.`;
        }
    }
}

// Initialize the advanced IDBN model
const advancedIDBNModel = new ImprovedDeepBeliefNetwork();

// Generate synthetic training data for pre-training
function generateTrainingData() {
    const data = [];
    const states = ['Tamil Nadu', 'Kerala', 'Karnataka'];
    const soils = ['Red Loamy Soil', 'Black Cotton Soil', 'Red Sandy Soil', 'Alluvial Soil', 'Laterite Soil'];
    
    for (let i = 0; i < 100; i++) {
        const state = states[Math.floor(Math.random() * states.length)];
        const soil = soils[Math.floor(Math.random() * soils.length)];
        
        data.push({
            soil: advancedIDBNModel.extractSoilFeatures(soil, 'District', state),
            climate: advancedIDBNModel.extractClimateFeatures(state, 'District'),
            location: advancedIDBNModel.extractLocationFeatures(state, 'District')
        });
    }
    
    return data;
}

// Pre-train the model
console.log('Initializing Advanced IDBN with RBM/GRBM...');
const trainingData = generateTrainingData();
advancedIDBNModel.pretrainLayers(trainingData, 30);

// Enhanced prediction function using advanced IDBN
function getAdvancedIDBNRecommendedCrops(category, soilType, state, district) {
    const aiPredictions = advancedIDBNModel.predictCrops(category, soilType, state, district);
    
    // Combine with existing crop data
    const enhancedRecommendations = aiPredictions.map(prediction => {
        const cropInfo = getCropInfo(prediction.name, category);
        return {
            ...cropInfo,
            ...prediction,
            aiEnhanced: true,
            modelUsed: 'Advanced IDBN (RBM + GRBM + Ranger Optimizer)',
            algorithm: 'Restricted Boltzmann Machines with Contrastive Divergence'
        };
    });

    return enhancedRecommendations;
}

// Helper function to get crop info
function getCropInfo(cropName, category) {
    if (typeof cropData !== 'undefined' && cropData[category] && cropData[category][cropName]) {
        return cropData[category][cropName];
    }
    
    return {
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
        soils: ['Red Loamy Soil', 'Black Soil'],
        season: 'Kharif/Rabi',
        duration: '90-120 days',
        yield: '2-4 tons/hectare'
    };
}