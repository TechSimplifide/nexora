import ApiError from "../utils/api-error.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      errors: err.errors ?? [],
    });
  }

  return res.status(500).json({
    statusCode: 500,
    success: false,
    message: "Internal Server Error",
    errors: [],
  });
};

export default errorHandler;
