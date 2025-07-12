import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Edit, Trash2, CheckCircle, Circle } from "lucide-react";
import Speaker from "./Speaker";

export default function TodoCard({
  todo,
  handleEdit,
  handleDelete,
  handleToggleComplete,
  loading,
}) {
  return (
    <Card className="w-full max-w-sm sm:max-w-md lg:max-w-none mx-auto">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
        <div className="flex-1 mb-2 sm:mb-0">
          <CardTitle
            className={`text-xl font-bold ${
              todo.isCompleted ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {todo.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Created: {new Date(todo.createdAt).toLocaleDateString()}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleToggleComplete(todo._id, todo.isCompleted)}
            disabled={loading}
            className="text-gray-600 hover:text-green-600"
            title={todo.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
          >
            {todo.isCompleted ? (
              <CheckCircle size={20} className="text-green-500" />
            ) : (
              <Circle size={20} />
            )}
          </Button>
          <Speaker text={`${todo.title}. ${todo.description}`} />
        </div>
      </CardHeader>
      <CardContent className="text-base text-gray-700 leading-relaxed">
        {todo.description}
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(todo)}
          disabled={loading}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Edit size={16} className="mr-1" /> Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(todo._id)}
          disabled={loading}
          className="text-white bg-red-600 hover:bg-red-700"
        >
          <Trash2 size={16} className="mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
