const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

router.get('/scheme/:schemeId', storyController.getSchemeStories);
router.get('/scheme/:schemeId/personalized', storyController.getPersonalizedStory);
router.post('/', storyController.createStory);
router.put('/:storyId/like', storyController.likeStory);

module.exports = router;