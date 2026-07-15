import type { FormulaDef } from "./types";
import { F_GRUND } from "./f-grund";
import { F_WIDERSTAND } from "./f-widerstand";
import { F_SCHALTUNGEN } from "./f-schaltungen";
import { F_LEISTUNG } from "./f-leistung";
import { F_MOTOREN } from "./f-motoren";
import { F_WECHSEL } from "./f-wechsel";
import { F_DREHSTROM } from "./f-drehstrom";
import { F_TRAFO } from "./f-trafo";
import { F_LEISTUNGSARTEN } from "./f-leistungsarten";
import { F_INSTALL } from "./f-install";
import { F_EXTRA } from "./f-extra";

export const FORMULAS: FormulaDef[] = [
  ...F_GRUND,
  ...F_WIDERSTAND,
  ...F_SCHALTUNGEN,
  ...F_LEISTUNG,
  ...F_MOTOREN,
  ...F_WECHSEL,
  ...F_DREHSTROM,
  ...F_TRAFO,
  ...F_LEISTUNGSARTEN,
  ...F_INSTALL,
  ...F_EXTRA,
];

export const FORMULA_BY_ID: Record<string, FormulaDef> = Object.fromEntries(
  FORMULAS.map((f) => [f.id, f]),
);

export const formulasOfCategory = (catId: string) => FORMULAS.filter((f) => f.cat === catId);

export { CATEGORIES, CATEGORY_BY_ID } from "./categories";
export { TOPICS, TOPIC_BY_ID } from "./topics";
