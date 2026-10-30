import type { DefaultTextSet, PickerLocale } from "../types";
import catalog from "./translations.json";

export const translations = catalog satisfies Record<
  PickerLocale,
  DefaultTextSet
>;

export const SUPPORTED_LOCALES = Object.keys(translations) as PickerLocale[];
