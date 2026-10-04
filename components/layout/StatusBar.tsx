"use client";

import { useEffect, useState } from "react";
import { CloudSun, LocateFixed, Moon, Navigation, Sun } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useTheme } from "@/components/theme/ThemeProvider";

interface WeatherState {
  temperature: number | null;
  condition: string;
  icon: string;
}

const initialWeather: WeatherState = {
  temperature: null,
  condition: "LOADING",
  icon: "•",
};

function weatherPresentation(code: number): Pick<WeatherState, "condition" | "icon"> {
  if (code === 0) return { condition: "SUNNY", icon: "☼" };
  if (code <= 3) return { condition: "PARTLY CLOUDY", icon: "◒" };
  if (code <= 67) return { condition: "RAIN", icon: "☂" };
  if (code <= 77) return { condition: "SNOW", icon: "❄" };
  if (code <= 82) return { condition: "SHOWERS", icon: "☂" };
  return { condition: "STORM", icon: "ϟ" };
}

export function StatusBar() {
  const { theme, toggleTheme } = useTheme();
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState(initialWeather);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current=temperature_2m,weather_code&temperature_unit=fahrenheit",
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
        const data = (await response.json()) as {
          current?: { temperature_2m?: number; weather_code?: number };
        };
        const temperature = data.current?.temperature_2m;
        const code = data.current?.weather_code;
        if (typeof temperature !== "number" || typeof code !== "number") {
          throw new Error("Weather response was incomplete");
        }
        setWeather({ temperature: Math.round(temperature), ...weatherPresentation(code) });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Unable to load Manila weather", error);
          setWeather({ temperature: null, condition: "UNAVAILABLE", icon: "—" });
        }
      }
    };
    void loadWeather();
    const refresh = window.setInterval(loadWeather, 15 * 60 * 1000);
    return () => {
      controller.abort();
      window.clearInterval(refresh);
    };
  }, []);

  const parts = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZoneName: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "--";

  return (
    <div className="grid grid-cols-3 gap-1.5 text-[8px] uppercase tracking-[0.08em] text-foreground/75 sm:gap-2 sm:text-[10px] sm:tracking-[0.14em]">
      <GlassPanel className="flex min-w-0 items-center justify-center gap-1 px-1.5 py-1.5 sm:flex-wrap sm:justify-start sm:gap-2 sm:px-3 sm:py-2">
        <span className="hidden sm:inline">{get("weekday")}</span>
        <span className="hidden rounded-md border border-foreground/15 px-1.5 py-1 sm:inline">{get("day")}</span>
        <span className="hidden rounded-md border border-foreground/15 px-1.5 py-1 sm:inline">{get("month")}</span>
        <span className="hidden rounded-md border border-foreground/15 px-1.5 py-1 sm:inline">{get("timeZoneName")}</span>
        <span className="font-mono text-foreground">{get("hour")}:{get("minute")}</span>
      </GlassPanel>
      <GlassPanel className="flex min-w-0 items-center justify-center gap-1 px-1.5 py-1.5 sm:flex-wrap sm:gap-2 sm:px-3 sm:py-2">
        <CloudSun size={12} className="shrink-0 text-accent sm:h-3.5 sm:w-3.5" />
        <span className="text-sm text-foreground sm:text-base">{weather.icon}</span>
        <span>{weather.temperature === null ? "--" : `${weather.temperature}°F`}</span>
        <span className="hidden rounded-md bg-foreground/10 px-1.5 py-1 text-[9px] sm:inline">{weather.condition}</span>
      </GlassPanel>
      <GlassPanel className="flex min-w-0 items-center justify-center gap-1 px-1.5 py-1.5 sm:justify-end sm:gap-2 sm:px-3 sm:py-2">
        <LocateFixed size={12} className="shrink-0 text-accent sm:h-3.5 sm:w-3.5" />
        <span className="truncate">MANILA, PH</span>
        <Navigation size={10} className="shrink-0 sm:h-3 sm:w-3" />
      </GlassPanel>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="fixed bottom-5 right-5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-foreground/10 text-foreground shadow-lg backdrop-blur-xl transition hover:border-accent hover:bg-accent/15 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
}
