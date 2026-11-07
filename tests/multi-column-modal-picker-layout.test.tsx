import * as ReactNative from "react-native";
import { StyleSheet } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Platform } from "react-native";
import type { WebGlobal } from "../src/types";
import { getModalInstances, pickerElement, renderPicker } from "./test-utils";

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

    expect(screen.getAllByLabelText("Accept")).toHaveLength(1);
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

  it("renders bottom inline actions below the picker with a themed separator", async () => {
    const result = await renderPicker({
      actionButtonsPosition: "bottomInline",
      title: "Choose an option",
      cancelButtonText: "Keep current",
      submitButtonText: "Choose destination",
      theme: "light",
      customColorScheme: {
        light: { border: "#444444", divider: "#8A6A9E" },
      },
    });
    const [, modal] = getModalInstances(result.root);
    const actionRow = modal.queryAll(
      (instance) =>
        instance.type === "View" &&
        StyleSheet.flatten(instance.props.style)?.borderTopWidth ===
          StyleSheet.hairlineWidth,
    )[0];
    const titleDivider = modal.queryAll(
      (instance) =>
        instance.type === "View" &&
        StyleSheet.flatten(instance.props.style)?.borderBottomWidth ===
          StyleSheet.hairlineWidth,
    )[0];
    const pickerRow = modal.queryAll(
      (instance) =>
        instance.type === "View" &&
        StyleSheet.flatten(instance.props.style)?.height === 216,
    )[0];
    const cancelButton = screen
      .getAllByLabelText("Keep current")
      .find((instance) => StyleSheet.flatten(instance.props.style)?.flex === 1);
    const submitButton = screen
      .getAllByLabelText("Choose destination")
      .find((instance) => StyleSheet.flatten(instance.props.style)?.flex === 1);

    expect(actionRow).toBeTruthy();
    expect(StyleSheet.flatten(actionRow.props.style)?.borderTopColor).toBe(
      "#8A6A9E",
    );
    expect(
      StyleSheet.flatten(titleDivider.props.style)?.borderBottomColor,
    ).toBe("#8A6A9E");
    expect(modal.queryAll(() => true).indexOf(actionRow)).toBeGreaterThan(
      modal.queryAll(() => true).indexOf(pickerRow),
    );
    expect(StyleSheet.flatten(cancelButton?.props.style)?.flex).toBe(1);
    expect(submitButton).toBeTruthy();
    expect(StyleSheet.flatten(submitButton?.props.style)?.flex).toBe(1);
  });

  it.each([
    ["cancel", false, true],
    ["submit", true, false],
  ] as const)(
    "keeps the bottom inline action row when the %s action is hidden",
    async (hiddenAction, showCancelButton, showSubmitButton) => {
      const result = await renderPicker({
        actionButtonsPosition: "bottomInline",
        cancelButtonText: "Keep current",
        submitButtonText: "Choose destination",
        showCancelButton,
        showSubmitButton,
      });
      const [, modal] = getModalInstances(result.root);

      expect(
        modal.queryAll(
          (instance) =>
            instance.type === "View" &&
            StyleSheet.flatten(instance.props.style)?.borderTopWidth ===
              StyleSheet.hairlineWidth,
        ),
      ).toHaveLength(1);
      const hiddenLabel =
        hiddenAction === "cancel" ? "Keep current" : "Choose destination";
      const visibleLabel =
        hiddenAction === "cancel" ? "Choose destination" : "Keep current";
      expect(
        modal.queryAll(
          (instance) =>
            instance.props.accessibilityLabel === hiddenLabel &&
            StyleSheet.flatten(instance.props.style)?.flex === 1,
        ),
      ).toHaveLength(0);
      expect(
        modal.queryAll(
          (instance) =>
            instance.props.accessibilityLabel === visibleLabel &&
            StyleSheet.flatten(instance.props.style)?.flex === 1,
        ),
      ).toHaveLength(1);
    },
  );

  it("uses a transparent divider for top and bottom submit separators", async () => {
    const topResult = await renderPicker({
      actionButtonsPosition: "top",
      title: "Choose an option",
      customColorScheme: {
        light: { border: "#444444", divider: "transparent" },
      },
    });
    const [, topModal] = getModalInstances(topResult.root);
    const topSeparators = topModal.queryAll(
      (instance) =>
        instance.type === "View" &&
        StyleSheet.flatten(instance.props.style)?.borderBottomWidth ===
          StyleSheet.hairlineWidth,
    );

    expect(topSeparators).toHaveLength(2);
    expect(
      topSeparators.map(
        (separator) =>
          StyleSheet.flatten(separator.props.style)?.borderBottomColor,
      ),
    ).toEqual(["transparent", "transparent"]);

    const bottomResult = await renderPicker({
      actionButtonsPosition: "bottom",
      customColorScheme: {
        light: { border: "#444444", divider: "transparent" },
      },
    });
    const [, bottomModal] = getModalInstances(bottomResult.root);
    const submitSeparator = bottomModal.queryAll(
      (instance) =>
        StyleSheet.flatten(instance.props.style)?.borderTopWidth ===
        StyleSheet.hairlineWidth,
    )[0];

    expect(
      StyleSheet.flatten(submitSeparator.props.style)?.borderTopColor,
    ).toBe("transparent");
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

  it("uses the native slide and fades a backdrop outside the modal", async () => {
    const timingSpy = jest
      .spyOn(ReactNative.Animated, "timing")
      .mockReturnValue(completedAnimation());
    const result = await renderPicker();
    const [overlayModal, modal] = getModalInstances(result.root);
    const backdrop = result.root?.queryAll(
      (instance) =>
        instance.type === "View" &&
        instance.props.pointerEvents === "none" &&
        StyleSheet.flatten(instance.props.style).position === "absolute",
    )[0];

    expect(overlayModal).toBeTruthy();
    expect(modal).toBeTruthy();
    expect(modal.props.animationType).toBe("slide");
    expect(backdrop).toBeTruthy();
    expect(timingSpy.mock.calls.map(([, config]) => config.toValue)).toEqual([
      1,
    ]);

    await result.rerender(pickerElement({ visible: false }));

    expect(timingSpy.mock.calls.map(([, config]) => config.toValue)).toEqual([
      1, 0,
    ]);
    expect(getModalInstances(result.root)).toHaveLength(0);
  });

  it("uses the native fade and fades the backdrop with it", async () => {
    const timingSpy = jest
      .spyOn(ReactNative.Animated, "timing")
      .mockReturnValue(completedAnimation());
    const result = await renderPicker({ modalAnimationType: "fade" });
    const modals = getModalInstances(result.root);
    const [overlayModal, modal] = modals;

    expect(overlayModal?.props.animationType).toBe("none");
    expect(modal?.props.animationType).toBe("fade");
    expect(timingSpy.mock.calls.map(([, config]) => config.toValue)).toEqual([
      1,
    ]);

    await result.rerender(
      pickerElement({ visible: false, modalAnimationType: "fade" }),
    );

    expect(timingSpy.mock.calls.map(([, config]) => config.toValue)).toEqual([
      1, 0,
    ]);
  });

  it("shows and hides the backdrop without animation when animation type is none", async () => {
    const timingSpy = jest
      .spyOn(ReactNative.Animated, "timing")
      .mockReturnValue(completedAnimation());
    const result = await renderPicker({ modalAnimationType: "none" });
    const modals = getModalInstances(result.root);
    const [overlayModal, modal] = modals;

    expect(overlayModal?.props.animationType).toBe("none");
    expect(modal?.props.animationType).toBe("none");
    expect(timingSpy).not.toHaveBeenCalled();

    await result.rerender(
      pickerElement({ visible: false, modalAnimationType: "none" }),
    );

    expect(timingSpy).not.toHaveBeenCalled();
    expect(getModalInstances(result.root)).toHaveLength(0);
  });

  it("ignores a late overlay show callback after dismissal", async () => {
    const result = await renderPicker({ modalAnimationType: "none" });
    const overlayModal = getModalInstances(result.root)[0];
    const onShow = overlayModal.props.onShow;

    await result.rerender(
      pickerElement({ visible: false, modalAnimationType: "none" }),
    );
    onShow();

    expect(getModalInstances(result.root)).toHaveLength(0);
  });

  it.each([
    ["bottom", "flex-end"],
    ["center", "center"],
    ["top", "flex-start"],
  ] as const)(
    "positions the picker at %s",
    async (modalPosition, justifyContent) => {
      const result = await renderPicker({ modalPosition });
      const [, modal] = getModalInstances(result.root);
      const positionedContainer = modal.queryAll(
        (instance) =>
          instance.type === "View" &&
          StyleSheet.flatten(instance.props.style)?.justifyContent ===
            justifyContent,
      )[0];

      expect(positionedContainer).toBeTruthy();
    },
  );

  it("keeps the picker below the top safe area without inset on the overlay", async () => {
    mockWindowDimensions(390, 844);
    const result = await renderPicker(
      { modalPosition: "top" },
      {
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 59, right: 0, bottom: 34, left: 0 },
      },
    );
    const [overlayModal, pickerModal] = getModalInstances(result.root);
    const pickerContainer = pickerModal.queryAll(
      (instance) =>
        instance.type === "View" &&
        StyleSheet.flatten(instance.props.style)?.justifyContent ===
          "flex-start",
    )[0];
    const overlayContainer = overlayModal.queryAll(
      (instance) =>
        instance.type === "View" &&
        StyleSheet.flatten(instance.props.style)?.flex === 1,
    )[0];

    expect(StyleSheet.flatten(pickerContainer.props.style)?.paddingTop).toBe(
      59,
    );
    expect(
      StyleSheet.flatten(overlayContainer.props.style)?.paddingTop,
    ).toBeUndefined();
  });

  it("preserves centered positioning on wide layouts unless overridden", async () => {
    mockWindowDimensions(844, 390, 1);
    const defaultResult = await renderPicker({}, landscapeMetrics);
    const [, defaultModal] = getModalInstances(defaultResult.root);

    expect(
      defaultModal.queryAll(
        (instance) =>
          instance.type === "View" &&
          StyleSheet.flatten(instance.props.style)?.justifyContent === "center",
      ),
    ).not.toHaveLength(0);

    await defaultResult.unmount();
    const bottomResult = await renderPicker(
      { modalPosition: "bottom" },
      landscapeMetrics,
    );
    const [, bottomModal] = getModalInstances(bottomResult.root);

    expect(
      bottomModal.queryAll(
        (instance) =>
          instance.type === "View" &&
          StyleSheet.flatten(instance.props.style)?.justifyContent ===
            "flex-end",
      ),
    ).not.toHaveLength(0);
  });

  it("presents the picker only after the overlay modal is shown", async () => {
    const result = await render(pickerElement());
    const [overlayModal] = getModalInstances(result.root);

    expect(overlayModal).toBeTruthy();
    expect(getModalInstances(result.root)).toHaveLength(1);

    await fireEvent(overlayModal, "show");

    expect(getModalInstances(result.root)).toHaveLength(2);
  });
});
