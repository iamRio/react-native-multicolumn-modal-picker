import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Platform } from "react-native";
import type { PickerWheelProps } from "../src/types";
import { PickerWheel } from "../src/components/PickerWheel";

const column = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
  { label: "Gamma", value: "gamma" },
];

const createProps = (
  overrides: Partial<PickerWheelProps> = {},
): PickerWheelProps => ({
  column,
  columnIndex: 0,
  selectedValue: "beta",
  itemTextColor: "black",
  columnAccessibilityLabel: "Column {column}",
  pickerHeight: 216,
  ...overrides,
});

const getScrollList = (result: Awaited<ReturnType<typeof render>>) => {
  const list = result.container.queryAll(
    ({ props }) => typeof props.onScroll === "function",
  )[0];
  if (!list) throw new Error("Picker wheel scroll list was not rendered.");
  return list;
};

const scrollEvent = (offset: number) => ({
  nativeEvent: {
    contentOffset: { x: 0, y: offset },
    contentSize: { width: 100, height: 120 },
    layoutMeasurement: { width: 100, height: 216 },
  },
});

describe("PickerWheel", () => {
  afterEach(() => {
    jest.useRealTimers();
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
  });

  it("exposes the selected item and renders wheel options", async () => {
    await render(<PickerWheel {...createProps()} />);

    expect(screen.getByLabelText("Column 1").props.accessibilityValue).toEqual({
      text: "Beta, 2 of 3",
    });
    expect(screen.getByText("Beta")).toBeTruthy();
    expect(screen.getByText("Gamma")).toBeTruthy();
  });

  it("notifies when the user requests the next accessible option", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    await render(
      <PickerWheel
        {...createProps({ onValueChange, animateSelectedValueChange: true })}
      />,
    );

    await fireEvent(screen.getByLabelText("Column 1"), "accessibilityAction", {
      nativeEvent: { actionName: "increment" },
    });
    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(onValueChange).toHaveBeenCalledWith("gamma", 2);
  });

  it("does not scroll outside the column bounds", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    await render(
      <PickerWheel
        {...createProps({
          selectedValue: "alpha",
          onValueChange,
        })}
      />,
    );

    await fireEvent(screen.getByLabelText("Column 1"), "accessibilityAction", {
      nativeEvent: { actionName: "decrement" },
    });
    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("updates the selected index when controlled value changes", async () => {
    const props = createProps({ selectedValue: "alpha" });
    const result = await render(<PickerWheel {...props} />);

    await result.rerender(<PickerWheel {...props} selectedValue="gamma" />);

    expect(screen.getByLabelText("Column 1").props.accessibilityValue).toEqual({
      text: "Gamma, 3 of 3",
    });
  });

  it("finishes an unnotified animated scroll after controlled selection changes", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    const props = createProps({
      selectedValue: "alpha",
      animateSelectedValueChange: true,
      onValueChange,
    });
    const result = await render(<PickerWheel {...props} />);

    await result.rerender(<PickerWheel {...props} selectedValue="gamma" />);
    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(
      screen.getByLabelText("Column 1").props.accessibilityValue.text,
    ).toBe("Gamma, 3 of 3");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("snaps a web drag to the nearest option", async () => {
    jest.useFakeTimers();
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    const onValueChange = jest.fn();
    const result = await render(
      <PickerWheel {...createProps({ onValueChange })} />,
    );
    const list = getScrollList(result);

    await fireEvent(list, "scrollBeginDrag");
    await fireEvent(list, "scroll", scrollEvent(85));
    await act(async () => {
      jest.advanceTimersByTime(120);
    });
    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(onValueChange).toHaveBeenCalledWith("gamma", 2);
  });

  it("commits a native drag after the user stops scrolling", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    const result = await render(
      <PickerWheel {...createProps({ onValueChange })} />,
    );
    const list = getScrollList(result);

    await fireEvent(list, "scrollBeginDrag");
    await fireEvent(list, "scrollEndDrag", scrollEvent(40));
    await act(async () => {
      jest.advanceTimersByTime(120);
    });

    expect(onValueChange).toHaveBeenCalledWith("beta", 1);
  });

  it("waits for momentum scrolling to finish before committing a value", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    const result = await render(
      <PickerWheel {...createProps({ onValueChange })} />,
    );
    const list = getScrollList(result);

    await fireEvent(list, "scrollBeginDrag");
    await fireEvent(list, "scrollEndDrag", scrollEvent(80));
    await fireEvent(list, "momentumScrollBegin");
    await act(async () => {
      jest.advanceTimersByTime(120);
    });
    expect(onValueChange).not.toHaveBeenCalled();

    await fireEvent(list, "momentumScrollEnd", scrollEvent(80));
    expect(onValueChange).toHaveBeenCalledWith("gamma", 2);
  });

  it("commits a web drag already aligned to an item without a snap animation", async () => {
    jest.useFakeTimers();
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    const onValueChange = jest.fn();
    const result = await render(
      <PickerWheel {...createProps({ onValueChange })} />,
    );
    const list = getScrollList(result);

    await fireEvent(list, "scrollBeginDrag");
    await fireEvent(list, "scroll", scrollEvent(80));
    await act(async () => {
      jest.advanceTimersByTime(120);
    });

    expect(onValueChange).toHaveBeenCalledWith("gamma", 2);
    await act(async () => {
      jest.advanceTimersByTime(350);
    });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("ignores momentum completion during a web snap animation", async () => {
    jest.useFakeTimers();
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    const onValueChange = jest.fn();
    const result = await render(
      <PickerWheel {...createProps({ onValueChange })} />,
    );
    const list = getScrollList(result);

    await fireEvent(list, "scrollBeginDrag");
    await fireEvent(list, "scroll", scrollEvent(85));
    await act(async () => {
      jest.advanceTimersByTime(120);
    });
    await fireEvent(list, "scroll", scrollEvent(40));
    await fireEvent(list, "momentumScrollEnd", scrollEvent(85));
    expect(onValueChange).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(350);
    });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("cancels a pending web snap when a new drag begins", async () => {
    jest.useFakeTimers();
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    const result = await render(<PickerWheel {...createProps()} />);
    const list = getScrollList(result);

    await fireEvent(list, "scrollBeginDrag");
    await fireEvent(list, "scroll", scrollEvent(85));
    await act(async () => {
      jest.advanceTimersByTime(120);
    });
    await fireEvent(list, "scrollBeginDrag");
    await fireEvent(list, "scroll", scrollEvent(40));
    await act(async () => {
      jest.advanceTimersByTime(120);
    });

    expect(
      screen.getByLabelText("Column 1").props.accessibilityValue.text,
    ).toBe("Beta, 2 of 3");
  });

  it("ignores controlled selection changes while an unanimated drag is active", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    const props = createProps({ onValueChange });
    const result = await render(<PickerWheel {...props} />);
    const list = getScrollList(result);
    await fireEvent(list, "scrollBeginDrag");

    await result.rerender(<PickerWheel {...props} selectedValue="gamma" />);

    expect(onValueChange).not.toHaveBeenCalled();
    await fireEvent(list, "scrollEndDrag", scrollEvent(40));
    await act(async () => {
      jest.advanceTimersByTime(120);
    });
    expect(onValueChange).toHaveBeenCalledWith("beta", 1);
  });

  it("finishes an animated controlled change without emitting a duplicate value", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    const props = createProps({
      onValueChange,
      animateSelectedValueChange: true,
    });
    const result = await render(<PickerWheel {...props} />);
    const list = getScrollList(result);

    await result.rerender(<PickerWheel {...props} selectedValue="gamma" />);
    await fireEvent(list, "momentumScrollEnd", scrollEvent(80));
    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("cleans up pending scroll timers when unmounted", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    const result = await render(
      <PickerWheel {...createProps({ onValueChange })} />,
    );
    const list = getScrollList(result);

    await fireEvent(list, "scrollEndDrag", scrollEvent(40));
    await result.unmount();
    await act(async () => {
      jest.advanceTimersByTime(120);
    });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not commit a value for an empty column", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    const result = await render(
      <PickerWheel
        {...createProps({
          column: [],
          selectedValue: null,
          onValueChange,
        })}
      />,
    );
    const list = getScrollList(result);

    await fireEvent(list, "scrollEndDrag", scrollEvent(40));
    await act(async () => {
      jest.advanceTimersByTime(120);
    });

    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen.getByLabelText("Column 1").props.accessibilityValue.text,
    ).toBe(undefined);
  });
});
