import React, { useContext, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";

const TaskForm = () => {
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
        const response = await fetch("http://localhost:5000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          setTitle("");
          setDescription("");
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
        className="flex flex-col max-w-lg mx-auto space-y-2 border p-2"
      >
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn" type="submit">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
