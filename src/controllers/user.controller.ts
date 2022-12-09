import { RequestHandler } from "express";

import User, { IUser } from "~/models/User";
import { jwt, hash, asyncHandler, ErrorResponse } from "~/utils";

const getPayLoad = (user: IUser) => {
  return {
    id: user.id,
  };
};

const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new ErrorResponse("Invalid Credentials", 400));

  const match = await hash.compare(req.body.password, user.password);
  if (!match) return next(new ErrorResponse("Invalid Credentails", 400));

  const payload = getPayLoad(user);
  const token = jwt.generate(payload);

  return res.json({ success: true, token });
});

const signup: RequestHandler = asyncHandler(async (req, res, next) => {
  if (await User.findOne({ email: req.body.email }))
    return next(new ErrorResponse("User already exists", 400));

  const { name, email, password } = req.body;

  const hashedPassword = await hash.generate(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const payload = getPayLoad(user);
  const token = jwt.generate(payload);

  return res.status(201).json({ success: true, token });
});

export default { login, signup };
