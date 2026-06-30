"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Howl } from "howler";
import { AUDIO } from "@/experience/config";
import { asset } from "@/lib/asset";

type AudioKey = keyof typeof AUDIO;

export interface AudioManager {
  play: (key: AudioKey) => void;
  setMuted: (muted: boolean) => void;
  muted: boolean;
  setAmbient: (track: "ambientDefault" | "ambientUnder") => void;
}

export function useAudio(): AudioManager {
  const howlsRef = useRef<Partial<Record<AudioKey, Howl>>>({});
  const [muted, setMutedState] = useState(true);
  const currentAmbientRef = useRef<"ambientDefault" | "ambientUnder">(
    "ambientDefault"
  );

  useEffect(() => {
    let active = true;

    import("howler").then(({ Howl: HowlCtor, Howler }) => {
      if (!active) return;

      // Instantiate all sounds
      (Object.keys(AUDIO) as AudioKey[]).forEach((key) => {
        const cfg = AUDIO[key];
        howlsRef.current[key] = new HowlCtor({
          src: [asset(cfg.file)],
          loop: cfg.loop,
          volume: cfg.volume,
          html5: cfg.loop,
        });
      });

      // Start both ambient loops at zero volume (crossfade targets)
      howlsRef.current.ambientDefault?.play();
      howlsRef.current.ambientUnder?.play();

      // Global volume stays at 0 until user unmutes
      Howler.volume(0);
    });

    return () => {
      active = false;
      import("howler").then(({ Howler }) => Howler.unload());
    };
  }, []);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    import("howler").then(({ Howler }) => {
      Howler.volume(m ? 0 : 1);
    });
  }, []);

  const play = useCallback(
    (key: AudioKey) => {
      if (muted) return;
      const h = howlsRef.current[key];
      if (!h) return;
      h.seek(0);
      h.play();
    },
    [muted]
  );

  const setAmbient = useCallback(
    (track: "ambientDefault" | "ambientUnder") => {
      if (track === currentAmbientRef.current) return;
      const targetVol = muted ? 0 : 1;
      const prev = howlsRef.current[currentAmbientRef.current];
      const next = howlsRef.current[track];
      if (prev) prev.fade(prev.volume(), 0, 1000);
      if (next) {
        if (!next.playing()) next.play();
        next.fade(0, targetVol, 1000);
      }
      currentAmbientRef.current = track;
    },
    [muted]
  );

  return { play, setMuted, muted, setAmbient };
}
