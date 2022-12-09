import { ErrorRequestHandler } from "express";

import type { ErrorResponse } from "~/utils";

const handleError: ErrorRequestHandler = (err: ErrorResponse, _, res, __) => {
  let { statusCode, message } = err;

  res.status(statusCode || 500).json({
    success: false,
    errors: [
      {
        msg: message,
      },
    ],
  });
};

export default handleError;
