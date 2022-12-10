import { Router } from 'express';

import { checkAuth, checkRole } from '~/middlewares';
import newsControllers from '~/controllers/news.controller';

const router = Router();

router.post(
  '/',
  checkAuth,
  checkRole(['writer', 'admin', 'moderator']),
  newsControllers.createNews,
);

router
  .route('/:id')
  .get(newsControllers.getNews)
  .patch(
    checkAuth,
    checkRole(['writer', 'admin', 'moderator']),
    newsControllers.updateNews,
  )
  .delete(
    checkAuth,
    checkRole(['writer', 'admin', 'moderator']),
    newsControllers.deleteNews,
  );

export default router;
