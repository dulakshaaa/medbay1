const axios = require('axios');

const API_KEY = "AIzaSyBHuBs8xQsQkRYZYKPktD0IZinc1VeZqk8"; // Replace with your valid key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

async function testApi() {
  try {
    const response = await axios.post(
      API_URL,
      {
        contents: [{
          parts: [{ text: "What is the capital of Japan?" }]
        }],
        safetySettings: [{
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }],
        generationConfig: {
          maxOutputTokens: 200
        }
      },
      { 
        headers: { "Content-Type": "application/json" },
        timeout: 10000
      }
    );

    console.log("✅ Success! Response:");
    console.log(response.data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    if (error.response?.data?.error) {
      console.log("Full error details:", error.response.data.error);
    }
  }
}

testApi();