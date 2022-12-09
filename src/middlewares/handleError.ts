import { type ErrorRequestHandler } from 'express';

import type { ErrorResponse } from '~/utils';

const handleError: ErrorRequestHandler = (err: ErrorResponse, _, res, __) => {
  let { statusCode, message } = err;

  if (typeof statusCode !== 'number') statusCode = 5000;

  res.status(statusCode).json({
    success: false,
    errors: [
      {
        msg: message,
      },
    ],
  });
};

export default handleError;
