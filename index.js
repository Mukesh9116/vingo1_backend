// import express from "express"
// import dotenv from "dotenv"
// dotenv.config()
// import connectDb from "./config/db.js"
// import cookieParser from "cookie-parser"
// import authRouter from "./routes/auth.routes.js"
// import cors from "cors"
// import userRouter from "./routes/user.routes.js"

// import itemRouter from "./routes/item.routes.js"
// import shopRouter from "./routes/shop.routes.js"
// import orderRouter from "./routes/order.routes.js"
// import http from "http"
// import { Server } from "socket.io"
// import { socketHandler } from "./socket.js"

// const app=express()
// const server=http.createServer(app)

// const io=new Server(server,{
//    cors:{
//     origin:"https://vingo1.onrender.com",
//     credentials:true,
//     methods:['POST','GET']
// }
// })

// app.set("io",io)

// const port=process.env.PORT || 5000
// app.use(cors({
//     origin:"https://vingo1.onrender.com",
//     credentials:true
// }))
// app.use(express.json())
// app.use(cookieParser())
// app.use("/api/auth",authRouter)
// app.use("/api/user",userRouter)
// app.use("/api/shop",shopRouter)
// app.use("/api/item",itemRouter)
// app.use("/api/order",orderRouter)

// socketHandler(io)
// server.listen(port,()=>{
//     connectDb()
//     console.log(`server started at ${port}`)
// })


import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

dotenv.config();

const app = express();

/* ------------------- ALLOWED ORIGINS ------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://vingo1.onrender.com"
];

/* ------------------- MIDDLEWARE ------------------- */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* ------------------- TEST ROUTE ------------------- */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ------------------- DATABASE ------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

/* ------------------- SERVER ------------------- */
const server = http.createServer(app);

/* ------------------- SOCKET.IO ------------------- */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

/* ------------------- START SERVER ------------------- */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


