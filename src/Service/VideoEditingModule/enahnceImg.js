const axios = require('axios');

const enhanceImg = async (input) => {
    console.log("input---->"  +  input);
    
    const API_KEY = process.env.CLAID_API_KEY;

    try {
        const response = await axios.post(
            'https://api.claid.ai/v1-beta1/image/edit',
            {
                input,
                "operations": {
                    "resizing": {
                        "width": 800,
                        "height": 800,
                        "fit": { 
                            "crop": "center" 
                        }
                    },
                    "adjustments": {
                        "hdr": 60,
                        "sharpness": 40
                    }
                },
                "output": {
                    "format": {
                    "type": "jpeg",
                    "quality": 90
                    }
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.data.output.tmp_url;
    } catch (error) {
        console.error('Error enhancing image:', error.message);
        throw new Error('Image enhancement failed');
    }
};


module.exports = {
    enhanceImg
};