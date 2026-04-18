// Detailed crop cultivation steps for different crops
const cropCultivationSteps = {
    'Rice': [
        {
            stepNumber: 1,
            title: 'Land Preparation',
            description: 'Prepare the field by plowing and leveling. Create bunds for water retention.',
            duration: '7-10 days',
            season: 'Before sowing'
        },
        {
            stepNumber: 2,
            title: 'Seed Selection & Treatment',
            description: 'Select high-quality seeds. Treat seeds with fungicide and soak for 24 hours.',
            duration: '2-3 days',
            season: 'Pre-sowing'
        },
        {
            stepNumber: 3,
            title: 'Nursery Preparation',
            description: 'Prepare nursery beds. Sow treated seeds in nursery for seedling development.',
            duration: '25-30 days',
            season: 'Nursery stage'
        },
        {
            stepNumber: 4,
            title: 'Transplanting',
            description: 'Transplant 25-30 day old seedlings to main field with proper spacing.',
            duration: '5-7 days',
            season: 'Transplanting'
        },
        {
            stepNumber: 5,
            title: 'Water Management',
            description: 'Maintain 2-5 cm water level throughout growing period.',
            duration: 'Continuous',
            season: 'Growing period'
        },
        {
            stepNumber: 6,
            title: 'Fertilizer Application',
            description: 'Apply NPK fertilizers in split doses as per soil test recommendations.',
            duration: '3-4 applications',
            season: 'Growing period'
        },
        {
            stepNumber: 7,
            title: 'Weed Control',
            description: 'Control weeds manually or using herbicides at proper timing.',
            duration: '2-3 times',
            season: 'Growing period'
        },
        {
            stepNumber: 8,
            title: 'Pest & Disease Management',
            description: 'Monitor and control pests like stem borer, leaf folder, and diseases.',
            duration: 'As needed',
            season: 'Growing period'
        },
        {
            stepNumber: 9,
            title: 'Harvesting',
            description: 'Harvest when 80% of grains turn golden yellow. Cut and dry properly.',
            duration: '7-10 days',
            season: 'Maturity'
        },
        {
            stepNumber: 10,
            title: 'Post-Harvest',
            description: 'Thresh, winnow, dry to 14% moisture and store in proper containers.',
            duration: '5-7 days',
            season: 'Post-harvest'
        }
    ],
    'Wheat': [
        {
            stepNumber: 1,
            title: 'Land Preparation',
            description: 'Deep plowing followed by 2-3 harrowings. Level the field properly.',
            duration: '7-10 days',
            season: 'Pre-sowing'
        },
        {
            stepNumber: 2,
            title: 'Seed Treatment',
            description: 'Treat seeds with fungicide and insecticide. Use quality certified seeds.',
            duration: '1 day',
            season: 'Pre-sowing'
        },
        {
            stepNumber: 3,
            title: 'Sowing',
            description: 'Sow seeds at proper depth (3-5 cm) with recommended spacing.',
            duration: '3-5 days',
            season: 'Sowing time'
        },
        {
            stepNumber: 4,
            title: 'Irrigation',
            description: 'Apply first irrigation 20-25 days after sowing, then as needed.',
            duration: '4-6 irrigations',
            season: 'Growing period'
        },
        {
            stepNumber: 5,
            title: 'Fertilizer Management',
            description: 'Apply nitrogen in split doses. Apply phosphorus and potash at sowing.',
            duration: '2-3 applications',
            season: 'Growing period'
        },
        {
            stepNumber: 6,
            title: 'Weed Control',
            description: 'Control weeds at 30-35 days after sowing using herbicides or manual weeding.',
            duration: '1-2 times',
            season: 'Growing period'
        },
        {
            stepNumber: 7,
            title: 'Disease Management',
            description: 'Monitor for rust, smut, and other diseases. Apply fungicides if needed.',
            duration: 'As needed',
            season: 'Growing period'
        },
        {
            stepNumber: 8,
            title: 'Harvesting',
            description: 'Harvest when grains are hard and moisture content is 20-25%.',
            duration: '5-7 days',
            season: 'Maturity'
        },
        {
            stepNumber: 9,
            title: 'Threshing & Storage',
            description: 'Thresh immediately after harvest. Dry to 12% moisture and store.',
            duration: '3-5 days',
            season: 'Post-harvest'
        }
    ],
    'Tomato': [
        {
            stepNumber: 1,
            title: 'Nursery Preparation',
            description: 'Prepare nursery beds with well-decomposed organic matter.',
            duration: '5-7 days',
            season: 'Pre-sowing'
        },
        {
            stepNumber: 2,
            title: 'Seed Sowing',
            description: 'Sow seeds in nursery beds. Maintain proper moisture and temperature.',
            duration: '25-30 days',
            season: 'Nursery stage'
        },
        {
            stepNumber: 3,
            title: 'Land Preparation',
            description: 'Prepare main field with deep plowing and organic matter incorporation.',
            duration: '7-10 days',
            season: 'Field preparation'
        },
        {
            stepNumber: 4,
            title: 'Transplanting',
            description: 'Transplant 4-5 week old seedlings with proper spacing (60x45 cm).',
            duration: '3-5 days',
            season: 'Transplanting'
        },
        {
            stepNumber: 5,
            title: 'Staking & Support',
            description: 'Provide support to plants using stakes or cages for proper growth.',
            duration: '2-3 days',
            season: 'Early growth'
        },
        {
            stepNumber: 6,
            title: 'Irrigation Management',
            description: 'Provide regular irrigation. Avoid water stress during flowering and fruiting.',
            duration: 'Regular',
            season: 'Growing period'
        },
        {
            stepNumber: 7,
            title: 'Fertilizer Application',
            description: 'Apply balanced fertilizers in split doses. Focus on potash during fruiting.',
            duration: '4-5 applications',
            season: 'Growing period'
        },
        {
            stepNumber: 8,
            title: 'Pruning & Training',
            description: 'Remove suckers and lower leaves. Train plants for better fruit development.',
            duration: 'Weekly',
            season: 'Growing period'
        },
        {
            stepNumber: 9,
            title: 'Pest & Disease Control',
            description: 'Monitor for whitefly, fruit borer, blight diseases. Apply appropriate control measures.',
            duration: 'As needed',
            season: 'Growing period'
        },
        {
            stepNumber: 10,
            title: 'Harvesting',
            description: 'Harvest fruits at proper maturity stage. Handle carefully to avoid damage.',
            duration: '60-90 days',
            season: 'Harvesting period'
        }
    ],
    'Maize': [
        {
            stepNumber: 1,
            title: 'Field Preparation',
            description: 'Deep plowing followed by harrowing. Prepare fine tilth for sowing.',
            duration: '5-7 days',
            season: 'Pre-sowing'
        },
        {
            stepNumber: 2,
            title: 'Seed Treatment',
            description: 'Treat seeds with fungicide and insecticide for protection against soil-borne diseases.',
            duration: '1 day',
            season: 'Pre-sowing'
        },
        {
            stepNumber: 3,
            title: 'Sowing',
            description: 'Sow seeds at 3-5 cm depth with 60x20 cm spacing between rows and plants.',
            duration: '2-3 days',
            season: 'Sowing'
        },
        {
            stepNumber: 4,
            title: 'Gap Filling',
            description: 'Fill gaps within 10 days of sowing to maintain proper plant population.',
            duration: '1-2 days',
            season: 'Early growth'
        },
        {
            stepNumber: 5,
            title: 'Fertilizer Application',
            description: 'Apply nitrogen in split doses. Apply full phosphorus and potash at sowing.',
            duration: '2-3 applications',
            season: 'Growing period'
        },
        {
            stepNumber: 6,
            title: 'Irrigation',
            description: 'Apply irrigation at critical stages - knee high, tasseling, and grain filling.',
            duration: '4-6 irrigations',
            season: 'Growing period'
        },
        {
            stepNumber: 7,
            title: 'Weed Management',
            description: 'Control weeds at 20-25 days after sowing using herbicides or manual weeding.',
            duration: '1-2 times',
            season: 'Growing period'
        },
        {
            stepNumber: 8,
            title: 'Pest Control',
            description: 'Monitor for stem borer, fall armyworm, and other pests. Apply control measures.',
            duration: 'As needed',
            season: 'Growing period'
        },
        {
            stepNumber: 9,
            title: 'Harvesting',
            description: 'Harvest when cobs are fully mature and grains have 20-25% moisture.',
            duration: '5-7 days',
            season: 'Maturity'
        },
        {
            stepNumber: 10,
            title: 'Drying & Storage',
            description: 'Dry cobs to 14% moisture content and store in proper containers.',
            duration: '7-10 days',
            season: 'Post-harvest'
        }
    ]
};

// Get cultivation steps for a specific crop
function getCropCultivationSteps(cropName) {
    return cropCultivationSteps[cropName] || cropCultivationSteps['Rice']; // Default to Rice if crop not found
}

// Calculate expected harvest date based on crop and start date
function calculateHarvestDate(cropName, startDate) {
    const cropDurations = {
        'Rice': 120, // days
        'Wheat': 120,
        'Maize': 90,
        'Tomato': 90,
        'Onion': 120,
        'Potato': 90,
        'Mango': 365, // Perennial
        'Banana': 365,
        'Chickpea': 90,
        'Groundnut': 120,
        'Sunflower': 90,
        'Rose': 365, // Perennial
        'Coffee': 365, // Perennial
        'Turmeric': 240
    };
    
    const duration = cropDurations[cropName] || 120;
    const harvestDate = new Date(startDate);
    harvestDate.setDate(harvestDate.getDate() + duration);
    return harvestDate;
}