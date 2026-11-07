import { Colors, resolvePalette } from "../src/constants/colors";

describe("resolvePalette", () => {
  it("uses the light palette by default", () => {
    expect(resolvePalette({})).toMatchObject(Colors.light);
  });

  it("uses a dark device scheme when no explicit theme is supplied", () => {
    expect(resolvePalette({ colorScheme: "dark" })).toMatchObject(Colors.dark);
  });

  it("uses the device color scheme for auto themes", () => {
    expect(
      resolvePalette({ theme: "auto", colorScheme: "dark" }),
    ).toMatchObject(Colors.dark);
    expect(
      resolvePalette({ theme: "auto", colorScheme: "light" }),
    ).toMatchObject(Colors.light);
  });

  it("uses the device palette as a base for custom theme names", () => {
    const palette = resolvePalette({
      theme: "midnight",
      colorScheme: "dark",
      customColorScheme: {
        dark: { modalBackground: "base" },
        midnight: { modalBackground: "named" },
      },
    });

    expect(palette.modalBackground).toBe("named");
  });

  it("falls back to the light device palette for an unknown custom theme", () => {
    const palette = resolvePalette({
      theme: "sunset",
      colorScheme: "light",
      customColorScheme: {
        light: { modalBackground: "light-base" },
      },
    });

    expect(palette.modalBackground).toBe("light-base");
  });

  it("applies named overrides when the selected theme matches the base palette", () => {
    const palette = resolvePalette({
      theme: "dark",
      colorScheme: "dark",
      customColorScheme: {
        dark: { modalBackground: "named-dark" },
      },
    });

    expect(palette.modalBackground).toBe("named-dark");
  });

  it("applies legacy overrides before palette-specific overrides", () => {
    const palette = resolvePalette({
      theme: "light",
      legacyColorOverrides: {
        modalBackground: "legacy",
        border: "legacy-border",
      },
      customColorScheme: {
        light: { modalBackground: "custom", border: undefined },
      },
    });

    expect(palette.modalBackground).toBe("custom");
    expect(palette.border).toBe("legacy-border");
  });

  it("defaults the divider color to the resolved border color", () => {
    const palette = resolvePalette({
      theme: "light",
      customColorScheme: {
        light: { border: "custom-border" },
      },
    });

    expect(palette.divider).toBe("custom-border");
  });

  it("allows a transparent divider without changing other border colors", () => {
    const palette = resolvePalette({
      theme: "light",
      customColorScheme: {
        light: { border: "custom-border", divider: "transparent" },
      },
    });

    expect(palette.border).toBe("custom-border");
    expect(palette.divider).toBe("transparent");
  });
});
