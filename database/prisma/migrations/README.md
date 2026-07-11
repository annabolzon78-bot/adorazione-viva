# Adorazione Viva — Database Migrations

Gestite con Prisma Migrate.

## Primo avvio (dev)
```bash
cd backend
npm run db:migrate:dev -- --name init
npm run db:seed
```

## Deploy produzione
```bash
npm run db:migrate:prod
```

## Reset completo (dev only)
```bash
npm run db:reset
```
