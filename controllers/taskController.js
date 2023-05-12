const Task = require("../models/taskModel");
//const catchAsync = require("./../utils/catchAsync.js");
const factory = require("./handlerFactory.js");

exports.setProjectUserId = (req, res, next) => {
  if (!req.body.project) req.body.project = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllTask = factory.getAll(Task);

exports.getTask = factory.getOne(Task);

exports.createTask = factory.createOne(Task);

exports.updateTask = factory.updateOne(Task);

exports.deleteTask = factory.deleteOne(Task);
