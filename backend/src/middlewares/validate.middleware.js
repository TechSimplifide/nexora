import ApiError from "../utils/api-error.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(400, "Validation failed", result.error.issues);
    }

    req.body = result.data;

    next();
  };
};

export default validate;
