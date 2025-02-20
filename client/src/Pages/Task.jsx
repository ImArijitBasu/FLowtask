import { useState, useEffect, useContext } from "react";
import TaskForm from "../Components/TaskForm";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AuthContext } from "../Provider/AuthProvider";
import SortableColumn from "../Components/SortableColumn";

const Task = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/tasks/${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          const tasksByCategory = { todo: [], inProgress: [], done: [] };

          data.tasks.forEach((task) => {
            if (task.category === "todo") {
              tasksByCategory.todo.push(task);
            } else if (task.category === "inProgress") {
              tasksByCategory.inProgress.push(task);
            } else if (task.category === "done") {
              tasksByCategory.done.push(task);
            }
          });

          setTasks(tasksByCategory);
        })
        .catch((error) => console.log("Error fetching tasks:", error));
    }
  }, [user?.email]);


  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const sourceCategory = active.data.current.containerId;
    const destinationCategory = over.data.current.containerId;

    if (sourceCategory !== destinationCategory) {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        const taskIndex = updatedTasks[sourceCategory].findIndex(
          (t) => t.id === active.id
        );

        if (taskIndex !== -1) {
          const movedTask = { ...updatedTasks[sourceCategory][taskIndex], category: destinationCategory };

          updatedTasks[sourceCategory] = updatedTasks[sourceCategory].filter(
            (task) => task.id !== active.id
          );

          updatedTasks[destinationCategory] = [
            ...updatedTasks[destinationCategory],
            movedTask,
          ];

          fetch(`http://localhost:5000/tasks/${movedTask.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userEmail: user.email,
              title: movedTask.title,
              description: movedTask.description,
              category: movedTask.category,
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log("Task updated:", data))
            .catch((err) => console.error("Error updating task:", err));

          return updatedTasks;
        }
        return prevTasks;
      });
    }
  };

  const addDummyTaskIfEmpty = (category) => {
    if (tasks[category].length === 0) {
      return [{ id: `dummy-${category}`, title: "Drag a task here", description: "", category, isDummy: true }];
    }
    return tasks[category];
  };

  return (
    <div className="flex justify-around flex-col">
      <TaskForm />
      <div className="flex container mx-auto my-10 gap-2">
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          {/* To-Do */}
          <SortableContext
            id="todo"
            items={addDummyTaskIfEmpty("todo").map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <SortableColumn id="todo" title="To-Do" tasks={addDummyTaskIfEmpty("todo")} />
          </SortableContext>

          {/* In Progress */}
          <SortableContext
            id="inProgress"
            items={addDummyTaskIfEmpty("inProgress").map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <SortableColumn id="inProgress" title="In Progress" tasks={addDummyTaskIfEmpty("inProgress")} />
          </SortableContext>

          {/* Done */}
          <SortableContext
            id="done"
            items={addDummyTaskIfEmpty("done").map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <SortableColumn id="done" title="Done" tasks={addDummyTaskIfEmpty("done")} />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Task;