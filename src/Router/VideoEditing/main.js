const express = require('express')
const Video_editing_router = express.Router();

const controllerGetImgs = require('../../Controller/VideoEditing/fetchImages')
const controllerSplitAndGenerate = require('../../Controller/VideoEditing/splitAndConvert')
const controllerRegenrateAudio = require('../../Controller/VideoEditing/regenrateAudio')
const controllerRenderVideo = require('../../Controller/VideoEditing/renderVideo')

Video_editing_router.post('/render-video', controllerRenderVideo.renderVideo);
Video_editing_router.post('/get-img', controllerGetImgs.getImg);
Video_editing_router.post('/split-content', controllerSplitAndGenerate.splitAndConvert);
Video_editing_router.post('/regenrate-audio', controllerRegenrateAudio.regenrateAudio); 

export default Video_editing_router
