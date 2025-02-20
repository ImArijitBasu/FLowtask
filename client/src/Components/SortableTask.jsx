import React, { useState, useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";

const SortableTask = ({ task, containerId, refetchTasks }) => {
  const { user } = useContext(AuthContext);
  const email = user?.email;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
    data: {
      type: "task",
      containerId,
    },
    disabled: isEditing, 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    userSelect: isEditing ? "text" : "none", 
    cursor: isEditing ? "default" : "grab",  
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://flowtask-liart.vercel.app/tasks/${task.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          refetchTasks();
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        } else {
          Swal.fire("Failed to delete task", "", "error");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        Swal.fire("Error deleting task", "", "error");
      }
    }
  };

  const handleEdit = async () => {
    const updatedTask = {
      ...task,
      title: editedTitle,
      description: editedDescription,
      userEmail : email,
    };

    try {
      const response = await fetch(`https://flowtask-liart.vercel.app/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        refetchTasks();
        setIsEditing(false);
        Swal.fire("Task updated!", "Your task has been updated.", "success");
      } else {
        Swal.fire("Failed to update task", "", "error");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire("Error updating task", "", "error");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white touch-none p-4 mb-2 overflow-auto rounded-lg shadow-md"
    >
      <div className="" {...attributes} {...listeners}>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="p-2 mb-2 w-full"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="p-2 w-full"
            />
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-blue-900 cursor-grab">{task.title}</h3>
            <p>{task.description}</p>
          </div>
        )}
      </div>

      <div className="mt-2 flex gap-2">
        {isEditing ? (
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-blue-900 text-white rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-900 text-white rounded"
          >
            Edit
          </button>
        )}

        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-orange-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SortableTask;