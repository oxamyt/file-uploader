const express = require("express");
const path = require("path");
const passport = require("passport");
require("dotenv").config();
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const indexRouter = require("./routes/indexRouter");
const fileRouter = require("./routes/fileRouter");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/", indexRouter);
app.use("/files", fileRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
