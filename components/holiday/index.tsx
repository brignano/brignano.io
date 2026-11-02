import type { ReactNode } from "react";
import Halloween from "./halloween";
import Thanksgiving from "./thanksgiving";
import Winter from "./winter";
import NewYear from "./new-year";
import Valentines from "./valentines";
import LunarNewYear from "./lunar-new-year";
import Holi from "./holi";
import StPatricks from "./st-patricks";
import Easter from "./easter";
import Eid from "./eid";
import Pride from "./pride";
import Juneteenth from "./juneteenth";
import IndependenceDay from "./independence-day";
import Diwali from "./diwali";
import Hanukkah from "./hanukkah";
import Kwanzaa from "./kwanzaa";
import EarthDay from "./earth-day";
import PiDay from "./pi-day";
import DiaDeMuertos from "./dia-de-muertos";

/**
 * One scene per holiday, each with its own placement, motion and palette (see
 * app/holiday.css). `day` is how far into the holiday we are, 0-based, for the
 * themes that change as it goes on (Hanukkah, Kwanzaa).
 */
export default function HolidayArt({ id, day }: { id: string; day: number }): ReactNode {
  switch (id) {
    case "halloween": return <Halloween />;
    case "dia-de-muertos": return <DiaDeMuertos />;
    case "thanksgiving": return <Thanksgiving />;
    case "winter": return <Winter />;
    case "hanukkah": return <Hanukkah day={day} />;
    case "kwanzaa": return <Kwanzaa day={day} />;
    case "new-year": return <NewYear />;
    case "lunar-new-year": return <LunarNewYear />;
    case "valentines": return <Valentines />;
    case "pi-day": return <PiDay />;
    case "holi": return <Holi />;
    case "st-patricks": return <StPatricks />;
    case "easter": return <Easter />;
    case "earth-day": return <EarthDay />;
    case "eid-al-fitr":
    case "eid-al-adha": return <Eid />;
    case "pride": return <Pride />;
    case "juneteenth": return <Juneteenth />;
    case "independence-day": return <IndependenceDay />;
    case "diwali": return <Diwali />;
    default: return null;
  }
}
