const express = require("express");
const projectController = require("../controllers/projectController");
const authController = require("./../controllers/authController");
const taskRouter = require("./../routes/taskRouter");

const router = express.Router();

router.use("/:id/tasks", taskRouter);

router
  .route("/")
  .get(projectController.getAllProjects)
  .post(
    authController.protect,
    projectController.setAdminMembers,
    projectController.createProject
  );
router.patch(
  "/updateMembers/:id",
  authController.protect,
  authController.restricToProject,
  authController.updateMembers
);
router.patch(
  "/deleteMembers/:id",
  authController.protect,
  authController.restricToProject,
  authController.deleteMembers
);
router
  .route("/:id")
  .get(projectController.getProject)
  .patch(
    authController.protect,
    authController.restricToProject,
    projectController.updateProject
  )
  .delete(
    authController.protect,
    authController.restricToProject,
    projectController.deleteProject
  );

module.exports = router;
