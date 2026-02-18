const express = require("express");
const { PORT } = require("./config/variables/variables");
const app = express();
const cors = require("cors");
const http = require("http");

const dbConnect = require("./config/database/dbConnect");
const signUpRoute = require("./routes/userRoutes/userSignUpRoute");
const userAuthRoutes = require("./routes/userRoutes/userAuthRoute");
const adminAuthRoutes = require("./routes/adminRoutes/adminRoutes");
const initializeSocket = require("./utils/socketConnection"); // ✅ your socket handler


const port = PORT || 3001;
const server = http.createServer(app);

// ✅ Initialize Socket.IO
initializeSocket(server);

app.set("trust proxy", true);
dbConnect();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://agape-vows-matrimony-final.vercel.app",
  "https://agape-vows-matrimony-final-2v1i.vercel.app"

 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS error: Origin ${origin} is not allowed`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Your routes
app.use("/user", signUpRoute);
app.use("/user-auth", userAuthRoutes);
app.use("/admin", adminAuthRoutes);


app.disable("x-powered-by");

server.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
