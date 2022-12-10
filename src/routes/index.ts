import { Router } from 'express';

import userRoutes from './user.routes';
import newsRoutes from './news.routes';

const router = Router();

router.use('/api/user', userRoutes);
router.use('/api/news', newsRoutes);

router.use((_, res) => {
  res.status(404).json({ success: false });
});

export default router;
