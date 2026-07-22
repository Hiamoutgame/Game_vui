"use client";

import { useState } from "react";
import Link from "next/link";


const allTasks = [
  {
    id: "km",
    icon: "KM",
    title: "Ký ức phân mảnh",
    desc: "Lật đúng các cặp ký hiệu trước khi thời gian cạn.",
    target: "Lật đúng các cặp ký hiệu trước khi thời gian cạn.",
    action: "Chạm vào hai ô để kiểm tra cặp. Sai cặp sẽ làm mất nhịp chú ý.",
    demo: "Hệ thống cho bạn thử một lượt trước khi vào mô phỏng chính."
  },
  {
    id: "ht",
    icon: "HT",
    title: "Hứng tác vụ rơi",
    desc: "Điều khiển máng hứng những việc đang rơi xuống.",
    target: "Bắt đúng các khối tác vụ đang rơi từ trên xuống.",
    action: "Sử dụng phím mũi tên hoặc lướt trái/phải để di chuyển máng.",
    demo: "Hệ thống sẽ thả 3 khối tác vụ chậm để bạn làm quen."
  },
  {
    id: "nc",
    icon: "NC",
    title: "Nhiễu màu-chữ",
    desc: "Chọn ĐÚNG hoặc SAI khi chữ và màu cố tình đánh lừa bạn.",
    target: "Chỉ định đúng tên màu sắc của chữ, bất chấp ý nghĩa của chữ.",
    action: "Nhấn nút màu tương ứng với màu hiển thị của chữ.",
    demo: "2 câu hỏi nháp sẽ giúp não bộ cân chuẩn lại tín hiệu."
  },
  {
    id: "px",
    icon: "PX",
    title: "Phản xạ ngược chiều",
    desc: "Phản hồi theo hướng ngược lại với mũi tên hệ thống đưa ra.",
    target: "Nhập hướng đi ngược lại hoàn toàn so với chỉ báo.",
    action: "Mũi tên chỉ trái -> Nhấn phải. Mũi tên chỉ lên -> Nhấn xuống.",
    demo: "Hãy tập quen với 2 lượt thử đảo ngược."
  }
];

export default function MissionPage() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>(["km", "ht"]);
  const [activeTutorial, setActiveTutorial] = useState<string>("km");

  const toggleTask = (id: string) => {
    setSelectedTasks(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const tutorialTask = allTasks.find(t => t.id === activeTutorial) || allTasks[0];
  const canStart = selectedTasks.length >= 2;

  return (
    <main id="main-content" className="px-5 py-16 md:px-10 lg:px-24 min-h-[80vh]">
      <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Left Side: Task Selector List */}
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
              CHỌN TÁC VỤ // TỐI THIỂU 2
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase text-white md:text-4xl">
              Cấu hình vũ trụ cần xử lý
            </h1>
            <p className="text-[color:var(--text-muted)] text-base leading-7 max-w-2xl">
              Chọn càng nhiều tác vụ, độ khó càng cao. Nếu chưa đủ 2 tác vụ, hệ thống sẽ giữ nút khởi động ở trạng thái chờ.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {allTasks.map((task, idx) => {
              const isSelected = selectedTasks.includes(task.id);


              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  onMouseEnter={() => setActiveTutorial(task.id)}
                  className={`group relative flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all duration-300 ${isSelected ? "border-[color:var(--neon-cyan)] bg-[color:var(--surface)]" : "border-[color:var(--neon-purple)]/30 bg-[color:var(--background)] hover:border-[color:var(--neon-purple)]"}`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border font-mono font-bold transition-colors ${isSelected ? "border-[color:var(--neon-cyan)]/50 bg-[color:var(--neon-blue)] text-white" : "border-white/10 bg-white/5 text-[color:var(--text-muted)]"}`}>
                    0{idx + 1}
                  </div>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-colors font-[family-name:var(--font-heading)] font-bold text-lg ${isSelected ? "border-[color:var(--neon-cyan)] bg-black text-[color:var(--neon-cyan)]" : "border-white/20 bg-black text-[color:var(--text-muted)]"}`}>
                    {task.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg transition-colors ${isSelected ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-[color:var(--text-muted)] mt-1 line-clamp-1">{task.desc}</p>
                  </div>

                  {/* Checkbox */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded border-2 transition-colors ${isSelected ? "border-[color:var(--neon-cyan)] bg-[color:var(--neon-cyan)] text-black" : "border-[color:var(--neon-cyan)]/50 bg-transparent text-transparent"}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>

                  {/* Drag Handle */}
                  <div className="flex flex-col gap-1 px-2 opacity-30 hover:opacity-100 transition-opacity cursor-grab">
                    <div className="h-0.5 w-4 rounded-full bg-white" />
                    <div className="h-0.5 w-4 rounded-full bg-white" />
                    <div className="h-0.5 w-4 rounded-full bg-white" />
                  </div>
                </div>
              );
            })}

            {/* Disabled Helper Message */}
            {!canStart && (
              <div className="flex items-center gap-3 rounded-lg border border-[color:var(--neon-pink)]/40 bg-[color:var(--surface)]/60 px-4 py-3 text-sm text-[color:var(--text-muted)] mt-2">
                <span className="text-[color:var(--neon-pink)]">⚠</span>
                Vui lòng chọn thêm {2 - selectedTasks.length} tác vụ để khởi động mô phỏng.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Tutorial Panel */}
        <div className="rounded-lg border border-[color:var(--neon-cyan)]/40 bg-black/40 p-6 shadow-[0_0_24px_rgba(39,255,255,0.1)] backdrop-blur h-fit sticky top-28 flex flex-col gap-6">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--neon-cyan)]">
              HƯỚNG DẪN / TÁC VỤ {allTasks.findIndex(t => t.id === activeTutorial) + 1}/4
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold uppercase text-white">
              {tutorialTask.title}
            </h2>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <p className="font-bold text-white mb-1">Mục tiêu</p>
              <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">{tutorialTask.target}</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Cách thao tác</p>
              <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">{tutorialTask.action}</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Thử nhanh</p>
              <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">{tutorialTask.demo}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-[color:var(--neon-cyan)]/20">
            <Link
              href={canStart ? `/mission/play?tasks=${selectedTasks.join(",")}` : "#"}
              className={`inline-flex min-h-12 items-center justify-center rounded-lg border px-6 font-bold transition-all duration-300 ${canStart ? "border-[color:var(--neon-cyan)] bg-[color:var(--neon-blue)] text-white shadow-[0_0_20px_rgba(39,255,255,0.3)] hover:bg-[color:var(--neon-purple)]" : "cursor-not-allowed border-white/10 bg-white/5 text-white/40"}`}
            >
              Bắt đầu nhiệm vụ
            </Link>
            <button
              onClick={() => setSelectedTasks(["km", "ht"])}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[color:var(--neon-pink)]/60 bg-[color:var(--surface)] text-[color:var(--text-muted)] font-bold transition hover:border-[color:var(--neon-pink)] hover:text-white"
            >
              Đặt lại mặc định
            </button>
            <Link
              href="/mission/play?demo=single"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[color:var(--neon-cyan)]/50 bg-[color:var(--surface)] text-[color:var(--text-muted)] font-bold transition hover:border-[color:var(--neon-cyan)] hover:text-white"
            >
              Chơi thử đơn tác vụ
            </Link>
            <Link
              href="/mission/play?demo=multi"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[color:var(--neon-purple)]/60 bg-[color:var(--surface)] text-[color:var(--text-muted)] font-bold transition hover:border-[color:var(--neon-purple)] hover:text-white"
            >
              Chơi thử đa tác vụ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
