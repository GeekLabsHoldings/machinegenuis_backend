const express = require('express')
const getImgs_router = express.Router()
const msg = "This module to handle the request and response of get images"
const getImagesControllers = require('../../Controller/ContentCreation/Get Images/getImages_controller')


getImgs_router.post('/get-images', getImagesControllers.getImg);


export default getImgs_router
