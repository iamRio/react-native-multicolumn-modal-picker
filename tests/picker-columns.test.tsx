import { fireEvent, render, screen } from "@testing-library/react-native";
import type { PickerColumnsProps } from "../src/types";
import { PickerColumns } from "../src/components/PickerColumns";

const column = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
];

const createProps = (
  overrides: Partial<PickerColumnsProps> = {},
): PickerColumnsProps => ({
  columns: [column, [], undefined],
  selectedValues: ["alpha", null, null],
  itemTextColor: "black",
  columnNavigationButtonsColor: "black",
  columnAccessibilityLabel: "Column {column}",
  previousOptionAccessibilityLabel: "Previous {column}",
  nextOptionAccessibilityLabel: "Next {column}",
  pickerHeight: 216,
  isSingleColumn: false,
  showColumnNavigationButtons: [false, false, false],
  reserveColumnNavigationButtonSpace: true,
  onValueChanges: [jest.fn(), jest.fn(), jest.fn()],
  ...overrides,
});

describe("PickerColumns", () => {
  it("renders non-empty columns with their controlled values", async () => {
    await render(<PickerColumns {...createProps()} />);

    expect(screen.getByLabelText("Column 1")).toBeTruthy();
    expect(screen.queryByLabelText("Column 2")).toBeNull();
    expect(screen.queryByLabelText("Column 3")).toBeNull();
  });

  it("routes each native picker selection to its corresponding callback", async () => {
    const callbacks = [jest.fn(), jest.fn(), jest.fn()] as const;
    await render(
      <PickerColumns
        {...createProps({
          columns: [column, column, column],
          selectedValues: ["alpha", "alpha", "alpha"],
          onValueChanges: [...callbacks],
        })}
      />,
    );

    await fireEvent(
      screen.getByLabelText("Column 2"),
      "valueChange",
      "beta",
      1,
    );
    expect(callbacks[1]).toHaveBeenCalledWith("beta", 1);
    expect(callbacks[0]).not.toHaveBeenCalled();
    expect(callbacks[2]).not.toHaveBeenCalled();
  });
});
