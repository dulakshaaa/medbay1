const pdfParse = require('pdf-parse');
const Conversation = require('../models/Conversation');

exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const data = await pdfParse(req.file.buffer);
    
    // Update the latest conversation with PDF text
    let conversation = await Conversation.findOne().sort({ createdAt: -1 });
    if (!conversation) {
      conversation = new Conversation();
    }
    
    conversation.pdfText = data.text;
    await conversation.save();

    res.json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing PDF' });
  }
};