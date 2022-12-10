import { validationResult } from 'express-validator';
import type { NextFunction, RequestHandler, Request, Response } from 'express';

import { errors } from '~/utils';

const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    const valErrors = validationResult(req);

    if (!valErrors.isEmpty()) {
      const errs = valErrors.array().map(({ msg, param }) => ({ msg, param }));
      return res.status(400).send({ success: false, errors: errs });
    }

    return Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log('[caught by asyncHandler]: ');
      console.log(err.message);

      next(errors.generic);
    });
  };

export default asyncHandler;
