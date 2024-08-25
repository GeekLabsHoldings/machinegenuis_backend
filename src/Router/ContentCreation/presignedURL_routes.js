const express = require('express')
const getPresigned_router = express.Router()
const msg = "This module to handle the request and response of get images"
const presignedControllers = require('../../Controller/ContentCreation/PreSigned URL Controller/preSigned_controller')


getPresigned_router.get('/get-presignedURL', presignedControllers.getPreSignedURL);


export default getPresigned_router
