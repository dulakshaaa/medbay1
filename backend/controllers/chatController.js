const Conversation = require('../models/Conversation');
const { generateResponse } = require('../utils/gemini');

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get or create conversation (we'll use a single conversation for simplicity)
    let conversation = await Conversation.findOne().sort({ createdAt: -1 });
    if (!conversation) {
      conversation = new Conversation();
    }

    // Add user message to conversation
    conversation.messages.push({
      sender: 'user',
      text: message
    });

    // Generate AI response
    const aiResponse = await generateResponse(message, conversation.pdfText);

    // Add AI response to conversation
    conversation.messages.push({
      sender: 'ai',
      text: aiResponse
    });

    await conversation.save();

    res.json({ response: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing your request' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const conversation = await Conversation.findOne().sort({ createdAt: -1 });
    res.json(conversation?.messages || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};