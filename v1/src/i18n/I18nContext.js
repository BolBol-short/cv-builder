import { createContext, useContext } from "react";
import { makeT } from "./translations";

// UI language for the editor chrome. Templates don't read this — they get
// their own `t` for the CV language, which can differ from the UI language.
export const I18nContext = createContext({ lang: "en", t: makeT("en") });

export const useI18n = () => useContext(I18nContext);
