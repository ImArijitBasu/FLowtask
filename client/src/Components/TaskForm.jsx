import React, { useContext, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";

const TaskForm = ({ refetchTasks }) => {
  const { user } = useContext(AuthContext);
  console.log(user.email);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title) {
      const taskData = {
        email: user.email,
        title,
        description,
        category: "todo",
      };

      try {
        const response = await fetch(
          "https://flowtask-liart.vercel.app/tasks",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
          }
        );

        if (response.ok) {
          setTitle("");
          setDescription("");
          refetchTasks();
        } else {
          alert("Failed to create task!");
        }
      } catch (error) {
        console.error("Error while creating task:", error);
        alert("An error occurred!");
      }
    } else {
      alert("Title is required!");
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-blue-900/50 text-white border-none shadow-2xl container mx-auto space-y-2 border p-2 rounded-lg"
      >
        <input
          type="text"
          placeholder="Task title"
          maxLength="50"
          value={title}
          className="rounded-md border-4 border-none px-2 text-white bg-blue-900"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          maxLength="200"
          value={description}
          className="rounded-md border-4 border-none px-2 text-white bg-blue-900"
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="btn bg-blue-900 text-white hover:bg-white hover:text-blue-900 transition-all duration-200 ease-in-out"
          type="submit"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
