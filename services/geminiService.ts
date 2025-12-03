import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Computer Science Teaching Assistant specializing in C Language and Algorithms (Data Structures).
The user is learning about the "Maze Problem" (finding all paths from start to end using DFS/Backtracking).

Your Goal:
1. Explain the concepts of Recursion, Stack, and Backtracking (DFS) clearly.
2. DO NOT give the complete C code solution immediately. Instead, guide the user step-by-step.
3. If they ask about the algorithm, explain the logic: "Check boundaries -> Check if visited -> Recursively call neighbors -> Backtrack (reset visited status)".
4. Use Chinese (Simplified) for communication.
5. Be encouraging and "循循善诱" (guide them patiently).
6. If asked for code snippets, provide small parts (e.g., the boundary check function, or the direction array) rather than the whole \`main\` and \`dfs\` function at once.

Context:
The problem input is a 2D array where 1 is a path and 0 is a wall.
Input format is Rows Cols followed by the grid.
Target: Find ALL paths from (0,0) to (R-1, C-1).
`;

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    const chatHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: chatHistory,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "我好像遇到了一点问题，请再试一次。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，连接 AI 助教时出现错误，请检查网络或 API Key。";
  }
};