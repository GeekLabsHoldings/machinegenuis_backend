const axios = require('axios');
const serviceEnhanceImg = require('../../Service/VideoEditingModule/enahnceImg');

const editImage = async (req, res) => {    
    try {
        const { input } = req.body;
        const result = await serviceEnhanceImg.enhanceImg(input);
        res.status(200).json({imgurl : result});
    } catch (error) {
    if (error.response) {
        console.error('API Error Response:', error.response.data);
        console.error('Status Code:', error.response.status);
    } else {
        console.error('Error Message:', error.message);
    }
    res.status(500).send('Error occurred while processing the request');
}
};

module.exports = { editImage };