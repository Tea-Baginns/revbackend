import { Router } from "express";

import userRoutes from "./user.routes";

const router = Router();

router.use("/api/user", userRoutes);

router.use((_, res) => res.status(404).json({ success: false }));

export default router;
