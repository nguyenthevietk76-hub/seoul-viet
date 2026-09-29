# Seoul của Việt

Portfolio cá nhân của **Nguyễn Thế Việt**, sinh viên Phân tích dữ liệu lớn, Khoa Kinh tế số, Học viện Chính sách và Phát triển. Portfolio được dựng thành một Seoul thu nhỏ bằng Three.js. Mỗi địa danh là một phần hồ sơ:

| Phím | Khu | Địa danh |
| --- | --- | --- |
| 1 | Giới thiệu | Tháp Namsan |
| 2 | Học vấn | Sungkyunkwan |
| 3 | Kinh nghiệm | Phố Gangnam |
| 4 | Lãnh đạo | Gwanghwamun |
| 5 | Giải thưởng | Công viên Olympic |
| 6 | Xã hội | Công viên sông Hàn |

## Chạy trên máy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # xuất bản tĩnh vào dist/
npm run preview  # xem thử bản build
```

## Cấu trúc

```
src/
  data/      nội dung: khu, hồ sơ, ảnh (sửa nội dung chỉ cần sửa ở đây)
  engine/    camera, ánh sáng – bầu trời, vòng lặp hoạt ảnh
  lib/       tiện ích: vật liệu, texture vẽ bằng canvas, instancing, số ngẫu nhiên
  world/     dựng cảnh: địa hình, cây, thành phố, 6 khu (world/zones)
  ui/        thanh chọn khu, nút hồ sơ, hồ sơ dạng bìa kẹp
  styles/    CSS
public/
  photos/    ảnh (WebP) – thông tin cá nhân nhạy cảm đã được che
  logos/     logo công cụ (SVG)
```

Bố cục thành phố được sinh từ một hạt giống cố định, nên mỗi lần tải trang đều giống nhau.

## Triển khai

Mỗi lần đẩy lên nhánh `main`, workflow `.github/workflows/deploy.yml` sẽ tự build và đăng lên GitHub Pages. Trong repo, vào **Settings → Pages** và đặt **Source** là **GitHub Actions**.

---

Mã nguồn và mô hình 3D là tự viết. Ý tưởng portfolio dạng thế giới 3D lấy cảm hứng từ bruno-simon.com. Logo công cụ thuộc về chủ sở hữu tương ứng.
