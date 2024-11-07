import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import http from 'http';  // Import the http module
import path from 'path';  // Import the path module

const app = express();

// CORS configuration (update it if deploying to a different domain)
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Get the frontend URL from env or fallback to localhost
  credentials: true,  // Allow cookies to be sent with requests
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Static file serving (serve React build folder)
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'build');
  app.use(express.static(buildPath));  // Serve static files from the 'build' folder
}

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Catch-all route to serve React app in production
// If no API route is matched, serve the index.html from the React build
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware (optional, but a good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Create HTTP server using the 'http' module
const server = http.createServer(app);

// Start the server on the port defined in environment variables (defaults to 8080)
const port = process.env.PORT || 8080;  // Use the PORT env variable or default to 8080
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
