import { Router, Request, Response } from "express";
import authenticate from "./AuthenticationControllers/authMiddleware";
import { User } from "../ConfigFiles/dbAssociations";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("RoomieTasks Website Server");
});

router.get("/api/liveness", (req: Request, res: Response) => {
  const answer = "API is alive.";
  res.json(answer);
});

router.get(
  "/protected",
  authenticate,
  (req: Request & { user?: any }, res: Response) => {
    res.json({
      message: "This is a protected route",
      user: req.user,
    });
  }
);

router.get("/user/:userId/firstName", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Return the user's first name
    res.status(200).json({ firstName: user.firstName });
    return;
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});


router.get('/users', async (req: Request, res: Response) => {
  try {
    // Query the users table for id, firstName, and lastName
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'role'],  // Select only the required columns
    });

    // If no users are found, return an empty array or an appropriate message
    if (!users) {
      res.status(404).json({ message: 'No users found' });
      return;
    }

    // Send the fetched data as a response
    res.status(200).json(users);
    return;
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
    return;
  }
});

export default router;
