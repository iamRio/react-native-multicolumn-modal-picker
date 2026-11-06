import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import type { PickerColumnViewProps } from "../src/types";
import {
  columnNavigationControlHeight,
  PickerColumnNavigationButtons,
} from "../src/components/PickerColumnNavigationButtons";

const createProps = (
  overrides: Partial<PickerColumnViewProps> = {},
): PickerColumnViewProps => ({
  column: [
    { label: "One", value: "one" },
    { label: "Two", value: "two" },
    { label: "Three", value: "three" },
  ],
  columnIndex: 1,
  selectedValue: "two",
  itemTextColor: "black",
  columnNavigationButtonsColor: "black",
  columnAccessibilityLabel: "Column {column}",
  previousOptionAccessibilityLabel: "Previous option in column {column}",
  nextOptionAccessibilityLabel: "Next option in column {column}",
  pickerHeight: 216,
  isSingleColumn: false,
  showColumnNavigationButtons: true,
  reserveColumnNavigationButtonSpace: false,
  ...overrides,
});

describe("PickerColumnNavigationButtons", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("navigates to adjacent items and reports their indices", async () => {
    const onValueChange = jest.fn();
    const result = await render(
      <PickerColumnNavigationButtons {...createProps({ onValueChange })}>
        <Text>Picker content</Text>
      </PickerColumnNavigationButtons>,
    );

    await fireEvent.press(
      screen.getByRole("button", { name: "Previous option in column 2" }),
    );
    await result.rerender(
      <PickerColumnNavigationButtons
        {...createProps({ selectedValue: "one", onValueChange })}
      >
        <Text>Picker content</Text>
      </PickerColumnNavigationButtons>,
    );
    await fireEvent.press(
      screen.getByRole("button", { name: "Next option in column 2" }),
    );

    expect(onValueChange.mock.calls).toEqual([
      ["one", 0],
      ["two", 1],
    ]);
  });

  it("disables navigation at the first and last options", async () => {
    const first = await render(
      <PickerColumnNavigationButtons {...createProps({ selectedValue: "one" })}>
        <Text>Picker content</Text>
      </PickerColumnNavigationButtons>,
    );

    expect(
      screen.getByRole("button", { name: "Previous option in column 2" }).props
        .accessibilityState.disabled,
    ).toBe(true);

    await first.unmount();
    const { unmount } = await render(
      <PickerColumnNavigationButtons
        {...createProps({ selectedValue: "three" })}
      >
        <Text>Picker content</Text>
      </PickerColumnNavigationButtons>,
    );
    expect(
      screen.getByRole("button", { name: "Next option in column 2" }).props
        .accessibilityState.disabled,
    ).toBe(true);
    await unmount();
  });

  it("uses the first item when the selected value is not present", async () => {
    const onValueChange = jest.fn();
    await render(
      <PickerColumnNavigationButtons
        {...createProps({ selectedValue: "missing", onValueChange })}
      >
        <Text>Picker content</Text>
      </PickerColumnNavigationButtons>,
    );

    expect(
      screen.getByRole("button", { name: "Previous option in column 2" }).props
        .accessibilityState.disabled,
    ).toBe(true);
    await fireEvent.press(
      screen.getByRole("button", { name: "Next option in column 2" }),
    );
    expect(onValueChange).toHaveBeenCalledWith("two", 1);
  });

  it("reserves button space when navigation controls are hidden", async () => {
    await render(
      <PickerColumnNavigationButtons
        {...createProps({
          showColumnNavigationButtons: false,
          reserveColumnNavigationButtonSpace: true,
        })}
      >
        <Text>Picker content</Text>
      </PickerColumnNavigationButtons>,
    );

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByText("Picker content")).toBeTruthy();
  });

  it("repeats navigation while a long press is active and stops at the edge", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    await render(
      <PickerColumnNavigationButtons
        {...createProps({
          columnIndex: 0,
          selectedValue: "one",
          onValueChange,
        })}
      >
        <Text>Picker content</Text>
      </PickerColumnNavigationButtons>,
    );
    const next = screen.getByRole("button", {
      name: "Next option in column 1",
    });

    await fireEvent(next, "pressIn");
    await fireEvent(next, "longPress");
    await act(async () => {
      jest.advanceTimersByTime(180 * 4);
    });

    expect(onValueChange.mock.calls).toEqual([
      ["two", 1],
      ["three", 2],
    ]);

    await fireEvent(next, "pressOut");
    await act(async () => {
      jest.advanceTimersByTime(180 * 4);
    });
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it("does not start repeat navigation after a press has ended", async () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    await render(
      <PickerColumnNavigationButtons {...createProps({ onValueChange })}>
        <Text>Picker content</Text>
      </PickerColumnNavigationButtons>,
    );
    const next = screen.getByRole("button", {
      name: "Next option in column 2",
    });

    await fireEvent(next, "longPress");
    await act(async () => {
      jest.advanceTimersByTime(180 * 2);
    });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("exports the navigation control height", () => {
    expect(columnNavigationControlHeight).toBe(48);
  });
});
