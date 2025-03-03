import { useState, useEffect, useContext } from "react";
import TaskForm from "../Components/TaskForm";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
      fetch(`https://flowtask-liart.vercel.app/tasks/${user.email}`)
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

          tasksByCategory.todo.sort((a, b) => a.order - b.order);
          tasksByCategory.inProgress.sort((a, b) => a.order - b.order);
          tasksByCategory.done.sort((a, b) => a.order - b.order);

          setTasks(tasksByCategory);
        })
        .catch((error) => console.log("Error fetching tasks:", error));
    }
  }, [user?.email]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const sourceCategory = active.data.current.containerId;
    const destinationCategory = over.data.current.containerId;
    const activeId = active.id;
    const overId = over.id;

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const taskIndex = updatedTasks[sourceCategory].findIndex(
        (t) => t.id === activeId
      );
      if (taskIndex === -1) return prevTasks;
      const movedTask = { ...updatedTasks[sourceCategory][taskIndex] };
      updatedTasks[sourceCategory] = updatedTasks[sourceCategory].filter(
        (task) => task.id !== activeId
      );
      if (sourceCategory !== destinationCategory) {
        movedTask.category = destinationCategory;
      }
      const overIndex = updatedTasks[destinationCategory].findIndex(
        (t) => t.id === overId
      );
      updatedTasks[destinationCategory] = [
        ...updatedTasks[destinationCategory].slice(0, overIndex),
        movedTask,
        ...updatedTasks[destinationCategory].slice(overIndex),
      ];
      updatedTasks[destinationCategory] = updatedTasks[destinationCategory].map(
        (task, index) => ({
          ...task,
          order: index,
        })
      );

      updatedTasks[destinationCategory].forEach((task, index) => {
        fetch(`https://flowtask-liart.vercel.app/tasks/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: user.email,
            title: task.title,
            description: task.description,
            category: task.category,
            order: index,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log("Task updated:", data))
          .catch((err) => console.error("Error updating task:", err));
      });

      return updatedTasks;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addDummyTaskIfEmpty = (category) => {
    if (tasks[category].length === 0) {
      return [
        {
          id: `dummy-${category}`,
          title: "Drag a task here",
          description: "",
          category,
          isDummy: true,
        },
      ];
    }
    return tasks[category];
  };
  const refetchTasks = () => {
    if (user?.email) {
      fetch(`https://flowtask-liart.vercel.app/tasks/${user.email}`)
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

          tasksByCategory.todo.sort((a, b) => a.order - b.order);
          tasksByCategory.inProgress.sort((a, b) => a.order - b.order);
          tasksByCategory.done.sort((a, b) => a.order - b.order);

          setTasks(tasksByCategory);
        })
        .catch((error) => console.log("Error fetching tasks:", error));
    }
  };

  return (
    <div className="flex justify-around flex-col">
      <TaskForm refetchTasks={refetchTasks} />
      <div className="flex container mx-auto my-10 gap-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* To-Do */}
            <SortableContext
              id="todo"
              items={addDummyTaskIfEmpty("todo").map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <SortableColumn
                refetchTasks={refetchTasks}
                id="todo"
                title="To-Do"
                tasks={addDummyTaskIfEmpty("todo")}
              />
            </SortableContext>

            {/* In Progress */}
            <SortableContext
              id="inProgress"
              items={addDummyTaskIfEmpty("inProgress").map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <SortableColumn
                refetchTasks={refetchTasks}
                id="inProgress"
                title="In Progress"
                tasks={addDummyTaskIfEmpty("inProgress")}
              />
            </SortableContext>

            {/* Done */}
            <SortableContext
              id="done"
              items={addDummyTaskIfEmpty("done").map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <SortableColumn
                refetchTasks={refetchTasks}
                id="done"
                title="Done"
                tasks={addDummyTaskIfEmpty("done")}
              />
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default Task;