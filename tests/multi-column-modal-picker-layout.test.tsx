import * as ReactNative from "react-native";
import { StyleSheet } from "react-native";
import { fireEvent, screen } from "@testing-library/react-native";
import { Platform } from "react-native";
import type { WebGlobal } from "../src/types";
import { pickerElement, renderPicker } from "./test-utils";

const landscapeMetrics = {
  frame: { x: 0, y: 0, width: 844, height: 390 },
  insets: { top: 20, right: 12, bottom: 30, left: 8 },
};

const mockWindowDimensions = (width: number, height: number, fontScale = 1) => {
  const dimensions = { width, height, scale: 1, fontScale };
  jest
    .spyOn(ReactNative.Dimensions, "get")
    .mockImplementation(() => dimensions);
};

const completedAnimation = (): ReactNative.Animated.CompositeAnimation => ({
  start: (callback) => callback?.({ finished: true }),
  stop: jest.fn(),
  reset: jest.fn(),
});

describe("MultiColumnModalPicker responsive layout", () => {
  beforeEach(() => {
    jest
      .spyOn(ReactNative.Animated, "timing")
      .mockReturnValue(completedAnimation());
    jest
      .spyOn(ReactNative.Animated, "parallel")
      .mockReturnValue(completedAnimation());
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
    delete (globalThis as WebGlobal).window;
  });

  it("renders landscape search, right-side info, custom padding, and focus callbacks", async () => {
    mockWindowDimensions(844, 390, 2);
    const onSearchFocus = jest.fn();
    const onSearchBlur = jest.fn();
    const result = await renderPicker(
      {
        enableSearch: true,
        actionButtonsPosition: "bottom",
        rightInfo: "$12 / month",
        horizontalPadding: 16,
        onSearchFocus,
        onSearchBlur,
      },
      landscapeMetrics,
    );

    expect(screen.getByText("$12 / month")).toBeTruthy();
    await fireEvent(screen.getByLabelText("Search options"), "focus");
    await fireEvent(screen.getByLabelText("Search options"), "blur");
    expect(onSearchFocus).toHaveBeenCalledTimes(1);
    expect(onSearchBlur).toHaveBeenCalledTimes(1);
    expect(
      result.container.queryAll(
        ({ props }) =>
          Array.isArray(props.style) &&
          props.style.some(
            (style) =>
              typeof style === "object" &&
              style !== null &&
              "minWidth" in style &&
              style.minWidth === 16,
          ),
      ),
    ).toHaveLength(1);
  });

  it("uses the landscape minimums when available height is constrained", async () => {
    mockWindowDimensions(844, 200);
    await renderPicker(
      {
        actionButtonsPosition: "bottom",
        title: "Short screen",
      },
      {
        frame: { x: 0, y: 0, width: 844, height: 200 },
        insets: { top: 0, right: 0, bottom: 24, left: 0 },
      },
    );

    expect(screen.getByText("Short screen")).toBeTruthy();
    expect(screen.getByLabelText("Column 1")).toBeTruthy();
  });

  it("uses the landscape portrait fallback action height for very short windows", async () => {
    mockWindowDimensions(844, 120);
    await renderPicker(
      { actionButtonsPosition: "bottom" },
      {
        frame: { x: 0, y: 0, width: 844, height: 120 },
        insets: { top: 0, right: 0, bottom: 0, left: 0 },
      },
    );

    expect(screen.getAllByLabelText("Accept")).toHaveLength(2);
  });

  it("applies the safe-area bottom inset on a narrow portrait screen", async () => {
    mockWindowDimensions(390, 844);
    const result = await renderPicker(
      { actionButtonsPosition: "bottom" },
      {
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 0, right: 0, bottom: 34, left: 0 },
      },
    );

    expect(
      result.container.queryAll(
        ({ props }) => StyleSheet.flatten(props.style)?.paddingBottom === 34,
      ),
    ).toHaveLength(1);
  });

  it("uses explicit navigation visibility and supports legacy column props", async () => {
    const result = await renderPicker({
      columns: undefined,
      column1: [{ label: "Legacy", value: "legacy" }],
      selectedValue1: "legacy",
      showColumnNavigationButtons: [true, false, undefined],
      horizontalPadding: 24,
    });

    expect(screen.getByLabelText("Column 1")).toBeTruthy();
    expect(screen.getByLabelText("Next option in column 1")).toBeTruthy();
    expect(screen.queryByLabelText("Next option in column 2")).toBeNull();
    expect(
      result.container.queryAll(
        ({ props }) =>
          Array.isArray(props.style) &&
          props.style.some(
            (style) =>
              typeof style === "object" &&
              style !== null &&
              "minWidth" in style &&
              style.minWidth === 24,
          ),
      ),
    ).toHaveLength(1);
  });

  it("accepts a boolean navigation visibility override", async () => {
    await renderPicker({ showColumnNavigationButtons: true });

    expect(screen.getByLabelText("Next option in column 1")).toBeTruthy();
  });

  it("hides navigation buttons when the boolean override is false", async () => {
    await renderPicker({ showColumnNavigationButtons: false });

    expect(screen.queryByLabelText("Next option in column 1")).toBeNull();
  });

  it("renders without columns and supports the legacy horizontal-padding alias", async () => {
    await renderPicker({ columns: undefined, hPadding: 12 });

    expect(screen.queryByLabelText("Column 1")).toBeNull();
  });

  it("does not render right-side info when multiple columns are active", async () => {
    await renderPicker({
      columns: [
        [{ label: "One", value: "one" }],
        [{ label: "Two", value: "two" }],
      ],
      rightInfo: "Multiple columns",
    });

    expect(screen.queryByText("Multiple columns")).toBeNull();
  });

  it("supports web without matchMedia", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {},
    });

    await renderPicker();

    expect(screen.getByLabelText("Accept")).toBeTruthy();
  });

  it("clears search state when the controlled modal becomes hidden", async () => {
    const props = { enableSearch: true };
    const result = await renderPicker(props);
    await fireEvent.changeText(
      screen.getByLabelText("Search options"),
      "basic",
    );

    await result.rerender(pickerElement({ ...props, visible: false }));

    expect(screen.queryByLabelText("Search options")).toBeNull();
    await result.rerender(pickerElement({ ...props, visible: true }));

    expect(screen.getByDisplayValue("")).toBeTruthy();
  });
});
