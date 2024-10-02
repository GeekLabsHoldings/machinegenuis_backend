import get_all_content from '../../Controller/VideoEditing/getContent';

const express = require('express')
const Video_editing_router = express.Router();

const controllerGetImgs = require('../../Controller/VideoEditing/fetchImages')
// const controllerSplitAndGenerate = require('../../Controller/VideoEditing/splitAndConvert')
// const controllerRegenrateAudio = require('../../Controller/VideoEditing/regenrateAudio')
const controllerRenderVideo = require('../../Controller/VideoEditing/renderVideo')

const controllerSplitAndGenerate = require('../../Service/VideoEditingModule/splitContent')
const controllerRegenrateAudio = require('../../Service/VideoEditingModule/splitContent')
const controllerReplaceWords = require('../../Controller/VideoEditing/addWord')
const controllerGetContent = require('../../Controller/VideoEditing/getContent')

Video_editing_router.get('/get-all-content', get_all_content);
Video_editing_router.post('/render-video', controllerRenderVideo.renderVideo);
Video_editing_router.post('/get-img', controllerGetImgs.getImg);
Video_editing_router.post('/split-content', controllerSplitAndGenerate.splitAndConvert);
Video_editing_router.post('/test-audio', controllerSplitAndGenerate.testAudio);
Video_editing_router.post('/regenrate-audio', controllerRegenrateAudio.regenrateAudio);
Video_editing_router.post('/replace-words', controllerReplaceWords.addWordToReplace);
Video_editing_router.post('/find-replace', controllerReplaceWords.findToReplace);

export default Video_editing_router
