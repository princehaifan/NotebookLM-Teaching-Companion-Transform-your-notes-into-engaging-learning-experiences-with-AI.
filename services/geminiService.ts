import { GoogleGenAI, Type } from "@google/genai";
import {
  TimelineData,
  CrosswordData,
  StorybookData,
  FlashcardsData,
  LanguageTutorData,
  StoryPage,
  Flashcard,
  SummaryData,
} from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const parseJsonResponse = <T,>(jsonString: string, fallback: T): T => {
    try {
        // The API might return the JSON wrapped in markdown ```json ... ```
        const sanitizedString = jsonString.replace(/^```json\s*|```\s*$/g, '').trim();
        return JSON.parse(sanitizedString) as T;
    } catch (e) {
        console.error("Failed to parse JSON:", e);
        console.error("Original string:", jsonString);
        throw new Error("The AI returned an invalid JSON format. Please try again.");
    }
};

export const generateTimeline = async (text: string): Promise<TimelineData> => {
  const response = await ai.models.generateContent({
    model: textModel,
    contents: `Based on the following text, create a historical timeline. For each event, provide a date, the event name, and a brief description. Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "The date of the event (e.g., '1945', 'c. 3000 BC')." },
            event: { type: Type.STRING, description: "A concise name for the event." },
            description: { type: Type.STRING, description: "A one-sentence description of the event." },
          },
          required: ["date", "event", "description"],
        },
      },
    },
  });
  return parseJsonResponse<TimelineData>(response.text, []);
};

export const generateCrosswordClues = async (text: string): Promise<CrosswordData> => {
  const response = await ai.models.generateContent({
    model: textModel,
    contents: `From the provided lesson text, generate 10-15 word-clue pairs for a crossword puzzle. Follow this exact format:
WORD Clue for the word
ANOTHERWORD Another clue

Here is an example:
DOG Man's best friend
CAT Likes to chase mice

Lesson text: "${text}"`,
  });
  return response.text.trim();
};

export const generateStorybook = async (text: string): Promise<StorybookData> => {
  const textResponse = await ai.models.generateContent({
    model: textModel,
    contents: `Create a 5-page illustrated storybook for a 2nd-grade kid based on this study guide. For each page, provide the page number, the story text, and a simple, descriptive prompt for an illustration that captures the essence of that page's text.
    Study Guide: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pageNumber: { type: Type.INTEGER },
                text: { type: Type.STRING, description: "The story text for this page." },
                imagePrompt: { type: Type.STRING, description: "A prompt for generating an image for this page. e.g., 'A cute robot waving hello in a sunny field'." },
              },
              required: ["pageNumber", "text", "imagePrompt"],
            },
          },
        },
      },
    },
  });

  const storyData = parseJsonResponse<{ pages: StoryPage[] }>(textResponse.text, { pages: [] });

  const pagesWithImages: StoryPage[] = [];
  for (const page of storyData.pages) {
    const imageResponse = await ai.models.generateImages({
      model: imageModel,
      prompt: `${page.imagePrompt}, children's book illustration, vibrant colors, friendly style`,
      config: { numberOfImages: 1 },
    });
    const imageUrl = `data:image/png;base64,${imageResponse.generatedImages[0].image.imageBytes}`;
    pagesWithImages.push({ ...page, imageUrl });
    await sleep(1000); // Add a 1-second delay to avoid rate limiting
  }
  
  return pagesWithImages;
};

export const generateFlashcards = async (text: string): Promise<FlashcardsData> => {
    const textResponse = await ai.models.generateContent({
        model: textModel,
        contents: `From the text provided, identify 8 key terms. For each term, provide a simple definition suitable for a 10-year-old, and a descriptive prompt for an image that visually represents the term.
        Text: "${text}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        term: { type: Type.STRING, description: "The key term." },
                        definition: { type: Type.STRING, description: "A simple definition." },
                        imagePrompt: { type: Type.STRING, description: "A prompt for generating a visual representation." },
                    },
                    required: ["term", "definition", "imagePrompt"],
                },
            },
        },
    });

    const flashcardData = parseJsonResponse<Flashcard[]>(textResponse.text, []);
    
    const flashcardsWithImages: Flashcard[] = [];
    for (const card of flashcardData) {
        const imageResponse = await ai.models.generateImages({
            model: imageModel,
            prompt: `Flashcard image: ${card.imagePrompt}, simple icon, clean background, educational style`,
            config: { numberOfImages: 1 },
        });
        const imageUrl = `data:image/png;base64,${imageResponse.generatedImages[0].image.imageBytes}`;
        flashcardsWithImages.push({ ...card, imageUrl });
        await sleep(1000); // Add a 1-second delay to avoid rate limiting
    }

    return flashcardsWithImages;
};

export const generateSummary = async (text: string): Promise<SummaryData> => {
  const response = await ai.models.generateContent({
    model: textModel,
    contents: `Provide a concise, easy-to-understand summary of the following text. Focus on the main points and key takeaways. Text: "${text}"`,
  });
  return response.text.trim();
};


export const generateLanguageTutorReport = async (text: string): Promise<LanguageTutorData> => {
  const response = await ai.models.generateContent({
    model: textModel,
    contents: `You are a Hindi-English language tutor for kids who know English but are learning Hindi. I will give you a Hindi story. Create a structured bilingual learning report.
    Hindi story: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING, description: "Title in Hindi." },
              translation: { type: Type.STRING, description: "Title in English." },
            },
            required: ["original", "translation"],
          },
          introduction: { type: Type.STRING, description: "A friendly introduction in English about the story." },
          sentences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING, description: "A sentence in Hindi." },
                translation: { type: Type.STRING, description: "The English translation." },
                notes: { type: Type.STRING, description: "Optional grammar or vocabulary notes." },
              },
              required: ["original", "translation"],
            },
          },
        },
      },
    },
  });

  return parseJsonResponse<LanguageTutorData>(response.text, {
      title: { original: '', translation: '' },
      introduction: '',
      sentences: [],
  });
};