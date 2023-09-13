const Project = require("../models/projectModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb");

exports.getLogging = (req, res) => {
  if (res.locals.user) {
    res.redirect("/projects");
  }

  res.status(200).render("login", {
    title: "Log In",
  });
};

exports.getSignup = (req, res) => {
  res.status(200).render("signup", {
    title: "Singup",
  });
};

exports.getProjects = async (req, res, next) => {
  if (!res.locals.user) {
    return next(new AppError("Please login again.", 404));
  }

  const projects = await Project.find({
    $or: [
      { admin: res.locals.user.id },
      { members: { $in: [res.locals.user.id] } }
    ]
  });

  res.status(200).render("projects", {
    title: "Projects",
    projects,
  });
};

exports.getSettings = (req, res) => {
  if (!res.locals.user) {
    return next(new AppError("Please login again.", 404));
  }

  res.status(200).render("settings", {
    title: "Settings",
  });
};

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({
    _id: new ObjectId(`${req.params.id}`),
  }).populate({
    path: "task",
  });

  if (
    !project ||
    (project.admin.id !== res.locals.user.id &&
      project.members.filter((e) => e.id === res.locals.user.id).length <= 0)
  ) {
    return next(new AppError("There is no Project with that name.", 404));
  }

  res.status(200).render("project", {
    title: "Project",
    name: project.name,
    id: project._id,
    allTask: project.task.length,
    completed: project.task.filter((e) => e.status === "Completed"),
    progress: project.task.filter((e) => e.status === "Progress").length,
    review: project.task.filter((e) => e.status === "Review").length,
    role: project.admin.id === res.locals.user.id ? "admin" : "member",
  });
});

exports.getTasks = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({
    _id: new ObjectId(`${req.params.id}`),
  }).populate({
    path: "task",
  });

  if (
    !project ||
    (project.admin.id !== res.locals.user.id &&
      project.members.filter((e) => e.id === res.locals.user.id).length <= 0)
  ) {
    return next(new AppError("There is no Project with that name.", 404));
  }

  res.status(200).render("tasks", {
    title: "Tasks",
    name: project.name,
    id: project._id,
    tasks: project.task
      .filter((e) => e.status !== "Completed" && e.status !== "Deferred")
      .sort((a, b) => a.dueDate - b.dueDate),
    role: project.admin.id === res.locals.user.id ? "admin" : "member",
  });
});

exports.getBoard = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({
    _id: new ObjectId(`${req.params.id}`),
  }).populate({
    path: "task",
  });

  if (
    !project ||
    (project.admin.id !== res.locals.user.id &&
      project.members.filter((e) => e.id === res.locals.user.id).length <= 0)
  ) {
    return next(new AppError("There is no Project with that name.", 404));
  }

  res.status(200).render("board", {
    title: "Board",
    name: project.name,
    id: project._id,
    tasks: project.task,
    role: project.admin.id === res.locals.user.id ? "admin" : "member",
    completed: project.task.filter((e) => e.status === "Completed"),
    progress: project.task.filter((e) => e.status === "Progress"),
    review: project.task.filter((e) => e.status === "Review"),
    deferred: project.task.filter((e) => e.status === "Deferred"),
  });
});

exports.getProjectSettings = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({
    _id: new ObjectId(`${req.params.id}`),
  }).populate({
    path: "task",
  });

  if (!project || project.admin.id !== res.locals.user.id) {
    return next(new AppError("There is no Project with that name.", 404));
  }

  res.status(200).render("projectSettings", {
    title: "settings",
    role: project.admin.id === res.locals.user.id ? "admin" : "member",
    name: project.name,
    id: project._id,
    project,
  });
});
