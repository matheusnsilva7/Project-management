const Project = require("../models/projectModel.js");
const User = require("./../models/userModel");
const factory = require("./handlerFactory.js");

exports.setAdminMembers = (req, res, next) => {
  if (!req.body.admin) req.body.admin = req.user.id;
  if (!req.body.members) req.body.members = [];
  next();
};

exports.getAllProjects = factory.getAll(Project);

exports.getProject = factory.getOne(Project, { path: "task" });

exports.createProject = factory.createOne(Project);

exports.updateProject = factory.updateOne(Project);

exports.deleteProject = factory.deleteOne(Project);
