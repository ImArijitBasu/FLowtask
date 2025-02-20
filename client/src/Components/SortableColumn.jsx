import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";

const SortableColumn = ({ id, title, tasks ,refetchTasks }) => {
  return (
    <div className="w-full p-4 border rounded-lg bg-blue-900/30">
      <h2 className="text-xl font-semibold mb-4 text-white ">{title}</h2>
      <SortableContext
        items={tasks.length > 0 ? tasks.map((task) => task.id) : [id]} 
        strategy={verticalListSortingStrategy}
      >
        <div>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <SortableTask refetchTasks={refetchTasks} key={task.id} task={task} containerId={id} />
            ))
          ) : (
            <div className="text-center text-blue-900">No tasks in this column.</div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortableColumn;
