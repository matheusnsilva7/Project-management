const express = require("express");
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(taskController.getAllTask)
  .post(
    authController.restricToProject,
    taskController.setProjectUserId,
    taskController.createTask
  );

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(authController.restricToTask, taskController.updateTask)
  .delete(authController.restricToTask, taskController.deleteTask);
module.exports = router;
