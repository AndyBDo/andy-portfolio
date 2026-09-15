"use client";
import { useEffect, useRef, useState } from "react";
const navItems = [
  { label: "welcome", href: "#welcome" },
  { label: "bio", href: "#bio" },
  { label: "experience", href: "#experience" },
  { label: "skillz", href: "#technical-skills" },
  { label: "projects", href: "#projects" },
  { label: "music", href: "#music" },
  { label: "contact", href: "#contact" },
];
const scrollToSection = (hash: string) => {
  if (typeof window === "undefined") return;
  const target = document.querySelector(hash);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
};
const resumeProjects = [
  {
    title: "CodeLens",
    subtitle: "Fiserv Hack Week Winner · Jun 2026",
    url: "https://github.com/AndyBDo/codelens",
    image: "/codelens.png",
    toolsUsed: "Chrome Extension, LangChain, Claude Sonnet 4.5, ChromaDB, FastAPI",
    description:
      "Built a full-stack Chrome extension that maps live web app components to backend code flows, Jira tickets, and Confluence docs on hover, helping 8 new interns learn their assigned codebases.",
  },
  {
    title: "Loci",
    subtitle: "Full-Stack AI Platform · 2026",
    url: "https://github.com/ethan-ngai/loci",
    image: "/loci.png",
    toolsUsed:
      "TanStack Start, React, TypeScript, MongoDB Atlas, Microsoft TRELLIS, Hugging Face, Gradio, R2/S3, Three.js",
    description:
      "Built a full-stack platform that turns raw text and PDFs into 3D memory palaces, self-hosted Microsoft TRELLIS on cloud GPUs to generate 3D concept objects, and created an interactive Three.js world viewer for spatial studying.",
  },
  {
    title: "SafeStep",
    subtitle: "Brown Hacks · Feb 2026",
    url: "https://github.com/AndyDo0942/safestep",
    image: "/safestep.png",
    toolsUsed: "SpringAI, OpenRouterAPI, Spring Boot JPA, PostgreSQL",
    description:
      "Mapped the safest possible routes to destinations by developing a routing service that manipulates the A* algorithm and identified road hazards like potholes and ice by implementing AI agents that analyze crowdsourced imagery.",
  },
  {
    title: "Alloc",
    subtitle: "Dell x Nvidia @ Cornell · 2026",
    url: "https://github.com/ethan-ngai/alloc",
    image: "/alloc.png",
    toolsUsed: "TypeScript, React, Fastify, MongoDB, Zod, Docker",
    description:
      "Built a local-first financial intelligence dashboard that connects company context to deterministic spending controls, auditable action intents, forecasts, and human-authorized decisions.",
  },
  {
    title: "PokerCaml",
    subtitle: "OCaml-Poker · Multiplayer TUI",
    url: "https://github.com/jacksonliao78/poker",
    image: "/pokercaml.png",
    toolsUsed: "OCaml, Dune",
    description:
      "Built a terminal-based multiplayer poker game entirely in OCaml with a terminal UI, poker betting and winner logic, and multi-game sessions. The client/server game supports four or more players.",
  },
];
const profileLinks = [
  {
    key: "GitHub",
    href: "https://github.com/AndyBDo",
  },
  {
    key: "LinkedIn",
    href: "https://www.linkedin.com/in/andybdo",
  },
  {
    key: "Resume",
    href: "/Andy_Do_Resume.pdf",
  },
];
const contactLinks = [
  {
    key: "email",
    value: "doandyb@gmail.com",
    href: "mailto:doandyb@gmail.com",
  },
  {
    key: "phone number",
    value: "(717) 808-2649",
    href: "tel:+17178082649",
  },
];
const musicTracks = [
  {
    title: "Telekinesis",
    artist: "Travis Scott, SZA",
    artistLabel: "Artists",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7d/4f/94/7d4f9468-56e1-3a2d-7186-c8088170ef58/196871341899.jpg/600x600bb.jpg",
  },
  {
    title: "sdp interlude",
    artist: "travis scott",
    artistLabel: "artist",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/b8/e5/27/b8e527c8-aaf4-c7b7-5562-c479458ed7d9/886446092645.jpg/600x600bb.jpg",
  },
  {
    title: "intentions",
    artist: "starfall",
    artistLabel: "artist",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c3/47/6f/c3476f88-2c89-c6bf-8435-252a5614386b/24UMGIM42867.rgb.jpg/600x600bb.jpg",
  },
  {
    title: "Bruch violin concerto no. 1",
    artist: "Max Bruch",
    artistLabel: "artist",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/77/5a/89/775a891a-5cb6-cf16-40a0-d91133637e2f/00028947592419.rgb.jpg/600x600bb.jpg",
  },
  {
    title: "Yuusha",
    artist: "Yaosobi",
    artistLabel: "artist",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d5/fb/70/d5fb7086-9fbe-feca-215e-da448bcf4596/197189862939.jpg/600x600bb.jpg",
  },
];
const bootCommands = ["cd andy_portfolio", "code .", "npm run dev"];
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  void delay;
  return <div>{children}</div>;
}

function ProfileIcon({ kind }: { kind: string }) {
  if (kind === "GitHub") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.08.55-.17.55-.38l-.01-1.33c-2.24.49-2.71-1.08-2.71-1.08-.37-.93-.9-1.17-.9-1.17-.73-.5.06-.49.06-.49.81.06 1.23.83 1.23.83.72 1.24 1.89.88 2.35.68.07-.52.28-.88.5-1.08-1.79-.2-3.67-.9-3.67-4 0-.88.32-1.6.83-2.16-.08-.2-.36-1.02.08-2.13 0 0 .68-.22 2.2.82A7.7 7.7 0 0 1 8 3.9c.68 0 1.36.09 2 .27 1.52-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.52.56.83 1.28.83 2.16 0 3.1-1.89 3.8-3.7 4 .29.25.55.74.55 1.5l-.01 2.22c0 .21.15.47.56.38A8 8 0 0 0 8 0Z" />
      </svg>
    );
  }
  if (kind === "LinkedIn") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M0 1.15C0 .52.52 0 1.15 0h13.7C15.48 0 16 .52 16 1.15v13.7c0 .63-.52 1.15-1.15 1.15H1.15C.52 16 0 15.48 0 14.85V1.15Zm4.85 12.1V6.17H2.5v7.08h2.35Zm-1.17-8.05c.82 0 1.33-.54 1.33-1.22-.02-.7-.5-1.22-1.31-1.22-.81 0-1.34.52-1.34 1.22 0 .68.51 1.22 1.3 1.22h.02Zm4.81 8.05V9.3c0-.21.02-.42.08-.57.17-.41.55-.84 1.2-.84.84 0 1.18.63 1.18 1.55v3.81h2.35V9.17c0-2.18-1.16-3.2-2.7-3.2-1.25 0-1.8.69-2.11 1.17v.02h-.02l.02-.02V6.17H6.29c.03.64 0 7.08 0 7.08h2.2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v5h5M9 12h6M9 16h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Typewriter({
  text,
  as: Component = "h2",
  className = "",
  speed = 18,
  showCursor = false,
  animate = false,
  delayMs = 0,
  cursorOffset = 8,
  persistCursor = false,
  reserve = false,
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  speed?: number;
  showCursor?: boolean;
  animate?: boolean;
  delayMs?: number;
  cursorOffset?: number;
  persistCursor?: boolean;
  reserve?: boolean;
}) {
  void speed;
  void delayMs;
  void reserve;
  const ref = useRef<HTMLElement | null>(null);
  const componentTag =
    typeof Component === "string" ? Component.toLowerCase() : "";
  const isHeading =
    componentTag === "h1" ||
    componentTag === "h2" ||
    componentTag === "h3" ||
    componentTag === "h4" ||
    componentTag === "h5" ||
    componentTag === "h6";
  const shouldShowCursor = showCursor || isHeading;
  return (
    <Component
      ref={ref}
      className={`typewriter ${animate ? "tw-animate" : ""} ${shouldShowCursor ? "tw-cursor" : ""} ${persistCursor ? "tw-persist" : ""} ${className}`.trim()}
      style={
        {
          "--cursor-offset": `${cursorOffset}px`,
        } as React.CSSProperties
      }
    >
      <span className="typewriter-fallback">{text}</span>
      <span className="typewriter-text">{text}</span>
    </Component>
  );
}
export default function Home() {
  const [coords, setCoords] = useState("X:000 Y:000");
  const [bootLines, setBootLines] = useState(() =>
    bootCommands.map(() => "")
  );
  const [bootCursorLine, setBootCursorLine] = useState(0);
  const [bootFading, setBootFading] = useState(false);
  const [bootVisible, setBootVisible] = useState(true);
  const progressRef = useRef(0);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const fuelFillRef = useRef<HTMLSpanElement | null>(null);
  const rocketTrailRef = useRef<HTMLDivElement | null>(null);
  const rocketTrailTextureRef = useRef<HTMLDivElement | null>(null);
  const rocketRef = useRef<HTMLImageElement | null>(null);
  const isDraggingRocketRef = useRef(false);
  const activeRocketPointerRef = useRef<number | null>(null);
  const applyProgress = (value: number) => {
    const clamped = Math.min(Math.max(value, 0), 100);
    if (progressRef.current === clamped) return;
    progressRef.current = clamped;
    if (fuelFillRef.current) {
      fuelFillRef.current.style.width = `${100 - clamped}%`;
    }
    if (rocketTrailRef.current) {
      rocketTrailRef.current.style.height = `${clamped}%`;
    }
    if (rocketTrailTextureRef.current) {
      rocketTrailTextureRef.current.style.height = `${clamped}%`;
    }
    if (rocketRef.current) {
      rocketRef.current.style.top = `${clamped}%`;
    }
  };
  const scrollFromRocketY = (clientY: number) => {
    const track = scrollIndicatorRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const withinTrack = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    const pct = rect.height > 0 ? withinTrack / rect.height : 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * pct, behavior: "auto" });
  };
  const endRocketDrag = () => {
    isDraggingRocketRef.current = false;
    activeRocketPointerRef.current = null;
    document.body.classList.remove("is-dragging-rocket");
  };
  const onRocketPointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (event.button !== 0) return;
    rocketRef.current = event.currentTarget;
    isDraggingRocketRef.current = true;
    activeRocketPointerRef.current = event.pointerId;
    document.body.classList.add("is-dragging-rocket");
    event.currentTarget.setPointerCapture(event.pointerId);
    scrollFromRocketY(event.clientY);
    event.preventDefault();
  };
  const onRocketPointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!isDraggingRocketRef.current) return;
    if (activeRocketPointerRef.current !== event.pointerId) return;
    if (event.buttons === 0) {
      endRocketDrag();
      return;
    }
    scrollFromRocketY(event.clientY);
  };
  const onRocketPointerUp = (event: React.PointerEvent<HTMLImageElement>) => {
    if (activeRocketPointerRef.current !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    endRocketDrag();
  };
  const onRocketPointerCancel = (event: React.PointerEvent<HTMLImageElement>) => {
    if (activeRocketPointerRef.current !== event.pointerId) return;
    endRocketDrag();
  };
  const onRocketLostPointerCapture = () => {
    endRocketDrag();
  };
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const timers: number[] = [];

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(resolve, ms);
        timers.push(timer);
      });

    const typeLine = async (lineIndex: number, content: string) => {
      setBootCursorLine(lineIndex);
      for (let i = 1; i <= content.length; i += 1) {
        if (cancelled) return;
        setBootLines((prev) => {
          const next = [...prev];
          next[lineIndex] = content.slice(0, i);
          return next;
        });
        await wait(50);
      }
    };

    const runBootSequence = async () => {
      await wait(240);
      for (let i = 0; i < bootCommands.length; i += 1) {
        if (cancelled) return;
        await typeLine(i, bootCommands[i]);
        await wait(240);
      }
      if (cancelled) return;
      setBootCursorLine(-1);
      await wait(260);
      setBootFading(true);
      await wait(320);
      if (cancelled) return;
      document.documentElement.classList.add("boot-ready");
      window.dispatchEvent(new Event("boot-ready"));
      setBootVisible(false);
    };

    runBootSequence();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (bootVisible) {
      document.body.classList.add("is-booting");
      return () => {
        document.body.classList.remove("is-booting");
      };
    }
    document.body.classList.remove("is-booting");
    return;
  }, [bootVisible]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.add("app-hydrated");
    document.documentElement.classList.remove("boot-ready");
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.classList.remove("app-hydrated");
      document.documentElement.classList.remove("boot-ready");
    };
  }, []);
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? scrollTop / maxScroll : 0;
      applyProgress(Math.round(pct * 100));
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let frame = 0;
    let nextX = 0;
    let nextY = 0;
    let lastCoords = "";

    const commit = () => {
      frame = 0;
      const coord = `X:${String(nextX).padStart(3, "0")} Y:${String(nextY).padStart(
        3,
        "0"
      )}`;
      if (coord === lastCoords) return;
      lastCoords = coord;
      setCoords(coord);
    };

    const onMove = (event: MouseEvent) => {
      const w = Math.max(window.innerWidth, 1);
      const h = Math.max(window.innerHeight, 1);
      nextX = Math.round((event.clientX / w) * 999);
      nextY = Math.round((event.clientY / h) * 999);
      if (frame) return;
      frame = window.requestAnimationFrame(commit);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const windows = Array.from(
      document.querySelectorAll<HTMLElement>(".window-tilt")
    );
    const cleanups: Array<() => void> = [];

    windows.forEach((card) => {
      const state = {
        targetX: 0,
        targetY: 0,
        currentX: 0,
        currentY: 0,
        raf: 0,
        active: false,
      };
      const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max);
      const ease = (value: number) =>
        Math.sign(value) * Math.pow(Math.abs(value), 0.82);
      const render = () => {
        const smoothing = state.active ? 0.19 : 0.15;
        state.currentX += (state.targetX - state.currentX) * smoothing;
        state.currentY += (state.targetY - state.currentY) * smoothing;
        if (!Number.isFinite(state.currentX) || !Number.isFinite(state.currentY)) {
          state.currentX = 0;
          state.currentY = 0;
          state.targetX = 0;
          state.targetY = 0;
        }
        state.currentX = clamp(state.currentX, -0.78, 0.78);
        state.currentY = clamp(state.currentY, -0.78, 0.78);
        card.style.setProperty("--tilt-x", state.currentX.toFixed(3));
        card.style.setProperty("--tilt-y", state.currentY.toFixed(3));
        const stillMoving =
          Math.abs(state.targetX - state.currentX) > 0.002 ||
          Math.abs(state.targetY - state.currentY) > 0.002;
        if (state.active || stillMoving) {
          state.raf = window.requestAnimationFrame(render);
          return;
        }
        state.raf = 0;
      };
      const ensureLoop = () => {
        if (state.raf) return;
        state.raf = window.requestAnimationFrame(render);
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!state.active) return;
        if (event.pointerType === "touch") return;
        const rect = card.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        const boundedX = clamp(x, -1, 1);
        const boundedY = clamp(y, -1, 1);
        const radial = Math.min(1, Math.hypot(boundedX, boundedY));
        const edgeBrake = 1 - Math.max((radial - 0.8) / 0.2, 0) * 0.42;
        state.targetX = ease(boundedX) * 0.72 * edgeBrake;
        state.targetY = ease(boundedY) * 0.72 * edgeBrake;
        ensureLoop();
      };

      const onPointerEnter = () => {
        state.active = true;
        card.classList.add("is-tilting");
        ensureLoop();
      };

      const resetTilt = () => {
        state.active = false;
        state.targetX = 0;
        state.targetY = 0;
        card.classList.remove("is-tilting");
        ensureLoop();
      };

      card.addEventListener("pointerenter", onPointerEnter);
      card.addEventListener("pointermove", onPointerMove, { passive: true });
      card.addEventListener("pointerleave", resetTilt);
      card.addEventListener("pointercancel", resetTilt);
      cleanups.push(() => {
        if (state.raf) window.cancelAnimationFrame(state.raf);
        card.removeEventListener("pointerenter", onPointerEnter);
        card.removeEventListener("pointermove", onPointerMove);
        card.removeEventListener("pointerleave", resetTilt);
        card.removeEventListener("pointercancel", resetTilt);
        card.classList.remove("is-tilting");
        card.style.setProperty("--tilt-x", "0");
        card.style.setProperty("--tilt-y", "0");
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const endDrag = () => {
      if (!isDraggingRocketRef.current) return;
      endRocketDrag();
    };
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("blur", endDrag);
    return () => {
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("blur", endDrag);
      if (rocketRef.current && activeRocketPointerRef.current !== null) {
        if (rocketRef.current.hasPointerCapture(activeRocketPointerRef.current)) {
          rocketRef.current.releasePointerCapture(activeRocketPointerRef.current);
        }
      }
      activeRocketPointerRef.current = null;
      document.body.classList.remove("is-dragging-rocket");
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      root.style.setProperty("--parallax-x", "0px");
      root.style.setProperty("--parallax-y", "0px");
      root.style.setProperty("--parallax-scroll", "0px");
      return;
    }

    let frame = 0;
    let scrollShift = 0;

    const commit = () => {
      frame = 0;
      root.style.setProperty("--parallax-x", "0px");
      root.style.setProperty("--parallax-y", "0px");
      root.style.setProperty("--parallax-scroll", `${scrollShift.toFixed(2)}px`);
    };

    const queueCommit = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(commit);
    };

    const onScroll = () => {
      const maxShift = Math.max(window.innerHeight * 0.9, 420);
      scrollShift = Math.min(window.scrollY * 0.22, maxShift);
      queueCommit();
    };

    queueCommit();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      root.style.setProperty("--parallax-x", "0px");
      root.style.setProperty("--parallax-y", "0px");
      root.style.setProperty("--parallax-scroll", "0px");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <>
      {bootVisible ? (
        <div className={`boot-sequence ${bootFading ? "is-fading" : ""}`} aria-live="polite">
          <div className="boot-sequence-window">
            <p className="boot-sequence-title">Andy Do - zsh - boot</p>
            <div className="boot-sequence-body">
              {bootCommands.map((command, index) => (
                <p className="boot-sequence-line" key={command}>
                  <span className="boot-sequence-prompt">$</span>
                  <span>{bootLines[index]}</span>
                  {bootCursorLine === index ? (
                    <span className="boot-sequence-cursor" aria-hidden="true" />
                  ) : null}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    <main className="relative space-bg">
      <div className="space-layer" aria-hidden="true">
        <div className="grid-lines" />
        <div className="space-stars" />
        <div className="space-haze" />
        <div className="scanlines" />
        <div className="planet planet--blue planet--one" />
        <div className="planet planet--amber planet--two" />
        <div className="planet planet--violet planet--three" />
        <div className="planet planet--four" />
        <div className="planet planet--ruby planet--nine" />
      </div>
      <div className="hud-left">
        <div className="hud-block">
          <p className="hud-label">Rocket fuel</p>
          <div className="hud-bar">
            <span className="hud-bar-fill" ref={fuelFillRef} style={{ width: "100%" }} />
          </div>
        </div>
        <div className="hud-block">
          <p className="hud-label">Coordinates</p>
          <p className="hud-value">{coords}</p>
        </div>
      </div>
      <div className="scroll-indicator" aria-hidden="true" ref={scrollIndicatorRef}>
        <div className="rocket-trail" ref={rocketTrailRef} style={{ height: "0%" }} />
        <div
          className="rocket-trail-texture"
          ref={rocketTrailTextureRef}
          style={{ height: "0%" }}
        />
        <img
          className="scroll-rocket"
          src="/rocket.png"
          alt=""
          style={{ top: "0%" }}
          ref={rocketRef}
          onPointerDown={onRocketPointerDown}
          onPointerMove={onRocketPointerMove}
          onPointerUp={onRocketPointerUp}
          onPointerCancel={onRocketPointerCancel}
          onLostPointerCapture={onRocketLostPointerCapture}
        />
      </div>
      <div className="relative z-10">
        <div className="site-nav-wrap">
          <div className="container-shell">
            <nav className="site-nav">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  className="nav-pill"
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                >
                  <Typewriter text={item.label} as="span" animate />
                </button>
              ))}
            </nav>
          </div>
        </div>
        <section id="welcome" className="relative overflow-hidden">
          <div className="container-shell py-12 sm:py-16">
          <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <FadeIn delay={0.1}>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                <Typewriter
                  as="p"
                  className="text-sm text-body-violet"
                  text="Software Engineer"
                  animate
                />
                </div>
                <div className="hero-name-wrap">
                  <div className="hero-blackhole-orbit" aria-hidden="true">
                    <img
                      className="hero-welcome-art"
                      src="/image-removebg-preview.png"
                      alt=""
                      width={500}
                      height={500}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <Typewriter
                    as="h1"
                    className="hero-title hero-tight pixel-reveal tw-nowrap relative z-10"
                    text="Andy Do"
                    speed={120}
                    animate
                    cursorOffset={60}
                  />
                </div>
                <Typewriter
                  as="p"
                  className="hero-subtitle max-w-xl mt-4"
                  text="Undergraduate student at Cornell studying Computer Science"
                  animate
                  showCursor
                  persistCursor
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="glow-card window-tilt window-tilt-small p-6 sm:p-8 space-y-6">
                <div className="space-y-3">
                  <Typewriter as="p" className="text-body-violet" text="{" animate />
                  {profileLinks.map((item, index) => (
                    <div className="json-link-row" key={item.key}>
                      <span className="json-link-icon" aria-hidden="true">
                        <ProfileIcon kind={item.key} />
                      </span>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="json-link-anchor"
                        aria-label={`Open ${item.key}`}
                      >
                        <Typewriter
                          as="span"
                          className="text-body-cyan underline underline-offset-2 decoration-[rgba(95,135,255,0.58)]"
                          text={`  "${item.key}": "${item.href}"${index < profileLinks.length - 1 ? "," : ""}`}
                          animate
                        />
                      </a>
                    </div>
                  ))}
                  <Typewriter as="p" className="text-body-violet" text="}" animate />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
        </section>
        <section id="bio" className="container-shell py-14 sm:py-20">
          <FadeIn>
            <Typewriter
              text="bio :)"
              className="text-3xl sm:text-4xl font-semibold text-[var(--surface-ink)]"
              animate
              delayMs={120}
            />
          </FadeIn>
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.62fr_1.38fr]">
            <FadeIn delay={0.06}>
              <div className="glow-card window-tilt window-tilt-small bio-photo-card p-4 sm:p-5">
                <div className="bio-photo-shell">
                  <img
                    src="/andy.png"
                    alt="Andy"
                    className="bio-photo-image"
                  />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="glow-card window-tilt window-tilt-large p-7 sm:p-9">
                <div className="space-y-3">
                  <Typewriter
                    as="p"
                    className="text-body-violet"
                    text="{"
                    animate
                  />
                  <Typewriter
                    as="p"
                    className="text-body-cyan"
                    text='  "school": "Cornell University",'
                    animate
                  />
                  <Typewriter
                    as="p"
                    className="text-body-lime"
                    text='  "major": "Computer Science",'
                    animate
                  />
                  <Typewriter
                    as="p"
                    className="text-body-amber"
                    text='  "graduation": "May 2028",'
                    animate
                  />
                  <Typewriter
                    as="p"
                    className="text-body-violet"
                    text={`  "about": "If you didn't get it from the title, my name is Andy. I'm currently a machine learning engineer for Cornell Data Science and working on my own projects. I like playing pickle ball with the boys, tennis, ping pong, lowkey any racket sport. I also enjoy watching anime, playing the clarinet, and eating (shrimp tempura sushi is the best). I also bench 225 btw (no flex)"`}
                    animate
                  />
                  <Typewriter
                    as="p"
                    className="text-body-violet"
                    text="}"
                    animate
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
        <section id="experience" className="container-shell py-14 sm:py-20">
          <FadeIn>
            <Typewriter
              text="experience"
              className="text-3xl sm:text-4xl font-semibold text-accent-cyan"
              animate
              delayMs={135}
            />
          </FadeIn>
          <div className="mt-10">
            <FadeIn delay={0.08}>
              <div className="glow-card window-tilt window-tilt-large p-7 sm:p-9">
                <div className="space-y-2">
                  <Typewriter as="p" className="text-body-violet" text="{" animate />
                  <Typewriter as="p" className="text-body-cyan" text='  "experience": [' animate />
                  <Typewriter as="p" className="text-body-violet" text="    {" animate />
                  <Typewriter
                    as="p"
                    className="text-body-lime"
                    text='      "company": "Fiserv",'
                    animate
                  />
                  <Typewriter
                    as="p"
                    className="text-body-red"
                    text='      "role": "Software Engineer Intern · Jun 2026 - Aug 2026",'
                    animate
                  />
                  <Typewriter as="p" className="text-body-violet" text="    }," animate />
                  <Typewriter as="p" className="text-body-violet" text="    {" animate />
                  <Typewriter
                    as="p"
                    className="text-body-lime"
                    text='      "company": "Lancaster Lebanon Intermediate Unit 13",'
                    animate
                  />
                  <Typewriter
                    as="p"
                    className="text-body-red"
                    text='      "role": "Software Engineer Intern · Jun 2024 - Aug 2024",'
                    animate
                  />
                  <Typewriter as="p" className="text-body-violet" text="    }," animate />
                  <Typewriter as="p" className="text-body-violet" text="    {" animate />
                  <Typewriter
                    as="p"
                    className="text-body-lime"
                    text='      "company": "Cornell Data Science",'
                    animate
                  />
                  <Typewriter
                    as="p"
                    className="text-body-red"
                    text='      "role": "Machine Learning Engineer · Nov 2025 - Present",'
                    animate
                  />
                  <Typewriter as="p" className="text-body-violet" text="    }" animate />
                  <Typewriter as="p" className="text-body-cyan" text="  ]" animate />
                  <Typewriter as="p" className="text-body-violet" text="}" animate />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
        <section id="technical-skills" className="container-shell py-14 sm:py-20">
          <FadeIn>
            <Typewriter
              text="skillz"
              className="text-3xl sm:text-4xl font-semibold text-accent-amber"
              animate
              delayMs={145}
            />
          </FadeIn>
          <div className="mt-10">
            <FadeIn delay={0.08}>
              <div className="glow-card window-tilt window-tilt-large p-7 sm:p-9">
                <div className="space-y-2">
                  <Typewriter as="p" className="text-body-violet" text="{" animate />
                  <Typewriter
                    as="p"
                    className="text-body-blue"
                    text='  "Languages": "Java, Python, C#, C, JavaScript, TypeScript, SQL, HTML, CSS, OCaml, Go",'
                    animate
                  />
                  <Typewriter
                    as="p"
                    className="text-body-lime"
                    text='  "Frameworks": "React, Node.js, NextJS, TanStack, JPA, Spring Boot, tRPC, Bootstrap, Flask, ASP.NET Core, SQLAlchemy, Prisma",'
                    animate
                  />
                  <Typewriter
                    as="p"
                    className="text-body-amber"
                    text='  "Developer Tools": "Git, Docker, VS Code, IntelliJ, AWS, Bruno, Postman, Kubernetes, ArgoCD, Helm, Hugging Face, Cloudflare, Jira, Confluence, Agile development"'
                    animate
                  />
                  <Typewriter as="p" className="text-body-cyan" text='  "Libraries": "Pandas, NumPy, Matplotlib, scikit-learn"' animate />
                  <Typewriter as="p" className="text-body-violet" text="}" animate />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
        <section id="projects" className="container-shell py-14 sm:py-20">
          <FadeIn>
            <Typewriter
              text="projects"
              className="text-3xl sm:text-4xl font-semibold text-accent-red"
              animate
              delayMs={150}
            />
          </FadeIn>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {resumeProjects.map((project, index) => (
              <FadeIn key={project.title} delay={0.05 * index}>
                <div className="glow-card window-tilt window-tilt-small h-full p-6 sm:p-7 flex flex-col gap-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <Typewriter
                      as="h3"
                      className={`text-2xl font-semibold ${
                        project.title === "CodeLens"
                          ? "text-body-cyan"
                          : project.title === "Loci"
                            ? "text-body-violet"
                            : project.title === "SafeStep"
                          ? "text-body-lime"
                          : project.title === "Alloc"
                            ? "text-body-amber"
                            : project.title === "PokerCaml"
                              ? "text-body-red"
                            : "text-[var(--surface-ink)]"
                      }`}
                      text={project.title}
                      animate
                    />
                    <Typewriter
                      as="p"
                      className="text-sm text-body-cyan"
                      text={project.subtitle}
                      animate
                    />
                  </div>
                  <div className="project-placeholder-shell">
                    <img
                      src={project.image}
                      alt={`${project.title} UI`}
                      className="project-placeholder-image"
                    />
                  </div>
                  <div className="space-y-2">
                    <Typewriter as="p" className="text-body-violet" text="{" animate />
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block w-fit rounded-[4px] px-1 -mx-1 transition-colors hover:text-accent-cyan focus-visible:text-accent-cyan"
                      aria-label={`Open ${project.title} GitHub repository`}
                    >
                      <Typewriter
                        as="p"
                        className="text-body-cyan underline underline-offset-2 decoration-[rgba(95,135,255,0.58)]"
                        text={`  "GitHub": "${project.url}",`}
                        animate
                        reserve={false}
                      />
                    </a>
                    <Typewriter
                      as="p"
                      className="text-body-cyan"
                      text={`  "tools used": "${project.toolsUsed}",`}
                      animate
                    />
                    <Typewriter
                      as="p"
                      className="text-body-lime"
                      text={`  "description": "${project.description}"`}
                      animate
                    />
                    <Typewriter as="p" className="text-body-violet" text="}" animate />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
        <section id="music" className="container-shell py-14 sm:py-20">
          <FadeIn>
            <Typewriter
              text="music (my personal top 5)"
              className="text-3xl sm:text-4xl font-semibold text-accent-violet"
              animate
              delayMs={300}
            />
          </FadeIn>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {musicTracks.map((track, index) => (
              <FadeIn key={track.title} delay={0.05 * index}>
                <div className="glow-card window-tilt window-tilt-small music-card p-5 sm:p-6 space-y-4">
                  <div className="project-placeholder-shell">
                    <img
                      src={track.image}
                      alt={`${track.title} cover`}
                      className="project-placeholder-image"
                    />
                  </div>
                  <div className="space-y-2">
                    <Typewriter as="p" className="text-body-violet" text="{" animate />
                    <Typewriter
                      as="p"
                      className="text-body-lime"
                      text={`  "title": "${track.title}",`}
                      animate
                    />
                    <Typewriter
                      as="p"
                      className="text-body-amber"
                      text={`  "${track.artistLabel}": "${track.artist}"`}
                      animate
                    />
                    <Typewriter as="p" className="text-body-violet" text="}" animate />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
        <section id="contact" className="container-shell pt-14 pb-6 sm:pt-20 sm:pb-8">
          <FadeIn>
            <Typewriter
              text="reach out to me!"
              className="text-3xl sm:text-4xl font-semibold text-accent-blue"
              animate
              delayMs={450}
            />
          </FadeIn>
          <FadeIn delay={0.06}>
            <div className="glow-card window-tilt window-tilt-large mt-6 p-6 sm:p-8">
              <div className="space-y-2">
                <Typewriter as="p" className="text-body-violet" text="{" animate />
                {contactLinks.map((item, index) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="block w-fit rounded-[4px] px-1 -mx-1 transition-colors hover:text-accent-cyan focus-visible:text-accent-cyan"
                  >
                    <Typewriter
                      as="p"
                      className={index === 0 ? "text-body-cyan" : "text-body-amber"}
                      text={`  "${item.key}": "${item.value}"${index < contactLinks.length - 1 ? "," : ""}`}
                      animate
                    />
                  </a>
                ))}
                <Typewriter as="p" className="text-body-violet" text="}" animate />
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
    </main>
    </>
  );
}
