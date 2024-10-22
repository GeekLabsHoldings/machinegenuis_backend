import * as fetchVideos from '../../Controller/VideoEditing/fetchVideos';
import get_all_content from '../../Controller/VideoEditing/getContent';
import { gitDetailsContent,  } from '../../Controller/VideoEditing/splitAndConvert';

const express = require('express')
const Video_editing_router = express.Router();

const controllerGetImgs = require('../../Controller/VideoEditing/fetchImages')

const controllerSplitAndGenerate = require('../../Controller/VideoEditing/splitAndConvert')

const controllerRegenrateAudio = require('../../Controller/VideoEditing/regenrateAudio')

const STPRenderVideo = require('../../Controller/VideoEditing/renderVideoSTP')
const MythRenderVideo = require('../../Controller/VideoEditing/renderVideoMyth')

const controllerReplaceWords = require('../../Controller/VideoEditing/addWord')
const controllerGetContent = require('../../Controller/VideoEditing/getContent')
const controllerEnhanceImage = require('../../Controller/VideoEditing/regenerateImg')
const controllerProcessOnVideo = require('../../Controller/VideoEditing/trimmingVids')

Video_editing_router.get('/get-all-content', get_all_content);
Video_editing_router.post('/render-stp-video', STPRenderVideo.renderVideo);
Video_editing_router.post('/render-myth-video', MythRenderVideo.renderVideo);
Video_editing_router.post('/get-img', controllerGetImgs.getImg);
Video_editing_router.post('/get-img-new', controllerGetImgs.getImgNew);
Video_editing_router.post('/split-content-stp', controllerSplitAndGenerate.splitAndConvertSTP);
Video_editing_router.post('/test-audio', controllerRegenrateAudio.testAudio);
Video_editing_router.post('/regenrate-audio', controllerRegenrateAudio.regenrateAudio);
Video_editing_router.post('/replace-words', controllerReplaceWords.addWordToReplace);
Video_editing_router.post('/find-replace', controllerReplaceWords.findToReplace);
Video_editing_router.post('/enhance-img', controllerEnhanceImage.editImage);
Video_editing_router.post('/process-video', controllerProcessOnVideo.processVideo);
Video_editing_router.post('/split-content-inv',controllerSplitAndGenerate.splitAndConvertINV);
Video_editing_router.post('/search-youtube',fetchVideos.searchVideosOnYouTube);




////////////

export default Video_editing_router
