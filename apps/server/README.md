# server

Express 5 + TypeScript API for the digital-advert monorepo.

## Scripts

- `bun run dev` – start dev server with hot reload (tsx watch)
- `bun run build` – type-check and emit JS to `dist/`
- `bun run start` – run compiled server from `dist/`
- `bun run check-types` – type-check only

## Configuration

Copy `.env.example` to `.env` and adjust:

```
PORT=4000
CORS_ORIGIN=http://localhost:3000,http://localhost:8081,http://localhost:19006
```

## Routes

| Method | Path             | Description                  |
| ------ | ---------------- | ---------------------------- |
| GET    | `/`              | Service info                 |
| GET    | `/api/health`    | Liveness + uptime            |
| GET    | `/api/ads`       | List mock ads                |
| GET    | `/api/ads/:id`   | Get a single ad              |
| POST   | `/api/ads`       | Create an ad (in-memory)     |
| ALL    | `/api/echo`      | Echo request for debugging   |
