"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, LogOut, Edit, Trash2 } from "lucide-react";
import MicInput from "@/components/MicInput";
import Speaker from "@/components/Speaker";
import { useRouter } from "next/navigation";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // State for success messages
  const router = useRouter();

  // Effect to clear messages after a few seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // Message disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Check auth and fetch todos on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchTodos(token);
    // eslint-disable-next-line
  }, []);

  const fetchTodos = async (token) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to fetch todos");
      setTodos(data.todos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMicResult = (text, fieldName) => {
    setForm((f) => ({ ...f, [fieldName]: text }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to add todo");
      setTodos([...todos, data.todo]);
      setForm({ title: "", description: "" });
      setMessage("Todo successfully added!"); // Success message
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setForm({ title: todo.title, description: todo.description });
    setMessage(""); // Clear message on edit start
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/todos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: editingId, ...form }),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to update todo");
      setTodos(
        todos.map((todo) => (todo._id === editingId ? data.todo : todo))
      );
      setEditingId(null);
      setForm({ title: "", description: "" });
      setMessage("Todo successfully edited!"); // Success message
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id, isCompleted) => {
    setLoading(true);
    setError("");
    setMessage(""); // Clear message on toggle start
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/todos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, isCompleted: !isCompleted }),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to update todo status");
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: !isCompleted } : todo
        )
      );
      setMessage("Todo status updated successfully!"); // Success message for toggle
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    setMessage(""); // Clear message on delete start
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/todos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to delete todo");
      setTodos(todos.filter((todo) => todo._id !== id));
      setMessage("Todo successfully deleted!"); // Success message
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto bg-gray-50 p-4 sm:p-8 rounded-xl shadow-lg space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 text-center sm:text-left">
            Todo Dashboard
          </h2>
          {/* The following div contains the Sign Out button and will be removed */}
          {/*
          <div className="flex-shrink-0">
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 bg-white text-gray-900 rounded-md shadow-sm hover:bg-gray-100 transition duration-200 text-sm font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
          */}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}

        <form
          onSubmit={editingId ? handleUpdate : handleAdd}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-grow w-full">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter todo title..."
                  className="flex-grow block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <MicInput onResult={(text) => handleMicResult(text, "title")} />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <Input
                type="text"
                name="description"
                id="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter todo description..."
                className="flex-grow block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <MicInput
                onResult={(text) => handleMicResult(text, "description")}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-sm"
            disabled={loading}
          >
            <Plus className="mr-2 h-5 w-5" />
            {editingId ? "Update Todo" : "Add Todo"}
          </Button>
        </form>

        <div className="space-y-4">
          {loading && <p className="text-center">Loading todos...</p>}
          {!loading && todos.length === 0 && (
            <p className="text-center text-gray-500">No todos yet.</p>
          )}
          {todos.map((todo) => (
            <Card
              key={todo._id}
              className="flex items-center justify-between p-4 shadow-md rounded-lg"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() =>
                    handleToggleComplete(todo._id, todo.isCompleted)
                  }
                  className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                />
                <div className="ml-3">
                  <h3
                    className={`text-lg font-semibold ${
                      todo.isCompleted ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <p
                    className={`text-sm text-gray-600 ${
                      todo.isCompleted ? "line-through" : ""
                    }`}
                  >
                    {todo.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(todo.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Speaker text={todo.title + ". " + todo.description} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(todo)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Edit className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(todo._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
