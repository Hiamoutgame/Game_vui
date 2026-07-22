import type { MissionQuestion, MissionResult } from "@/types/content";

export const missionQuestions: MissionQuestion[] = [
  {
    id: "tabs",
    question: "Từ sáng tới giờ bạn đã mở khoảng bao nhiêu tab/cửa sổ?",
    options: [
      { label: "Dưới 5", points: 0 },
      { label: "5-12", points: 1 },
      { label: "Trên 12", points: 2 },
    ],
  },
  {
    id: "switching",
    question: "Khi làm deadline, bạn có chuyển qua tin nhắn/social giữa chừng không?",
    options: [
      { label: "Hiếm khi", points: 0 },
      { label: "Có, vài lần", points: 1 },
      { label: "Liên tục", points: 2 },
    ],
  },
  {
    id: "focus",
    question: "Sau mỗi lần đổi tác vụ, bạn mất bao lâu để vào lại nhịp?",
    options: [
      { label: "Gần như ngay", points: 0 },
      { label: "1-3 phút", points: 1 },
      { label: "Lâu hơn hoặc quên đang làm gì", points: 2 },
    ],
  },
];

export const missionResults: MissionResult[] = [
  {
    min: 0,
    title: "Ổn định tác vụ",
    description: "Bạn đang giữ nhịp khá tốt. Hãy tiếp tục gom thông báo và giữ từng block tập trung rõ ràng.",
  },
  {
    min: 3,
    title: "Dịch chuyển nhiều",
    description: "Bạn có xu hướng đổi vũ trụ khi deadline áp sát. Não cần thêm thời gian để tải lại ngữ cảnh sau mỗi lần đổi tab.",
  },
  {
    min: 5,
    title: "System overload",
    description: "Hệ thống chú ý đang chịu tải cao. Thử khóa một tác vụ 10 phút trước khi mở cổng dịch chuyển tiếp theo.",
  },
];
