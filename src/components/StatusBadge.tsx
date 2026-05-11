import type { TaskStatus } from '../types/task';

interface StatusBadgeProps {
  status: TaskStatus;
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em andamento',
  DONE: 'Concluída',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status.toLowerCase()}`}>{STATUS_LABEL[status]}</span>;
}
