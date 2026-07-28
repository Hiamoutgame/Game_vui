"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: number;
  side: "left" | "right";
  label: string;
  content: string;
  color: string;
  exiting: boolean;
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
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const setManagedTimeout = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
      return timer;
    };

    const addNotification = (side: Notification["side"]) => {
      const item = DISTRACTIONS[Math.floor(Math.random() * DISTRACTIONS.length)];
      const newNotification = { id: idCounter++, side, exiting: false, ...item };

      setNotifications((prev) => {
        const withoutCurrentSide = prev.filter((notification) => notification.side !== side);
        return [...withoutCurrentSide, newNotification];
      });

      setManagedTimeout(() => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === newNotification.id ? { ...notification, exiting: true } : notification,
          ),
        );
      }, 3600);

      setManagedTimeout(() => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== newNotification.id));
      }, 4300);
    };

    const addBurst = () => {
      const bothSides = Math.random() > 0.62;
      if (bothSides) {
        addNotification("left");
        addNotification("right");
        return;
      }

      addNotification(Math.random() > 0.5 ? "left" : "right");
    };

    const initialTimeout = setManagedTimeout(addBurst, 500);

    const interval = setInterval(() => {
      if (Math.random() > 0.05) {
        addBurst();
      }
    }, 4000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 right-0 z-[999] hidden xl:block">
      {notifications.map((n) => {
        const sideClass = n.side === "left" ? "left-6 2xl:left-12" : "right-6 2xl:right-12";
        const motionClass = n.exiting
          ? n.side === "left"
            ? "opacity-0 -translate-x-5 scale-95"
            : "opacity-0 translate-x-5 scale-95"
          : "opacity-100 translate-x-0 scale-100";

        return (
          <div
            key={n.id}
            className={`absolute top-1/2 flex w-[280px] -translate-y-1/2 flex-col gap-1.5 overflow-hidden rounded-lg border p-[10px_12px] transition-all duration-700 ease-in-out ${sideClass} ${motionClass}`}
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
