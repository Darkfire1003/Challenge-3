// -- LightLines.tsx --
// Animierter SVG-Hintergrund mit fallenden Licht-Tropfen (Visual-Component).
// Zweck:
// - Stellt eine rein visuelle, animierte Hintergrundebene mit Linien und Tropfen dar.
// - Eignet sich als dekoratives Overlay auf Landing- oder Content-Seiten.
// Eingaben (Props): Steuerbare Parameter wie Farben, Opazitäten, Animationsgeschwindigkeit
//   und optionale children für ein Content-Overlay.
// Laufzeit / Kontext:
// - Läuft ausschließlich im Browser ("use client").
// - Verwendet useEffect, requestAnimationFrame und IntersectionObserver für performante Animationen.
// - Keine Datenbank- oder Netzwerkzugriffe, rein UI/Rendering-Logik.
// Rolle im Datenfluss:
// - Visuelle Präsentationskomponente; beeinflusst keine Applikationsdaten.
// Hinweise zur Implementierung:
// - Nutzt lokale Refs und DOM-Manipulation (SVG transform attributes) für flüssige Animation.
// - Bei Performance-Problemen sind Anpassungen am speedMultiplier, Anzahl der Tropfen oder an
//   der devicePixelRatio-Behandlung sinnvoll.
// Wichtige Sicherheitshinweise: Keine sensiblen Daten oder Tokens in dieser Datei.

"use client";

import { useEffect, useRef } from "react";
import { cn } from "./../../lib/utils";

interface LightLinesProps {
  /** Additional CSS classes */
  className?: string;
  /** Lines opacity (0-1) */
  linesOpacity?: number;
  /** Lights opacity (0-1) */
  lightsOpacity?: number;
  /** Animation speed multiplier */
  speedMultiplier?: number;
  /** Primary gradient color (from) */
  gradientFrom?: string;
  gradientVia?: string;
  /** Primary gradient color (to) */
  gradientTo?: string;
  /** Light color */
  lightColor?: string;
  /** Line color */
  lineColor?: string;
  /** Children content to overlay */
  children?: React.ReactNode;
}

interface AnimatedLightRef {
  element: SVGGElement | null;
  from: number;
  to: number;
  duration: number;
}

// Tropfen-Positionen, übernommen aus den ursprünglichen Rechteck-Koordinaten.
// cx = horizontale Mitte des jeweiligen Tropfen-Streifens, tops = vertikale
// Startpositionen der einzelnen Tropfen auf diesem Streifen.
const dropLights: { id: string; cx: number; tops: number[] }[] = [
  { id: "light1", cx: 617.25, tops: [298.4, 674.8, 135.1, 55.5] },
  { id: "light2", cx: 1255.95, tops: [531.9, 497.9, 0, 252.2] },
  { id: "light3", cx: 874.2, tops: [123.8, 289.4, 0, 50.2] },
  { id: "light4", cx: 1100.9, tops: [983.8, 1075.9, 873.7, 851] },
  { id: "light5", cx: 685.5, tops: [822.7, 928.4, 1043.8] },
  { id: "light6", cx: 1549.4, tops: [826.8, 519.6, 990.9] },
  { id: "light7", cx: 1310.65, tops: [698, 377.9, 48] },
  { id: "light8", cx: 124.65, tops: [504.8, 184.7] },
  { id: "light9", cx: 303.1, tops: [764.2, 381.2, 968.8] },
  { id: "light10", cx: 1820.65, tops: [170.7, 435.1, 55.9, 0] },
  { id: "light11", cx: 1666.85, tops: [331.5, 602.4, 898.5] },
  { id: "light12", cx: 1619.5, tops: [200.7, 469.1, 0, 81.3] },
  { id: "light13", cx: 72.55, tops: [201, 512.3, 65.8, 0] },
  { id: "light14", cx: 1370.3, tops: [655.3, 829.7, 1020.3] },
  { id: "light15", cx: 1233.85, tops: [893.2, 733, 568] },
  { id: "light16", cx: 456.8, tops: [992.7, 398] },
  { id: "light17", cx: 329.6, tops: [170.7, 435.1, 55.9, 0] },
];

const DROP_SIZE = 14;

// Hauptkomponente:
// - Rendert den animierten Hintergrund mit Linien und Tropfen.
// - Prop-Defaults steuern Farben, Opazitäten und Animationsgeschwindigkeit.
// - children erlaubt eine Overlay-Ebene über der Animation.
export function LightLines({
  className,
  linesOpacity = 0.05,
  lightsOpacity = 0.9,
  speedMultiplier = 1,
  gradientFrom = "#6a95ae",
  gradientVia = "#123250",
  gradientTo = "#6a95ae",
  lightColor = "#fff",
  lineColor = "#fff",
  children,
}: LightLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<AnimatedLightRef[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // useEffect initialisiert die Animation im DOM.
    // - Es werden SVG-Gruppen ausgewählt und Bewegungsrichtungen zugewiesen.
    // - Eine requestAnimationFrame-Schleife animiert die Tropfen kontinuierlich.
    const lightsDown = [
      { selector: ".light4", from: -1080, to: 1080 },
      { selector: ".light5", from: -1080, to: 1080 },
      { selector: ".light6", from: -1080, to: 1080 },
      { selector: ".light7", from: -1080, to: 1080 },
      { selector: ".light8", from: -1080, to: 1080 },
      { selector: ".light11", from: -1080, to: 1080 },
      { selector: ".light12", from: -1080, to: 1080 },
      { selector: ".light13", from: -1080, to: 1080 },
      { selector: ".light14", from: -1080, to: 1080 },
      { selector: ".light15", from: -1080, to: 1080 },
      { selector: ".light16", from: -1080, to: 1080 },
    ];

    const lightsUp = [
      { selector: ".light1", from: 1080, to: -1080 },
      { selector: ".light2", from: 1080, to: -1080 },
      { selector: ".light3", from: 1080, to: -1080 },
      { selector: ".light9", from: 1080, to: -1080 },
      { selector: ".light10", from: 1080, to: -1080 },
      { selector: ".light17", from: 1080, to: -1080 },
    ];

    const container = containerRef.current;
    if (!container) return;

    // Initialize animations
    const allLights = [...lightsDown, ...lightsUp];
    animationsRef.current = allLights.map((light) => {
      const element = container.querySelector(
        light.selector,
      ) as SVGGElement | null;
      const duration = (Math.floor(Math.random() * 59) + 2) * 0.5 + 0.5;
      return {
        element,
        from: light.from,
        to: light.to,
        duration: duration / speedMultiplier,
      };
    });

    // Animation state for each light
    const animationState = animationsRef.current.map(() => ({
      startTime: performance.now() - Math.random() * 5000, // Stagger start times
      currentY: 0,
    }));

    let isVisible = false;

    const animate = (time: number) => {
      if (!isVisible) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      animationsRef.current.forEach((ref, index) => {
        if (!ref.element) return;

        const state = animationState[index];
        const elapsed = (time - state.startTime) / 1000;
        const progress = (elapsed % ref.duration) / ref.duration;
        const currentY = ref.from + (ref.to - ref.from) * progress;

        ref.element.setAttribute("transform", `translate(0, ${currentY})`);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 },
    );

    observer.observe(container);

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      observer.disconnect();
    };
  }, [speedMultiplier]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 h-full w-full flex justify-center overflow-hidden",
        className,
      )}
      style={{
        background: `linear-gradient(180deg, ${gradientFrom}, ${gradientVia}, ${gradientTo})`,
      }}
    >
      <svg
        className="absolute h-full"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Tropfenform: spitz oben, rund unten */}
          <symbol id="drop" viewBox="0 0 32 32">
            <path d="M16,2 C16,2 26,17 26,22 C26,27.523 21.523,32 16,32 C10.477,32 6,27.523 6,22 C6,17 16,2 16,2 Z" />
          </symbol>
        </defs>

        {/* Static Lines */}
        <g className="lines" style={{ opacity: linesOpacity }}>
          <rect
            className="line"
            x="1253.6"
            width="4.5"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="873.3"
            width="1.8"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="1100"
            width="1.8"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="1547.1"
            width="4.5"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="615"
            width="4.5"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="684.6"
            width="1.8"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="1369.4"
            width="1.8"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="1310.2"
            width="0.9"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="1233.4"
            width="0.9"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="124.2"
            width="0.9"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="1818.4"
            width="4.5"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="70.3"
            width="4.5"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="1618.6"
            width="1.8"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="455.9"
            width="1.8"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="328.7"
            width="1.8"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="300.8"
            width="4.6"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
          <rect
            className="line"
            x="1666.4"
            width="0.9"
            height="1080"
            style={{
              fill: lineColor,
              fillRule: "evenodd",
              clipRule: "evenodd",
            }}
          />
        </g>

        {/* Animated Lights, jetzt als Tropfen statt Streifen */}
        <g className="lights" style={{ opacity: lightsOpacity }}>
          {dropLights.map(({ id, cx, tops }) => (
            <g key={id} className={`${id} light`} style={{ fill: lightColor }}>
              {tops.map((topY, i) => (
                <use
                  key={i}
                  href="#drop"
                  x={cx - DROP_SIZE / 2}
                  y={topY}
                  width={DROP_SIZE}
                  height={DROP_SIZE * 1.3}
                />
              ))}
            </g>
          ))}
        </g>
      </svg>

      {/* Content overlay */}
      {children && (
        <div className="relative z-10 w-full h-full">{children}</div>
      )}
    </div>
  );
}

export default LightLines;
