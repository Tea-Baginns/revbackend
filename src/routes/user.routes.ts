import { Router } from 'express';
import { check } from 'express-validator';

import userControllers from '~/controllers/user.controller';

const router = Router();

router.post(
  '/signup',
  [
    notEmpty('name', 'Name cannot be empty'),
    notEmpty('email', 'Email cannot be empty')
      .isEmail()
      .withMessage('Provided email is not a valid email')
      .normalizeEmail(),
    check('password')
      .isLength({ min: 5 })
      .withMessage('Password should be of more than 4 characters'),
  ],
  userControllers.signup,
);

router.post(
  '/login',
  [
    notEmpty('email', 'Email cannot be empty'),
    notEmpty('password', 'Password cannot be empty'),
  ],
  userControllers.login,
);

function notEmpty(name: string, message: string) {
  return check(name).trim().notEmpty().withMessage(message);
}

export default router;
