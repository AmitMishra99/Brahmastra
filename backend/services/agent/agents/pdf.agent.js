import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import { generatePdf } from "../utils/generatePdf.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const pdfAgent = async (state) => {
  try {
    const llm = getModel("pdf");

    const prompt = `
You are an expert document writer.

Return ONLY valid JSON.
Do NOT return markdown.
Do NOT return explanations.
Do NOT wrap the JSON inside \`\`\`json.

Use exactly this structure:

{
  "title": "",
  "subtitle": "",
  "sections": [
    {
      "heading": "",
      "points": []
    }
  ]
}

Requirements:
- Generate 4-8 sections.
- Each section must have 3-6 concise bullet points.
- Keep the content clear, informative, and well structured.

Topic:
${state.prompt}
`;

    const res = await llm.invoke(prompt);
    await deductCredits(state.userId, "pdf");

    const data = JSON.parse(res.content);

    const pdfBuffer = await generatePdf(data);

    const fileName = `pdf-${Date.now()}.pdf`;

    await uploadToS3(fileName, pdfBuffer, "application/pdf");

    const downloadUrl = await getFromS3(fileName, 10 * 60);

    return {
      ...state,

      aiResponse: `
### PDF Generated Successfully!

📄 [Download PDF](${downloadUrl})

*Link expires in 10 minutes.*
`,
    };
  } catch (err) {
    console.log("Error in PDF Agent - ", err);

    return {
      ...state,
      aiResponse: "Failed to generate PDF.",
    };
  }
};
