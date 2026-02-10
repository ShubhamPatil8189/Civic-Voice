const Conversation = require("../models/Conversation");

exports.saveConversation = async (req, res) => {
  try {
    const { sessionId, question, answer } = req.body;

    const data = await Conversation.create({
      sessionId,
      question,
      answer,
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
