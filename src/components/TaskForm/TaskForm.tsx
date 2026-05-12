import { useState } from "react";
import type { Task, TaskRequest } from "../../types/types";
import "./TaskForm.css";

interface TaskFormProps {
  initial?: Task;
  onSubmit: (data: TaskRequest) => Promise<void>;
  onCancel: () => void;
}

function toFormValues(initial?: Task): TaskRequest {
  if (initial) {
    return {
      title: initial.title,
      description: initial.description ?? "",
      status: initial.status,
      priority: initial.priority,
      dueDate: initial.dueDate ?? "",
    };
  }
  return {
    title: "",
    description: "",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: "",
  };
}

export default function TaskForm({
  initial,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [form, setForm] = useState<TaskRequest>(() => toFormValues(initial));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("O título é obrigatório.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: TaskRequest = {
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
      };
      await onSubmit(payload);
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__field">
        <label htmlFor="title" className="task-form__label">
          Título *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="task-form__input"
          value={form.title}
          onChange={handleChange}
          placeholder="Nome da tarefa"
          maxLength={255}
          autoFocus
        />
      </div>

      <div className="task-form__field">
        <label htmlFor="description" className="task-form__label">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          className="task-form__textarea"
          value={form.description}
          onChange={handleChange}
          placeholder="Detalhes da tarefa..."
          rows={3}
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__field">
          <label htmlFor="status" className="task-form__label">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="task-form__select"
            value={form.status}
            onChange={handleChange}
          >
            <option value="PENDING">Pendente</option>
            <option value="IN_PROGRESS">Em progresso</option>
            <option value="DONE">Concluída</option>
          </select>
        </div>

        <div className="task-form__field">
          <label htmlFor="priority" className="task-form__label">
            Prioridade
          </label>
          <select
            id="priority"
            name="priority"
            className="task-form__select"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>
      </div>

      <div className="task-form__field">
        <label htmlFor="dueDate" className="task-form__label">
          Prazo
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          className="task-form__input"
          value={form.dueDate}
          onChange={handleChange}
        />
      </div>

      {error && <p className="task-form__error">{error}</p>}

      <div className="task-form__actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-save" disabled={submitting}>
          {submitting ? "Salvando..." : initial ? "Atualizar" : "Salvar Tarefa"}
        </button>
      </div>
    </form>
  );
}
