import { GoogleGenAI, Modality } from "@google/genai";
import fs from "fs";
import path from "path";

export const generateImage = async (prompt) => {
  try {
    const ai = new GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        
        // Create a unique filename
        const filename = `image_${Date.now()}.png`;
        const tempPath = path.join(process.cwd(), "public", "temp", filename);
        
        // Ensure temp directory exists
        const tempDir = path.join(process.cwd(), "public", "temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Save the file
        fs.writeFileSync(tempPath, buffer);
        
        return {
          base64: imageData,
          filePath: tempPath
        };
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    throw error;
  }
};
