import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const summarizeText = async (text: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    const prompt = `قم بتلخيص النص التالي باللغة العربية بشكل موجز:
    
    "${text}"
    
    المطلوب: ملخص قصير لا يتجاوز 3 أسطر يغطي النقاط الرئيسية.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw new Error("فشل في تلخيص النص");
  }
};

export const generateSuggestions = async (content: string): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    const prompt = `بناءً على محتوى الملاحظة التالية، قم باقتراح 3 أفكار أو إجراءات متابعة ذكية:
    
    "${content}"
    
    قدم الاقتراحات باللغة العربية في شكل قائمة مرقمة.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse numbered list
    return text.split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return [];
  }
};

export const extractTags = async (content: string): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    const prompt = `استخرج 3-5 كلمات مفتاحية (tags) من النص التالي باللغة العربية:
    
    "${content}"
    
    قدم النتيجة كقائمة مفصولة بفواصل فقط، بدون أرقام أو رموز إضافية.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  } catch (error) {
    console.error("Error extracting tags:", error);
    return [];
  }
};

export const improveText = async (text: string, style: "formal" | "creative" | "academic" = "formal"): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    const stylePrompts = {
      formal: "بأسلوب رسمي ومهني",
      creative: "بأسلوب إبداعي وجذاب",
      academic: "بأسلوب أكاديمي وعلمي"
    };
    
    const prompt = `حسّن النص التالي ${stylePrompts[style]}:
    
    "${text}"
    
    قدم النص المحسّن فقط بدون أي إضافات.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error improving text:", error);
    throw new Error("فشل في تحسين النص");
  }
};
