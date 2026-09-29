import { Classic } from "./Classic";
import { Modern } from "./Modern";
import { Professional } from "./Professional";
import { Minimal } from "./Minimal";
import { Traditional } from "./Traditional";

// id → component. Order matches TEMPLATE_IDS (picker order).
export const TEMPLATES = {
  classic: Classic,
  modern: Modern,
  professional: Professional,
  minimal: Minimal,
  traditional: Traditional,
};
