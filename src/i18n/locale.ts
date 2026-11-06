import { NativeModules, Platform } from "react-native";
import type { PickerLocale } from "../types";
import { SUPPORTED_LOCALES, translations } from "./translations";

export { translations };

const supportedLocaleMap: Record<string, PickerLocale> = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
  pt: "pt",
  ru: "ru",
  ja: "ja",
  ko: "ko",
  zh: "zh",
  ar: "ar",
  hi: "hi",
  tr: "tr",
  nl: "nl",
  pl: "pl",
  sv: "sv",
  nb: "nb",
  nn: "nb",
  da: "da",
  fi: "fi",
  cs: "cs",
  el: "el",
  id: "id",
  th: "th",
  uk: "uk",
  he: "he",
  iw: "he",
  ro: "ro",
  hu: "hu",
  sk: "sk",
  vi: "vi",
};

export const normalizeLocale = (
  rawLocale?: string | null,
): PickerLocale | undefined => {
  if (!rawLocale) {
    return undefined;
  }

  const normalized = rawLocale.replace(/_/g, "-").toLowerCase();
  const baseLocale = normalized.split("-")[0];

  return supportedLocaleMap[baseLocale];
};

export const detectDeviceLocale = (): PickerLocale => {
  const candidates: Array<string | undefined> = [];

  if (typeof Intl !== "undefined") {
    const resolvedLocale = Intl.DateTimeFormat?.().resolvedOptions?.().locale;
    candidates.push(resolvedLocale);
  }

  if (Platform.OS === "ios") {
    const appleLocale =
      NativeModules.SettingsManager?.settings?.AppleLocale ??
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
    candidates.push(appleLocale);
  }

  if (Platform.OS === "android") {
    const androidLocale =
      NativeModules.I18nManager?.localeIdentifier ??
      NativeModules.I18nManager?.systemLocale ??
      NativeModules.I18nManager?.locale;
    candidates.push(androidLocale);
  }

  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return "en";
};

export const resolveLocale = (manualLocale?: PickerLocale): PickerLocale => {
  if (manualLocale && SUPPORTED_LOCALES.includes(manualLocale)) {
    return manualLocale;
  }

  return detectDeviceLocale();
};

export const resolveDefaultTextSet = (
  manualLocale?: PickerLocale,
): (typeof translations)[PickerLocale] => {
  return translations[resolveLocale(manualLocale)];
};
