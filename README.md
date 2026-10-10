# Kho Máy CTV

PWA mobile-first để quản lý kho iPhone cũ cho nhóm cộng tác viên. Ứng dụng dùng Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth, PostgreSQL, Storage, Realtime và RPC bảo mật cho nghiệp vụ bán hàng.

## Tính năng chính

- Đăng nhập bằng Supabase Auth.
- Phân quyền `ADMIN` và `CTV` bằng bảng `profiles` + Row Level Security.
- Quản lý từng máy độc lập với mã kho tự sinh.
- Upload nhiều ảnh sản phẩm lên Supabase Storage.
- Danh sách kho chính chỉ hiển thị máy `CON_HANG`.
- Chốt bán qua RPC `confirm_phone_sale`, khóa dòng `phones for update`, chống bán trùng/double-click.
- Admin hoàn tác giao dịch qua RPC `undo_sale`, bắt buộc nhập lý do và ghi audit log.
- Dashboard, bảng xếp hạng CTV, lịch sử bán, quản trị tài khoản.
- Supabase Realtime tự refresh kho khi có thay đổi.
- PWA có manifest, icon 192/512 và service worker không cache dữ liệu nhạy cảm.

## 1. Cài dependencies

```bash
npm install
```

## 2. Tạo Supabase project

Tạo project mới tại Supabase, lấy:

- Project URL
- Anon public key

Không dùng service role key trong frontend.

## 3. Tạo database bằng migration

Cài Supabase CLI nếu muốn chạy local, hoặc mở SQL Editor trên Supabase Dashboard và chạy file:

```text
supabase/migrations/001_initial_schema.sql
```

Migration sẽ tạo enum, bảng `profiles`, `phones`, `phone_images`, `sales`, `audit_logs`, trigger, index, RLS policies, bucket `phone-images` và RPC:

- `confirm_phone_sale(p_phone_id uuid, p_final_price numeric)`
- `undo_sale(p_sale_id uuid, p_reason text)`

## 4. Tạo bucket và bảo mật ảnh

Migration đã tự tạo bucket public `phone-images` với giới hạn 5MB và MIME type ảnh. Nếu tạo thủ công, hãy dùng đúng tên bucket:

```text
phone-images
```

Storage policy nằm trong migration. Người dùng phải đăng nhập và đang hoạt động mới được đọc/upload ảnh.

## 5. Cấu hình biến môi trường

Tạo `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Điền giá trị:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STORAGE_BUCKET=phone-images
```

## 6. Tạo tài khoản Admin ban đầu

Trong Supabase Dashboard:

1. Vào Authentication → Users.
2. Tạo user đầu tiên bằng email và mật khẩu an toàn.
3. Trigger sẽ tạo profile mặc định là `CTV`.
4. Mở SQL Editor và chạy:

```sql
update public.profiles
set role = 'ADMIN', full_name = 'Admin Kho Máy'
where id = '<USER_ID_TU_AUTH_USERS>';
```

Sau đó đăng nhập bằng tài khoản này. Admin có thể đổi role/vô hiệu hóa CTV trong trang `/admin`.

## 7. Chạy ứng dụng local

```bash
npm run dev
```

Mở:

```text
http://localhost:3000
```

## 8. Kiểm thử tài khoản CTV

1. Admin tạo user CTV trong Supabase Auth hoặc dùng Invite user.
2. Đăng nhập CTV.
3. Thêm một máy `QUOC_TE` hoặc `LOCK`.
4. Kiểm tra CTV chỉ sửa được máy mình thêm khi còn hàng.
5. Chốt bán máy và mở một trình duyệt khác để xác nhận kho realtime biến mất khỏi danh sách còn hàng.

## 9. Kiểm thử nghiệp vụ cốt lõi

- Hai CTV bán cùng một máy: chỉ một RPC thành công, lần còn lại nhận lỗi do khóa dòng/unique index.
- Máy nhóm `AN`: tự về `CHO_XAC_MINH`, không thể chuyển `CON_HANG`/`DA_BAN` nếu chưa có `verified_at`.
- Admin hoàn tác: nhập lý do, sale được `voided_at`, máy quay lại `CON_HANG`, audit log ghi `UNDO_SALE`.
- Upload ảnh: chỉ nhận file ảnh tối đa 5MB.
- Offline: banner hiện trạng thái mất mạng và nút bán bị khóa.
- Responsive: kiểm tra các viewport 360px, 390px, 430px và desktop.

## 10. Deploy lên Vercel

1. Push source lên GitHub.
2. Import project vào Vercel.
3. Thêm các biến môi trường giống `.env.local`.
4. Build command: `npm run build`.
5. Deploy.

Sau khi deploy, cập nhật `NEXT_PUBLIC_APP_URL` thành URL production.

## 11. Cài PWA trên điện thoại

Android Chrome:

1. Mở URL production.
2. Chọn menu ⋮.
3. Chọn “Add to Home screen”.

iOS Safari:

1. Mở URL production.
2. Chọn nút Share.
3. Chọn “Add to Home Screen”.

## Ghi chú bảo mật

- Không đặt service role key trong `.env.local` của frontend.
- Không update trực tiếp trạng thái `DA_BAN` từ client; trigger database chặn thao tác này.
- Lịch sử bán không bị xóa vật lý. Hoàn tác dùng `voided_at` và audit log.
- Service worker chỉ cache asset tĩnh, không cache dữ liệu tồn kho, auth, Supabase API hoặc ảnh storage.
