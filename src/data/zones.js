/**
 * Sáu khu trên bản đồ. Toạ độ tính theo đơn vị cảnh 3D (trục z dương hướng về phía nam).
 * - r: bán kính khuôn viên, dùng để giữ khoảng trống cho khu
 * - labelY: độ cao nhãn tên khu
 * - camRadius / camY: khoảng cách và độ cao điểm nhìn khi camera bay tới
 * - accent: [màu chính, màu nhạt, màu đậm] dùng cho hồ sơ của khu
 */
export const ZONES = [
  {
    id: 'intro', name: 'Giới thiệu', place: 'Tháp Namsan',
    x: 0, z: -40, r: 44, labelY: 128, camRadius: 165, camY: 48,
    labelDot: '#e58aa8', accent: ['#2f6dff', '#e3ebff', '#10307f'],
  },
  {
    id: 'education', name: 'Học vấn', place: 'Sungkyunkwan',
    x: -100, z: -100, r: 40, labelY: 30, camRadius: 120,
    labelDot: '#2f6db5', accent: ['#2f6db5', '#e1ebf8', '#173a6b'],
  },
  {
    id: 'experience', name: 'Kinh nghiệm', place: 'Phố Gangnam',
    x: -105, z: 112, r: 40, labelY: 152, camRadius: 240, camY: 46,
    labelDot: '#2d2f3a', accent: ['#1d7f73', '#dcf2ee', '#0e4a43'],
  },
  {
    id: 'leadership', name: 'Lãnh đạo', place: 'Gwanghwamun',
    x: 100, z: -104, r: 40, labelY: 40, camRadius: 140,
    labelDot: '#c8413a', accent: ['#c8413a', '#fbe3e0', '#7a1f19'],
  },
  {
    id: 'awards', name: 'Giải thưởng', place: 'Công viên Olympic',
    x: 105, z: 112, r: 38, labelY: 36, camRadius: 125,
    labelDot: '#e0a82e', accent: ['#c98a12', '#fbefd6', '#6e4a05'],
  },
  {
    id: 'community', name: 'Xã hội', place: 'Công viên sông Hàn',
    x: 0, z: 70, r: 46, labelY: 30, camRadius: 150,
    labelDot: '#9aa3a8', accent: ['#2f8f5b', '#def2e6', '#14502f'],
  },
];

export const HUB = ZONES[0];
