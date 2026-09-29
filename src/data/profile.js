/**
 * Nội dung hồ sơ, tổng hợp từ Portfolio_NguyenTheViet.docx (cập nhật 9/2026).
 * Muốn sửa chữ trên trang: chỉ cần sửa file này.
 * Thứ tự DOSSIERS khớp với thứ tự ZONES trong zones.js.
 */

export const CONTACT = {
  email: 'nguyenthevietk76@gmail.com',
  phone: '0354044152',
  phoneDisplay: '0354 044 152',
  location: 'Hà Nội, Việt Nam',
};

export const SOCIALS = [
  { id: 'facebook', label: 'Facebook', short: 'f', handle: 'nguyen.the.viet', href: 'https://www.facebook.com/nguyen.the.viet.220884' },
  { id: 'instagram', label: 'Instagram', short: 'IG', handle: '@_vincen.vie', href: 'https://www.instagram.com/_vincen.vie/' },
  { id: 'tiktok', label: 'TikTok', short: 'TT', handle: '@viet_ngthe', href: 'https://www.tiktok.com/@viet_ngthe' },
  { id: 'linkedin', label: 'LinkedIn', short: 'in', handle: 'Thế Việt Nguyễn', href: 'https://www.linkedin.com/in/th%E1%BA%BF-vi%E1%BB%87t-nguy%E1%BB%85n-37319439a/' },
  { id: 'github', label: 'GitHub', short: 'GH', handle: 'nguyenthevietk76-hub', href: 'https://github.com/nguyenthevietk76-hub' },
];

export const TOOLS = [
  { id: 'python', label: 'Python' },
  { id: 'powerbi', label: 'Power BI' },
  { id: 'sql', label: 'SQL' },
  { id: 'excel', label: 'Excel' },
  { id: 'github', label: 'GitHub' },
  { id: 'canva', label: 'Canva' },
  { id: 'powerpoint', label: 'PowerPoint' },
  { id: 'capcut', label: 'CapCut' },
];

/** Từ được tô màu trong các đoạn giới thiệu. */
export const HIGHLIGHTS = ['Phân tích dữ liệu lớn', 'Data Analyst', 'kinh tế số', 'Google', 'ANESSA', 'Anessa', 'OPPO', '1.600', '8 giải thưởng', 'Gen Z', 'GKS'];

/** Một mục trong danh sách: tiêu đề, đơn vị, thời gian, các ý, có nổi bật không, link kèm theo. */
const entry = (title, org, date, points = [], featured = false, link = null) => ({ title, org, date, points, featured, link });

const INTRO = {
  script: 'Xin chào, mình là',
  title: 'Nguyễn Thế Việt',
  subtitle: 'Sinh viên Phân tích dữ liệu lớn · Khoa Kinh tế số, Học viện Chính sách và Phát triển',
  roles: ['Đại sứ Sinh viên Google Việt Nam', 'Đại sứ Thương hiệu ANESSA Việt Nam', 'Phó ban Đổi mới sáng tạo · LCĐ Khoa Kinh tế số'],
  lead: [
    'Mình là sinh viên chuyên ngành Phân tích dữ liệu lớn thuộc Khoa Kinh tế số, Học viện Chính sách và Phát triển. Định hướng nghề nghiệp của mình là trở thành chuyên viên Phân tích dữ liệu (Data Analyst) trong lĩnh vực kinh tế số và tài chính, nơi dữ liệu được dùng để giải thích hành vi thị trường và hỗ trợ ra quyết định chính sách cũng như quyết định kinh doanh.',
  ],
  stats: [['6.0', 'IELTS'], ['2.000+', 'người theo dõi TikTok'], ['1.600', 'sinh viên mình đại diện'], ['8', 'giải thưởng']],
  strength: 'Điểm mạnh của mình nằm ở sự kết hợp giữa ba nhóm năng lực: nền tảng phân tích dữ liệu (Python, Power BI, xử lý và trực quan hóa dữ liệu), tư duy nghiên cứu học thuật, và năng lực truyền thông dẫn dắt (MC, sáng tạo nội dung số, điều phối đội nhóm). Nhờ vậy mình không chỉ tìm ra con số, mà còn kể được câu chuyện phía sau con số cho những người không làm chuyên môn dữ liệu.',
  goals: [
    ['Ngắn hạn', 'hoàn thiện nền tảng học thuật và ngoại ngữ (IELTS 7.0) để theo học thạc sĩ về kinh tế số, dữ liệu và thương mại điện tử tại Hàn Quốc theo học bổng GKS.'],
    ['Dài hạn', 'làm việc ở vị trí giao thoa giữa phân tích dữ liệu và hoạch định chính sách kinh tế số tại Việt Nam.'],
  ],
  updated: 'Hồ sơ năng lực cập nhật tháng 9/2026 · Nguyễn Thế Việt',
};

const EDUCATION = {
  script: 'Sungkyunkwan',
  title: 'Học vấn & Năng lực',
  lead: [
    'Với mình, học là một hành trình liên tục chứ không dừng lại ở điểm số. Chuyên ngành Phân tích dữ liệu lớn giúp mình làm quen với cách đặt câu hỏi, thu thập và đọc dữ liệu một cách có hệ thống.',
    'Bên cạnh giờ học trên lớp, mình tự bồi dưỡng thêm ngoại ngữ, công cụ và kỹ năng trình bày, để những gì học được có thể dùng vào công việc thật. Mình vẫn đang học mỗi ngày và luôn trân trọng những góp ý từ thầy cô, bạn bè.',
  ],
  note: [['6.0', 'IELTS · mục tiêu 7.0'], ['HK I', 'SV hoạt động Xuất sắc 2025–2026'], ['Nhì', 'NCKH sinh viên cấp Khoa']],
  groups: [
    ['Học vấn', [
      entry('Học viện Chính sách và Phát triển (APD)', 'Cử nhân Kinh tế số · chuyên ngành Phân tích dữ liệu lớn · lớp PTDLL15', '', [], true),
      entry('Sinh viên có thành tích hoạt động Xuất sắc', 'Khoa Kinh tế số, APD', 'HK I 2025–2026', [], true),
      entry('Chủ nhiệm nhóm nghiên cứu khoa học sinh viên', 'Khoa Kinh tế số, APD', '2025 – 2026', [
        'Đề tài: “Tác động của thuật toán gợi ý đến hành vi tiêu dùng của người mua hàng trên TikTok Shop”.',
        'Kết quả: Giải Nhì Nghiên cứu khoa học sinh viên cấp Khoa.',
      ]),
    ]],
    ['Năng lực chuyên môn & chứng chỉ', [
      entry('Ngoại ngữ', 'IELTS 6.0 · đang hướng tới mục tiêu 7.0'),
      entry('Chứng chỉ', 'Foundations: Data, Data, Everywhere · Google Data Analytics (Coursera)'),
      entry('Công cụ', 'Python, Power BI, SQL cơ bản, GitHub, Excel; Canva và PowerPoint cho trình bày báo cáo; CapCut cho dựng video'),
      entry('Kỹ năng mềm', 'Thuyết trình và MC, tranh biện, viết kịch bản nội dung số, làm việc nhóm và điều phối dự án'),
      entry('Kênh cá nhân', 'Kênh TikTok truyền cảm hứng học tập với hơn 2.000 người theo dõi'),
    ]],
  ],
};

const EXPERIENCE = {
  script: 'Phố Gangnam',
  title: 'Kinh nghiệm',
  lead: [
    'Mỗi vị trí mình đảm nhận là một cơ hội để học từ người đi trước và từ chính công việc. Từ vai trò đại sứ sinh viên, truyền thông sự kiện đến nghiên cứu và kiến tập, mình dần hiểu rằng làm tốt một việc cần cả sự chuẩn bị kỹ lưỡng lẫn tinh thần sẵn sàng thử cái mới.',
    'Mình trân trọng những người đã tin tưởng giao việc và luôn cố gắng hoàn thành phần việc của mình một cách chỉn chu, đúng hẹn.',
  ],
  note: [['6', 'vị trí & dự án'], ['3', 'thương hiệu đại sứ'], ['5', 'sự kiện truyền thông']],
  groups: [
    ['', [
      entry('Đại sứ Sinh viên (Student Ambassador)', 'Google Việt Nam', '02/2026 – nay', [
        'Đại diện Google tại Học viện, là cầu nối giữa sinh viên với các chương trình, sản phẩm và công nghệ của Google.',
        'Phối hợp lên ý tưởng, điều phối và trực tiếp dẫn dắt các workshop công nghệ, đặc biệt về Trí tuệ nhân tạo và công cụ dữ liệu.',
        'Lan tỏa giá trị chuyển đổi số tới cộng đồng sinh viên qua nội dung số và hoạt động tại trường.',
      ], true),
      entry('Đại sứ Thương hiệu Sinh viên (Anessa Students Ambassador)', 'ANESSA Việt Nam', '2026', [
        'Tham gia trực tiếp các chiến dịch truyền thông của thương hiệu hướng tới nhóm khách hàng Gen Z.',
        'Sáng tạo nội dung hình ảnh và video trên mạng xã hội theo cấu trúc kịch bản KOC (đặt vấn đề – dẫn dắt – trải nghiệm – kêu gọi hành động), góp phần tăng độ nhận diện cho các dòng sản phẩm mới.',
      ], true),
      entry('Đại sứ Thương hiệu Sinh viên (NEXT TREND Ambassador)', 'OPPO Việt Nam', '2025', [
        'Tham gia chiến dịch truyền thông sản phẩm hướng tới người dùng trẻ; sản xuất nội dung đa nền tảng.',
        'Nghiên cứu và nắm bắt hành vi tiêu dùng của Gen Z để điều chỉnh thông điệp truyền thông phù hợp.',
      ]),
      entry('Đại sứ Truyền thông', 'Các dự án và sự kiện quy mô lớn', '2024 – 2025', [
        'Đại sứ Truyền thông cho: Hackathon Vietnam (Google Developer Groups), YouthSpeak Unitour 2025, Mini Leadership Conference 2024, Trạm Hiến Máu (Đại học Kinh tế Quốc dân) và You Can (Học viện Tài chính).',
        'Lên kế hoạch và thực thi việc lan tỏa thông điệp sự kiện trên các nền tảng số; viết bài, sản xuất nội dung truyền thông.',
        'Mở rộng mạng lưới tiếp cận tới hàng nghìn sinh viên trên toàn quốc.',
      ]),
      entry('Nghiên cứu khoa học sinh viên · Chủ nhiệm nhóm', 'Khoa Kinh tế số, APD', '2025 – 2026', [
        'Đề tài: “Tác động của thuật toán gợi ý đến hành vi tiêu dùng của người mua hàng trên TikTok Shop”.',
        'Kết quả: Giải Nhì Nghiên cứu khoa học sinh viên cấp Khoa.',
      ]),
      entry('Sinh viên kiến tập', 'Công ty TNHH Ô Tô Thái Nguyên (đại lý Mitsubishi)', '2026', [
        'Thực hiện báo cáo phân tích năng lực cạnh tranh và thị phần của thương hiệu Mitsubishi trên thị trường khu vực.',
        'Thu thập, xử lý số liệu bán hàng và so sánh với các đối thủ cùng phân khúc để đề xuất hướng cải thiện vị thế cạnh tranh.',
      ]),
    ]],
  ],
};

const LEADERSHIP = {
  script: 'Gwanghwamun',
  title: 'Lãnh đạo',
  lead: [
    'Mình quan niệm dẫn dắt trước hết là lắng nghe và cùng làm với mọi người. Ở lớp học, Liên chi đoàn hay câu lạc bộ, mình học cách phân chia công việc, giữ nhịp cho cả nhóm và đứng ra khi tập thể cần một người đại diện.',
    'Mỗi hoạt động giúp mình tự tin hơn khi nói trước đông người, và hiểu rằng kết quả tốt luôn đến từ sự góp sức của cả tập thể.',
  ],
  note: [['1.600', 'sinh viên mình đại diện tại Đền Hùng'], ['7', 'vai trò lãnh đạo & đại diện']],
  groups: [
    ['', [
      entry('Ban Chấp hành Liên chi đoàn Khoa Kinh tế số', 'Học viện Chính sách và Phát triển', '2024 – nay', [
        'Vị trí: Phó ban Đổi mới sáng tạo; thành viên Ban chuyên môn; thành viên Ban truyền thông kiêm MC.',
        'Tham gia xây dựng khung chương trình và định hướng chuyên môn cho các hoạt động cấp Khoa.',
        'Trực tiếp điều phối các dự án đổi mới sáng tạo, sản xuất ấn phẩm truyền thông và dẫn dắt các sự kiện quan trọng của Khoa.',
      ], true),
      entry('Trưởng ban Phát thanh & Đại diện Sinh viên', 'Chuỗi sự kiện Vitri APD Military', '2024 – 2025', [
        'Quản lý kịch bản và chất lượng nội dung các buổi phát thanh trong khuôn khổ chương trình.',
        'Đại diện cho hơn 1.600 sinh viên đọc diễn văn tại Đền Hùng, rèn luyện bản lĩnh sân khấu và kỹ năng nói trước công chúng quy mô lớn.',
      ], true),
      entry('Bộ trưởng Bộ Tài chính · Phiên họp Quốc hội giả định', 'Khoa Chính sách công, APD', '03/2026', [
        'Nghiên cứu và xây dựng luận điểm về ngân sách nhà nước và kinh tế vĩ mô.',
        'Trực tiếp tranh biện và bảo vệ phương án chính sách trước hội đồng mô phỏng.',
      ]),
      entry('Lớp phó lớp PTDLL15', 'Khoa Kinh tế số, APD', '2024 – nay', [
        'Hỗ trợ giảng viên quản lý lớp học, theo dõi và đôn đốc tiến độ học tập của tập thể.',
        'Tổ chức các hoạt động nội bộ nhằm gắn kết và nâng cao tinh thần học tập của lớp.',
      ]),
      entry('Leader Team Sóng Biển', 'Chương trình chào tân sinh viên APD', '2025', [
        'Dẫn dắt đội đại diện Khoa Kinh tế số: xây dựng chiến lược thi đấu, phân vai và gắn kết các thành viên.',
      ]),
      entry('Thành viên nòng cốt câu lạc bộ', 'CLB AEC & CLB ACC', '2024 – 2025', [
        'CLB AEC · Ban Truyền thông & MC: dẫn chương trình sự kiện Christmas with AEC, đẩy mạnh truyền thông đa nền tảng.',
        'CLB ACC · Ban Phát thanh: xây dựng kịch bản, thu âm và phát sóng các chuyên mục nội bộ.',
      ]),
      entry('Đại diện hình ảnh sinh viên', 'Video quảng bá Học viện hợp tác cùng VTV', '26 – 27/03/2026', [
        'Được chọn làm gương mặt đại diện sinh viên trong sản phẩm truyền thông quảng bá hình ảnh Học viện Chính sách và Phát triển trên VTV Digital.',
      ], false, { href: 'https://www.facebook.com/reel/996751792998006', label: 'Xem video phát sóng trên VTV' }),
    ]],
  ],
};

const AWARDS = {
  script: 'Công viên Olympic',
  title: 'Thành tích',
  lead: [
    'Các giải thưởng là dấu mốc ghi lại những lần mình dám thử sức ở nhiều lĩnh vực khác nhau, từ nghiên cứu, tiếng Anh đến kinh doanh và sáng tạo nội dung.',
    'Điều mình nhớ nhất không phải là kết quả, mà là quá trình chuẩn bị cùng đồng đội và những góp ý giúp mình tiến bộ. Mỗi giải thưởng là thêm một động lực để mình tiếp tục học hỏi.',
  ],
  note: [['8', 'giải thưởng'], ['Nhất', 'tọa đàm cấp Khoa'], ['Top 28', 'chung kết toàn quốc']],
  groups: [
    ['Học thuật & nghiên cứu', [
      entry('Giải Nhì · Nghiên cứu khoa học sinh viên cấp Khoa', '“Tác động của thuật toán tới hành vi tiêu dùng của người mua hàng trên TikTok Shop”', '', [], true),
      entry('Giải Nhất · Tọa đàm cấp Khoa “English and Technology: Partners in Progress”', 'Khoa Kinh tế số, APD', '', [], true),
      entry('Giải Ba · Cuộc thi Destination Through Times', 'Khoa Quản trị kinh doanh, APD'),
      entry('Giải Ba · APD English Contest', 'Khoa Ngôn ngữ Anh, APD'),
    ]],
    ['Kinh doanh & khởi nghiệp', [
      entry('Top 28 Chung kết toàn quốc · The Story of Leaders 2024', 'Hệ sinh thái MSOC (MSOCE)', '2024', [], true),
      entry('Giải Triển vọng · Cuộc thi Đột phá Kinh doanh số DBIC 2025', 'Khoa Kinh tế & Quản lý, Đại học Đại Nam', '2025'),
    ]],
    ['Sáng tạo & truyền thông', [
      entry('Quý quân (Giải Ba) · Cuộc thi Sản xuất Video Quảng cáo Take One', 'Youth NEU Media tổ chức, bảo trợ bởi Đoàn Thanh niên NEU', '', [
        'Thể hiện tư duy hình ảnh, năng lực quay dựng và kể chuyện thương hiệu.',
      ]),
      entry('Giải Khuyến khích · Cuộc thi hùng biện và truyền cảm hứng Inspire the Light', 'Khoa Luật kinh tế, APD'),
    ]],
    ['Danh hiệu', [
      entry('Sinh viên có thành tích hoạt động Xuất sắc', 'Khoa Kinh tế số', 'HK I 2025–2026'),
    ]],
  ],
};

const COMMUNITY = {
  script: 'Công viên sông Hàn',
  title: 'Xã hội',
  lead: [
    'Mình tin rằng những điều mình học được sẽ ý nghĩa hơn khi được dùng để giúp đỡ người khác. Từ những chuyến đi tới vùng cao, các giải chạy gây quỹ đến dự án tái chế, mình học được sự kiên nhẫn và tinh thần trách nhiệm.',
    'Những thay đổi có thể còn nhỏ, nhưng niềm vui khi cùng mọi người làm điều tốt là động lực để mình tiếp tục đóng góp cho cộng đồng.',
  ],
  note: [['5', 'hoạt động cộng đồng'], ['2026', 'Đại sứ Gen G · Ví Xanh']],
  groups: [
    ['', [
      entry('Tình nguyện viên · Chiến dịch Thắp ĐUỐC', 'Tổ chức tình nguyện ĐUỐC', '2025', [
        'Tham gia chuẩn bị, gây quỹ và vận chuyển quà hỗ trợ tới điểm trường THCS tại Võ Nhai, Thái Nguyên.',
        'Làm việc cùng nhóm tình nguyện tại địa phương trong điều kiện di chuyển và hậu cần khó khăn.',
      ], true),
      entry('Dự án Ví Xanh · Đại sứ Gen G 2026 (Panasonic × GreenU)', 'Dự án kinh tế tuần hoàn', '2026', [
        'Đồng sáng lập dự án thu gom quần áo cũ và bã cà phê để tái chế theo mô hình kinh tế tuần hoàn, cùng nhóm 5 sinh viên.',
        'Phụ trách xây dựng nội dung, thông điệp truyền thông và lộ trình triển khai của dự án.',
      ], true),
      entry('Runner · Giải chạy IRONRUN', 'Giải chạy gây quỹ cộng đồng', '2025', [
        'Chạy việt dã gây quỹ ủng hộ người khuyết tật, lan tỏa lối sống lành mạnh và tinh thần trách nhiệm với cộng đồng.',
      ]),
      entry('Cộng tác viên chương trình “Nắng về trên bản”', 'Chương trình thiện nguyện vùng cao', '2026', [
        'Hỗ trợ tổ chức, truyền thông và vận động nguồn lực cho các hoạt động hướng về học sinh vùng cao.',
      ]),
      entry('Thành viên đội xúc tiến tuyển sinh', 'Khoa Kinh tế số, APD', '2025 – nay', [
        'Tư vấn, giới thiệu ngành học và đồng hành cùng học sinh phổ thông trong quá trình tìm hiểu định hướng nghề nghiệp.',
      ]),
    ]],
  ],
};

export const DOSSIERS = [INTRO, EDUCATION, EXPERIENCE, LEADERSHIP, AWARDS, COMMUNITY];
