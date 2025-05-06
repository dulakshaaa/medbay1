// utils/gemini.js - Updated with proper error handling
const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

const generateResponse = async (message, pdfText) => {
  try {
    // Verify API key is set
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('API key not configured');
    }

    const prompt = pdfText 
      ? `Document Context:\n${pdfText}\n\nQuestion: ${message}\nAnswer:` 
      : message;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        safetySettings: [{
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }],
        generationConfig: {
          maxOutputTokens: 2000
        }
      },
      {
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
           "I couldn't generate a response. Please try again.";
    
  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      config: error.config?.url,
      data: error.response?.data
    });
    
    // Specific error messages for different cases
    if (error.response?.status === 404) {
      return "The AI model is currently unavailable. Please try again later.";
    }
    if (error.code === 'ECONNABORTED') {
      return "The request timed out. Please try again.";
    }
    return "I'm experiencing technical difficulties. Please try again later.";
  }
};

module.exports = { generateResponse };