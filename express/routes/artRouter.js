import express from "express";
import artController from "../controllers/artController.js";
import { validateArtBody, validateArtId, validateEditArtBody } from "../middleware/validate.js";
const router = express.Router();

router.get("/arts/:id", validateArtId, artController.getOneArt);
router.get("/arts", artController.getArts);

router.post("/arts", validateArtBody, artController.createArt);

router.patch("/arts/:id", validateArtId, validateEditArtBody, artController.updateArt);
export default router;

// 2 GET
// 1 POST

// 1 PUT OT PATCH

// Use middleware to validate all inputs from the client, including request parameters and data in the request body.

// Have basic error handling, particular for not-found resources.

// Use a similar architecture to our assignments and lessons with routing, controller, and model logic separated.

/*
Send responses with appropriate status codes;
▪ Filter or modify GET requests with URL query parameters;
▪ resource-based path names; => plurlar
▪ URL versioning; => done
▪ JSON responses; => done
*/
