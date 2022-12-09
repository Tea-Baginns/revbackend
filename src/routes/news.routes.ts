import { Router } from 'express';

import { checkAuth } from '~/middlewares';
import newsControllers from '~/controllers/news.controller';

const router = Router();

router.post('/', checkAuth, newsControllers.createNews);

router
  .route('/:id')
  .get(newsControllers.getNews)
  .patch(checkAuth, newsControllers.updateNews)
  .delete(checkAuth, newsControllers.deleteNews);

export default router;
