"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: number;
  label: string;
  content: string;
  color: string;
};

const DISTRACTIONS = [
  { label: "NHIỄU 02", content: "Bạn vừa bỏ lỡ một thứ cực kỳ quan trọng. Chắc vậy.", color: "var(--neon-purple, #A855F7)" },
  { label: "CẢNH BÁO GIẢ", content: "Đừng nhìn góc trái. Góc trái đang nhìn lại bạn.", color: "var(--neon-cyan, #22D3EE)" },
  { label: "PING! PING!", content: "Tập trung nào. À không, quên đi, thông báo mới tới rồi.", color: "var(--neon-pink, #FF00FF)" },
  { label: "LỖI HỆ THỐNG", content: "Điểm của bạn vừa bị trừ... Đùa thôi, chưa trừ đâu.", color: "var(--neon-green, #39FF14)" },
  { label: "THÔNG BÁO CHỜ", content: "Đang tải dữ liệu. Bạn có thể chớp mắt 1 lần.", color: "var(--neon-yellow, #EAB308)" }
];

export function DistractionNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let idCounter = 0;
    
    const addNotification = () => {
      const item = DISTRACTIONS[Math.floor(Math.random() * DISTRACTIONS.length)];
      const newNotification = { id: idCounter++, ...item };

      setNotifications((prev) => {
        const updated = [...prev, newNotification];
        return updated.slice(-3);
      });
    };

    const initialTimeout = setTimeout(addNotification, 0);

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        addNotification();
      }
    }, 5500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[999] flex w-full max-w-[356px] flex-col justify-end gap-2.5">
      {notifications.map((n, i) => {
        // Calculate opacity based on position (0 is oldest, length-1 is newest)
        const isOldest = i === 0 && notifications.length === 3;
        const isMiddle = (i === 1 && notifications.length === 3) || (i === 0 && notifications.length === 2);
        
        let opacityClass = "opacity-100 translate-x-0";
        if (isOldest) opacityClass = "opacity-40 translate-x-4";
        else if (isMiddle) opacityClass = "opacity-75 translate-x-2";

        return (
          <div
            key={n.id}
            className={`flex flex-col gap-1.5 overflow-hidden rounded-lg border p-[10px_12px] transition-all duration-700 ease-in-out ${opacityClass}`}
            style={{
              borderColor: n.color,
              boxShadow: `0 8px 20px ${n.color}55`,
              background: "linear-gradient(90deg, rgba(20,0,47,0.93) 0%, rgba(7,20,38,0.93) 100%)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ backgroundColor: n.color, boxShadow: `0 0 8px ${n.color}` }}
              />
              <span
                className="font-mono text-[10px] font-extrabold uppercase tracking-wider"
                style={{ color: n.color }}
              >
                {n.label}
              </span>
            </div>
            
            <p className="font-[family-name:var(--font-body)] text-[13px] font-bold leading-[1.15] text-white">
              {n.content}
            </p>
            
            <div
              className="mt-0.5 h-[2px] w-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${n.color} 0%, transparent 100%)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
