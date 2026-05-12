import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import TaskItem from "../../components/TaskItem/TaskItem";
import TaskForm from "../../components/TaskForm/TaskForm";
import type {
  Task,
  TaskStatus,
  Priority,
  TaskRequest,
} from "../../types/types";
import "./TasksPage.css";

type FilterValue = TaskStatus | Priority | "ALL";

const DAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function getTodayLabel() {
  const now = new Date();
  return `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`;
}

function getAvatarLetters(): string {
  const email = localStorage.getItem("user_email") || "";
  if (!email) return "TF";
  return email.slice(0, 2).toUpperCase();
}

export default function TasksPage() {
  const navigate = useNavigate();
  const { tasks, loading, error, addTask, editTask, removeTask, toggleStatus } =
    useTasks();

  const [activeFilter, setActiveFilter] = useState<FilterValue>("ALL");
  const [search, setSearch] = useState("");
  const [sortByDue, setSortByDue] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const displayed = useMemo(() => {
    let list = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q),
      );
    }

    if (activeFilter !== "ALL") {
      list = list.filter(
        (t) => t.status === activeFilter || t.priority === activeFilter,
      );
    }

    if (sortByDue) {
      list.sort((a, b) => {
        const da = a.dueDate ?? "9999-12-31";
        const db = b.dueDate ?? "9999-12-31";
        return da.localeCompare(db);
      });
    }

    return list;
  }, [tasks, search, activeFilter, sortByDue]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditing(task);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: TaskRequest) => {
    if (editing) await editTask(editing.id, data);
    else await addTask(data);
    closeModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    navigate("/");
  };

  const STAT_FILTERS: {
    label: string;
    filter: FilterValue;
    count: number;
    cls: string;
  }[] = [
    { label: "Total", filter: "ALL", count: total, cls: "s-all" },
    { label: "Pendentes", filter: "PENDING", count: pending, cls: "s-pend" },
    {
      label: "Em progresso",
      filter: "IN_PROGRESS",
      count: inProgress,
      cls: "s-prog",
    },
    { label: "Concluídas", filter: "DONE", count: done, cls: "s-done" },
  ];

  const PILLS: { label: string; filter: FilterValue }[] = [
    { label: "Todas", filter: "ALL" },
    { label: "Pendentes", filter: "PENDING" },
    { label: "Em progresso", filter: "IN_PROGRESS" },
    { label: "Concluídas", filter: "DONE" },
    { label: "Alta", filter: "HIGH" },
    { label: "Média", filter: "MEDIUM" },
    { label: "Baixa", filter: "LOW" },
  ];

  return (
    <div className="tf-page">
      <header className="topbar">
        <div className="logo">
          <div className="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <span>TO-DO-LIST</span>
        </div>
        <div className="topbar-right">
          <span className="today-label">{getTodayLabel()}</span>
          <div className="avatar" title="Sair" onClick={handleLogout}>
            {getAvatarLetters()}
          </div>
        </div>
      </header>

     
      <div className="tf-content">
        <div className="page-header">
          <div>
            <h1>Minhas Tarefas</h1>
            <p className="page-header__sub">Organize, priorize e entregue.</p>
          </div>
          <button className="btn-new" onClick={openCreate}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova Tarefa
          </button>
        </div>

        
        <div className="stats">
          {STAT_FILTERS.map((s) => (
            <div
              key={s.filter}
              className={`stat-card ${s.cls}${activeFilter === s.filter ? " stat-card--active" : ""}`}
              onClick={() => setActiveFilter(s.filter)}
            >
              <div className="stat-card__label">{s.label}</div>
              <div className="stat-card__value">{s.count}</div>
              <div className="stat-card__sub">tarefas</div>
            </div>
          ))}
        </div>

       
        <div className="progress-row">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-pct">{pct}%</span>
        </div>

       
        <div className="controls">
          <div className="search-wrap">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar tarefas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className={`sort-btn${sortByDue ? " sort-btn--active" : ""}`}
            onClick={() => setSortByDue((v) => !v)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="18" x2="9" y2="18" />
            </svg>
            Prazo
          </button>
        </div>

      
        <div className="pills">
          {PILLS.map((p) => (
            <button
              key={p.filter}
              className={`pill${activeFilter === p.filter ? " pill--active" : ""}`}
              onClick={() => setActiveFilter(p.filter)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading && <p className="tf-state">Carregando...</p>}
        {error && <p className="tf-state tf-state--error">{error}</p>}

        {!loading && !error && displayed.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <h3>Nenhuma tarefa encontrada</h3>
            <p>Crie uma nova tarefa ou ajuste os filtros</p>
          </div>
        )}

        {!loading && !error && displayed.length > 0 && (
          <div className="task-list">
            {displayed.map((task, i) => (
              <TaskItem
                key={task.id}
                task={task}
                index={i}
                onEdit={openEdit}
                onDelete={(id) => setDeleteConfirm(id)}
                onToggle={toggleStatus}
              />
            ))}
          </div>
        )}
      </div>

    
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "Editar Tarefa" : "Nova Tarefa"}</h2>
              <button
                className="close-btn"
                onClick={closeModal}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            <TaskForm
              initial={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

     
      {deleteConfirm !== null && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Excluir tarefa</h2>
            </div>
            <p className="modal-body">
              Tem certeza? Esta ação não pode ser desfeita.
            </p>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancelar
              </button>
              <button
                className="btn-save btn-save--danger"
                onClick={async () => {
                  await removeTask(deleteConfirm);
                  setDeleteConfirm(null);
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
