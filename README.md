
# Banco Next.js (Depósito, Saque e Histórico)

Projeto em **Next.js + TypeScript + SQLite** — interface simples para depósito, saque, histórico de transações e consulta de saldo.

---

## Funcionalidades
- Depósito de valores (persistido em SQLite)
- Saque (verifica saldo antes)
- Histórico de transações (com data/hora)
- Consulta de saldo
- Interface responsiva e estilizada com Tailwind (v4 / integração automática)

---

## Tecnologias
- Next.js 13 (App Router) + TypeScript
- SQLite (arquivo local `database.sqlite`)
- TailwindCSS (v4 — via `@import "tailwindcss"` em `app/globals.css`)
- Node.js / npm

---

## Estrutura principal do projeto
```
/deposito-app
 ├─ app/
 │  ├─ api/
 │  │  ├─ deposit/route.ts
 │  │  ├─ withdraw/route.ts
 │  │  ├─ balance/route.ts
 │  │  └─ history/route.ts
 │  ├─ globals.css
 │  ├─ layout.tsx
 │  └─ page.tsx
 ├─ db.ts
 ├─ package.json
 └─ tsconfig.json
```

---

## Requisitos
- Node.js (recomendado >= 18)
- npm (recomendado >= 8)

Verifique com:
```bash
node -v
npm -v
```

---

## Instalação (passo a passo)

1. Clone / copie o projeto para sua máquina e entre na pasta:
```bash
cd banco-nextjs
```

2. Instale dependências de runtime necessárias (SQLite):
```bash
npm install sqlite sqlite3
```

> Observação: o Tailwind v4 costuma vir integrado em projetos Next.js recentes. Se você estiver usando Tailwind v3 ou quiser instalar manualmente, execute:
> ```bash
> npm install -D tailwindcss postcss autoprefixer
> npx tailwindcss init -p
> ```
> **No projeto entregue usamos `@import "tailwindcss";` em `app/globals.css` (Tailwind v4)**.

3. (Opcional) Instale dependências de desenvolvimento, se desejar:
```bash
npm install -D typescript @types/node @types/react
```

4. Rode a aplicação em modo de desenvolvimento:
```bash
npm run dev
```

Abra no navegador: `http://localhost:3000`

---

## Scripts úteis (package.json)
- `npm run dev` — inicia servidor de desenvolvimento Next.js
- `npm run build` — build para produção
- `npm run start` — inicia servidor em modo produção (após `build`)

---

## Banco de dados (SQLite)
- O arquivo do banco local será criado automaticamente: `database.sqlite` na raiz do projeto.
- Tabelas principais criadas automaticamente ao abrir o DB (`wallet`, `history`).

### Resetar o banco (apagar dados)
Para resetar o banco em desenvolvimento, pare o servidor e apague o arquivo `database.sqlite`. Ao reiniciar o app, o DB será recriado vazio.

---

## Endpoints disponíveis (API interna)
- `GET /api/balance` — retorna `{ balance: number }`
- `POST /api/deposit` — body `{ value: number }` — realiza depósito e retorna saldo atualizado
- `POST /api/withdraw` — body `{ value: number }` — realiza saque (verifica saldo) e retorna saldo atualizado
- `GET /api/history` — retorna lista de transações ordenadas por data (mais recentes primeiro)

---

## Autor
Desenvolvido por Aguinaldo Borges.  

---

## Licença
```
MIT License
```