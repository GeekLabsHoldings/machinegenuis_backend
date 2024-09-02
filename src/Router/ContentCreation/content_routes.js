const express = require('express')
const content_router = express.Router()
const msg = "This module to handle the request and response of content"
const contentControllers = require('../../Controller/ContentCreation/Content Controller/content_controller')
const middleware = require('../../middleware/ContentCreatorVerification')


content_router.get('/content', middleware.verifyToken ,contentControllers.get_all_content);

content_router.post('/content', middleware.verifyToken ,contentControllers.add_new_content);

content_router.patch('/content/:id', contentControllers.update_content);

content_router.delete('/content/:id', contentControllers.delete_content);

content_router.delete('/content', contentControllers.delete_all_content);

export default content_router
