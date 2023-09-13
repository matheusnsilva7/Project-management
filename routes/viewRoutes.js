const express = require("express");
const viewController = require("./../controllers/viewController");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/", authController.isLoggedIn, viewController.getLogging);
router.get("/signup", authController.isLoggedIn, viewController.getSignup);
router.get("/projects", authController.isLoggedIn, viewController.getProjects);
router.get("/settings", authController.protect, viewController.getSettings);
router.get(
  "/project/:id",
  authController.isLoggedIn,
  viewController.getProject
);
router.get(
  "/project/:id/tasks",
  authController.isLoggedIn,
  viewController.getTasks
);
router.get(
  "/project/:id/board",
  authController.isLoggedIn,
  viewController.getBoard
);
router.get(
  "/project/:id/project-settings",
  authController.isLoggedIn,
  viewController.getProjectSettings
);

module.exports = router;
