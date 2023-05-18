# Browser controller

Using template: Next.js / custom Fastify Server example

Install dependencies

```bash
npm i
```
Run with dev mode

```bash
npm run dev
```

Run with production mode

```bash
npm run build

npm run start
```

### Startup

Using PM2 process manager, w/ log rotation via pm2-logrotate module

Install logrotate module

```bash
pm2 install pm2-logrotate

pm2 set pm2-logrotate:max_size 3M
```

Start with ecosystem.config.js, and configire startup scripts

```bash
pm2 start ecosystem.config.js --env production

pm2 startup

pm2 save
```
