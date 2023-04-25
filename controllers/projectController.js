const Project = require("../models/projectModel.js");
const APIFeatures = require("./../utils/apiFeatures.js");
const catchAsync = require("./../utils/catchAsync.js");
const AppError = require("./../utils/appError.js");

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Project.find(), req.query)
    .sort()
    .limitFields()
    .paginate();
  const projects = await features.query;

  res.status(200).json({
    status: "success",
    results: projects.length,
    data: {
      projects,
    },
  });
});

exports.createProject = catchAsync(async (req, res, next) => {
  const newProject = await Project.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      project: newProject,
    },
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(200).json({
    status: "sucess",
    data: {
      project,
    },
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runvalidators: true,
  });

  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
