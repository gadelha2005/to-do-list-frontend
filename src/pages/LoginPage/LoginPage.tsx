import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login, register } from "../../api/authApi";
import "./LoginPage.css";

type Mode = "login" | "register";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
  };

  const switchMode = (m: Mode) => {
    reset();
    setMode(m);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { token } = await login({ email, password });
        localStorage.setItem("token", token);
        localStorage.setItem("user_email", email);
        navigate("/tasks");
      } else {
        if (name.trim().length < 2) {
          setError("O nome deve ter pelo menos 2 caracteres.");
          return;
        }
        const { token } = await register({
          name: name.trim(),
          email,
          password,
        });
        localStorage.setItem("token", token);
        localStorage.setItem("user_email", email);
        navigate("/tasks");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409)
          setError("Este e-mail já está cadastrado.");
        else if (err.response?.status === 401)
          setError("E-mail ou senha inválidos.");
        else
          setError(
            (err.response?.data as { message?: string })?.message ??
              "Ocorreu um erro. Tente novamente.",
          );
      } else {
        setError("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo__icon">
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
          <span className="auth-logo__name">TO-DO-LIST</span>
        </div>

        <h1 className="auth-card__title">
          {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
        </h1>
        <p className="auth-card__subtitle">
          {mode === "login"
            ? "Entre e gerencie suas tarefas."
            : "Comece a organizar seu trabalho."}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab${mode === "login" ? " auth-tab--active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-tab${mode === "register" ? " auth-tab--active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Cadastrar
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "register" ? "Mínimo 6 caracteres" : "••••••••"
              }
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={mode === "register" ? 6 : undefined}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? "Aguarde..."
              : mode === "login"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

        <p className="auth-footer">
          {mode === "login" ? (
            <>
              Não tem conta?{" "}
              <button
                type="button"
                className="auth-link"
                onClick={() => switchMode("register")}
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button
                type="button"
                className="auth-link"
                onClick={() => switchMode("login")}
              >
                Entrar
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
