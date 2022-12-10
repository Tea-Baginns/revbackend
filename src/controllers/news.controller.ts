import News from '~/models/News';
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
    author: req.user.id,
  });

  res.status(201).json({ success: true, news });
});

const updateNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (news === null) return next(new ErrorResponse('Invalid news id', 400));

  if (
    news.author !== req.user.id &&
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
    news.author !== req.user.id &&
    !['admin', 'moderator'].includes(req.user.role)
  )
    return next(errors.authorization);

  await News.deleteOne({ id: req.params.id });

  return res.json({ success: true });
});

const voteNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (news === null) return next(new ErrorResponse('Invalid news id', 400));

  if (req.body.type === 'upvote') {
    if (news.downvotes.includes(req.user.id))
      await news.updateOne({ $pull: { downvotes: [req.user.id] } });

    if (news.upvotes.includes(req.user.id))
      await news.updateOne({ $pull: { upvotes: [req.user.id] } });
    else await news.updateOne({ $push: { upvotes: [req.user.id] } });
  } else {
    if (news.upvotes.includes(req.user.id))
      await news.updateOne({ $pull: { upvotes: [req.user.id] } });

    if (news.downvotes.includes(req.user.id))
      await news.updateOne({ $pull: { downvotes: [req.user.id] } });
    else await news.updateOne({ $push: { downvotes: [req.user.id] } });
  }

  return res.json({ success: true });
});

function ifUpdate(name: string, news: any, body: any) {
  if (typeof body[name] === 'string') news[name] = body[name];
}

export default { getNews, createNews, updateNews, deleteNews, voteNews };
