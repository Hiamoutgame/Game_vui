import type { Article } from "@/types/content";

export const articles: Article[] = [
  {
    slug: "space-shift-log-1",
    title: "Ghi chép dịch chuyển vũ trụ #1",
    excerpt:
      "Một nghi thức khởi động deadline quen thuộc: mở máy, tạo thật nhiều tác vụ, rồi tin rằng mình đã sẵn sàng.",
    category: "Ghi chép dịch chuyển",
    status: "complete",
    cover: { label: "Ghi chép #1", alt: "Ghi chép dịch chuyển vũ trụ số 1", ratio: "square" },
    blocks: [
      { type: "paragraph", text: "Hệ thống vừa quét qua đa vũ trụ và ghi nhận một nghi thức khởi động mỗi khi thực hiện deadline trông có vẻ cực kỳ uy tín từ các hệ người chơi." },
      { type: "paragraph", text: "Các hành vi trong báo cáo được ghi nhận như sau:" },
      { type: "quote", text: "Mở máy → Khởi tạo một loạt tác vụ dày đặc → Yên tâm bắt đầu thực hiện nhiệm vụ" },
      { type: "paragraph", text: "Hành vi này đã được đồng bộ và lặp lại liên tục qua vô số vũ trụ lẫn các dòng thời gian khác nhau. Ký chủ có phải người chơi thường xuyên thực hiện hành vi này?" },
    ],
  },
  {
    slug: "alt-tab-space-formula",
    title: "ALT + TAB - Công thức dịch chuyển xuyên vũ trụ",
    excerpt:
      "Một cú Alt + Tab có thể tạo cảm giác kiểm soát, nhưng cũng có thể là dấu hiệu não đang trả phí chuyển đổi tác vụ.",
    category: "Ghi chép dịch chuyển",
    status: "complete",
    cover: { label: "Ghi chép #2", alt: "Ghi chép dịch chuyển vũ trụ số 2", ratio: "square" },
    blocks: [
      { type: "paragraph", text: "ALT + TAB - CÔNG THỨC DỊCH CHUYỂN XUYÊN VŨ TRỤ" },
      { type: "list", items: ["Tần suất dịch chuyển vũ trụ bất thường", "Tạch tạch chuyển tab tốc độ ánh sáng", "Thần thái ngút ngàn, ngạo nghễ dân chơi multitasks vip pro"] },
      { type: "paragraph", text: "Hệ thống vừa quét qua dữ liệu và ghi nhận rất nhiều người chơi mang danh hiệu Chiến thần đa nhiệm đang một mình gánh vác cả giang sơn, cân tất cả các vũ trụ cùng một lúc." },
      { type: "list", items: ["Vũ trụ này có file đang xử lý dang dở", "Vũ trụ kia là bộ phim đang coi giữa chừng", "Vũ trụ khác cùng những dòng tin nhắn inh ỏi", "Vũ trụ nọ với drama chưa kịp hít hà xong"] },
      { type: "paragraph", text: "Giao diện bên ngoài trông vô cùng bận rộn. Nhưng liệu trong số đống tab ngổn ngang đó, ta thực sự đang có mặt tại đâu?" },
    ],
  },
  {
    slug: "space-shift-log-3",
    title: "Ghi chép dịch chuyển vũ trụ #3",
    excerpt: "Bản ghi đang chờ đồng bộ full content. Tạm giữ như một tín hiệu nội dung trong hệ thống.",
    category: "Ghi chép dịch chuyển",
    status: "summary-only",
    sourceUrl: "https://www.facebook.com/share/p/186Rx9bgH9/",
    blocks: [{ type: "paragraph", text: "Nội dung đầy đủ đang chờ đội dự án cập nhật vào hệ thống." }],
  },
  {
    slug: "multitask-feeling",
    title: "Multitask là một loại cảm giác?",
    excerpt: "Cảm giác bận rộn có thể rất thật, nhưng hiệu suất thật cần được kiểm chứng bằng kết quả và mức tập trung.",
    category: "Insight",
    status: "summary-only",
    sourceUrl: "https://www.facebook.com/share/p/1FpYWoaoQL/",
    blocks: [{ type: "paragraph", text: "Bài đầy đủ sẽ được chuyển từ kênh social về website khi có nội dung chính thức." }],
  },
  {
    slug: "pseudo-multitask-operating-system",
    title: "Hệ điều hành đa nhiệm ảo",
    excerpt: "Một phép ẩn dụ về cách chúng ta mở quá nhiều tiến trình nhưng quên kiểm tra tài nguyên tập trung.",
    category: "Insight",
    status: "summary-only",
    sourceUrl: "https://www.facebook.com/share/p/19FohY2ASQ/",
    blocks: [{ type: "paragraph", text: "Bài đầy đủ sẽ được cập nhật sau khi có nội dung chính thức." }],
  },
  {
    slug: "switching-fee",
    title: "Phí dịch chuyển",
    excerpt: "Mỗi lần chuyển tab đều có chi phí nhận thức: thời gian khởi động lại, nhớ lại ngữ cảnh và ổn định chú ý.",
    category: "Insight",
    status: "summary-only",
    sourceUrl: "https://www.facebook.com/share/p/1Sc5eYEr1Q/",
    blocks: [{ type: "paragraph", text: "Bài đầy đủ sẽ được cập nhật sau khi có nội dung chính thức." }],
  },
  {
    slug: "overload-error-code",
    title: "Mã lỗi Overload",
    excerpt: "Khi quá nhiều đầu vào cùng lúc đổ về, hệ thống tập trung bắt đầu báo quá tải.",
    category: "Mã lỗi",
    status: "summary-only",
    sourceUrl: "https://www.facebook.com/share/p/1J4nT4Jo1b/",
    blocks: [{ type: "paragraph", text: "Bài đầy đủ sẽ được cập nhật sau khi có nội dung chính thức." }],
  },
  {
    slug: "error-404-focus-not-found",
    title: "Mã lỗi 404",
    excerpt: "Focus not found: trạng thái tưởng đang làm nhiều việc nhưng không thật sự ở lại với việc nào.",
    category: "Mã lỗi",
    status: "summary-only",
    sourceUrl: "https://www.facebook.com/share/p/1DF6vu3r74/",
    blocks: [{ type: "paragraph", text: "Bài đầy đủ sẽ được cập nhật sau khi có nội dung chính thức." }],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
