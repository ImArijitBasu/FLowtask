import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";

const SortableColumn = ({ id, title, tasks }) => {
  return (
    <div className="w-1/3 p-4 border rounded-lg bg-gray-100">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <SortableContext
        items={tasks.length > 0 ? tasks.map((task) => task.id) : [id]} 
        strategy={verticalListSortingStrategy}
      >
        <div>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <SortableTask key={task.id} task={task} containerId={id} />
            ))
          ) : (
            <div className="text-center text-gray-500">No tasks in this column.</div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortableColumn;
