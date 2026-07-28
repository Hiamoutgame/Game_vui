"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameId } from "./types";

interface DemoSlide {
  icon: string;
  text: string;
}

interface DemoInfo {
  title: string;
  icon: string;
  slides: DemoSlide[];
}

const DEMO_DATA: Record<GameId, DemoInfo> = {
  km: {
    title: "Ký ức phân mảnh",
    icon: "🧠",
    slides: [
      {
        icon: "🃏",
        text: "Lật hai thẻ mỗi lượt để tìm các cặp ký hiệu giống nhau. Demo chỉ hoàn tất khi bạn ghép đúng cả 2 cặp.",
      },
    ],
  },
  ht: {
    title: "Hứng tác vụ rơi",
    icon: "⚽",
    slides: [
      {
        icon: "⚽",
        text: "Di chuyển máng sang trái hoặc phải để hứng khối tác vụ đang rơi. Demo hoàn tất khi bạn hứng được 1 khối.",
      },
    ],
  },
  nc: {
    title: "Nhiễu màu-chữ",
    icon: "🎨",
    slides: [
      {
        icon: "🎨",
        text: 'Chọn "ĐÚNG" nếu nghĩa của chữ khớp với màu hiển thị. Chọn "SAI" nếu nghĩa và màu không khớp.',
      },
    ],
  },
  px: {
    title: "Phản xạ ngược chiều",
    icon: "🔄",
    slides: [
      {
        icon: "🔄",
        text: "Khi thấy mũi tên, hãy chọn hướng ngược lại hoàn toàn. Demo hoàn tất khi bạn phản hồi đúng hướng đảo chiều.",
      },
    ],
  },
};

interface GameDemoProps {
  gameList: GameId[];
  standalone: boolean;
  isOpen: boolean;
  onFinish: () => void;
}

interface PracticeProps {
  onComplete: () => void;
}

const buttonBaseClass =
  "rounded-lg border px-4 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]";

const PRACTICE_AREA_HEIGHT = 112;
const PRACTICE_BALL_SIZE = 16;
const PRACTICE_BUCKET_HEIGHT = 16;
const PRACTICE_BUCKET_BOTTOM = 8;
const PRACTICE_BALL_VISIBLE_WHEN_CAUGHT = 0.75;

export default function GameDemo({ gameList, standalone, isOpen, onFinish }: GameDemoProps) {
  const normalizedGameList = gameList.length > 0 ? gameList : (["km", "ht", "nc", "px"] as GameId[]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPractice, setShowPractice] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);

  const currentGameId = normalizedGameList[currentIndex] || "km";
  const demo = DEMO_DATA[currentGameId];
  const totalGames = normalizedGameList.length;
  const slide = demo.slides[currentSlide] || demo.slides[0];
  const isLastGame = currentIndex + 1 >= totalGames;

  if (!isOpen) return null;

  const goToPractice = () => {
    if (currentSlide + 1 >= demo.slides.length) {
      setShowPractice(true);
      setPracticeComplete(false);
    } else {
      setCurrentSlide((value) => value + 1);
    }
  };

  const goToNextGame = () => {
    if (!practiceComplete) return;

    if (isLastGame) {
      onFinish();
      return;
    }

    setCurrentSlide(0);
    setShowPractice(false);
    setPracticeComplete(false);
    setCurrentIndex((value) => value + 1);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Hướng dẫn: ${demo.title}`}
    >
      <div className="max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-2xl border border-[color:var(--neon-cyan)]/40 bg-[color:var(--background)] p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="mb-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--neon-cyan)]">
            TÁC VỤ {currentIndex + 1}/{totalGames}
          </p>
          <div className="my-2 text-4xl" aria-hidden="true">
            {demo.icon}
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">{demo.title}</h2>
        </div>

        {!showPractice ? (
          <div className="my-4">
            <div className="mb-2 text-3xl" aria-hidden="true">
              {slide.icon}
            </div>
            <p className="px-2 text-sm leading-relaxed text-[color:var(--text-muted)]">{slide.text}</p>
          </div>
        ) : (
          <div className="my-4 rounded-lg border border-dashed border-[color:var(--neon-cyan)]/30 bg-[color:var(--surface)] p-3">
            <PracticeContent gameId={currentGameId} onComplete={() => setPracticeComplete(true)} />
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {showPractice && !practiceComplete ? (
            <p className="text-xs font-bold text-[color:var(--neon-pink)]">Hoàn thành demo này để mở tác vụ tiếp theo.</p>
          ) : null}
          <button
            type="button"
            onClick={!showPractice ? goToPractice : goToNextGame}
            disabled={showPractice && !practiceComplete}
            className={`min-h-11 rounded-lg px-6 py-2 text-sm font-bold transition shadow-[0_0_16px_rgba(55,15,255,0.4)] ${
              showPractice && !practiceComplete
                ? "cursor-not-allowed bg-white/10 text-white/40 shadow-none"
                : "bg-[color:var(--neon-blue)] text-white hover:bg-[color:var(--neon-purple)]"
            }`}
          >
            {!showPractice
              ? "Vào demo tương tác →"
              : isLastGame
                ? standalone
                  ? "Hoàn tất demo"
                  : "Bắt đầu nhiệm vụ"
                : "Game tiếp theo →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PracticeContent({ gameId, onComplete }: { gameId: GameId; onComplete: () => void }) {
  if (gameId === "km") return <MemoryPractice onComplete={onComplete} />;
  if (gameId === "ht") return <CatchPractice onComplete={onComplete} />;
  if (gameId === "nc") return <WordPractice onComplete={onComplete} />;
  return <ReverseArrowPractice onComplete={onComplete} />;
}

function MemoryPractice({ onComplete }: PracticeProps) {
  const cards = useMemo(
    () => [
      { id: 1, value: "★" },
      { id: 2, value: "◆" },
      { id: 3, value: "★" },
      { id: 4, value: "◆" },
    ],
    []
  );
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedValues, setMatchedValues] = useState<string[]>([]);
  const [message, setMessage] = useState("Lật 2 thẻ để tìm cặp giống nhau.");
  const lockRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const pickCard = (cardId: number) => {
    if (lockRef.current || flipped.includes(cardId)) return;

    const nextFlipped = [...flipped, cardId];
    setFlipped(nextFlipped);

    if (nextFlipped.length !== 2) return;

    lockRef.current = true;
    const first = cards.find((card) => card.id === nextFlipped[0]);
    const second = cards.find((card) => card.id === nextFlipped[1]);

    timerRef.current = setTimeout(() => {
      if (first && second && first.value === second.value) {
        const nextMatchedValues = matchedValues.includes(first.value) ? matchedValues : [...matchedValues, first.value];
        setMatchedValues(nextMatchedValues);
        setMessage(nextMatchedValues.length >= 2 ? "Đã ghép xong cả 2 cặp." : "Đúng cặp, tiếp tục cặp còn lại.");
        if (nextMatchedValues.length >= 2) onComplete();
      } else {
        setMessage("Chưa đúng cặp, thử lại nhé.");
      }
      setFlipped([]);
      lockRef.current = false;
    }, 420);
  };

  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center gap-3">
      <p className="text-xs font-bold text-[color:var(--neon-cyan)]">Thử lật cặp thẻ</p>
      <div className="grid w-full max-w-[150px] grid-cols-2 gap-2">
        {cards.map((card) => {
          const isMatched = matchedValues.includes(card.value);
          const isFlipped = flipped.includes(card.id) || isMatched;

          return (
            <button
              key={card.id}
              type="button"
              aria-label={`Lật thẻ demo ${card.id}`}
              onClick={() => pickCard(card.id)}
              disabled={isMatched}
              className={`aspect-square rounded-lg border text-2xl font-bold transition ${
                isFlipped
                  ? "border-[color:var(--neon-pink)] bg-[linear-gradient(135deg,#370fff,#8200ff)] text-white"
                  : "border-[color:var(--neon-cyan)]/30 bg-black/60 text-[color:var(--neon-cyan)] hover:border-[color:var(--neon-cyan)]"
              } ${isMatched ? "opacity-45" : ""}`}
            >
              {isFlipped ? card.value : "?"}
            </button>
          );
        })}
      </div>
      <p className="min-h-5 text-xs text-[color:var(--text-muted)]">{message}</p>
    </div>
  );
}

function CatchPractice({ onComplete }: PracticeProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const bucketXRef = useRef(20);
  const ballYRef = useRef(0);
  const [bucketX, setBucketX] = useState(20);
  const [ballY, setBallY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("Kéo máng hoặc dùng A/D để hứng khối rơi.");

  const moveBucket = (nextX: number) => {
    const safeX = Math.max(10, Math.min(90, nextX));
    bucketXRef.current = safeX;
    setBucketX(safeX);
  };

  const getAreaHeight = useCallback(() => areaRef.current?.offsetHeight || PRACTICE_AREA_HEIGHT, []);

  const getCaughtBallY = useCallback(() => {
    const areaHeight = getAreaHeight();
    const caughtTop = areaHeight - PRACTICE_BUCKET_BOTTOM - PRACTICE_BUCKET_HEIGHT - PRACTICE_BALL_SIZE * PRACTICE_BALL_VISIBLE_WHEN_CAUGHT;

    return (caughtTop / areaHeight) * 100;
  }, [getAreaHeight]);

  useEffect(() => {
    if (completedRef.current) return;

    const timer = window.setInterval(() => {
      if (completedRef.current) return;

      const nextY = ballYRef.current + 2.2;
      const areaHeight = getAreaHeight();
      const bucketTop = areaHeight - PRACTICE_BUCKET_BOTTOM - PRACTICE_BUCKET_HEIGHT;
      const ballBottom = (nextY / 100) * areaHeight + PRACTICE_BALL_SIZE;

      if (ballBottom < bucketTop) {
        ballYRef.current = nextY;
        setBallY(nextY);
        return;
      }

      if (Math.abs(bucketXRef.current - 50) <= 12) {
        completedRef.current = true;
        const caughtY = getCaughtBallY();
        ballYRef.current = caughtY;
        setBallY(caughtY);
        setMessage("Đã hứng được khối tác vụ.");
        onComplete();
        return;
      }

      ballYRef.current = 0;
      setBallY(0);
      setMessage("Trượt rồi, căn máng gần giữa và thử lại.");
    }, 40);

    return () => window.clearInterval(timer);
  }, [getAreaHeight, getCaughtBallY, onComplete]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "a") {
        moveBucket(bucketXRef.current - 8);
      }
      if (event.key.toLowerCase() === "d") {
        moveBucket(bucketXRef.current + 8);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const updateBucketFromPointer = (clientX: number) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const nextX = ((clientX - rect.left) / rect.width) * 100;
    moveBucket(nextX);
  };

  return (
    <div className="flex min-h-[170px] flex-col gap-3">
      <p className="text-xs font-bold text-[color:var(--neon-cyan)]">Hứng 1 khối tác vụ rơi</p>
      <div
        ref={areaRef}
        tabIndex={0}
        onPointerDown={(event) => {
          setDragging(true);
          updateBucketFromPointer(event.clientX);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragging) updateBucketFromPointer(event.clientX);
        }}
        onPointerUp={(event) => {
          setDragging(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={() => setDragging(false)}
        onLostPointerCapture={() => setDragging(false)}
        className="relative h-[112px] overflow-hidden rounded-lg border border-white/10 bg-black/70 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]"
      >
        <div
          className="absolute z-0 h-4 w-4 rounded-full bg-[color:var(--neon-pink)] shadow-[0_0_10px_rgba(255,0,255,0.8)]"
          style={{ left: "calc(50% - 8px)", top: `${ballY}%` }}
        />
        <div
          className="absolute bottom-2 z-10 h-4 w-14 rounded-full bg-[color:var(--neon-cyan)] shadow-[0_0_10px_rgba(39,255,255,0.7)]"
          style={{ left: `calc(${bucketX}% - 28px)` }}
        />
      </div>
      <div className="flex justify-center gap-2">
        <button type="button" className={`${buttonBaseClass} border-white/15 bg-white/10 text-white`} onClick={() => moveBucket(bucketXRef.current - 8)}>
          A
        </button>
        <button type="button" className={`${buttonBaseClass} border-white/15 bg-white/10 text-white`} onClick={() => moveBucket(bucketXRef.current + 8)}>
          D
        </button>
      </div>
      <p className="min-h-5 text-xs text-[color:var(--text-muted)]">{message}</p>
    </div>
  );
}

function WordPractice({ onComplete }: PracticeProps) {
  const [message, setMessage] = useState("Chữ BLUE đang có màu đỏ, vậy đáp án là SAI.");
  const [complete, setComplete] = useState(false);

  const answer = (isCorrect: boolean) => {
    if (complete) return;

    if (isCorrect) {
      setComplete(true);
      setMessage("Đúng. Màu đỏ không khớp với nghĩa XANH.");
      onComplete();
    } else {
      setMessage("Chưa đúng. Hãy xét màu hiển thị, không chỉ đọc nghĩa chữ.");
    }
  };

  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center gap-3">
      <p className="text-xs font-bold text-[color:var(--neon-cyan)]">Màu và nghĩa có khớp không?</p>
      <div className="text-3xl font-extrabold tracking-widest text-red-500">XANH</div>
      <div className="flex gap-2">
        <button type="button" onClick={() => answer(false)} className={`${buttonBaseClass} border-[color:var(--neon-green)] bg-[color:var(--neon-green)] text-black`}>
          ĐÚNG
        </button>
        <button type="button" onClick={() => answer(true)} className={`${buttonBaseClass} border-red-500 bg-red-600 text-white`}>
          SAI
        </button>
      </div>
      <p className="min-h-5 text-xs text-[color:var(--text-muted)]">{message}</p>
    </div>
  );
}

type Direction = "up" | "down" | "left" | "right";

function ReverseArrowPractice({ onComplete }: PracticeProps) {
  const [message, setMessage] = useState("Mũi tên đang chỉ lên, hãy chọn hướng ngược lại.");
  const [complete, setComplete] = useState(false);

  const choose = (direction: Direction) => {
    if (complete) return;

    if (direction === "down") {
      setComplete(true);
      setMessage("Chính xác. Xuống là hướng ngược của lên.");
      onComplete();
    } else {
      setMessage("Chưa đúng, hãy chọn hướng ngược lại với mũi tên.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowLeft: "left",
        ArrowDown: "down",
        ArrowRight: "right",
      };
      const direction = keyMap[event.key];
      if (direction) choose(direction);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="flex min-h-[170px] flex-col items-center justify-center gap-3">
      <p className="text-xs font-bold text-[color:var(--neon-cyan)]">Chọn hướng ngược lại</p>
      <div className="text-5xl text-white">⬆</div>
      <div className="grid grid-cols-3 gap-2">
        <span />
        <ArrowButton label="▲" onClick={() => choose("up")} />
        <span />
        <ArrowButton label="◀" onClick={() => choose("left")} />
        <ArrowButton label="▼" onClick={() => choose("down")} />
        <ArrowButton label="▶" onClick={() => choose("right")} />
      </div>
      <p className="min-h-5 text-xs text-[color:var(--text-muted)]">{message}</p>
    </div>
  );
}

function ArrowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="grid h-10 w-10 place-items-center rounded border border-white/15 bg-white/10 text-sm font-bold text-white transition hover:border-[color:var(--neon-cyan)] hover:text-[color:var(--neon-cyan)]">
      {label}
    </button>
  );
}
