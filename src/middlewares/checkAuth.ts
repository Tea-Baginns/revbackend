import { type RequestHandler } from 'express';

import User from '~/models/User';
import { jwt, ErrorResponse } from '~/utils';

const notAuthorizedError = new ErrorResponse("You aren't authorized to access this route", 401);

const checkAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')?.[1];

    if (req.headers.authorization?.startsWith('Bearer ') === true || typeof token !== 'string') {
      next(notAuthorizedError);
      return;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token);
    } catch (error) {
      next(notAuthorizedError);
      return;
    }

    const user = await User.findById(decoded.id).select('-password');

    if (user == null) {
      next(notAuthorizedError);
      return;
    }

    req.user = user.toObject();
    next();
  } catch (err) {
    next(new ErrorResponse('Something went wrong', 500));
  }
};

export default checkAuth;
