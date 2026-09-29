/**
 * Ảnh của từng khu (thứ tự khớp ZONES).
 * - AVATARS: ảnh trên thẻ tên; `position` là điểm lấy nét khi cắt ảnh (object-position).
 * - GALLERY: ảnh trong phần "Khoảnh khắc" cuối hồ sơ.
 * Ảnh nằm trong public/photos. Ảnh IELTS và giấy khen đã được che thông tin cá nhân.
 */

const photo = (file) => `photos/${file}`;

export const AVATARS = [
  { src: photo('avatar-intro.webp'), position: '50% 16%' },
  { src: photo('avatar-education.webp'), position: '46% 30%' },
  { src: photo('avatar-experience.webp'), position: '50% 22%' },
  { src: photo('avatar-leadership.webp'), position: '44% 42%' },
  { src: photo('avatar-awards.webp'), position: '50% 30%' },
  { src: photo('avatar-community.webp'), position: '58% 28%' },
];

const shot = (n, caption, note) => ({ src: photo(`g${n}.webp`), caption, note });

export const GALLERY = [
  [],
  [
    shot(20, 'Kết quả IELTS Academic 6.0', 'Thông tin cá nhân đã được che'),
    shot(22, 'Tại thư viện Học viện', 'Cùng các thầy cô'),
    shot(34, 'Diễn thuyết', 'Học viện Chính sách và Phát triển'),
  ],
  [
    shot(24, 'Lễ ra mắt Đại sứ Sinh viên Google', 'Google Student Ambassador'),
    shot(21, 'Workshop cùng Google Student Ambassador', 'Tại giảng đường'),
    shot(26, 'OPPO’s Next Trend', 'Workshop & ngày ra mắt đại sứ'),
    shot(33, 'Anessa Student Ambassador', 'Danh sách đại sứ'),
    shot(32, 'Đại sứ truyền thông', 'Các cuộc thi & sự kiện sinh viên'),
  ],
  [
    shot(16, 'Đọc diễn văn tại Đền Hùng', 'Vitri APD Military'),
    shot(17, 'Gương mặt sinh viên APD trên VTV Digital', '03/2026'),
    shot(25, 'Ghi hình cùng VTV Digital', 'Học viện Chính sách và Phát triển'),
    shot(19, 'Cùng đồng đội Liên chi đoàn', 'Khoa Kinh tế số'),
    shot(30, 'Khoảnh khắc cùng Khoa Kinh tế số', 'Giấy khen & Quốc hội giả định'),
    shot(27, 'Team Sóng Biển', 'Chào tân sinh viên APD 2025'),
    shot(37, 'Trao giải Quốc hội giả định', '18/04/2026'),
  ],
  [
    shot(15, 'Giải Triển vọng DBIC 2025', 'Đại học Đại Nam'),
    shot(35, 'Chung kết DBIC 2025', '10/06/2025 · Đại học Đại Nam'),
    shot(36, 'Lễ công bố giải', '13/03/2025 · Khoa Kinh tế số, APD'),
    shot(38, 'Nhận giấy khen của Học viện', '07/2026'),
    shot(29, 'Quý quân Take One 2025', 'Youth NEU Media'),
    shot(14, 'Tọa đàm English and Technology', 'Khoa Kinh tế số, APD'),
    shot(23, 'Góc thành tích', 'Giấy chứng nhận & kỷ niệm'),
  ],
  [
    shot(18, 'Tổng kết học kỳ II 2025–2026', 'Giấy khen & chứng nhận tình nguyện viên'),
    shot(39, 'Mẫu ảnh tuyển sinh APD', 'Học viện Chính sách và Phát triển'),
    shot(31, 'Những khoảnh khắc được in lại', 'Kỷ niệm các hoạt động'),
  ],
];
