const mongoose = require("mongoose");
const Project = require("./projectModel");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "task can not be empty"],
      maxlength: 15,
    },
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      dafault: Date.now(),
    },
    dueDate: {
      type: Date,
      required: [true, "task most have a dueDate"],
    },
    difficult: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
      required: [true, "task most have a difficult"],
    },
    status: {
      type: String,
      enum: ["Review", "Progress", "Completed", "Deferred"],
      default: "Review",
      required: [true, "task most have a status"],
    },
    notes: String,
    project: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
      require: [true, "Task must belong to a project."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "task must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

/*taskSchema.statics.completedTasks = async function (projectId) {
  const stats = await this.aggregate([
    {
      $match: { project: projectId },
    },
    {
      $group: {
        _id: "$status",
        total: { $sum: 1 },
      },
    },
  ]);
  console.log(stats);

  let obj = {
    taskInReview: 0,
    taskInProgress: 0,
    taskCompleted: 0,
  };
  stats.forEach((el) => {
    if (el._id === "review") obj.taskInReview = el.total;
    if (el._id === "progress") obj.taskInProgress = el.total;
    if (el._id === "completed") obj.taskCompleted = el.total;
  });

  await Project.findByIdAndUpdate(projectId, obj);
};

taskSchema.post("save", function () {
  this.constructor.completedTasks(this.project);
});

taskSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  next();
});

taskSchema.post(/^findOneAnd/, async function () {
  console.log(this.r.project)
  await this.r.constructor.completedTasks(this.r.project)
}); */

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
