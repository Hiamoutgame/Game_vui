"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { GameId } from "./types";

interface DemoSlide {
  icon: string;
  text: string;
}

const DEMO_DATA: Record<GameId, { title: string; icon: string; slides: DemoSlide[] }> = {
  km: {
    title: "Ký ức phân mảnh",
    icon: "🧠",
    slides: [
      {
        icon: "🃏",
        text: "Tất cả các thẻ trên màn hình đều được úp xuống. Nhấp chuột hoặc bấm phím số (1-9, 0) để tìm và lật mở tất cả các cặp thẻ giống nhau.",
      },
    ],
  },
  ht: {
    title: "Hứng tác vụ rơi",
    icon: "⚽",
    slides: [
      {
        icon: "⚽",
        text: "Một khối tác vụ sẽ rơi từ trên xuống. Kéo máng sang trái hoặc phải để hứng, hoặc dùng phím A/D.",
      },
    ],
  },
  nc: {
    title: "Nhiễu màu-chữ",
    icon: "🎨",
    slides: [
      {
        icon: "🎨",
        text: 'Chọn "ĐÚNG" nếu màu của chữ giống với nghĩa của chữ (VD: chữ "ĐỎ" được tô màu đỏ). Chọn "SAI" nếu màu và nghĩa chữ không khớp.',
      },
    ],
  },
  px: {
    title: "Phản xạ ngược chiều",
    icon: "🔄",
    slides: [
      {
        icon: "🔄",
        text: "Một hướng mũi tên xuất hiện. Dùng bàn phím mũi tên/WASD hoặc click chuột vào hướng NGƯỢC LẠI với hướng hiển thị.",
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

export default function GameDemo({ gameList, standalone, isOpen, onFinish }: GameDemoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPractice, setShowPractice] = useState(false);
  const practiceRef = useRef<HTMLDivElement>(null);

  const demo = DEMO_DATA[gameList[currentIndex]] || DEMO_DATA.km;

  const nextSlide = useCallback(() => {
    const slides = demo.slides;
    if (currentSlide + 1 >= slides.length) {
      setShowPractice(true);
    } else {
      setCurrentSlide((s) => s + 1);
    }
  }, [currentSlide, demo.slides]);

  const nextGame = useCallback(() => {
    setShowPractice(false);
    setCurrentSlide(0);
    if (currentIndex + 1 >= gameList.length) {
      onFinish();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, gameList.length, onFinish]);

  const skipAll = useCallback(() => {
    onFinish();
  }, [onFinish]);

  // Practice content generation
  useEffect(() => {
    if (!showPractice || !practiceRef.current) return;

    const container = practiceRef.current;
    container.innerHTML = "";

    const gameId = gameList[currentIndex];
    const practiceHtml = getPracticeContent(gameId);
    container.innerHTML = practiceHtml;
  }, [showPractice, currentIndex, gameList]);

  if (!isOpen) return null;

  const totalGames = gameList.length;
  const slide = demo.slides[currentSlide] || demo.slides[0];

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-label={`Hướng dẫn: ${demo.title}`}
    >
      <div className="bg-[color:var(--background)] border border-[color:var(--neon-cyan)]/40 rounded-2xl p-6 max-w-[440px] w-[92%] shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-center max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--neon-cyan)]">
            TÁC VỤ {currentIndex + 1}/{totalGames}
          </p>
          <div className="text-4xl my-2">{demo.icon}</div>
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
            {demo.title}
          </h2>
        </div>

        {/* Slides / Practice area */}
        {!showPractice ? (
          <div className="my-4">
            <div className="text-3xl mb-2">{slide.icon}</div>
            <p className="text-sm text-[color:var(--text-muted)] leading-relaxed px-2">{slide.text}</p>
          </div>
        ) : (
          <div
            ref={practiceRef}
            className="my-4 p-3 bg-[color:var(--surface)] rounded-lg border border-dashed border-[color:var(--neon-cyan)]/30 min-h-[100px] flex items-center justify-center flex-col gap-2"
          >
            <p className="text-xs text-[color:var(--text-muted)]">Đang tải...</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center gap-3 mt-4">
          <div className="flex gap-2">
            {!standalone && (
              <button onClick={skipAll} className="px-3 py-2 rounded-lg text-xs font-bold bg-white/10 text-[color:var(--text-muted)] hover:bg-white/20 transition">
                Bỏ qua tất cả
              </button>
            )}
            {showPractice && (
              <button onClick={nextGame} className="px-3 py-2 rounded-lg text-xs font-bold bg-white/10 text-[color:var(--text-muted)] hover:bg-white/20 transition">
                Bỏ qua game này
              </button>
            )}
          </div>
          <button
            onClick={!showPractice ? nextSlide : nextGame}
            className="px-6 py-2 rounded-lg font-bold text-sm bg-[color:var(--neon-blue)] text-white hover:bg-[color:var(--neon-purple)] transition shadow-[0_0_16px_rgba(55,15,255,0.4)]"
          >
            {!showPractice ? "Tiếp tục →" : gameList[currentIndex + 1] ? "Game tiếp theo →" : "Bắt đầu nhiệm vụ"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple practice content per game
function getPracticeContent(gameId: GameId): string {
  switch (gameId) {
    case "km": {
      const emojis = ["⭐", "🔥"];
      const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
      return (
        '<div style="font-size:11px;color:var(--neon-cyan);margin-bottom:6px;">Thử lật cặp thẻ (bấm vào để thử)</div>' +
        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;max-width:140px;margin:0 auto;">' +
        cards
          .map(
            (emoji, i) =>
              `<div class="demo-mem-card" data-emoji="${emoji}" data-idx="${i}" style="aspect-ratio:1;background:linear-gradient(135deg,#2c3e50,#3498db);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:24px;color:white;min-width:50px;">?</div>`
          )
          .join("") +
        "</div>" +
        '<div id="demo-mem-result" style="margin-top:6px;font-size:11px;"></div>' +
        "<script>" +
        "(function(){var flipped=[];var matched=0;var locked=false;var cards=document.querySelectorAll('.demo-mem-card');" +
        "cards.forEach(function(c){c.onclick=function(){if(locked||this.textContent!=='?'||matched>=2)return;" +
        "this.textContent=this.dataset.emoji;this.style.background='linear-gradient(135deg,#667eea,#764ba2)';" +
        "flipped.push(this);if(flipped.length===2){locked=true;" +
        "if(flipped[0].dataset.emoji===flipped[1].dataset.emoji){matched++;" +
        "setTimeout(function(){flipped[0].style.opacity='0';flipped[1].style.opacity='0';flipped=[];locked=false;" +
        "if(matched>=2){document.getElementById('demo-mem-result').innerHTML='<span style=color:#39ff14>Đã ghép xong!</span>';}" +
        "},300);}else{setTimeout(function(){flipped[0].textContent='?';flipped[0].style.background='linear-gradient(135deg,#2c3e50,#3498db)';" +
        "flipped[1].textContent='?';flipped[1].style.background='linear-gradient(135deg,#2c3e50,#3498db)';flipped=[];locked=false;},600);}}};});" +
        "})();</script>"
      );
    }
    case "ht": {
      return (
        '<div style="font-size:11px;color:var(--neon-cyan);margin-bottom:4px;">Kéo máng để hứng bóng (demo chậm)</div>' +
        '<div id="demo-ball-area" style="position:relative;width:100%;height:100px;background:rgba(0,0,0,0.6);border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);">' +
        '<div id="demo-ball" style="position:absolute;width:14px;height:14px;background:#ff00ff;border-radius:50%;top:0;left:55px;box-shadow:0 0 8px rgba(255,0,255,0.6);pointer-events:none;"></div>' +
        '<div id="demo-bucket" style="position:absolute;bottom:4px;width:44px;height:16px;background:#27ffff;border-radius:8px;left:40px;box-shadow:0 0 8px rgba(39,255,255,0.5);cursor:pointer;"></div>' +
        "</div>" +
        '<div id="demo-ball-result" style="margin-top:4px;font-size:11px;"></div>' +
        "<script>" +
        "(function(){var bucket=document.getElementById('demo-bucket');var ball=document.getElementById('demo-ball');" +
        "var ballY=0;var bucketX=40;var isPressed=false;var lastX=0;var caught=false;" +
        "bucket.onmousedown=function(e){isPressed=true;lastX=e.clientX;e.preventDefault();};" +
        "bucket.ontouchstart=function(e){isPressed=true;lastX=e.touches[0].clientX;e.preventDefault();};" +
        "document.addEventListener('mousemove',function(e){if(!isPressed||caught)return;bucketX+=e.clientX-lastX;" +
        "bucketX=Math.max(0,Math.min(bucketX,180));bucket.style.left=bucketX+'px';lastX=e.clientX;});" +
        "document.addEventListener('mouseup',function(){isPressed=false;});" +
        "document.addEventListener('touchmove',function(e){if(!isPressed||caught)return;bucketX+=e.touches[0].clientX-lastX;" +
        "bucketX=Math.max(0,Math.min(bucketX,180));bucket.style.left=bucketX+'px';lastX=e.touches[0].clientX;});" +
        "document.addEventListener('touchend',function(){isPressed=false;});" +
        "function drop(){if(caught)return;ballY+=0.25;ball.style.top=ballY+'px';" +
        "var area=document.getElementById('demo-ball-area');if(!area)return;" +
        "if(ballY>=area.offsetHeight-20){var ballLeft=55;" +
        "if(ballLeft+14>bucketX&&ballLeft<bucketX+44){caught=true;document.getElementById('demo-ball-result').innerHTML='<span style=color:#39ff14>Đã hứng được!</span>';return;}" +
        "ballY=0;ball.style.top='0';}requestAnimationFrame(drop);}requestAnimationFrame(drop);})();</script>"
      );
    }
    case "nc": {
      const demoWord = '<span style="color:#e74c3c;font-weight:bold;font-size:18px;">BLUE</span>';
      return (
        '<div style="font-size:11px;color:var(--neon-cyan);margin-bottom:6px;">Chữ "BLUE" màu đỏ → SAI (không trùng)</div>' +
        '<div style="margin:8px 0;">' +
        demoWord +
        "</div>" +
        '<div style="display:flex;gap:8px;justify-content:center;">' +
        '<button id="demo-word-yes" style="padding:6px 18px;background:#39ff14;color:#000;border:none;border-radius:6px;font-weight:bold;cursor:pointer;">[Y] ĐÚNG</button>' +
        '<button id="demo-word-no" style="padding:6px 18px;background:#e74c3c;color:#fff;border:none;border-radius:6px;font-weight:bold;cursor:pointer;">[N] SAI</button>' +
        "</div>" +
        '<div id="demo-word-result" style="margin-top:6px;font-size:11px;"></div>' +
        "<script>" +
        "(function(){" +
        "document.getElementById('demo-word-yes').onclick=function(){document.getElementById('demo-word-result').innerHTML='<span style=color:#e74c3c>❌ Sai! Chữ BLUE màu đỏ — không trùng!</span>';};" +
        "document.getElementById('demo-word-no').onclick=function(){document.getElementById('demo-word-result').innerHTML='<span style=color:#39ff14>✅ Đúng! Chữ BLUE màu đỏ — màu và nghĩa không trùng.</span>';};" +
        "})();</script>"
      );
    }
    case "px": {
      return (
        '<div style="font-size:11px;color:var(--neon-cyan);margin-bottom:6px;">Mũi tên ↑ → Ấn ↓ (ngược lại)</div>' +
        '<div style="font-size:40px;margin:8px 0;">⬆️</div>' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">' +
        '<button id="demo-arr-up" style="width:40px;height:32px;background:rgba(255,255,255,0.1);border:none;border-radius:4px;color:white;font-weight:bold;cursor:pointer;">▲</button>' +
        '<div style="display:flex;gap:2px;">' +
        '<button id="demo-arr-left" style="width:40px;height:32px;background:rgba(255,255,255,0.1);border:none;border-radius:4px;color:white;font-weight:bold;cursor:pointer;">◀</button>' +
        '<button id="demo-arr-down" style="width:40px;height:32px;background:rgba(255,255,255,0.1);border:none;border-radius:4px;color:white;font-weight:bold;cursor:pointer;">▼</button>' +
        '<button id="demo-arr-right" style="width:40px;height:32px;background:rgba(255,255,255,0.1);border:none;border-radius:4px;color:white;font-weight:bold;cursor:pointer;">▶</button>' +
        "</div></div>" +
        '<div id="demo-arr-result" style="margin-top:6px;font-size:11px;"></div>' +
        "<script>" +
        "(function(){var correct=false;" +
        "document.getElementById('demo-arr-down').onclick=function(){document.getElementById('demo-arr-result').innerHTML='<span style=color:#39ff14>✅ Chính xác! ↓ là ngược của ↑</span>';};" +
        "['demo-arr-up','demo-arr-left','demo-arr-right'].forEach(function(id){document.getElementById(id).onclick=function(){document.getElementById('demo-arr-result').innerHTML='<span style=color:#e74c3c>❌ ↑ là ngược của ↓. Hãy ấn hướng ngược lại!</span>';};});" +
        "})();</script>"
      );
    }
    default:
      return '<p style="color:var(--text-muted);">Không có nội dung thử nghiệm.</p>';
  }
}
