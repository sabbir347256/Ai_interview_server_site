
// import "dotenv/config";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const models = [
//   "gemini-3.5-flash-lite",
//   "gemini-3.1-flash-lite",
//   "gemini-3.5-flash",
// ];

// const testModels = async () => {
//   for (const model of models) {
//     console.log(`\nTesting: ${model}`);

//     try {
//       const response = await ai.models.generateContent({
//         model,
//         contents: "Reply with exactly: CONNECTION_OK",
//       });

//       console.log("SUCCESS:", response.text);
//     } catch (error) {
//       console.log("FAILED:", error.status);
//       console.log("MESSAGE:", error.message);
//     }
//   }
// };

// testModels();
