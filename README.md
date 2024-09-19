# Backend 실행하는 법
## 1. Postgres 실행
```bash
cd back-end/myorg
./run-postgres.sh
```
back-end/myorg/run-postgres.sh 을 실행하면 로컬에서 Postgres가 실행됩니다.
5432 포트를 사용합니다.

## 2. 환경변수 설정
back-end/myorg/.env.local 파일을 생성하여 아래내용을 넣어주세요.

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

## 3. 데이터베이스 마이그레이션

```bash
cd back-end/myorg
./run_prisma_generate.sh
```
## 4. 서버 실행
PORT라는 환경변수로 포트를 설정할 수 있습니다. 기본값 3000

```bash
cd back-end/myorg
nx run fastify-api:serve
```

# Frontend 실행하는 법
```bash
cd front-end
npm run dev
```