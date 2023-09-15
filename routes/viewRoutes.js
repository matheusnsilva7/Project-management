const express = require("express");
const viewController = require("./../controllers/viewController");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/", authController.isLoggedIn, viewController.getLogging);
router.get("/signup", authController.isLoggedIn, viewController.getSignup);
router.get("/projects", authController.protect, viewController.getProjects);
router.get("/settings", authController.protect, viewController.getSettings);
router.get("/project/:id", authController.protect, viewController.getProject);
router.get(
  "/project/:id/tasks",
  authController.protect,
  viewController.getTasks
);
router.get(
  "/project/:id/board",
  authController.protect,
  viewController.getBoard
);
router.get(
  "/project/:id/project-settings",
  authController.protect,
  viewController.getProjectSettings
);

module.exports = router;
