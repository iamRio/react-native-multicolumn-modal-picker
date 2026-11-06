import { NativeModules, Platform } from "react-native";

import {
  detectDeviceLocale,
  normalizeLocale,
  resolveDefaultTextSet,
  resolveLocale,
  translations,
} from "../src/i18n/locale";

const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
let runtimeLocale = "en";

beforeEach(() => {
  Intl.DateTimeFormat.prototype.resolvedOptions = function () {
    return {
      ...originalResolvedOptions.call(this),
      locale: runtimeLocale,
    };
  };
  Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
  Object.defineProperty(NativeModules, "SettingsManager", {
    configurable: true,
    value: { settings: {} },
  });
  Object.defineProperty(NativeModules, "I18nManager", {
    configurable: true,
    value: {},
  });
});

afterEach(() => {
  Intl.DateTimeFormat.prototype.resolvedOptions = originalResolvedOptions;
  runtimeLocale = "en";
});

describe("normalizeLocale", () => {
  it("normalizes separators, casing, and regional locale codes", () => {
    expect(normalizeLocale("pt_BR")).toBe("pt");
    expect(normalizeLocale("ES-mx")).toBe("es");
  });

  it("maps supported aliases and rejects unsupported values", () => {
    expect(normalizeLocale("nn-NO")).toBe("nb");
    expect(normalizeLocale("iw-IL")).toBe("he");
    expect(normalizeLocale("xx-XX")).toBeUndefined();
    expect(normalizeLocale(null)).toBeUndefined();
    expect(normalizeLocale("")).toBeUndefined();
  });
});

describe("detectDeviceLocale", () => {
  it("prefers the runtime locale when it is supported", () => {
    runtimeLocale = "de-DE";

    expect(detectDeviceLocale()).toBe("de");
  });

  it("uses the iOS locale when the runtime locale is unsupported", () => {
    runtimeLocale = "xx-XX";
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
    NativeModules.SettingsManager.settings = { AppleLocale: "es-ES" };

    expect(detectDeviceLocale()).toBe("es");
  });

  it("falls back to the first iOS language when AppleLocale is absent", () => {
    runtimeLocale = "xx-XX";
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
    NativeModules.SettingsManager.settings = {
      AppleLanguages: ["es-ES"],
    };

    expect(detectDeviceLocale()).toBe("es");
  });

  it("uses the Android locale when the runtime locale is unsupported", () => {
    runtimeLocale = "xx-XX";
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: "android",
    });
    Object.defineProperty(NativeModules, "I18nManager", {
      configurable: true,
      value: { localeIdentifier: "fr_FR" },
    });

    expect(detectDeviceLocale()).toBe("fr");
  });

  it("uses the Android system locale when the locale identifier is absent", () => {
    runtimeLocale = "xx-XX";
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: "android",
    });
    Object.defineProperty(NativeModules, "I18nManager", {
      configurable: true,
      value: { systemLocale: "it-IT", locale: "es-ES" },
    });

    expect(detectDeviceLocale()).toBe("it");
  });

  it("uses the Android locale when preferred Android locales are absent", () => {
    runtimeLocale = "xx-XX";
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: "android",
    });
    Object.defineProperty(NativeModules, "I18nManager", {
      configurable: true,
      value: { locale: "pt-BR" },
    });

    expect(detectDeviceLocale()).toBe("pt");
  });

  it("falls back to English when no device locale is supported", () => {
    runtimeLocale = "xx-XX";

    expect(detectDeviceLocale()).toBe("en");
  });
});

describe("locale resolution", () => {
  it("uses a supported manual locale and falls back to the device locale", () => {
    expect(resolveLocale("es")).toBe("es");
    expect(resolveLocale()).toBe(detectDeviceLocale());
  });

  it("returns the translation set for the resolved locale", () => {
    expect(resolveDefaultTextSet("fr")).toBe(translations.fr);
  });
});
