# minh.dev

Portfolio cá nhân dùng Next.js trong `apps/web`, Prisma trong `packages/database` và PostgreSQL. Nội dung portfolio có thể quản trị tại `/admin`.

## Chạy local

1. Cài dependencies:

```bash
npm install
```

2. Tạo file môi trường:

```bash
copy .env.example .env
```

3. Điền các biến trong `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="ChangeMe123!"
ADMIN_NAME="Portfolio Admin"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. Tạo Prisma client và đẩy schema:

```bash
npm run prisma:generate
npm run prisma:push
```

5. Seed admin và nội dung ban đầu:

```bash
npm run prisma:seed
```

Nếu không đặt `ADMIN_EMAIL` hoặc `ADMIN_PASSWORD`, seed dùng tài khoản demo `admin@example.com` / `ChangeMe123!`. Chỉ dùng demo cho local, không dùng cho production.

6. Chạy web:

```bash
npm --workspace @minh-dev/web run dev
```

Mở `http://localhost:3000`. Admin ở `http://localhost:3000/admin/login`.

## Scripts chính

```bash
npm run dev
npm run build
npm run lint
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

## Railway PostgreSQL

1. Tạo project trên Railway.
2. Add service `PostgreSQL`.
3. Mở tab database, vào `Variables`.
4. Copy biến `DATABASE_URL`.
5. Dán vào `.env` local hoặc biến môi trường deploy.
6. Chạy `npm run prisma:push` và `npm run prisma:seed` với `DATABASE_URL` đó.

Không hard-code connection string trong source code. PostgreSQL chỉ lưu URL ảnh như `/avatar1.png` hoặc URL Cloudinary/Vercel Blob sau này.

## Admin

Footer public có link nhỏ `Admin`. Sau khi seed, đăng nhập bằng tài khoản trong `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

Admin hiện quản lý:

- Hồ sơ cá nhân
- Dự án, ảnh dự án, tech stack, published/featured
- Nhóm kỹ năng và kỹ năng con
- Kinh nghiệm, details, visible
- Mạng xã hội, visible

Mật khẩu được hash bằng `bcryptjs`. Session admin dùng JWT trong httpOnly cookie, không lưu token trong localStorage.
