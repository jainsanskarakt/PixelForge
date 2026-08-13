import fs from "fs";
import path from "path";

const PUTER_API_ORIGIN = process.env.PUTER_API_ORIGIN || "https://api.puter.com";

export const generateImage = async (prompt) => {
  try {
    const authToken = process.env.PUTER_AUTH_TOKEN;
    if (!authToken) {
      throw new Error("PUTER_AUTH_TOKEN is not set");
    }

    const response = await fetch(`${PUTER_API_ORIGIN}/drivers/call`, {
      method: "POST",
      headers: { "Content-Type": "text/plain;actually=json" },
      body: JSON.stringify({
        interface: "puter-image-generation",
        driver: "ai-image",
        method: "generate",
        args: {
          prompt,
          model: process.env.PUTER_IMAGE_MODEL || "openai/gpt-image-1-mini",
        },
        auth_token: authToken,
      }),
    });

    const data = await response.json();

    if (!response.ok || data?.success === false) {
      const detail =
        data?.error?.message ||
        data?.error?.reason ||
        data?.error ||
        (typeof data === "object" ? JSON.stringify(data) : data);
      throw new Error(detail || `Failed to generate image (status ${response.status})`);
    }

    const src = data?.result;
    if (!src) {
      throw new Error("No image generated");
    }

    let imageData;
    if (typeof src === "string" && src.startsWith("data:")) {
      imageData = src.split(",")[1];
    } else if (typeof src === "string") {
      const res = await fetch(src);
      if (!res.ok) {
        throw new Error(`Failed to download generated image (status ${res.status})`);
      }
      imageData = Buffer.from(await res.arrayBuffer()).toString("base64");
    } else {
      throw new Error("Unexpected image response");
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
