import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the API only if the key exists to prevent crashing the whole app
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Generates a dynamic quiz for a specific topic based on the user's mastery level.
 * 
 * @param {string} topicTitle - The title of the topic
 * @param {string} subjectName - The name of the subject
 * @param {string} topicNotes - The text content of the notes for context
 * @param {number} masteryLevel - The user's mastery level (1 to 5)
 * @returns {Promise<Array>} - An array of question objects
 */
export async function generateQuiz(topicTitle, subjectName, topicNotes, masteryLevel) {
  if (!genAI) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env file. Please add your API key to generate quizzes.");
  }

  // We use gemini-2.5-flash as it is the standard available model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
    }
  });

  // Adjust difficulty prompt based on mastery level
  let difficultyDescription;
  if (masteryLevel <= 2) {
    difficultyDescription = "Focus on the basics and foundational definitions. Make the questions relatively easy and straightforward.";
  } else if (masteryLevel === 3) {
    difficultyDescription = "Focus on intermediate concepts and application. Make the questions moderately challenging.";
  } else {
    difficultyDescription = "Focus on advanced concepts, edge cases, and tricky scenarios. The student has high mastery, so make the questions difficult and thought-provoking.";
  }

  const prompt = `
    You are an expert tutor creating a practice quiz for a student studying "${subjectName}".
    The specific topic is "${topicTitle}".
    
    Here are the study notes the student just read for context:
    """
    ${topicNotes}
    """

    Generate exactly 5 multiple choice questions.
    
    DIFFICULTY LEVEL ADJUSTMENT:
    The student's current mastery level is ${masteryLevel} out of 5.
    ${difficultyDescription}

    CRITICAL INSTRUCTIONS FOR OUTPUT FORMAT:
    You must respond ONLY with a raw JSON array of objects. Do not include markdown formatting, code blocks like \`\`\`json, or conversational text.
    
    The JSON structure MUST look exactly like this:
    [
      {
        "question": "The text of the question?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "explanation": "Why Option A is correct."
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Sanitize the response just in case the AI wraps it in markdown despite instructions
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const questions = JSON.parse(responseText);
    
    if (!Array.isArray(questions)) {
      throw new Error("AI did not return a valid array of questions.");
    }
    
    return questions;
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    
    // Check if it's a JSON parse error to give a better message
    if (error instanceof SyntaxError) {
       throw new Error("The AI failed to format the questions properly. Please try again.", { cause: error });
    }
    
    throw new Error(`AI Error: ${error.message}`, { cause: error });
  }
}

/**
 * Generates an in-depth, markdown-formatted study guide based on the user's mastery level.
 * 
 * @param {string} topicTitle - The title of the topic
 * @param {string} subjectName - The name of the subject
 * @param {number} masteryLevel - The user's mastery level (1 to 5)
 * @returns {Promise<string>} - A markdown string containing the study notes
 */
export async function generateStudyNotes(topicTitle, subjectName, masteryLevel) {
  if (!genAI) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env file.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
    }
  });

  let levelInstructions;
  switch(masteryLevel) {
    case 1:
      levelInstructions = "Target audience: Absolute Beginner. Use simple analogies, avoid complex jargon, and provide extremely foundational definitions. Keep the tone encouraging.";
      break;
    case 2:
      levelInstructions = "Target audience: Novice. Expand on the basics with practical examples and standard use cases. Introduce technical terms but explain them clearly.";
      break;
    case 3:
      levelInstructions = "Target audience: Intermediate. Focus on technical implementation, standard algorithms, rules, and common pitfalls. Assume they know the basics.";
      break;
    case 4:
      levelInstructions = "Target audience: Advanced. Dive deep into complex scenarios, optimizations, performance tradeoffs, and advanced techniques.";
      break;
    case 5:
    default:
      levelInstructions = "Target audience: Elite Master. Focus on edge cases, mathematical proofs (if applicable), deep architectural tradeoffs, industry-level nuances, and expert-level insights.";
      break;
  }

  const prompt = `
    You are an expert tutor creating a comprehensive study guide for a student studying "${subjectName}".
    The specific topic is "${topicTitle}".
    
    The student's current mastery level is ${masteryLevel} out of 5.
    ${levelInstructions}

    INSTRUCTIONS:
    1. Write a massive, in-depth study guide (at least 800-1000 words).
    2. Format the response entirely in beautiful Markdown. Use headings (##, ###), bullet points, bold text, and code blocks (where applicable).
    3. Ensure the depth and breadth of the content perfectly matches the student's mastery level.
    4. Do not include any conversational filler (e.g., "Here is your study guide"). Just output the raw markdown content starting with a # Title.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Failed to generate notes:", error);
    throw new Error(`AI Error: ${error.message}`, { cause: error });
  }
}
