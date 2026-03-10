import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { content, type } = await req.json();
    
    if (!content) {
      return NextResponse.json(
        { error: "المحتوى مطلوب" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    let prompt = "";
    if (type === "suggestions") {
      prompt = `بناءً على محتوى الملاحظة التالية، قم باقتراح 3 أفكار أو إجراءات متابعة ذكية:
      
      "${content}"
      
      قدم الاقتراحات باللغة العربية في شكل قائمة مرقمة.`;
    } else if (type === "tags") {
      prompt = `استخرج 3-5 كلمات مفتاحية (tags) من النص التالي باللغة العربية:
      
      "${content}"
      
      قدم النتيجة كقائمة مفصولة بفواصل فقط.`;
    } else {
      prompt = `حسّن النص التالي:
      
      "${content}"
      
      قدم النص المحسّن فقط.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "فشل في توليد المحتوى" },
      { status: 500 }
    );
  }
}
