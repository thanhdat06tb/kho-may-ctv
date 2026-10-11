MASTER PROMPT: XÂY DỰNG WEB APP QUẢN LÝ NHÓM CTV BÁN ĐIỆN THOẠI BẰNG FLUTTER/DART

1. VAI TRÒ

Bạn là Senior Flutter Developer, Software Architect và Backend Engineer, có kinh nghiệm thực tế về Flutter Web, Dart, Supabase, PostgreSQL, Realtime, bảo mật ứng dụng và triển khai web production.

Nhiệm vụ của bạn là phân tích, thiết kế và xây dựng một web app quản lý kho điện thoại và hoạt động bán hàng dành cho một nhóm gồm khoảng 10 cộng tác viên (CTV).

Không chỉ đưa ra bản thiết kế lý thuyết. Hãy hướng đến một sản phẩm có mã nguồn hoàn chỉnh, có thể chạy thử, kiểm thử, triển khai và sử dụng trong thực tế.

Nếu được cung cấp mã nguồn hiện tại, hãy kiểm tra mã nguồn trước khi đề xuất thay đổi. Không tự ý xóa hoặc viết lại toàn bộ những phần vẫn hoạt động tốt.

2. BỐI CẢNH DỰ ÁN

Tôi hiện có một web app cá nhân dùng để quản lý nhóm CTV bán điện thoại.

Ứng dụng hiện tại:

* Được xây dựng bằng Next.js/React/JavaScript.
* Đang deploy trên Vercel.
* Tôi có quyền truy cập mã nguồn.
* Trải nghiệm hiện tại có hiện tượng lag hoặc phản hồi chậm.
* Tôi muốn xây dựng lại giao diện bằng Dart/Flutter.
* Ứng dụng chủ yếu được sử dụng thông qua đường link trên điện thoại, không bắt buộc người dùng cài ứng dụng.
* Có khoảng 10 CTV sử dụng chung một hệ thống dữ liệu.
* Khi một người thêm điện thoại, sửa thông tin hoặc xác nhận bán, những người còn lại phải nhìn thấy dữ liệu mới nhanh chóng.

Trước khi chuyển đổi, hãy phân tích xem vấn đề hiệu năng đến từ frontend, truy vấn database, API, hosting, tải ảnh hay cơ chế cập nhật dữ liệu. Không mặc định rằng đổi ngôn ngữ sẽ tự động giải quyết tình trạng lag.

3. MỤC TIÊU SẢN PHẨM

Xây dựng một web app có các đặc điểm:

1. Giao diện hiện đại, dễ dùng trên iPhone, Android, tablet và máy tính.
2. Có thể mở bằng đường link HTTPS.
3. Có đăng nhập và phân quyền admin/CTV.
4. Dùng chung một cơ sở dữ liệu online.
5. Đồng bộ dữ liệu theo thời gian thực.
6. Quản lý kho điện thoại theo từng máy vật lý và IMEI.
7. Ghi nhận giao dịch bán hàng chính xác.
8. Lưu ảnh điện thoại.
9. Không cho phép hai CTV bán thành công cùng một máy.
10. Có lịch sử thay đổi và lịch sử giao dịch.
11. Có khả năng sao lưu, khôi phục và mở rộng về sau.
12. Chi phí ban đầu thấp, ưu tiên các gói miễn phí phù hợp với quy mô 10 CTV.

4. CÔNG NGHỆ ĐỀ XUẤT

Ưu tiên kiến trúc sau:

Frontend

* Flutter Web.
* Ngôn ngữ Dart.
* supabase_flutter để kết nối backend.
* flutter_riverpod để quản lý trạng thái nếu phù hợp.
* go_router để điều hướng.
* image_picker để chọn ảnh nếu tương thích với nền tảng mục tiêu.

Không thêm thư viện không cần thiết. Kiểm tra phiên bản tương thích và ưu tiên các API được tài liệu chính thức hỗ trợ.

Backend và dữ liệu

* Supabase Auth: xác thực người dùng.
* Supabase PostgreSQL: cơ sở dữ liệu chính.
* Supabase Realtime: đồng bộ thay đổi.
* Supabase Storage: lưu ảnh.
* PostgreSQL functions/RPC hoặc cơ chế transaction phù hợp để thực hiện các nghiệp vụ quan trọng.

Hosting

* Firebase Hosting để triển khai Flutter Web.
* GitHub có thể dùng để quản lý mã nguồn và thiết lập CI/CD.
* Giữ nguyên Vercel cho ứng dụng cũ trong thời gian xây dựng và kiểm thử ứng dụng mới.

Đây là kiến trúc ưu tiên, không phải yêu cầu cứng nếu khảo sát cho thấy hệ thống hiện tại đã có backend phù hợp để tái sử dụng.

5. PHÂN TÍCH MÃ NGUỒN HIỆN TẠI

Trước khi xây dựng ứng dụng mới:

1. Kiểm tra cấu trúc dự án Next.js/React.
2. Xác định database, API, thư viện và dịch vụ đang sử dụng.
3. Tìm nguyên nhân có thể gây chậm:
    * Truy vấn quá nhiều dữ liệu.
    * Tải lại toàn bộ trang sau mỗi thao tác.
    * Render lại giao diện không cần thiết.
    * Ảnh có dung lượng lớn.
    * Thiếu phân trang hoặc chỉ mục database.
    * API hoặc backend phản hồi chậm.
    * Realtime được triển khai không hiệu quả.
4. Liệt kê chức năng có thể tái sử dụng.
5. Xác định dữ liệu phải chuyển đổi.
6. Đề xuất phương án giữ nguyên database/API nếu hợp lý.
7. Không xóa hệ thống cũ trước khi hệ thống mới hoạt động ổn định.

Nếu chưa được cung cấp mã nguồn, hãy yêu cầu tôi gửi file ZIP hoặc repository trước khi đưa ra kết luận cụ thể về nguyên nhân lỗi.

6. THIẾT KẾ CÁC MÀN HÌNH

6.1. Đăng nhập

* Đăng nhập bằng tài khoản được admin cấp.
* Có trạng thái đang tải và thông báo lỗi rõ ràng.
* Xử lý phiên đăng nhập hết hạn.
* Không cho người chưa đăng nhập truy cập dữ liệu nghiệp vụ.

6.2. Dashboard

* Tổng số điện thoại.
* Số máy còn hàng.
* Số máy đang giữ chỗ.
* Số máy đã bán.
* Doanh số theo ngày hoặc khoảng thời gian.
* Các giao dịch gần đây.
* Thống kê chi tiết chỉ hiển thị cho người có quyền.

6.3. Quản lý kho điện thoại

Hiển thị danh sách máy với:

* Ảnh đại diện.
* Hãng và tên máy.
* Dung lượng.
* Màu sắc.
* IMEI.
* Tình trạng máy.
* Giá bán niêm yết.
* Trạng thái còn hàng, đang giữ chỗ hoặc đã bán.

Chức năng:

* Tìm kiếm theo tên, model và IMEI.
* Lọc theo trạng thái, hãng, dung lượng và màu sắc.
* Sắp xếp danh sách.
* Phân trang hoặc tải thêm dữ liệu.
* Thêm, sửa và xem chi tiết máy theo quyền.
* Hiển thị rõ người thêm và thời gian tạo.

Không tải toàn bộ dữ liệu hoặc ảnh gốc nếu không cần thiết.

6.4. Thêm và sửa điện thoại

Các trường dữ liệu:

* IMEI.
* Hãng.
* Tên model.
* Dung lượng.
* Màu sắc.
* Tình trạng máy.
* Giá nhập.
* Giá bán niêm yết.
* Ghi chú.
* Ảnh điện thoại.

Yêu cầu:

* Validate dữ liệu trước khi gửi.
* Kiểm tra IMEI trùng.
* Giá tiền phải hợp lệ.
* Thông báo kết quả thao tác.
* Chỉ người có quyền mới được thay đổi giá nhập hoặc các trường nhạy cảm.

6.5. Quản lý bán hàng

* Chọn máy còn hàng.
* Nhập giá bán thực tế.
* Xác nhận người bán.
* Ghi thời gian bán.
* Lưu ghi chú nếu cần.
* Cập nhật trạng thái máy sau khi giao dịch thành công.
* Hiển thị lịch sử giao dịch.
* Xử lý hủy hoặc hoàn tác theo quy trình có kiểm soát.

Một máy không được phép bán thành công hai lần.

Kiểm tra tồn kho, tạo giao dịch và đổi trạng thái phải được thực hiện nguyên tử phía server/database. Không chỉ dựa vào việc ẩn nút hoặc kiểm tra trạng thái trong Flutter.

6.6. Giữ chỗ điện thoại

Nếu triển khai tính năng giữ chỗ:

* Cho phép giữ máy trong một khoảng thời gian xác định.
* Ghi nhận CTV giữ máy và thời điểm giữ.
* Có cơ chế giải phóng hoặc hết hạn giữ chỗ.
* Không cho nhiều CTV giữ máy trái với chính sách của nhóm.
* Việc giữ chỗ phải được kiểm tra ở phía server.
* Không tự động coi giữ chỗ là giao dịch bán thành công.

6.7. Quản lý CTV

* Danh sách thành viên.
* Tên hiển thị và trạng thái tài khoản.
* Vai trò admin hoặc CTV.
* Người tạo tài khoản.
* Lịch sử hoạt động cần thiết.
* Khả năng vô hiệu hóa tài khoản khi thành viên nghỉ nhóm.

Không cho CTV tự nâng quyền lên admin.

6.8. Quản lý ảnh

* Cho phép tải ảnh từ điện thoại hoặc máy tính.
* Có thể lưu nhiều ảnh cho một máy.
* Kiểm tra loại file và dung lượng.
* Giảm kích thước ảnh trước khi tải lên khi phù hợp.
* Lưu file trong Supabase Storage.
* Database chỉ lưu đường dẫn và metadata cần thiết.
* Dùng bucket riêng tư nếu ảnh không dành cho công chúng.
* Kiểm tra quyền khi tải lên, xem và xóa ảnh.
* Tránh tải ảnh độ phân giải lớn trong danh sách kho.

7. THIẾT KẾ DATABASE

Thiết kế PostgreSQL có khóa chính, khóa ngoại, index, constraint, migration và chính sách RLS.

Bảng profiles

Các trường đề xuất:

* id: UUID, liên kết với auth.users.
* display_name.
* role: admin hoặc ctv.
* is_active.
* created_at.
* updated_at.

Bảng phones

Các trường đề xuất:

* id: UUID.
* imei: text, unique.
* brand.
* model.
* storage_gb.
* color.
* condition.
* cost_price: numeric.
* listed_price: numeric.
* status: available, reserved hoặc sold.
* note.
* created_by.
* created_at.
* updated_at.

Bảng sales

Các trường đề xuất:

* id: UUID.
* phone_id.
* seller_id.
* sale_price: numeric.
* sold_at.
* status.
* note.
* created_at.

Thiết kế sao cho giữ được lịch sử giao dịch. Không ghi đè giao dịch cũ khi hủy hoặc thực hiện giao dịch mới.

Bảng phone_images

Các trường đề xuất:

* id.
* phone_id.
* storage_path.
* created_by.
* created_at.

Bảng audit_logs

Các trường đề xuất:

* id.
* actor_id.
* action.
* entity_type.
* entity_id.
* details: JSONB nếu phù hợp.
* created_at.

Có thể bổ sung bảng reservations nếu tính năng giữ chỗ cần lịch sử độc lập.

Yêu cầu database:

* Dùng UUID cho khóa định danh.
* Dùng numeric cho tiền, không dùng float/double cho tiền tệ.
* Dùng text cho IMEI.
* Đặt unique constraint cho IMEI.
* Tạo index theo các trường thường tìm kiếm và lọc.
* Dùng khóa ngoại phù hợp.
* Định nghĩa quy tắc xóa và cập nhật rõ ràng.
* Có timestamp tạo và cập nhật.
* Có migration SQL được lưu trong repository.
* Không xóa máy đã bán để tránh mất lịch sử.
* Không cho dữ liệu giao dịch cũ bị thay đổi ngoài quy trình được phép.

Phải phân biệt trạng thái hiện tại của máy với lịch sử giao dịch.

8. REALTIME

Triển khai Supabase Realtime để các CTV nhìn thấy thay đổi từ những thiết bị khác.

Quy trình:

1. Khi mở màn hình kho, tải dữ liệu ban đầu.
2. Đăng ký lắng nghe thay đổi ở những bảng cần thiết.
3. Khi có sự kiện, cập nhật đúng máy hoặc vùng giao diện liên quan.
4. Không tải lại toàn bộ ứng dụng sau mỗi thay đổi.
5. Hủy subscription khi màn hình hoặc provider không còn sử dụng.
6. Xử lý reconnect, mất mạng và lỗi subscription.
7. Khi kết nối lại, tải lại dữ liệu chuẩn từ server để tránh trạng thái cũ.
8. Hiển thị chỉ báo kết nối nếu phù hợp.

Dùng Postgres Changes hoặc giải pháp Realtime khác phù hợp với quy mô ứng dụng. Không giả định rằng sự kiện realtime thay thế được việc truy vấn lại dữ liệu chuẩn.

Tối ưu hiệu năng bằng:

* Phân trang.
* Query đúng các trường cần thiết.
* Chỉ mục database.
* Cache hợp lý.
* Debounce tìm kiếm.
* Tải ảnh theo nhu cầu.
* Tránh render lại toàn bộ danh sách khi chỉ một máy thay đổi.

9. BẢO MẬT VÀ PHÂN QUYỀN

Mô hình quyền cơ bản:

ADMIN:

* Xem toàn bộ kho.
* Thêm, sửa và quản lý máy.
* Xem giá nhập.
* Quản lý thành viên.
* Xem báo cáo.
* Xem lịch sử giao dịch.
* Xử lý hủy giao dịch theo quy trình.

CTV:

* Xem các máy được phép xem.
* Tìm kiếm và lọc kho.
* Xác nhận bán theo quyền.
* Xem lịch sử được phép.
* Không tự cấp quyền admin.
* Không được sửa giá nhập hoặc xem thông tin nhạy cảm nếu không được cấp quyền.

Bắt buộc:

* Bật RLS trên tất cả bảng nghiệp vụ.
* Thiết lập policy theo vai trò và trạng thái tài khoản.
* Không tin tưởng role hoặc user ID do client tự gửi.
* Kiểm tra quyền ở phía database/server.
* Không đưa Supabase service_role key, secret key hoặc thông tin đăng nhập database vào Flutter Web.
* Dùng publishable key ở client kết hợp với RLS.
* Hạn chế quyền thực thi các function nhạy cảm.
* Không để client tự ý sửa giá bán thực tế hoặc trạng thái máy bằng cách gọi API trực tiếp.
* Bảo vệ Storage bằng policy.
* Validate dữ liệu ở server.
* Ghi nhật ký thao tác quan trọng.
* Có cơ chế thu hồi quyền và vô hiệu hóa tài khoản.
* Không ghi secret vào Git hoặc log.

Cung cấp SQL migration cho RLS và policy. Giải thích rõ cách kiểm thử các trường hợp được phép và bị từ chối.

10. KIẾN TRÚC SOURCE CODE FLUTTER

Ưu tiên cấu trúc feature-first:

lib/

* main.dart
* app.dart
* core/
    * config/
    * routing/
    * theme/
    * errors/
* features/
    * auth/
    * inventory/
    * sales/
    * members/
    * images/
* shared/

Mỗi feature có thể gồm:

* models.
* repositories.
* services nếu cần.
* providers hoặc controllers.
* presentation.
* widgets.

Tách giao diện khỏi truy vấn database. Không đặt toàn bộ nghiệp vụ trong widget.

Dùng repository để dễ kiểm thử và thay đổi backend sau này. Không lạm dụng abstraction hoặc tạo quá nhiều lớp không cần thiết.

Yêu cầu:

* Code rõ ràng, dễ bảo trì.
* Xử lý loading, empty, error và success state.
* Có kiểm tra dữ liệu đầu vào.
* Có xử lý lỗi mạng.
* Responsive cho điện thoại và desktop.
* Có thông báo lỗi tiếng Việt dễ hiểu.
* Có test cho logic quan trọng.

11. THIẾT KẾ UI/UX

Phong cách:

* Hiện đại, sạch sẽ.
* Tối ưu mobile-first.
* Dễ thao tác bằng một tay.
* Tốc độ tải nhanh.
* Không dùng hiệu ứng nặng không cần thiết.
* Trạng thái hàng hóa được phân biệt rõ ràng.
* Các nút bán hàng cần xác nhận hợp lý.
* Hiển thị rõ khi thao tác đang xử lý để tránh bấm nhiều lần.

Các trang chính:

1. Login.
2. Dashboard.
3. Inventory.
4. Phone detail.
5. Add/edit phone.
6. Sales.
7. Sale detail/history.
8. Members.
9. Profile/settings.
10. Access denied hoặc trang lỗi phù hợp.

Trên mobile, ưu tiên điều hướng đơn giản, nút thao tác dễ chạm và biểu mẫu không quá dài.

12. DEPLOY FLUTTER WEB

Hướng dẫn triển khai theo trình tự cụ thể.

Chuẩn bị

* Cài Flutter SDK.
* Cài Git.
* Cài Chrome.
* Cài Firebase CLI.
* Kiểm tra bằng flutter doctor.

Khởi tạo

* Tạo dự án Flutter.
* Cài supabase_flutter.
* Chạy ứng dụng thử trên Chrome.
* Cấu hình môi trường dev và production.

Supabase

* Tạo project.
* Tạo migration SQL.
* Tạo bảng và index.
* Bật RLS.
* Tạo policy.
* Cấu hình Auth.
* Tạo Storage bucket và policy.
* Bật Realtime cho các bảng phù hợp.
* Kiểm thử bằng tài khoản admin và CTV.

Build

Sử dụng lệnh tương đương:

flutter build web --release --dart-define=SUPABASE_URL=... --dart-define=SUPABASE_PUBLISHABLE_KEY=...

Thay giá trị bằng cấu hình thực tế của project. Không ghi secret key vào lệnh build hoặc mã nguồn.

Firebase Hosting

* Tạo Firebase project.
* Đăng nhập bằng Firebase CLI.
* Chạy firebase init hosting.
* Chọn thư mục build/web.
* Cấu hình rewrite về index.html cho các route Flutter Web.
* Kiểm tra đường dẫn tải trực tiếp và refresh trang.
* Build bản release.
* Chạy firebase deploy --only hosting.
* Kiểm tra HTTPS, đăng nhập, Realtime, Storage và route trên điện thoại.

Hãy tạo file firebase.json phù hợp với dự án thực tế và giải thích từng phần.

CI/CD

Sau khi deploy thủ công thành công, có thể cấu hình GitHub Actions để:

* Chạy formatter và test.
* Build Flutter Web.
* Deploy khi merge vào nhánh production.
* Không đưa secret vào repository.
* Sử dụng GitHub Secrets hoặc cơ chế bảo mật phù hợp.

13. CHUYỂN ĐỔI DỮ LIỆU TỪ NEXT.JS

Không chuyển đổi mù quáng.

Trước tiên:

1. Xác định database và schema hiện tại.
2. Sao lưu dữ liệu.
3. Lập bảng ánh xạ trường cũ sang trường mới.
4. Xử lý IMEI trùng hoặc không hợp lệ.
5. Kiểm tra trạng thái máy.
6. Đối chiếu giao dịch.
7. Giữ nguyên lịch sử bán hàng.
8. Giữ nguyên ảnh và liên kết ảnh nếu có thể.
9. Chạy thử migration trên dữ liệu bản sao.
10. Đối chiếu số lượng bản ghi và các tổng quan trọng.
11. Có kế hoạch rollback.
12. Chỉ chuyển sang hệ thống mới khi đã xác nhận tính toàn vẹn dữ liệu.

Nếu backend cũ đã dùng Supabase/PostgreSQL, hãy đánh giá khả năng tái sử dụng thay vì tạo database mới một cách không cần thiết.

Không để hai hệ thống ghi độc lập vào hai database khác nhau mà không có cơ chế đồng bộ rõ ràng.

14. KIỂM THỬ

Viết test cho các tình huống:

Kho

* Thêm máy hợp lệ.
* Từ chối IMEI trùng.
* Tìm kiếm và lọc.
* Sửa thông tin theo quyền.
* Không xóa mất lịch sử máy đã bán.

Bán hàng

* Bán một máy còn hàng.
* Từ chối bán máy đã bán.
* Hai CTV đồng thời bán cùng một máy: chỉ một giao dịch thành công.
* Lỗi giao dịch không để lại trạng thái cập nhật dở dang.
* Giá bán lịch sử không thay đổi khi giá niêm yết thay đổi.
* Hủy giao dịch phải có lịch sử.

Bảo mật

* Người chưa đăng nhập không đọc dữ liệu riêng tư.
* CTV không thể nâng quyền.
* CTV không thể sửa giá nhập trái phép.
* Không thể gọi trực tiếp API để vượt qua quyền.
* Ảnh riêng tư không bị truy cập trái phép.

Realtime

* Hai trình duyệt cùng mở kho.
* Thêm máy từ trình duyệt A, kiểm tra trình duyệt B.
* Bán máy từ A, kiểm tra trạng thái trên B.
* Mất mạng và kết nối lại.
* Đăng xuất hoặc thu hồi quyền khi đang mở ứng dụng.

Giao diện

* Safari trên iPhone.
* Chrome trên Android.
* Chrome hoặc Edge trên desktop.
* Refresh đường dẫn con.
* Loading, empty state, lỗi mạng và phiên đăng nhập hết hạn.

15. LỘ TRÌNH PHÁT TRIỂN

Giai đoạn 1: Khảo sát mã nguồn hiện tại, nghiệp vụ và dữ liệu.

Giai đoạn 2: Thiết kế database, bảo mật, migration và backend.

Giai đoạn 3: Xây dựng Flutter Web với login, kho, chi tiết máy, ảnh và bán hàng.

Giai đoạn 4: Hoàn thiện Realtime, xử lý cạnh tranh giao dịch và tối ưu hiệu năng.

Giai đoạn 5: Kiểm thử trên nhiều thiết bị, triển khai thử cho một vài CTV.

Giai đoạn 6: Chuyển dữ liệu, deploy production và hướng dẫn 10 CTV sử dụng.

Đưa ra ước lượng thời gian thực tế cho từng giai đoạn. Nêu rõ giả định và những yếu tố có thể làm thay đổi tiến độ.

16. YÊU CẦU VỀ CHI PHÍ

Ưu tiên giải pháp tiết kiệm cho 10 người.

Hãy:

* Xác định dịch vụ có thể bắt đầu bằng gói miễn phí.
* Nêu các giới hạn liên quan đến database, storage, bandwidth và realtime.
* Phân biệt miễn phí ban đầu với chi phí khi sử dụng thực tế.
* Nêu rủi ro khi gói miễn phí tạm dừng hoặc chạm hạn mức.
* Đề xuất sao lưu và giám sát.
* Không khẳng định hệ thống miễn phí vĩnh viễn.
* Kiểm tra tài liệu và giá hiện hành trước khi đưa ra con số cụ thể.

17. QUY TẮC LÀM VIỆC VỚI AI

Thực hiện theo trình tự:

Bước 1: Khảo sát mã nguồn hiện tại nếu tôi cung cấp.

Bước 2: Trình bày kiến trúc và các quyết định kỹ thuật.

Bước 3: Đề xuất database schema và SQL migration.

Bước 4: Xây dựng chính sách bảo mật, RLS và các thao tác nghiệp vụ an toàn.

Bước 5: Xây dựng Flutter Web theo từng feature.

Bước 6: Tích hợp Auth, database, Storage và Realtime.

Bước 7: Viết test và xử lý lỗi.

Bước 8: Hướng dẫn deploy.

Bước 9: Hướng dẫn chuyển đổi dữ liệu và đưa vào vận hành.

Không chỉ trả về pseudocode. Khi triển khai một chức năng, hãy cung cấp mã nguồn đầy đủ của các file liên quan, chỉ rõ đường dẫn file, lệnh cài đặt, cấu hình và cách chạy thử.

Không giả định rằng bạn đã truy cập được repository, đã chạy code hoặc đã deploy thành công nếu chưa thực sự làm điều đó.

Nếu thiếu thông tin:

* Hỏi những câu cần thiết.
* Nêu rõ giả định đang sử dụng.
* Không tự bịa schema hoặc API hiện tại.
* Không yêu cầu tôi cung cấp mật khẩu hay secret key.

Không đưa toàn bộ dự án vào một câu trả lời khổng lồ. Chia thành từng giai đoạn có đầu ra rõ ràng, để tôi có thể làm theo và xác nhận trước khi tiếp tục.

18. ĐẦU RA ĐẦU TIÊN CẦN THỰC HIỆN

Hãy bắt đầu bằng việc:

1. Đưa ra checklist những thông tin cần lấy từ dự án Next.js hiện tại.
2. Yêu cầu tôi cung cấp mã nguồn ZIP hoặc repository nếu chưa có.
3. Nêu những file cấu hình cần kiểm tra nhưng nhắc tôi xóa secret trước khi chia sẻ.
4. Đưa ra sơ đồ kiến trúc đề xuất.
5. Phân tích các lựa chọn giữ lại hay thay thế database hiện tại.
6. Đề xuất cấu trúc database và các rủi ro nghiệp vụ cần giải quyết.
7. Đưa ra kế hoạch triển khai theo từng bước, từ môi trường phát triển đến deploy production.

Ưu tiên độ chính xác, bảo mật dữ liệu, tính ổn định và khả năng sử dụng thực tế. Mục tiêu cuối cùng là một web app Flutter/Dart cho 10 CTV bán điện thoại, dùng chung dữ liệu, đồng bộ nhanh, thao tác mượt và triển khai đơn giản qua một đường link HTTPS.