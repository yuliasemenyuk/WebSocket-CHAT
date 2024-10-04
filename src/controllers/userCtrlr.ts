// import { Request, Response } from "express";
// import { userService } from "../services/userService";

// export const userController = {
//   checkSession: async (req: Request, res: Response) => {
//     try {
//       const { sessionToken } = req.body;
//       if (!sessionToken) {
//         res.status(400).json({ message: "Session token is required" });
//       }

//       const user = userService.getUserBySessionToken(sessionToken);
//       if (!user) {
//         res.status(404).json({ message: "User not found" });
//       }

//       res.status(200).json(user);
//     } catch (error) {
//       console.error("Error checking session:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },

//   create: async (req: Request, res: Response) => {
//     try {
//       const { name } = req.body;
//       if (!name) {
//         res.status(400).json({ message: "User name is required" });
//       }

//       const user = userService.createUser(name);
//       res.status(200).json(user);
//     } catch (error) {
//       console.error("Error creating user:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
// };
