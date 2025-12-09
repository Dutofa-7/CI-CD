// IMPORTANT: Import instrument.ts at the top before any other imports
import "./instrument.js";
import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import { getAllTodos, addTodo, toggleTodo, deleteTodo } from "./todos.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Attach request handler before any other middleware
app.use(Sentry.Handlers.requestHandler());

app.use(cors());
app.use(express.json());

app.get("/api/todos", async (req, res) => {
  const todos = await getAllTodos();
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const { text } = req.body;
  const todo = await addTodo(text);
  res.json(todo);
});

app.patch("/api/todos/:id", async (req, res) => {
  const todo = await toggleTodo(req.params.id);
  res.json(todo);
});

app.delete("/api/todos/:id", async (req, res) => {
  const result = await deleteTodo(req.params.id);
  res.json(result);
});

// Test route for Sentry - intentionally throws an error
app.get("/fail", (req, res) => {
  throw new Error("This is a test error from the /fail endpoint");
});

// Attach error handler after all other middleware and routes
app.use(Sentry.Handlers.errorHandler());

// Custom error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
