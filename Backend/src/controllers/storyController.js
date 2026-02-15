const mongoose = require('mongoose');
const Story = require('../models/Story');

// @desc    Get personalized story for a scheme
// @route   GET /api/stories/scheme/:schemeId/personalized
const getPersonalizedStory = async (req, res) => {
  try {
    const { schemeId } = req.params;
    
    console.log('========== STORY DEBUG ==========');
    console.log('1. Looking for schemeId:', schemeId);
    console.log('2. SchemeId type:', typeof schemeId);
    
    // Find all stories
    const allStories = await Story.find({});
    console.log('3. Total stories in DB:', allStories.length);
    
    if (allStories.length > 0) {
      console.log('4. First story schemeId:', allStories[0].schemeId);
      console.log('5. First story schemeId type:', typeof allStories[0].schemeId);
    }
    
    // 🔥 FIX: Convert string to ObjectId for the query
    const stories = await Story.find({ 
      schemeId: new mongoose.Types.ObjectId(schemeId) // THIS IS THE FIX
    });
    
    console.log('6. Stories found for this scheme:', stories.length);
    console.log('================================');
    
    if (!stories || stories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No stories found for this scheme',
        debug: {
          searchedId: schemeId,
          totalStories: allStories.length,
          firstStoryId: allStories.length > 0 ? allStories[0].schemeId : 'none'
        }
      });
    }

    // Increment used count
    const selectedStory = stories[0];
    selectedStory.usedCount += 1;
    await selectedStory.save();

    res.json({
      success: true,
      data: selectedStory
    });

  } catch (error) {
    console.error('Story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all stories for a scheme
// @route   GET /api/stories/scheme/:schemeId
const getSchemeStories = async (req, res) => {
  try {
    const { schemeId } = req.params;
    
    const stories = await Story.find({ 
      schemeId: new mongoose.Types.ObjectId(schemeId) 
    }).sort('-likes');
    
    res.json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create a new story
// @route   POST /api/stories
const createStory = async (req, res) => {
  try {
    const story = await Story.create(req.body);
    res.status(201).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Like a story
// @route   PUT /api/stories/:storyId/like
const likeStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    story.likes += 1;
    await story.save();
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Export ALL functions
module.exports = {
  getPersonalizedStory,
  getSchemeStories,
  createStory,
  likeStory
};