// -- HamsterLoader.tsx --
// Präsenzielle Lade-Komponente mit Hamster-Rad-Animation.
// Zweck:
// - Anzeige eines visuellen Lade-Indikators an Stellen, an denen Daten geladen werden.
// - Rein presentational: keine API- oder Auth-Logik.
// Accessibility:
// - Das animierte Element hat role="img" und aria-label, sodass Screenreader informiert werden.
// Props:
// - text?: optionaler Beschreibungstext unter der Animation
// - className?: zusätzliche CSS-Klassen zur Anpassung der Positionierung
type HamsterLoaderProps = {
  // Optionaler Text, der unter der Hamster-Animation angezeigt wird.
  text?: string;
  // Zusätzliche CSS-Klassen für individuelle Positionierung oder Abstände.
  className?: string;
};

export default function HamsterLoader({
  text = "Bitte warten...",
  className = "",
}: HamsterLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div
        aria-label="Ladevorgang läuft"
        role="img"
        className="wheel-and-hamster"
      >
        <div className="wheel"></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className="spoke"></div>
      </div>

      <p className="text-xs text-center text-secon">{text}</p>
    </div>
  );
}
