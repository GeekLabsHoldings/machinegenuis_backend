import get_all_content from '../../Controller/VideoEditing/getContent';
import { gitDetailsContent } from '../../Controller/VideoEditing/getVideos';

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
const controllerEnhanceImage = require('../../Controller/VideoEditing/regenerateImg')
const controllerProcessOnVideo = require('../../Controller/VideoEditing/trimmingVids')

Video_editing_router.get('/get-all-content', get_all_content);
Video_editing_router.post('/render-video', controllerRenderVideo.renderVideo);
Video_editing_router.post('/get-img', controllerGetImgs.getImg);
Video_editing_router.post('/get-img-new', controllerGetImgs.getImgNew);
Video_editing_router.post('/split-content', controllerSplitAndGenerate.splitAndConvert);
Video_editing_router.post('/test-audio', controllerSplitAndGenerate.testAudio);
Video_editing_router.post('/regenrate-audio', controllerRegenrateAudio.regenrateAudio);
Video_editing_router.post('/replace-words', controllerReplaceWords.addWordToReplace);
Video_editing_router.post('/find-replace', controllerReplaceWords.findToReplace);
Video_editing_router.post('/enhance-img', controllerEnhanceImage.editImage);
Video_editing_router.post('/process-video', controllerProcessOnVideo.processVideo);
Video_editing_router.post('/get-content-youtube',gitDetailsContent );



////////////

export default Video_editing_router
