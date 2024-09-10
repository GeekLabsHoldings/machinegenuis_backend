const multer = require('multer');
const express = require('express')
const g_routes = express.Router()
const msg = "This module to handle the request and response of AI generation model"
const { verifyToken } = require("../../middleware/ContentCreatorVerification");

// using multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        // const fileType = file.mimetype.split('/')[0];    

        const fullName = "movie" + `.${ext}`;
        cb(null, fullName)

    }
})

const filefilter = (req, file, cb) => {
    const fileType = file.mimetype.split('/')[0];
    if (fileType === "video") {
        return cb(null, true)
    }
    else {
        return cb(("This is an acceptable file type"), false)
    }
}
const upload = multer({
    storage: storage,
    fileFilter: filefilter
})

// Require modules
const generateContent = require('../../Controller/ContentCreation/OpenAi Controllers/generateContent_controller')
const finalizeScriptContent = require('../../Controller/ContentCreation/OpenAi Controllers/scriptContent_controllers')
const finalizeArticleContent = require('../../Controller/ContentCreation/OpenAi Controllers/articleContent_controllers')
const generateTitles = require('../../Controller/ContentCreation/OpenAi Controllers/generateTitles_controller')
const transcriptAudio = require('../../Controller/ContentCreation/AWS_Transcription/convertController')
g_routes.post('/generate-content', generateContent.generateContent);

//////////
g_routes.post('/script/finalize-content', finalizeScriptContent.generateContent);
g_routes.post('/article/finalize-content', finalizeArticleContent.generateContent);
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
