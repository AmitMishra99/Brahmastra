import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import { generatePpt } from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const pptAgent = async (state) => {
  try {
    const llm = getModel("ppt");

    const prompt = `
You are a professional presentation designer.

Return ONLY valid JSON.

Format:
{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": [
        "",
        "",
        "",
        ""
      ]
    }
  ]
}

Rules:
- Generate exactly 6 content slides.
- Each slide must have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY valid JSON.

Topic: ${state.prompt}
`;

    const res = await llm.invoke(prompt);
    await deductCredits(state.userId, "ppt");

    const data = JSON.parse(res.content);

    const ppt = await generatePpt(data);

    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });

    const fileName = `ppt-${Date.now()}.pptx`;

    await uploadToS3(
      fileName,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    const downloadUrl = await getFromS3(fileName, 10 * 60);

    return {
      ...state,
      aiResponse: `
### PPT Generated Successfully!

📄 [Download PPT](${downloadUrl})

*Link expires in 10 minutes.*
`,
    };
  } catch (err) {
    console.log("Error in PPT Agent - Agents:", err);

    return {
      ...state,
      aiResponse: "Failed to generate PPT.",
    };
  }
};
