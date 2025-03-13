import { Router, Request, Response } from "express";
import authenticate from "./AuthenticationControllers/authMiddleware";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("RoomieTasks Task Service");
});

router.get("/api/liveness", (req: Request, res: Response) => {
  const answer = "Task Service API is alive.";
  res.json(answer);
});

router.get(
  "/protected",
  authenticate,
  (req: Request & { user?: any }, res: Response) => {
    res.json({
      message: "This is a protected route in the task service",
      user: req.user,
    });
  }
);

export default router;