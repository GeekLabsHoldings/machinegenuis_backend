const express = require('express')
const g_routes = express.Router()
const msg = "This module to handle the request and response of AI generation model"
const { verifyToken } = require("../../middleware/ContentCreatorVerification");


// Require modules
const generateContent = require('../../Controller/ContentCreation/OpenAi Controllers/generateContent_controller')
const finalizeScriptContent = require('../../Controller/ContentCreation/OpenAi Controllers/scriptContent_controllers')
const finalizeArticleContent = require('../../Controller/ContentCreation/OpenAi Controllers/articleContent_controllers')
const generateTitles = require('../../Controller/ContentCreation/OpenAi Controllers/generateTitles_controller')
const transcriptAudio = require('../../Controller/ContentCreation/AWS_Transcription/convertController')
const finalRecap = require('../../Controller/ContentCreation/OpenAi Controllers/recapTranscript_controller')
g_routes.post('/generate-content', generateContent.generateContent);

//////////
g_routes.post('/script/finalize-content', finalizeScriptContent.generateContent);
g_routes.post('/article/finalize-content', finalizeArticleContent.generateContent);
g_routes.post('/script/recap-content', finalRecap.generateRecapContent);
//////////
g_routes.post('/generate-titles', generateTitles.generateContentTitles);
//////////
g_routes.post('/generate-thumbnails', generateTitles.generateContentThumbnails);
//////////
g_routes.post('/transcript-audio' , transcriptAudio.convertor);

//////////
g_routes.post('/format-to-html', finalizeScriptContent.convertContentTo_HTML);
g_routes.post('/expand-script', finalizeScriptContent.expandScript);
export default g_routes;
export { msg }
