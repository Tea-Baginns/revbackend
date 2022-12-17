import { type RequestHandler } from 'express';

import User from '~/models/User';
import { jwt, errors } from '~/utils';

const checkAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')?.[1];

    if (
      req.headers.authorization?.startsWith('Bearer ') === false ||
      typeof token !== 'string'
    ) {
      next(errors.authorization);
      return;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token);
    } catch (error) {
      next(errors.authorization);
      return;
    }

    const user = await User.findById(decoded.id).select('-password');

    if (user == null) {
      next(errors.authorization);
      return;
    }

    req.user = user.toObject();
    next();
  } catch (err) {
    next(errors.generic);
  }
};

export default checkAuth;
