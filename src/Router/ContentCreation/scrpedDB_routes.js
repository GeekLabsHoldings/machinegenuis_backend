const express = require('express')
const scraped_router = express.Router()
const msg = "This module to handle the request and response of scraped DB"

const scrapedDBControllers = require('../../Controller/ContentCreation/Scraped DB Controller/scrapedDB_controller')


scraped_router.post('/scrapedDB' , scrapedDBControllers.get_scraped_fromDB);
scraped_router.delete('/Delete-scrapedDB' , scrapedDBControllers.delete_scraped_fromDB);
export default scraped_router
