# To-Do List — Frontend

**Aplicacao em producao:** https://to-do-list-frontend-ecru-seven.vercel.app

**Repositorio do backend:** https://github.com/gadelha2005/to-do-list-backend

---

Interface web para gerenciamento de tarefas. O usuario se cadastra ou faz login e tem acesso a um painel para criar, visualizar, editar e excluir suas tarefas com filtros por status e prioridade.

## Tecnologias

- React 18
- TypeScript
- Vite
- React Router DOM v7
- Axios
- CSS puro (sem frameworks de estilos)

## Funcionalidades

- Tela de login e cadastro com alternancia entre os modos
- Autenticacao JWT com armazenamento no localStorage
- Rotas protegidas (redireciona para login se nao autenticado)
- Listagem de tarefas com busca por texto
- Filtros por status (Pendente, Em progresso, Concluida) e por prioridade (Alta, Media, Baixa)
- Cards estatisticos com contagem por categoria
- Barra de progresso com percentual de conclusao
- Ordenacao por prazo
- Modal de criacao e edicao de tarefas
- Alternancia de status direto pelo checkbox do card
- Design responsivo com tema escuro

## Como rodar localmente

**Pre-requisitos:** Node.js 18+

1. Clone o repositorio
2. Instale as dependencias:

```bash
npm install
```

3. Crie um arquivo `.env.local` na raiz com:

```
VITE_API_URL=http://localhost:8080
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicacao abre em `http://localhost:5173`.

## Deploy

Frontend hospedado na Vercel. A variavel `VITE_API_URL` aponta para a API no Railway e e configurada nas variaveis de ambiente da plataforma.
