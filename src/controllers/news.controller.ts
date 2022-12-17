import News from '~/models/News';
import User from '~/models/User';
import { asyncHandler, ErrorResponse, errors } from '~/utils';

const getNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (news === null) return next(new ErrorResponse('News not found', 404));

  return res.json({ success: true, news });
});

const createNews = asyncHandler(async (req, res) => {
  const data = req.body;

  const news = await News.create({
    title_en: data.title_en,
    title_np: data.title_np,
    content_en: data.content_en,
    content_np: data.content_np,
    category: data.category,
    author: req.user._id,
    image: data.image_url,
  });

  res.status(201).json({ success: true, news });
});

const updateNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (news === null) return next(new ErrorResponse('Invalid news id', 400));

  if (
    news.author !== req.user._id &&
    !['admin', 'moderator'].includes(req.user.role)
  )
    return next(errors.authorization);

  ifUpdate('title_en', news, req.body);
  ifUpdate('title_np', news, req.body);
  ifUpdate('content_en', news, req.body);
  ifUpdate('content_np', news, req.body);

  await news.save();

  return res.json({ success: true, news });
});

const deleteNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (news === null) return next(new ErrorResponse('Invalid news id', 400));

  if (
    news.author !== req.user._id &&
    !['admin', 'moderator'].includes(req.user.role)
  )
    return next(errors.authorization);

  await News.deleteOne({ id: req.params.id });

  return res.json({ success: true });
});

function ifUpdate(name: string, news: any, body: any) {
  if (typeof body[name] === 'string') news[name] = body[name];
}

const bookmark = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);
  if (news === null) return next(new ErrorResponse('Invalid news id', 400));

  const user = (await User.findById(req.user.id))!;

  if (user.bookmarks.includes(news.id))
    await news.updateOne({ $pull: { bookmarks: [news.id] } });
  else await news.updateOne({ $push: { bookmarks: [news.id] } });

  return res.json({ success: true });
});

export default {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  bookmark,
};
