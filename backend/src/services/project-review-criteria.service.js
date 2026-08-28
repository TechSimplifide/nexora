import { ProjectReviewCriteria } from "../models/project-review-criteria.model.js";
import { DEFAULT_PROJECT_REVIEW_CRITERIA } from "../constants/project-review-criteria.js";
import ApiError from "../utils/api-error.js";

const createDefaultProjectReviewCriteria = async (collegeId) => {
  return ProjectReviewCriteria.create({
    college: collegeId,
    standardCriteria: DEFAULT_PROJECT_REVIEW_CRITERIA,
    customCriteria: [],
    autoReview: {
      enabled: false,
      confidenceThreshold: 0.9,
    },
  });
};

export const getProjectReviewCriteriaService = async (collegeId) => {
  let criteria = await ProjectReviewCriteria.findOne({
    college: collegeId,
  });

  if (!criteria) {
    criteria = await createDefaultProjectReviewCriteria(collegeId);
  }

  return criteria;
};

export const updateProjectReviewCriteriaService = async ({
  collegeId,
  standardCriteria,
  customCriteria,
  autoReview,
}) => {
  let criteria = await ProjectReviewCriteria.findOne({
    college: collegeId,
  });

  if (!criteria) {
    criteria = await createDefaultProjectReviewCriteria(collegeId);
  }

  const defaultKeys = new Set(
    DEFAULT_PROJECT_REVIEW_CRITERIA.map((criterion) => criterion.key),
  );

  const submittedKeys = new Set(
    standardCriteria.map((criterion) => criterion.key),
  );

  if (submittedKeys.size !== defaultKeys.size) {
    throw new ApiError(400, "All standard review criteria must be provided");
  }

  for (const key of defaultKeys) {
    if (!submittedKeys.has(key)) {
      throw new ApiError(400, `Missing standard review criterion: ${key}`);
    }
  }

  const defaultCriteriaMap = new Map(
    DEFAULT_PROJECT_REVIEW_CRITERIA.map((criterion) => [
      criterion.key,
      criterion,
    ]),
  );

  criteria.standardCriteria = standardCriteria.map((criterion) => {
    const defaultCriterion = defaultCriteriaMap.get(criterion.key);

    return {
      key: defaultCriterion.key,
      name: defaultCriterion.name,
      description: defaultCriterion.description,
      enabled: criterion.enabled,
      required: criterion.required,
    };
  });

  criteria.customCriteria = customCriteria;

  criteria.autoReview = autoReview;

  await criteria.save();

  return criteria;
};
