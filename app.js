const hpp = require("hpp");
const xss = require("xss-clean");
const helmet = require("helmet");
const express = require("express");
const AppError = require("./utils/appError");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routes/userRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const projectRouter = require("./routes/projectsRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xss());

app.use(hpp({ whitelist: ["duration"] }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/users", userRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
