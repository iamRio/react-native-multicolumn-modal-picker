import type {
  BasePalette,
  PickerPalette,
  ResolvePaletteOptions,
  ThemePalette,
} from "../types";
import { pickerTokens } from "./tokens";

export const Colors: Readonly<{
  light: BasePalette;
  dark: BasePalette;
}> &
  Pick<PickerPalette, "searchElements" | "cancelText"> = {
  light: {
    modalBackground: pickerTokens.color.light.modalBackground,
    overlay: pickerTokens.color.light.overlay,
    border: pickerTokens.color.light.border,
    buttonText: pickerTokens.color.light.buttonText,
    columnNavigationButtons: pickerTokens.color.light.columnNavigationButtons,
    cancelButtonText: pickerTokens.color.light.cancelButtonText,
    secondaryText: pickerTokens.color.light.secondaryText,
    rightInfoText: pickerTokens.color.light.buttonText,
    inputText: pickerTokens.color.light.inputText,
    pickerItemText: pickerTokens.color.light.inputText,
    selectionHighlight: pickerTokens.color.light.selectionHighlight,
    searchBackground: pickerTokens.color.light.searchBackground,
    searchClearBackground: pickerTokens.color.light.searchClearBackground,
    searchClearText: pickerTokens.color.light.searchClearText,
  },
  dark: {
    modalBackground: pickerTokens.color.dark.modalBackground,
    overlay: pickerTokens.color.dark.overlay,
    border: pickerTokens.color.dark.border,
    buttonText: pickerTokens.color.dark.inputText,
    columnNavigationButtons: pickerTokens.color.dark.columnNavigationButtons,
    cancelButtonText: pickerTokens.color.dark.inputText,
    secondaryText: pickerTokens.color.dark.secondaryText,
    rightInfoText: pickerTokens.color.dark.secondaryText,
    inputText: pickerTokens.color.dark.inputText,
    pickerItemText: pickerTokens.color.dark.inputText,
    selectionHighlight: pickerTokens.color.dark.selectionHighlight,
    searchBackground: pickerTokens.color.dark.searchBackground,
    searchClearBackground: pickerTokens.color.dark.searchClearBackground,
    searchClearText: pickerTokens.color.dark.searchClearText,
  },
  searchElements: pickerTokens.color.searchElements,
  cancelText: pickerTokens.color.cancelText,
} as const;

const omitUndefined = <T extends object>(value: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  ) as Partial<T>;

export const resolvePalette = ({
  theme,
  customColorScheme,
  colorScheme,
  legacyColorOverrides,
}: ResolvePaletteOptions): PickerPalette => {
  const resolvedThemeName: string =
    theme === "auto"
      ? colorScheme === "dark"
        ? "dark"
        : "light"
      : (theme ?? (colorScheme === "dark" ? "dark" : "light"));

  const basePaletteName: "light" | "dark" =
    resolvedThemeName === "dark" || resolvedThemeName === "light"
      ? resolvedThemeName
      : colorScheme === "dark"
        ? "dark"
        : "light";

  const baseThemeOverrides = customColorScheme?.[basePaletteName] ?? {};
  const namedThemeOverrides =
    resolvedThemeName === basePaletteName
      ? {}
      : (customColorScheme?.[resolvedThemeName] ?? {});

  const basePalette: BasePalette = Colors[basePaletteName];

  return {
    ...basePalette,
    searchElements: Colors.searchElements,
    cancelText: Colors.cancelText,
    ...omitUndefined(legacyColorOverrides ?? {}),
    ...omitUndefined(baseThemeOverrides),
    ...omitUndefined(namedThemeOverrides),
  } satisfies ThemePalette;
};
