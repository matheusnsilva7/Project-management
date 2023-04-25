const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Project must have a name"],
    unique: true,
    trim: true,
    maxlength: [25, "A tour name must have less or equal then 25 characters"],
    minlength: [3, "A tour name must have more or equal then 3 characters"],
  },
  dueDate: {
    type: String,
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
  admin: [String],
  secretProject: {
    type: Boolean,
    default: false,
  },
});

projectSchema.pre(/^find/, function (next) {
  this.find({ secretProject: { $ne: true } });
  this.start = Date.now();
  next();
});

projectSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
