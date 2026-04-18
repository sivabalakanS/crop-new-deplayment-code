// District-wise soil data for Tamil Nadu, Kerala, and Karnataka
const districtSoilData = {
    'Tamil Nadu': {
        'Chennai': ['Red Sandy Soil', 'Coastal Alluvial Soil'],
        'Coimbatore': ['Red Loamy Soil', 'Black Cotton Soil', 'Red Sandy Soil'],
        'Madurai': ['Red Loamy Soil', 'Black Soil', 'Red Sandy Soil'],
        'Tiruchirappalli': ['Black Cotton Soil', 'Red Loamy Soil', 'Alluvial Soil'],
        'Salem': ['Red Loamy Soil', 'Red Sandy Soil', 'Black Soil'],
        'Tirunelveli': ['Red Sandy Soil', 'Black Soil', 'Coastal Alluvial Soil'],
        'Erode': ['Red Loamy Soil', 'Black Cotton Soil', 'Red Sandy Soil'],
        'Vellore': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Thoothukudi': ['Red Sandy Soil', 'Coastal Alluvial Soil', 'Saline Soil'],
        'Dindigul': ['Red Loamy Soil', 'Black Soil', 'Red Sandy Soil'],
        'Thanjavur': ['Deltaic Alluvial Soil', 'Black Cotton Soil', 'Coastal Alluvial Soil'],
        'Ranipet': ['Red Loamy Soil', 'Red Sandy Soil'],
        'Sivaganga': ['Red Sandy Soil', 'Black Soil', 'Saline Soil'],
        'Karur': ['Red Loamy Soil', 'Black Cotton Soil'],
        'Ramanathapuram': ['Red Sandy Soil', 'Coastal Alluvial Soil', 'Saline Soil'],
        'Virudhunagar': ['Red Sandy Soil', 'Black Soil', 'Red Loamy Soil'],
        'Tiruppur': ['Red Loamy Soil', 'Black Cotton Soil', 'Red Sandy Soil'],
        'Cuddalore': ['Coastal Alluvial Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Kanchipuram': ['Red Sandy Soil', 'Red Loamy Soil', 'Coastal Alluvial Soil'],
        'Nagapattinam': ['Deltaic Alluvial Soil', 'Coastal Alluvial Soil', 'Saline Soil'],
        'Viluppuram': ['Red Sandy Soil', 'Red Loamy Soil', 'Laterite Soil'],
        'Tiruvannamalai': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Namakkal': ['Red Loamy Soil', 'Black Cotton Soil', 'Red Sandy Soil'],
        'Dharmapuri': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Krishnagiri': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Pudukkottai': ['Red Sandy Soil', 'Black Soil', 'Coastal Alluvial Soil'],
        'Ariyalur': ['Black Cotton Soil', 'Red Loamy Soil', 'Alluvial Soil'],
        'Perambalur': ['Red Loamy Soil', 'Black Cotton Soil', 'Red Sandy Soil'],
        'Nilgiris': ['Forest Loam Soil', 'Red Loamy Soil', 'Laterite Soil'],
        'Theni': ['Red Loamy Soil', 'Black Soil', 'Forest Loam Soil'],
        'Tenkasi': ['Red Sandy Soil', 'Laterite Soil', 'Black Soil'],
        'Tirupathur': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Chengalpattu': ['Red Sandy Soil', 'Coastal Alluvial Soil', 'Red Loamy Soil'],
        'Kallakurichi': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Tiruvallur': ['Red Sandy Soil', 'Coastal Alluvial Soil', 'Red Loamy Soil'],
        'Tirupattur': ['Red Loamy Soil', 'Red Sandy Soil'],
        'Mayiladuthurai': ['Deltaic Alluvial Soil', 'Coastal Alluvial Soil'],
        'Kanyakumari': ['Laterite Soil', 'Coastal Alluvial Soil', 'Red Sandy Soil']
    },
    'Kerala': {
        'Thiruvananthapuram': ['Laterite Soil', 'Coastal Alluvial Soil', 'Red Loamy Soil'],
        'Kollam': ['Laterite Soil', 'Coastal Alluvial Soil', 'Kari Soil'],
        'Pathanamthitta': ['Laterite Soil', 'Forest Loam Soil', 'Red Loamy Soil'],
        'Alappuzha': ['Kuttanad Clay Soil', 'Coastal Alluvial Soil', 'Kari Soil'],
        'Kottayam': ['Laterite Soil', 'Kuttanad Clay Soil', 'Forest Loam Soil'],
        'Idukki': ['Forest Loam Soil', 'Mountain Soil', 'Laterite Soil'],
        'Ernakulam': ['Laterite Soil', 'Coastal Alluvial Soil', 'Kari Soil'],
        'Thrissur': ['Laterite Soil', 'Coastal Alluvial Soil', 'Red Loamy Soil'],
        'Palakkad': ['Laterite Soil', 'Red Loamy Soil', 'Black Cotton Soil'],
        'Malappuram': ['Laterite Soil', 'Coastal Alluvial Soil', 'Forest Loam Soil'],
        'Kozhikode': ['Laterite Soil', 'Coastal Alluvial Soil', 'Red Loamy Soil'],
        'Wayanad': ['Forest Loam Soil', 'Mountain Soil', 'Laterite Soil'],
        'Kannur': ['Laterite Soil', 'Coastal Alluvial Soil', 'Red Loamy Soil'],
        'Kasaragod': ['Laterite Soil', 'Coastal Alluvial Soil', 'Red Loamy Soil']
    },
    'Karnataka': {
        'Bengaluru Urban': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Bengaluru Rural': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Mysuru': ['Red Loamy Soil', 'Red Sandy Soil', 'Black Soil'],
        'Tumakuru': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Mandya': ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],
        'Hassan': ['Red Loamy Soil', 'Laterite Soil', 'Black Soil'],
        'Chikkamagaluru': ['Red Loamy Soil', 'Laterite Soil', 'Forest Loam Soil'],
        'Kodagu': ['Laterite Soil', 'Forest Loam Soil', 'Red Loamy Soil'],
        'Dakshina Kannada': ['Laterite Soil', 'Coastal Alluvial Soil', 'Red Loamy Soil'],
        'Udupi': ['Laterite Soil', 'Coastal Alluvial Soil', 'Red Loamy Soil'],
        'Uttara Kannada': ['Laterite Soil', 'Coastal Alluvial Soil', 'Forest Loam Soil'],
        'Shivamogga': ['Red Loamy Soil', 'Laterite Soil', 'Forest Loam Soil'],
        'Chitradurga': ['Red Sandy Soil', 'Red Loamy Soil', 'Black Soil'],
        'Davanagere': ['Red Loamy Soil', 'Black Cotton Soil', 'Red Sandy Soil'],
        'Haveri': ['Black Cotton Soil', 'Red Loamy Soil', 'Red Sandy Soil'],
        'Dharwad': ['Black Cotton Soil', 'Red Loamy Soil', 'Mixed Red Black Soil'],
        'Gadag': ['Black Cotton Soil', 'Red Loamy Soil', 'Red Sandy Soil'],
        'Belagavi': ['Black Cotton Soil', 'Red Loamy Soil', 'Laterite Soil'],
        'Bagalkot': ['Black Cotton Soil', 'Red Loamy Soil', 'Mixed Red Black Soil'],
        'Vijayapura': ['Black Cotton Soil', 'Red Loamy Soil', 'Mixed Red Black Soil'],
        'Kalaburagi': ['Black Cotton Soil', 'Red Loamy Soil', 'Mixed Red Black Soil'],
        'Yadgir': ['Black Cotton Soil', 'Red Loamy Soil', 'Red Sandy Soil'],
        'Bidar': ['Black Cotton Soil', 'Red Loamy Soil', 'Mixed Red Black Soil'],
        'Raichur': ['Black Cotton Soil', 'Red Loamy Soil', 'Alluvial Soil'],
        'Ballari': ['Red Sandy Soil', 'Black Cotton Soil', 'Red Loamy Soil'],
        'Koppal': ['Black Cotton Soil', 'Red Loamy Soil', 'Red Sandy Soil'],
        'Kolar': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Chikkaballapura': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Ramanagara': ['Red Loamy Soil', 'Red Sandy Soil', 'Laterite Soil'],
        'Chamarajanagar': ['Red Loamy Soil', 'Black Soil', 'Forest Loam Soil'],
        'Vijayanagara': ['Red Sandy Soil', 'Black Cotton Soil', 'Red Loamy Soil']
    }
};

// Soil images with specific, accurate URLs for each soil type
const soilImages = {
    'Red Loamy Soil': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Soil_Auroville.JPG',
    'Red Sandy Soil': 'https://gardenvista.in/wp-content/uploads/2024/08/Red-Soil-Dealers-Thane.jpeg',
    'Black Cotton Soil': 'https://5.imimg.com/data5/SELLER/Default/2024/5/422107457/FM/KD/MQ/9944729/black-cotton-soil.jpg',
    'Black Soil': 'https://5.imimg.com/data5/ANDROID/Default/2021/3/YR/CH/BS/53037511/product-jpeg.jpg',
    'Red Soil': 'https://m.media-amazon.com/images/I/51yBu-rUDmL._AC_UF1000,1000_QL80_.jpg',
    'Alluvial Soil': 'https://iaspoint.com/wp-content/uploads/2023/08/alluvial-soil.png',
    'Deltaic Alluvial Soil': 'https://cmds-test.vedantu.com/prod/question-sets/92d1b796-1416-4209-8361-42289841df6f3986576519591075267.png',
    'Coastal Alluvial Soil': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg-s7wuS7uMMhPgp-VHvUKP-0GUOht6ShPHg&s',
    'Laterite Soil': 'https://indianetzone.wordpress.com/wp-content/uploads/2024/12/laterite-soil-texture-red-gravel-floor-background-45027634.jpg',
    'Saline Soil': 'https://naes.agnt.unr.edu/PMS/Images/pub-images/6972-Block.jpg',
    'Forest Loam Soil': 'https://images.stockcake.com/public/a/a/d/aad14930-32a5-4d61-a62b-32d8bc274bdd/rich-forest-soil-stockcake.jpg',
    'Kuttanad Clay Soil': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2SgEh6M_x7tJUZhZ-X2Cynvifx2zlmwpOGA&s',
    'Kari Soil': 'https://www.keralasoils.gov.in/sites/default/files/styles/media_library/public/2022-01/coastalalluvium_manathala.jpg?itok=KjgqDka4',
    'Mountain Soil': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoz8GQ72MtMkKT6T850ToaKtjrsUu9wu-Cyg&s',
    'Mixed Red Black Soil': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJApuxsuOcM6f1swn6xnkLWfQu7m70McNRvQ&s'
};

// Get soils for specific district
function getSoilsForDistrict(state, district) {
    if (districtSoilData[state] && districtSoilData[state][district]) {
        return districtSoilData[state][district];
    }
    // Fallback to state-level default
    return ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'];
}

// Get soil image with fallback
function getSoilImage(soilType) {
    return soilImages[soilType] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop';
}

// Get recommended soil for crop category
function getRecommendedSoil(cropCategory, availableSoils) {
    const recommendations = {
        'Cereals': ['Alluvial Soil', 'Deltaic Alluvial Soil', 'Black Cotton Soil', 'Red Loamy Soil'],
        'Vegetables': ['Red Loamy Soil', 'Alluvial Soil', 'Black Soil'],
        'Fruits': ['Red Loamy Soil', 'Laterite Soil', 'Forest Loam Soil'],
        'Pulses': ['Black Cotton Soil', 'Red Loamy Soil', 'Black Soil'],
        'Oil Seeds': ['Black Cotton Soil', 'Red Loamy Soil', 'Alluvial Soil'],
        'Flowers': ['Red Loamy Soil', 'Laterite Soil', 'Black Soil'],
        'Plantation Crops': ['Laterite Soil', 'Forest Loam Soil', 'Red Loamy Soil'],
        'Spices': ['Laterite Soil', 'Forest Loam Soil', 'Red Loamy Soil']
    };
    
    const preferred = recommendations[cropCategory] || [];
    
    // Find which available soils are recommended
    for (let soil of preferred) {
        if (availableSoils.includes(soil)) {
            return soil;
        }
    }
    
    return availableSoils[0]; // Return first available if no match
}
