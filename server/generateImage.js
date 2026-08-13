import { init } from "@heyputer/puter.js/src/init.cjs";
import fs from "fs";
import path from "path";

const puter = init(process.env.PUTER_AUTH_TOKEN);

export const generateImage = async (prompt) => {
  try {
    const response = await puter.ai.txt2img(prompt, {
      model: process.env.PUTER_IMAGE_MODEL || "openai/gpt-image-1-mini",
    });

    const src = response.src || (typeof response === "string" ? response : null);
    if (!src) {
      throw new Error("No image generated");
    }

    let imageData;
    if (src.startsWith("data:")) {
      const base64 = src.split(",")[1];
      imageData = base64;
    } else {
      const res = await fetch(src);
      if (!res.ok) {
        throw new Error(`Failed to download generated image (status ${res.status})`);
      }
      imageData = Buffer.from(await res.arrayBuffer()).toString("base64");
    }

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
  } catch (error) {
    throw error;
  }
};