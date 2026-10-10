# XÂY DỰNG KHO MÁY CTV – MOBILE-FIRST PWA

Bạn là Senior Full-Stack Developer và UI/UX Designer.

Hãy xây dựng ứng dụng web hoàn chỉnh có tên **Kho Máy CTV**, dùng để quản lý kho iPhone cũ chung cho nhóm khoảng 10 cộng tác viên.

## 1. Công nghệ

- Next.js với App Router và TypeScript.
- Tailwind CSS, shadcn/ui, Lucide Icons.
- Supabase PostgreSQL làm cơ sở dữ liệu tập trung.
- Supabase Auth quản lý đăng nhập.
- Supabase Storage lưu hình ảnh sản phẩm.
- Supabase Realtime đồng bộ biến động kho.
- PWA có manifest, icon 192px/512px và chế độ standalone.
- Deploy lên Vercel.

Không sử dụng dữ liệu giả như nguồn chính trong bản production. Có thể cung cấp seed dữ liệu mẫu riêng để kiểm thử.

## 2. Giao diện

Thiết kế mobile-first, tối ưu màn hình 360–430px.

Phong cách dark navy chuyên nghiệp, điểm nhấn xanh ngọc. Thiết kế đơn giản, hiện đại, dễ nhìn, không lạm dụng animation.

- Mobile: thanh điều hướng cố định dưới màn hình.
- Desktop: sidebar trái.
- Thẻ điện thoại có ảnh, tên, giá, pin, phân loại và trạng thái.
- Các nút thao tác lớn, dễ chạm.
- Skeleton loading, toast, hộp thoại xác nhận.
- Font hỗ trợ tiếng Việt.
- Định dạng tiền VND và thời gian Việt Nam.
- Responsive hoàn toàn, không tràn màn hình.

## 3. Tài khoản và phân quyền

Có hai vai trò: ADMIN và CTV.

Admin có quyền:
- Quản lý toàn bộ điện thoại.
- Tạo và vô hiệu hóa tài khoản CTV bằng quy trình mời an toàn.
- Sửa, lưu trữ máy.
- Xem thống kê.
- Kiểm tra và điều chỉnh lịch sử giao dịch bằng thao tác có ghi nhật ký.

CTV có quyền:
- Đăng nhập.
- Xem kho chung.
- Thêm điện thoại.
- Sửa thông tin máy do mình thêm nếu còn hàng.
- Xác nhận bán máy.
- Xem lịch sử và bảng xếp hạng thành viên.
- Không thể tự sửa quyền, xóa giao dịch hoặc chọn người khác làm người bán.

Bảo vệ dữ liệu bằng Row Level Security. Không đặt service role key trong frontend.

## 4. Quản lý điện thoại

Mỗi điện thoại là một đơn vị hàng độc lập, có mã kho duy nhất.

Các thông tin:
- Mã máy tự sinh.
- Tên điện thoại.
- Dòng máy.
- Dung lượng.
- Màu sắc.
- Phân loại: LOCK, QUOC_TE, AN.
- Nhà mạng khóa nếu là Lock.
- Pin (%).
- Ngoại hình.
- Tình trạng màn hình, Face ID, camera, SIM.
- Lịch sử sửa chữa hoặc thay thế linh kiện.
- Mô tả tình trạng chi tiết.
- Giá bán.
- Nhiều hình ảnh.
- Người thêm.
- Ngày nhập kho.
- Trạng thái.

Máy thuộc nhóm AN có thể nhập để kiểm kê nhưng cần trạng thái CHO_XAC_MINH. Không cho chuyển sang CON_HANG hoặc DA_BAN nếu chưa xác minh quyền sở hữu và xử lý hợp lệ tình trạng Khóa kích hoạt.

Trạng thái gồm:
- CHO_XAC_MINH
- CON_HANG
- DA_GIU (tùy chọn, có thời gian hết hạn)
- DA_BAN
- LUU_TRU

Danh sách kho chính chỉ hiển thị máy CON_HANG. Có bộ lọc và tìm kiếm nhanh.

## 5. Xác nhận bán

Trong trang chi tiết điện thoại có nút Xác nhận đã bán.

Khi nhấn:
- Hiển thị tên máy, mã máy và giá hiện tại.
- Cho nhập giá chốt thực tế.
- Xác nhận giao dịch đã hoàn thành.
- Hỏi xác nhận cuối cùng.

Backend phải thực hiện transaction nguyên tử:
- Kiểm tra máy vẫn còn hàng hoặc đang được giữ hợp lệ cho người bán.
- Kiểm tra người dùng có quyền bán và máy đủ điều kiện.
- Chuyển trạng thái sang DA_BAN.
- Tạo duy nhất một giao dịch thành công cho mỗi mã máy.
- Lấy ID người bán từ phiên đăng nhập, không tin dữ liệu người bán do frontend gửi.
- Chống race condition và double-click.
- Nếu thất bại, rollback toàn bộ.

Sau khi thành công, máy tự biến mất khỏi danh sách còn hàng ở mọi thiết bị. Không xóa vật lý dữ liệu máy.

Admin có chức năng hoàn tác giao dịch, yêu cầu lý do và ghi nhật ký.

## 6. Thống kê

Dashboard hiển thị:
- Số máy còn hàng.
- Số máy đã bán.
- Tổng giá trị giao dịch.
- Số máy bán trong tháng.
- Hoạt động gần đây.

Bảng xếp hạng CTV:
- Tên CTV.
- Số lượng đã bán.
- Tổng giá trị bán.
- Thời gian bán gần nhất.
- Bộ lọc ngày, tuần, tháng, tùy chỉnh.

Chỉ tính giao dịch hợp lệ, loại trừ giao dịch đã hoàn tác. Các thống kê phải được tính từ dữ liệu server.

## 7. Cơ sở dữ liệu

Thiết kế các bảng:
- profiles
- phones
- phone_images
- sales
- audit_logs

Định nghĩa rõ primary key, foreign key, check constraint, unique index, indexes và timestamps.

Viết migration SQL đầy đủ, policies RLS và các database functions cần thiết.

Hạn chế UPDATE trạng thái DA_BAN trực tiếp từ client. Bắt buộc sử dụng server action hoặc RPC bảo mật cho nghiệp vụ bán hàng.

Không cho phép chỉnh sửa lịch sử bán bằng thao tác trực tiếp thông thường.

## 8. Realtime

Lắng nghe thay đổi dữ liệu kho từ Supabase Realtime.

Khi một máy được thêm, sửa hoặc bán, các tài khoản đang mở ứng dụng phải cập nhật danh sách và số liệu tương ứng.

Khi mất kết nối:
- Hiển thị trạng thái offline.
- Không cho xác nhận bán khi offline.
- Tải lại dữ liệu khi có mạng.
- Có xử lý lỗi và retry hợp lý.

## 9. PWA

- Có manifest hợp lệ.
- Icon 192px và 512px.
- Splash screen phù hợp.
- Standalone display.
- Theme color.
- Hướng dẫn cài lên màn hình chính Android/iOS.
- Không cache thông tin nhạy cảm hoặc dữ liệu tồn kho theo cách gây lỗi đồng bộ.

## 10. Cấu trúc dự án

Tổ chức thư mục rõ ràng:

- app/
- components/
- lib/
- hooks/
- types/
- public/
- supabase/migrations/

Tách UI components, business logic, database access và các schema validation.

Sử dụng tên biến, hàm và file dễ hiểu; ưu tiên tiếng Việt không dấu cho những tên nghiệp vụ tự định nghĩa, nhưng tuân thủ quy ước bắt buộc của Next.js.

## 11. Chất lượng và kiểm thử

- Không có chức năng giả chỉ để trình diễn.
- Form validation đầy đủ.
- Không lưu mật khẩu dạng plaintext.
- Kiểm tra phân quyền trên server và database.
- Kiểm thử hai CTV bán cùng một máy.
- Kiểm thử Admin hoàn tác.
- Kiểm thử đồng bộ giữa hai thiết bị.
- Kiểm thử tải ảnh và giới hạn loại/kích thước file.
- Kiểm thử responsive trên iPhone/Android.
- Kiểm thử khi mất kết nối.

## 12. Bàn giao

Hoàn thiện toàn bộ mã nguồn, database migrations, file .env.example và README tiếng Việt.

README phải hướng dẫn từng bước:
1. Cài dependencies.
2. Tạo Supabase project.
3. Tạo database bằng migration.
4. Tạo bucket và cấu hình bảo mật ảnh.
5. Cấu hình biến môi trường.
6. Tạo tài khoản Admin ban đầu.
7. Chạy ứng dụng local.
8. Kiểm thử tài khoản CTV.
9. Triển khai lên Vercel.
10. Cài PWA trên điện thoại.

Thực hiện theo các giai đoạn: database và auth, quản lý kho, bán hàng nguyên tử, thống kê, realtime, PWA, kiểm thử và triển khai.

Không bỏ qua nghiệp vụ cốt lõi. Nếu chưa có thông tin kết nối Supabase, sử dụng biến môi trường và hướng dẫn cấu hình, không tự tuyên bố hệ thống đã triển khai thành công.