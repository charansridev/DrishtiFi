import { GoogleGenAI, Type } from "@google/genai";
import type { ReportData } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const reportSchema = {
    type: Type.OBJECT,
    properties: {
        shop_name: { type: Type.STRING },
        trust_score: { type: Type.STRING, description: "A letter grade (e.g., A, B+, C) representing credit-worthiness." },
        recommendation_summary: { type: Type.STRING, description: "A one or two-word summary of the recommendation (e.g., 'LOW RISK', 'HIGH RISK')." },
        executive_summary: { type: Type.STRING, description: "A concise paragraph summarizing the findings and recommendation." },
        financial_estimates: {
            type: Type.ARRAY,
            description: "A list of financial estimates based on the visual data.",
            items: {
                type: Type.OBJECT,
                properties: {
                    metric: { type: Type.STRING, description: "The name of the metric (e.g., 'Est. Inventory Value')." },
                    value: { type: Type.STRING, description: "The estimated value in INR (e.g., '₹72,500')." },
                    confidence: { type: Type.STRING, description: "Confidence level for the estimate: 'High', 'Medium', or 'Low'." },
                },
                required: ["metric", "value", "confidence"],
            }
        },
        positive_indicators: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of positive observations from the images, phrased as strengths."
        },
        risks_or_concerns: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of potential risks or concerns observed, phrased as weaknesses."
        },
        final_recommendation_and_rationale: { type: Type.STRING, description: "A detailed final recommendation and the rationale behind it, including a suggested loan amount if applicable." },
    },
    required: [
        "shop_name", "trust_score", "recommendation_summary", "executive_summary",
        "financial_estimates", "positive_indicators", "risks_or_concerns",
        "final_recommendation_and_rationale"
    ],
};


export const generateCreditReport = async (
  shopName: string,
  inventoryImage: File,
  ledgerImage: File
): Promise<Omit<ReportData, 'id' | 'analysisDate'>> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const inventoryImagePart = await fileToGenerativePart(inventoryImage);
  const ledgerImagePart = await fileToGenerativePart(ledgerImage);
  
  const text_prompt = `You are 'DrishtiFi', a senior credit analyst AI agent at a major Indian bank. Your job is to create a professional, detailed 'Digital Credit-Readiness Report' for an offline MSME.

You will be given the shop's name and two images: one of the inventory and one of a handwritten sales ledger.

**YOUR TASK:**
Analyze the images and the shop name ("${shopName}") to generate a comprehensive report. Follow the structure of a professional financial document. Be insightful and base your analysis on the visual evidence.

- **Executive Summary:** Start with a concise summary that includes the trust score and overall recommendation.
- **Financial Estimates:** Provide key financial metrics you can estimate from the images (like inventory value, daily sales, monthly turnover). For each estimate, provide a value in INR and a confidence level (High, Medium, Low).
- **Detailed Analysis:** List specific, bullet-pointed 'Positive Indicators' (strengths) and 'Risks & Concerns' (weaknesses) that you observe.
- **Final Recommendation:** Conclude with a clear recommendation and a detailed rationale explaining why you've reached that conclusion. Suggest a specific loan amount if the business is deemed credit-worthy.

Return **ONLY** a single, valid JSON object that adheres to the provided schema. Do not include any markdown formatting like \`\`\`json.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          inventoryImagePart,
          ledgerImagePart,
          { text: text_prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });

    const responseText = response.text.trim();
    const reportData = JSON.parse(responseText);
    return reportData;
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate credit report. Please check the console for details.");
  }
};