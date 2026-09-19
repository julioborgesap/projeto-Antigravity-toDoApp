# Todo Dashboard

## Visão Geral
Um aplicativo de gerenciamento de tarefas ("to-dos") com um painel de controle (dashboard) visualmente atraente. O foco é fornecer uma visão geral clara da produtividade (tarefas totais, concluídas hoje, atrasadas) junto com recursos robustos de organização (categorias, prioridades, tags e datas limite).

## Project Type
WEB

## Critérios de Sucesso
- Autenticação de usuário funcional.
- CRUD completo de tarefas com atributos: título, descrição, data limite, prioridade (urgente, média, baixa).
- Sistema de categorização (trabalho, casa, estudos).
- Sistema de tags/etiquetas.
- Dashboard dinâmico mostrando métricas (total, concluídas hoje, atrasadas).
- Interface de usuário bonita, limpa e moderna (design premium com React).

## Stack Tecnológica (A Definir - Ver Socratic Gate)
O usuário solicitou "React com Express no backend, conectar banco SQLite", mas também pediu "use python". 

**Opção Recomendada (React + FastAPI + SQLite):**
- **Frontend:** React (Vite) + TailwindCSS para o design bonito.
- **Backend:** Python (FastAPI). FastAPI é excelente, rápido e atende ao requisito "use python".
- **Database:** SQLite (SQLAlchemy ou SQLModel).

## Estrutura de Arquivos (Proposta)
```text
/
├── frontend/             # React (Vite)
│   ├── src/
│   │   ├── components/   # UI components (Dashboard, TodoItem, etc)
│   │   ├── pages/        # Telas (Login, Dashboard)
│   │   └── services/     # API Client
├── backend/              # Python (FastAPI) ou Express (Node)
│   ├── main.py           # Entry point
│   ├── models/           # DB Models (SQLite)
│   ├── routes/           # Endpoints
│   └── database.py       # Conexão SQLite
└── todo-dashboard.md     # Este plano
```

## Task Breakdown

### Fase 1: Setup e Fundação (Backend)
- `[ ]` **TASK-1.1:** Inicializar projeto backend e configurar banco SQLite. (Agent: `backend-specialist`) - INPUT: Decisão da stack -> OUTPUT: BD configurado -> VERIFY: Script de teste conecta no DB.
- `[ ]` **TASK-1.2:** Criar tabelas/modelos (Users, Tasks, Categories, Tags). (Agent: `database-architect`) - INPUT: Schema -> OUTPUT: Tabelas criadas -> VERIFY: Queries de inserção funcionam.

### Fase 2: Desenvolvimento da API
- `[ ]` **TASK-2.1:** Endpoint de Autenticação (Login/Registro). (Agent: `backend-specialist`)
- `[ ]` **TASK-2.2:** Endpoints de Tarefas (CRUD). (Agent: `backend-specialist`)
- `[ ]` **TASK-2.3:** Endpoint do Dashboard (Agregação de métricas). (Agent: `backend-specialist`)

### Fase 3: Frontend - UI e Design
- `[ ]` **TASK-3.1:** Setup React (Vite) com Tailwind e roteamento. (Agent: `frontend-specialist`)
- `[ ]` **TASK-3.2:** Criar tela de Login e integração com auth. (Agent: `frontend-specialist`)
- `[ ]` **TASK-3.3:** Criar tela inicial (Dashboard) bonita e dinâmica. (Agent: `frontend-specialist`)
- `[ ]` **TASK-3.4:** Criar formulário de nova tarefa, listagem e filtros. (Agent: `frontend-specialist`)

## Phase X: Verificação Final
- [ ] Segurança: Testar JWT/Auth.
- [ ] UI/UX: Validar contrastes e layout responsivo.
- [ ] Build: `npm run build` do frontend sem erros.
- [ ] E2E: O fluxo completo de login -> criar tarefa -> ver dashboard funciona perfeitamente.
