import { type RequestHandler } from 'express';
import News from '~/models/News';

import User, { type IUser } from '~/models/User';
import { jwt, hash, asyncHandler, ErrorResponse } from '~/utils';

const getPayLoad = (user: IUser) => ({
  id: user.id,
});

const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user == null) {
    next(new ErrorResponse('Invalid Credentials', 400));
    return;
  }

  const match = await hash.compare(req.body.password, user.password);
  if (!match) {
    next(new ErrorResponse('Invalid Credentails', 400));
    return;
  }

  const payload = getPayLoad(user);
  const token = jwt.generate(payload);

  return res.json({ success: true, token });
});

const signup: RequestHandler = asyncHandler(async (req, res, next) => {
  if ((await User.findOne({ email: req.body.email })) != null) {
    next(new ErrorResponse('User already exists', 400));
    return;
  }

  const { name, email, password, role } = req.body;

  const hashedPassword = await hash.generate(password);
  const user = await User.create({
    name,
    email,
    role,
    password: hashedPassword,
  });

  const payload = getPayLoad(user);
  const token = jwt.generate(payload);

  return res.status(201).json({ success: true, token });
});

const voteNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (news === null) return next(new ErrorResponse('Invalid news id', 400));

  if (req.body.type === 'upvote') {
    if (news.downvotes.includes(req.user._id))
      await news.updateOne({ $pull: { downvotes: [req.user._id] } });

    if (news.upvotes.includes(req.user._id))
      await news.updateOne({ $pull: { upvotes: [req.user._id] } });
    else await news.updateOne({ $push: { upvotes: [req.user._id] } });
  } else {
    if (news.upvotes.includes(req.user._id))
      await news.updateOne({ $pull: { upvotes: [req.user._id] } });

    if (news.downvotes.includes(req.user._id))
      await news.updateOne({ $pull: { downvotes: [req.user._id] } });
    else await news.updateOne({ $push: { downvotes: [req.user._id] } });
  }

  return res.json({ success: true });
});

const followUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user === null) return next(new ErrorResponse('Invalid user id', 400));

  const curUser = (await User.findById(req.user._id))!;
  if (curUser.follows.includes(user.id)) {
    await curUser.updateOne({ $pull: { follows: [user.id] } });
  } else {
    await curUser.updateOne({ $push: { follows: [user.id] } });
  }

  return res.json({ success: true });
});

export default { login, signup, voteNews, followUser };
