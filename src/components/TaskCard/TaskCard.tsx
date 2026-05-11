import type { Task, Priority } from '../../types/task';
import StatusBadge from '../StatusBadge';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggle: (task: Task) => void;
}

const PRIORITY_LABEL: Record<Priority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
};

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  const formattedDue = formatDate(task.dueDate);

  return (
    <div className={`task-card task-card--${task.status.toLowerCase()}`}>
      <div className="task-card__header">
        <div className="task-card__badges">
          <StatusBadge status={task.status} />
          <span className={`priority-badge priority-badge--${task.priority.toLowerCase()}`}>
            {PRIORITY_LABEL[task.priority]}
          </span>
        </div>
        <div className="task-card__actions">
          <button
            className="task-card__btn task-card__btn--toggle"
            onClick={() => onToggle(task)}
            title="Avançar status"
            aria-label="Avançar status"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </button>
          <button
            className="task-card__btn task-card__btn--edit"
            onClick={() => onEdit(task)}
            title="Editar"
            aria-label="Editar tarefa"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="task-card__btn task-card__btn--delete"
            onClick={() => onDelete(task.id)}
            title="Excluir"
            aria-label="Excluir tarefa"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="task-card__title">{task.title}</h3>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      {formattedDue && (
        <div className="task-card__due">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formattedDue}</span>
        </div>
      )}
    </div>
  );
}
