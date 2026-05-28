const providers = [
  {
    name: "gemini",
    key: import.meta.env.VITE_GEMINI_API_KEY,
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    model: "gemini-2.5-flash",
    headers: (key) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    }),
    body: (model, prompt) => ({
      model: model,
      messages: [{ role: "user", content: prompt }]
    }),
    extract: (data) => data.choices?.[0]?.message?.content
  },
  {
    name: "openai",
    key: import.meta.env.VITE_OPENAI_KEY_1 || import.meta.env.VITE_OPENAI_API_KEY,
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4.1-mini",
    headers: (key) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    }),
    body: (model, prompt) => ({
      model: model,
      messages: [{ role: "user", content: prompt }]
    }),
    extract: (data) => data.choices?.[0]?.message?.content
  }
];

/**
 * Helper to call AI completion with fallback across multiple providers.
 * 
 * @param {string} prompt - The prompt to send to the AI
 * @returns {Promise<string>} - The generated text response
 */
async function callAIWithFallback(prompt) {
  const activeProviders = providers.filter(p => p.key);

  if (activeProviders.length === 0) {
    throw new Error("No AI API keys configured. Please add VITE_GEMINI_API_KEY or VITE_OPENAI_KEY_1 to your .env file.");
  }

  let lastError = null;

  for (const provider of activeProviders) {
    try {
      console.log(`Attempting generation with ${provider.name} (${provider.model})...`);
      const response = await fetch(provider.url, {
        method: "POST",
        headers: provider.headers(provider.key),
        body: JSON.stringify(provider.body(provider.model, prompt))
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const content = provider.extract(data);
      if (!content) {
        throw new Error("Invalid response structure (missing content)");
      }
      return content;
    } catch (err) {
      console.warn(`Provider ${provider.name} failed:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`All configured AI providers failed. Last error: ${lastError?.message || "unknown"}`);
}

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
    const responseText = await callAIWithFallback(prompt);
    
    // Sanitize the response just in case the AI wraps it in markdown despite instructions
    const cleanResponseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const questions = JSON.parse(cleanResponseText);
    
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
    return await callAIWithFallback(prompt);
  } catch (error) {
    console.error("Failed to generate notes:", error);
    throw new Error(`AI Error: ${error.message}`, { cause: error });
  }
}
