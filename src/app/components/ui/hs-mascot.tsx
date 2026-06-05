import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Btn } from "./btn";

// ── Posing Stampy ───────────────────────────────────────────
import PS01 from "../../../assets/Mascots/Posing Stampy/Layer_1.png";
import PS02 from "../../../assets/Mascots/Posing Stampy/Layer_1-1.png";
import PS03 from "../../../assets/Mascots/Posing Stampy/Untitled 1.png";
import PS04 from "../../../assets/Mascots/Posing Stampy/FLORA-Different Pose Creation 2-4f100992 1.png";
import PS05 from "../../../assets/Mascots/Posing Stampy/Gemini_Generated_Image_exf9mqexf9mqexf9 1.png";
import PS06 from "../../../assets/Mascots/Posing Stampy/Gemini_Generated_Image_inqi44inqi44inqi 1.png";
import PS07 from "../../../assets/Mascots/Posing Stampy/Gemini_Generated_Image_nv3ud2nv3ud2nv3u 1.png";

// ── Anatomy & Reference ─────────────────────────────────────
import AN01 from "../../../assets/Mascots/Slider/Anatomy.png";
import AN02 from "../../../assets/Mascots/Slider/Arms & Legs.png";
import AN03 from "../../../assets/Mascots/Slider/Arms & Legs-1.png";
import AN04 from "../../../assets/Mascots/Slider/Arms & Legs-2.png";
import AN05 from "../../../assets/Mascots/Slider/Full Body.png";
import AN06 from "../../../assets/Mascots/Slider/Full-Turn.png";
import AN07 from "../../../assets/Mascots/Slider/Toolkit.png";

// ── Social Ready Poses ──────────────────────────────────────
import SP01 from "../../../assets/Mascots/Social Ready Poses /01 - Full Body_Standing 1.png";
import SP02 from "../../../assets/Mascots/Social Ready Poses /04 - Full Body_Hearts 1.png";
import SP03 from "../../../assets/Mascots/Social Ready Poses /05 - Full Body_Heavy Lift 1.png";
import SP04 from "../../../assets/Mascots/Social Ready Poses /06 - Full Body_Peek Blush 1.png";
import SP05 from "../../../assets/Mascots/Social Ready Poses /07 - Full Body_Peek Smile 1.png";
import SP06 from "../../../assets/Mascots/Social Ready Poses /08 - Full Body_Tear Eyes Happy 1.png";

// ── Expressions ─────────────────────────────────────────────
import EX01 from "../../../assets/Mascots/Social-Ready Expressions/Angry.png";
import EX02 from "../../../assets/Mascots/Social-Ready Expressions/Excited Smile.png";
import EX03 from "../../../assets/Mascots/Social-Ready Expressions/Laugh Cry.png";
import EX04 from "../../../assets/Mascots/Social-Ready Expressions/Open Smile.png";
import EX05 from "../../../assets/Mascots/Social-Ready Expressions/Rosey Smile.png";
import EX06 from "../../../assets/Mascots/Social-Ready Expressions/Shocked.png";
import EX07 from "../../../assets/Mascots/Social-Ready Expressions/Small Smile.png";
import EX08 from "../../../assets/Mascots/Social-Ready Expressions/Streaming Tears.png";
import EX09 from "../../../assets/Mascots/Social-Ready Expressions/Tears in Eyes.png";
import EX10 from "../../../assets/Mascots/Social-Ready Expressions/Wink.png";

/* ── Types ─────────────────────────────────────────────────── */

export type MascotAsset = { label: string; src: string; filename: string };

/* ── Asset data ────────────────────────────────────────────── */

export const POSING_STAMPY: MascotAsset[] = [
  { label: "Layer 1",       src: PS01, filename: "stampy-layer-1.png"        },
  { label: "Layer 1 Alt",   src: PS02, filename: "stampy-layer-1-alt.png"    },
  { label: "Untitled",      src: PS03, filename: "stampy-untitled.png"       },
  { label: "Pose 1",        src: PS04, filename: "stampy-pose-1.png"         },
  { label: "Pose 2",        src: PS05, filename: "stampy-pose-2.png"         },
  { label: "Pose 3",        src: PS06, filename: "stampy-pose-3.png"         },
  { label: "Pose 4",        src: PS07, filename: "stampy-pose-4.png"         },
];

export const ANATOMY: MascotAsset[] = [
  { label: "Full Body",     src: AN05, filename: "stampy-full-body.png"      },
  { label: "Arms & Legs 2", src: AN04, filename: "stampy-arms-legs-2.png"    },
  { label: "Arms & Legs 1", src: AN03, filename: "stampy-arms-legs-1.png"    },
  { label: "Arms & Legs",   src: AN02, filename: "stampy-arms-legs.png"      },
  { label: "Anatomy",       src: AN01, filename: "stampy-anatomy.png"        },
  { label: "Full Turn",     src: AN06, filename: "stampy-full-turn.png"      },
  { label: "Toolkit",       src: AN07, filename: "stampy-toolkit.png"        },
];

export const SOCIAL_POSES: MascotAsset[] = [
  { label: "Standing",        src: SP01, filename: "stampy-standing.png"        },
  { label: "Hearts",          src: SP02, filename: "stampy-hearts.png"          },
  { label: "Heavy Lift",      src: SP03, filename: "stampy-heavy-lift.png"      },
  { label: "Peek Blush",      src: SP04, filename: "stampy-peek-blush.png"      },
  { label: "Peek Smile",      src: SP05, filename: "stampy-peek-smile.png"      },
  { label: "Tear Eyes Happy", src: SP06, filename: "stampy-tear-eyes-happy.png" },
];

export const EXPRESSIONS: MascotAsset[] = [
  { label: "Angry",           src: EX01, filename: "stampy-angry.png"           },
  { label: "Excited Smile",   src: EX02, filename: "stampy-excited-smile.png"   },
  { label: "Laugh Cry",       src: EX03, filename: "stampy-laugh-cry.png"       },
  { label: "Open Smile",      src: EX04, filename: "stampy-open-smile.png"      },
  { label: "Rosey Smile",     src: EX05, filename: "stampy-rosey-smile.png"     },
  { label: "Shocked",         src: EX06, filename: "stampy-shocked.png"         },
  { label: "Small Smile",     src: EX07, filename: "stampy-small-smile.png"     },
  { label: "Streaming Tears", src: EX08, filename: "stampy-streaming-tears.png" },
  { label: "Tears in Eyes",   src: EX09, filename: "stampy-tears-in-eyes.png"   },
  { label: "Wink",            src: EX10, filename: "stampy-wink.png"            },
];

/* ── Utilities ─────────────────────────────────────────────── */

function downloadAsset(src: string, filename: string) {
  const a = document.createElement("a");
  a.href = src;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ── MascotCard ────────────────────────────────────────────── */

export function MascotCard({ label, src, filename }: MascotAsset) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        border: `1px solid ${hover ? "var(--color-brand-primary)" : "var(--border)"}`,
        overflow: "hidden",
        background: "var(--bg)",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{
        background: "var(--muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        minHeight: 140,
      }}>
        <img src={src} alt={label} style={{ maxHeight: 120, maxWidth: "100%", objectFit: "contain" }} />
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderTop: "1px solid var(--border)",
        gap: 8,
      }}>
        <span style={{
          fontSize: 12, fontWeight: 500, color: "var(--muted-fg)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {label}
        </span>
        <Btn
          size="sm"
          variant="outline"
          onClick={() => downloadAsset(src, filename)}
          title={`Download ${label}`}
        >
          <Download size={11} />
          PNG
        </Btn>
      </div>
    </div>
  );
}

/* ── MascotGrid ────────────────────────────────────────────── */

export function MascotGrid({ assets }: { assets: MascotAsset[] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
      gap: 12,
    }}>
      {assets.map(asset => (
        <MascotCard key={asset.filename} {...asset} />
      ))}
    </div>
  );
}

/* ── AnatomySlider ─────────────────────────────────────────── */

const SLIDE_W     = 82;  // % of content width each slide occupies
const SLIDE_GAP   = 32;  // px gap between slides
const SLIDE_PAD_L = 32;  // px left padding inside the track

const slideSpring = { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.9 };


export function AnatomySlider({ slides }: { slides: MascotAsset[] }) {
  const [index, setIndex]         = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const containerRef              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const contentW = containerRef.current.offsetWidth - SLIDE_PAD_L;
        setSlideWidth(contentW * SLIDE_W / 100);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const offset = -(index * (slideWidth + SLIDE_GAP));
  const prev   = () => setIndex(i => Math.max(i - 1, 0));
  const next   = () => setIndex(i => Math.min(i + 1, slides.length - 1));

  return (
    <div style={{ borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", background: "var(--bg)" }}>

      {/* Track */}
      <div
        ref={containerRef}
        style={{ overflow: "hidden", background: "#fff", padding: `24px 0 24px ${SLIDE_PAD_L}px` }}
      >
        <motion.div
          animate={{ x: offset }}
          transition={slideSpring}
          style={{ display: "flex", gap: SLIDE_GAP, willChange: "transform" }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.filename}
              onClick={() => setIndex(i)}
              style={{
                flexShrink: 0,
                width: slideWidth > 0 ? slideWidth : `${SLIDE_W}%`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: i !== index ? "pointer" : "default",
                opacity: i === index ? 1 : 0.45,
                transition: "opacity 0.2s",
              }}
            >
              <img
                src={slide.src}
                alt={slide.label}
                style={{ maxWidth: "100%", display: "block", borderRadius: 8 }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderTop: "1px solid var(--border)",
        gap: 12,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{slides[index].label}</span>
          <span style={{ fontSize: 11, color: "var(--muted-fg)" }}>{index + 1} / {slides.length}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === index ? 16 : 6,
                  height: 6,
                  borderRadius: 999,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: i === index ? "var(--color-brand-primary)" : "var(--border)",
                  transition: "width 0.2s, background 0.15s",
                }}
              />
            ))}
          </div>
          <Btn size="icon-sm" variant="outline" onClick={prev} disabled={index === 0}>
            <ChevronLeft size={16} />
          </Btn>
          <Btn size="icon-sm" variant="outline" onClick={next} disabled={index === slides.length - 1}>
            <ChevronRight size={16} />
          </Btn>
        </div>
      </div>
    </div>
  );
}
