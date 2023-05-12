const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project must have a name"],
      unique: true,
      trim: true,
      maxlength: [25, "A tour name must have less or equal then 25 characters"],
      minlength: [3, "A tour name must have more or equal then 3 characters"],
    },
    photo: String,
    dueDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    admin: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    secretProject: {
      type: Boolean,
      default: false,
    },
    /*taskInReview:{
      type:Number,
      default: 0 
    },
    taskInProgress:{
      type:Number,
      default: 0 
    },
    taskCompleted:{
      type:Number,
      default: 0 
    } */
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.virtual("task", {
  ref: "Task",
  foreignField: "project",
  localField: "_id",
});

projectSchema.pre(/^find/, function (next) {
  this.find({ secretProject: { $ne: true } });
  this.start = Date.now();
  next();
});

projectSchema.pre(/^find/, function (next) {
  this.populate({
    path: "members admin",
    select: "-__v -passwordResetExpires -passwordResetToken -passwordChangedAt",
  });
  next();
});

projectSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
