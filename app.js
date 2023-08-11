const hpp = require("hpp");
const path = require("path");
const xss = require("xss-clean");
const helmet = require("helmet");
const express = require("express");
const AppError = require("./utils/appError");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRouter");
const viewRouter = require("./routes/viewRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const projectRouter = require("./routes/projectsRoutes");
const globalErrorHandler = require("./controllers/errorController");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(hpp({ whitelist: ["duration"] }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

app.use("/", viewRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
