require("dotenv").config();
const PORT = process.env.PORT || 5000;
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./util/db");
const errorHandler = require("./middleware/error");
const log = require("./middleware/log");
const isLoggedIn = require("./middleware/isLoggedIn");
const apiRoutes = require("./routes/api");
const pagesRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");
const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use("/static", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Log every request.
app.use(log);
// Check if user is logged in for every request.
app.use(isLoggedIn);
app.use("/", pagesRoutes);
app.use("/api/", apiRoutes);
app.use("/api/auth/", authRoutes);

// Handler for any undefined routes.
app.use((req, res, next) => {
    res.render("pages/notFound", {
        logged_in: req.decodedToken,
        is_admin: req.decodedToken.is_admin
    });
});

// Handler for standardizing error format.
app.use(errorHandler);

let time = new Date().toLocaleTimeString();
db.connect(
    (process.env.APP_STATE === "dev" ? db.MODE_DEV : db.MODE_PROD),
    () => {
        console.log(time, "Connected to Postgres");
        app.listen(PORT, () => {
            console.log(time, `Started in ${process.env.APP_STATE === "dev" ? "dev" : "prod"} mode`)
            console.log(time, `Council app is listening on port ${PORT}, http://localhost:${PORT}/`);
        });
    }
);
