import type { RequestHandler } from 'express';

import { Roles } from '~/types';
import { errors } from '~/utils';

const checkRole = (roles: Roles[]): RequestHandler => {
  return (req, _, next) => {
    if (req.user === null || req.user === undefined)
      return next(errors.authorization);

    if (!roles.includes(req.user.role as any))
      return next(errors.authorization);

    next();
  };
};

export default checkRole;
