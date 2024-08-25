const express = require('express')
const content_creation_router = express.Router();

import content_router from "./content_routes"
import getImgs_router from "./getImages_routes"
import g_routes from "./generate_routes"
import scraped_router from "./scrpedDB_routes"
import getPresigned_router from "./presignedURL_routes"

content_creation_router.use('/', content_router)
content_creation_router.use('/', getImgs_router)
content_creation_router.use('/', g_routes)
content_creation_router.use('/', scraped_router)
content_creation_router.use('/', getPresigned_router)

export default content_creation_router