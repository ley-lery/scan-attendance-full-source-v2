// Particle.tsx
import { useEffect, useState, memo } from "react";
import { loadSlim } from "@tsparticles/slim";
import Particles, { initParticlesEngine } from "@tsparticles/react";

const Particle = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    (async () => {
      await initParticlesEngine(async (engine: any) => {
        await loadSlim(engine);
      });
      setInit(true);
    })();
  }, []);

  return (
    init && (
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: "#0000" } },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: { enable: false, mode: "push" },
              onHover: { enable: true, mode: "grab" },
              resize: { enable: true },
            },
            modes: {
              push: { quantity: 2 },
              repulse: { distance: 200, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 2,
              straight: false,
            },
            number: { density: { enable: true, width: 800 }, value: 50 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
      />
    )
  );
};

export default memo(Particle);
