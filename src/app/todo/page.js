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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-50 p-6 sm:p-8 rounded-xl shadow-lg space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center sm:text-left">
            Todo Dashboard
          </h2>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="text-gray-900 hover:text-black border-gray-300 hover:border-black py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
          >
            <LogOut className="mr-2" size={20} /> Sign Out
          </Button>
        </div>

        <form
          onSubmit={editingId ? handleUpdate : handleAdd}
          className="space-y-6 mb-8 p-6 bg-white rounded-lg shadow-inner border border-gray-100"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-base font-semibold text-gray-800 mb-2"
            >
              Title
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Input
                id="title"
                name="title"
                placeholder="Enter todo title..."
                value={form.title}
                onChange={handleChange}
                required
                className="flex-grow border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-base"
              />
              <MicInput onResult={(text) => handleMicResult(text, "title")} />
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-base font-semibold text-gray-800 mb-2"
            >
              Description
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Input
                id="description"
                name="description"
                placeholder="Enter todo description..."
                value={form.description}
                onChange={handleChange}
                required
                className="flex-grow border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-base"
              />
              <MicInput
                onResult={(text) => handleMicResult(text, "description")}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full py-3 text-lg font-semibold rounded-lg shadow-md transition duration-200 transform hover:scale-[1.005] bg-gray-900 text-white hover:bg-black"
          >
            {editingId ? (
              "Update Todo"
            ) : (
              <>
                <Plus size={20} className="mr-2" /> Add Todo
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="text-red-600 text-center mb-6 p-3 bg-gray-100 rounded-lg border border-gray-300 text-base shadow-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="text-green-600 text-center mb-6 p-3 bg-green-100 rounded-lg border border-green-300 text-base shadow-sm">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-10 text-lg font-medium">
            Loading Todos...
          </div>
        ) : (
          <div className="space-y-4">
            {todos.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                <p className="mb-3 text-lg">
                  No tasks yet! Start by adding your first todo.
                </p>
                <Speaker text="No tasks yet! Start by adding your first todo." />
              </div>
            )}
            {todos.map((todo) => (
              <Card
                key={todo._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-100"
              >
                <div className="flex items-start flex-grow mb-3 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() =>
                      handleToggleComplete(todo._id, todo.isCompleted)
                    }
                    className="mr-4 mt-1 h-6 w-6 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-2 transform scale-105 transition duration-150 ease-in-out cursor-pointer"
                  />
                  <div
                    className={`flex-grow ${
                      todo.isCompleted
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }`}
                  >
                    <div className="font-semibold text-xl flex items-center mb-1">
                      {todo.title}
                      <Speaker
                        text={`${todo.title}. ${todo.description}`}
                        className="ml-2 text-gray-900 hover:text-gray-700 transition-colors duration-200"
                      />
                    </div>
                    <div className="text-gray-700 text-base leading-relaxed">
                      {todo.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Created: {new Date(todo.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(todo)}
                    className="text-gray-900 hover:bg-gray-100 hover:text-gray-700 rounded-full transition duration-200"
                  >
                    <Edit size={18} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(todo._id)}
                    className="text-gray-900 hover:bg-gray-100 hover:text-gray-700 rounded-full transition duration-200"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
