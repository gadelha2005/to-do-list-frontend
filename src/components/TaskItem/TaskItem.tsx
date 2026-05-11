import type { Task, Priority } from "../../types/task";
import "./TaskItem.css";

interface TaskItemProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggle: (task: Task) => void;
}

const PRIORITY_LABEL: Record<Priority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export default function TaskItem({
  task,
  index,
  onEdit,
  onDelete,
  onToggle,
}: TaskItemProps) {
  const isDone = task.status === "DONE";
  const formattedDue = formatDate(task.dueDate);

  return (
    <div
      className={`task-item${isDone ? " task-item--done" : ""}`}
      style={{ animationDelay: `${index * 0.035}s` }}
      onClick={() => onEdit(task)}
    >
      {/* Checkbox */}
      <div
        className={`task-checkbox${isDone ? " task-checkbox--checked" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task);
        }}
        title={isDone ? "Marcar como pendente" : "Marcar como concluída"}
      >
        {isDone && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="task-item__content">
        <div className="task-item__title">{task.title}</div>
        <div className="task-item__meta">
          {formattedDue && (
            <span className="task-item__date">{formattedDue}</span>
          )}
          <span
            className={`badge badge--priority badge--${task.priority.toLowerCase()}`}
          >
            {PRIORITY_LABEL[task.priority]}
          </span>
          <span className="badge badge--status">
            {task.status === "PENDING"
              ? "Pendente"
              : task.status === "IN_PROGRESS"
                ? "Em progresso"
                : "Concluída"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="task-item__actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="icon-btn"
          onClick={() => onEdit(task)}
          title="Editar"
          aria-label="Editar tarefa"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className="icon-btn icon-btn--del"
          onClick={() => onDelete(task.id)}
          title="Excluir"
          aria-label="Excluir tarefa"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
