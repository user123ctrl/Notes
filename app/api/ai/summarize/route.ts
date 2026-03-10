import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: "النص مطلوب" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    const prompt = `قم بتلخيص النص التالي باللغة العربية بشكل موجز:
    
    "${text}"
    
    المطلوب: ملخص قصير لا يتجاوز 3 أسطر.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { error: "فشل في تلخيص النص" },
      { status: 500 }
    );
  }
}
