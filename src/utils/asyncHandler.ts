import { validationResult } from "express-validator";
import type { NextFunction, RequestHandler, Request, Response } from "express";

import ErrorResponse from "~/utils/ErrorResponse";

const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errs = errors.array().map(({ msg, param }) => ({ msg, param }));
      return res.status(400).send({ success: false, errors: errs });
    }

    return Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log(`[caught by asyncHandler]: `);
      console.log(err.message);

      return next(new ErrorResponse("Something went wrong", 500));
    });
  };

export default asyncHandler;
