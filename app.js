require("dotenv").config();
const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const bodyParser = require("body-parser")
const { PORT } = process.env
const sequelize = require("./db/conenction");
const users = require("./router/index")
const admin = require("./router/Admin")

console.log({
  USER_NAME: process.env.USER_NAME,
  PASSWORD: process.env.PASSWORD ? process.env.PASSWORD : "Missing",
  DATABASE: process.env.DATABASE,
  HOST: process.env.HOST,
  DB_DIALECT: process.env.DB_DIALECT
});

// app.use(cors({
//     origin: ["http://localhost:5173", "https://parakshtach.com"],
//     credentials: true
// }))

app.use(cors({
    origin: ["http://localhost:5173", "https://parakshtach.com","https://www.parakshtach.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

sequelize.sync()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


app.use("/api/v1/users", users.roleRoutes);
app.use("/api/v1/users", users.userRouters);


app.use("/api/v1/admin", admin.Category)
app.use("/api/v1/admin", admin.SubCategory)
app.use("/api/v1/admin", admin.Inventories)
app.use("/api/v1/admin", admin.Events)
app.use("/api/v1/admin", admin.WareHouse)
app.use("/api/v1/admin", admin.VehicleType)
app.use("/api/v1/admin", admin.Vehicle)
app.use("/api/v1/admin", admin.TeamAssign)
app.use("/api/v1/admin", admin.Companies)
app.use("/api/v1/admin", admin.EventPayHistory)
app.use("/api/v1/admin", admin.AgentOwner)
app.use("/api/v1/admin", admin.VehicleMovementRoutes)





http.createServer(app).listen(PORT, (req, res) => {
    console.log("Server is running on " + PORT);

})
