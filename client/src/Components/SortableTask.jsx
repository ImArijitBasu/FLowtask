import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableTask = ({ task, containerId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      containerId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 mb-2 rounded-lg shadow-md cursor-grab"
    >
      <h3 className="font-semibold">{task.title}</h3>
      <p>{task.description}</p>
    </div>
  );
};

export default SortableTask;