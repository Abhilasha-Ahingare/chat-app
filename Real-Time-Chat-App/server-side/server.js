// server.js ya app.js

require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const express = require("express");
const authRouter = require("./router/authRouter");
const contactRouter = require("./router/contactRouter");
const GetMessage = require("./router/messageRouter");
const ChannelRouter = require("./router/ChannelRouter");
const { SetupSocket } = require("./socketio");

const app = express();

app.use(
  cors({
    // origin: [process.env.ORIGIN],
    origin: [
      "http://localhost:5173", // Your local development

      "https://talk-buddy.vercel.app/login", // Your Vercel frontend

      " https://chat-app-backend-7vb2.onrender.com", // Your Render backend (if needed)
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/user", GetMessage);
app.use("/api/channel", ChannelRouter);

const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;

// ... (your previous setup)

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("✅ MongoDB connected");
    const server = app.listen(port, () =>
      console.log("🚀 Server running on port", port)
    );

    SetupSocket(server);
  })
  .catch((err) => console.log("❌ MongoDB Error:", err.message));
