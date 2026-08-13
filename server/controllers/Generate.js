import { generateImage } from "../generateImage.js";
import { createError } from "../error.js";
import fs from "fs";

const SAFETY_PATTERNS = [
    /reject/i,
    /safety system/i,
    /content.polic/i,
    /moderat/i,
    /not allowed/i,
    /violat/i,
    /policy/i,
    /blocked/i,
    /refus/i,
    /harmful/i,
    /inappropriate/i
];

const FALLBACK_SUGGESTIONS = [
    "A cute orange cat sitting on a sunny windowsill",
    "A snowy mountain landscape at sunset",
    "A cozy coffee shop on a rainy street",
    "A friendly robot reading a book in a library",
    "A colorful coral reef with tropical fish"
];

const SUGGESTIONS = {
    people: [
        "A futuristic city skyline at night",
        "A magical forest with glowing mushrooms",
        "A serene lake reflecting golden mountains",
        "An astronaut floating above planet Earth",
        "A cozy cabin in a snowy pine forest"
    ],
    violence: [
        "A peaceful garden full of colorful flowers",
        "A baby panda playing in bamboo",
        "A sunrise over the ocean waves",
        "A hot air balloon floating over green hills",
        "A stack of books with a steaming mug of tea"
    ],
    explicit: [
        "A dreamy pastel sunset over the sea",
        "A whimsical hot air balloon festival",
        "A tranquil zen garden with a koi pond",
        "A bowl of fresh fruit on a wooden table",
        "A lighthouse on a rocky cliff at dawn"
    ],
    default: FALLBACK_SUGGESTIONS
};

const getSuggestionCategory = (message) => {
    const text = (message || "").toLowerCase();
    if (/person|people|celebrity|face|politician|public figure|famous|named/i.test(text)) {
        return "people";
    }
    if (/violent|violence|weapon|gun|gore|blood|fight|kill|harm/i.test(text)) {
        return "violence";
    }
    if (/sex|nudit|naked|explicit|erotic|intimate|porn/i.test(text)) {
        return "explicit";
    }
    return "default";
};

export const generateAIImage = async (req, res, next) => {
    try {
        const { data } = req.body;
        const result = await generateImage(data.prompt);

        return res.status(200).json({
            success: true,
            photo: result.base64,
            filePath: result.filePath
        });
    } catch (err) {
        const message = err.message || "Failed to generate image";
        const isSafety = SAFETY_PATTERNS.some((pattern) => pattern.test(message));

        if (isSafety) {
            const category = getSuggestionCategory(message);
            const friendly = {
                title: "This prompt couldn't be created",
                reason:
                    "Our safety system flagged this prompt. To keep everyone safe, we can't generate images that include real people's likeness, violent, explicit, or harmful content.",
                suggestions: SUGGESTIONS[category] || SUGGESTIONS.default,
                raw: message
            };
            return next(createError(400, "Please try a different prompt.", friendly));
        }

        return next(createError(500, message));
    }
};