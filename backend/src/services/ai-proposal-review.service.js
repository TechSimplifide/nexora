import proposalReviewSystemPrompt from "../prompts/proposal-review.system-prompt.js";
import { ProjectProposal } from "../models/project-proposal.model.js";
import { ProjectReviewCriteria } from "../models/project-review-criteria.model.js";
import ApiError from "../utils/api-error.js";
import { proposalAIResponseSchema } from "../validators/proposal-ai-response.validator.js";
import { geminiModel } from "../config/gemini.js";

const fetchProposalPdf = async (url) => {
  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    console.error("Failed to fetch proposal PDF:", error);

    throw new ApiError(503, "Project proposal document could not be retrieved");
  }

  if (!response.ok) {
    console.error(`Failed to fetch proposal PDF. Status: ${response.status}`);

    throw new ApiError(503, "Project proposal document could not be retrieved");
  }

  const contentType = response.headers.get("content-type");

  if (
    contentType &&
    !contentType.includes("application/pdf") &&
    !contentType.includes("application/octet-stream")
  ) {
    console.error(`Unexpected proposal document content type: ${contentType}`);

    throw new ApiError(502, "Project proposal document is not a valid PDF");
  }

  const arrayBuffer = await response.arrayBuffer();

  const pdfBuffer = Buffer.from(arrayBuffer);

  if (!pdfBuffer.length) {
    throw new ApiError(502, "Project proposal document is empty");
  }

  return pdfBuffer;
};

const buildProposalReviewPrompt = ({ proposal, criteria }) => {
  const enabledStandardCriteria = criteria.standardCriteria.filter(
    (criterion) => criterion.enabled,
  );

  const enabledCustomCriteria = criteria.customCriteria.filter(
    (criterion) => criterion.enabled,
  );

  return `
${proposalReviewSystemPrompt}

PROJECT PROPOSAL INFORMATION

Title:
${proposal.title}

Team Size:
${proposal.team.size}

Team Members:
${proposal.team.members.map((member) => member.name).join(", ")}


ADMINISTRATOR-DEFINED REVIEW CRITERIA

STANDARD CRITERIA:

${enabledStandardCriteria
  .map(
    (criterion) => `
Key: ${criterion.key}
Name: ${criterion.name}
Description: ${criterion.description}
Required: ${criterion.required}
`,
  )
  .join("\n")}


CUSTOM CRITERIA:

${
  enabledCustomCriteria.length
    ? enabledCustomCriteria
        .map(
          (criterion) => `
Name: ${criterion.name}
Description: ${criterion.description}
Required: ${criterion.required}
`,
        )
        .join("\n")
    : "No custom criteria have been defined."
}
`;
};

export const analyzeProposalWithAIService = async ({
  proposalId,
  collegeId,
}) => {
  const proposal = await ProjectProposal.findOne({
    _id: proposalId,
    college: collegeId,
  });

  if (!proposal) {
    throw new ApiError(404, "Project proposal not found");
  }

  if (proposal.status !== "pending") {
    throw new ApiError(400, "Only pending project proposals can be analyzed");
  }

  const criteria = await ProjectReviewCriteria.findOne({
    college: collegeId,
  });

  if (!criteria) {
    throw new ApiError(404, "Project review criteria configuration not found");
  }

  const pdfBuffer = await fetchProposalPdf(proposal.abstractPdf.url);

  const prompt = buildProposalReviewPrompt({
    proposal,
    criteria,
  });

  let result;

  try {
    result = await geminiModel.generateContent([
      {
        text: prompt,
      },
      {
        inlineData: {
          data: pdfBuffer.toString("base64"),
          mimeType: "application/pdf",
        },
      },
    ]);
  } catch (error) {
    console.error("Gemini proposal review error:", error);

    throw new ApiError(
      503,
      "AI proposal review service is currently unavailable",
    );
  }

  const responseText = result.response.text().trim();

  let reviewData;

  try {
    reviewData = JSON.parse(responseText);
  } catch {
    console.error("Invalid Gemini proposal review JSON:", responseText);

    throw new ApiError(
      502,
      "Invalid response received from AI proposal review service",
    );
  }

  const validationResult = proposalAIResponseSchema.safeParse(reviewData);

  if (!validationResult.success) {
    console.error(
      "Invalid Gemini proposal review structure:",
      validationResult.error,
    );

    throw new ApiError(
      502,
      "AI proposal review service returned an invalid response",
    );
  }

  const enabledCriteriaCount =
    criteria.standardCriteria.filter((criterion) => criterion.enabled).length +
    criteria.customCriteria.filter((criterion) => criterion.enabled).length;

  if (validationResult.data.criteriaBreakdown.length !== enabledCriteriaCount) {
    throw new ApiError(
      502,
      "AI proposal review returned an incomplete criteria evaluation",
    );
  }

  return validationResult.data;
};
