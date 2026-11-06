import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Platform } from "react-native";
import type {
  PickerColumnViewProps,
  WebDocument,
  WebKeyboardEvent,
} from "../src/types";
import { PickerColumnView as IOSPickerColumn } from "../src/components/PickerColumn";
import { PickerColumnView as AndroidPickerColumn } from "../src/components/PickerColumn.android";
import { PickerColumnView as WebPickerColumn } from "../src/components/PickerColumn.web";

const column = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
  { label: "Gamma", value: "gamma" },
];

const createProps = (
  overrides: Partial<PickerColumnViewProps> = {},
): PickerColumnViewProps => ({
  column,
  columnIndex: 0,
  selectedValue: "beta",
  itemTextColor: "black",
  columnNavigationButtonsColor: "black",
  columnAccessibilityLabel: "Column {column}",
  previousOptionAccessibilityLabel: "Previous {column}",
  nextOptionAccessibilityLabel: "Next {column}",
  pickerHeight: 216,
  isSingleColumn: true,
  showColumnNavigationButtons: false,
  reserveColumnNavigationButtonSpace: true,
  ...overrides,
});

const setPlatform = (OS: string) => {
  Object.defineProperty(Platform, "OS", { configurable: true, value: OS });
};

describe("platform picker columns", () => {
  afterEach(() => {
    setPlatform("ios");
    delete (globalThis as { document?: WebDocument }).document;
  });

  it("renders the native picker and forwards a selected value", async () => {
    const onValueChange = jest.fn();
    await render(<IOSPickerColumn {...createProps({ onValueChange })} />);

    await fireEvent(
      screen.getByLabelText("Column 1"),
      "valueChange",
      "gamma",
      2,
    );
    expect(onValueChange).toHaveBeenCalledWith("gamma", 2);
    expect(onValueChange).toHaveBeenCalledWith("gamma", 2);
  });

  it("renders the Android wheel and supports adjacent option controls", async () => {
    const onValueChange = jest.fn();
    await render(
      <AndroidPickerColumn
        {...createProps({
          showColumnNavigationButtons: true,
          reserveColumnNavigationButtonSpace: false,
          onValueChange,
        })}
      />,
    );

    await fireEvent.press(screen.getByLabelText("Next 1"));
    expect(onValueChange).toHaveBeenCalledWith("gamma", 2);
    expect(
      screen.getByLabelText("Column 1").props.accessibilityValue.text,
    ).toBe("Beta, 2 of 3");
  });

  it("registers web arrow navigation and unregisters the listener on unmount", async () => {
    setPlatform("web");
    let keyDownListener: ((event: WebKeyboardEvent) => void) | undefined;
    const addEventListener = jest.fn(
      (_type: "keydown", listener: (event: WebKeyboardEvent) => void) => {
        keyDownListener = listener;
      },
    );
    const removeEventListener = jest.fn();
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        addEventListener,
        removeEventListener,
      } satisfies WebDocument,
    });
    const onValueChange = jest.fn();
    const result = await render(
      <WebPickerColumn {...createProps({ onValueChange })} />,
    );
    const event: WebKeyboardEvent = {
      key: "ArrowDown",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      defaultPrevented: false,
      target: null,
      preventDefault: jest.fn(),
    };

    await act(async () => keyDownListener?.(event));

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("gamma", 2);
    await result.unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "keydown",
      keyDownListener,
    );
  });

  it("ignores modified keys and keyboard events from editable targets", async () => {
    setPlatform("web");
    let keyDownListener: ((event: WebKeyboardEvent) => void) | undefined;
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        addEventListener: (
          _type: "keydown",
          listener: (event: WebKeyboardEvent) => void,
        ) => {
          keyDownListener = listener;
        },
        removeEventListener: jest.fn(),
      } satisfies WebDocument,
    });
    const onValueChange = jest.fn();
    await render(<WebPickerColumn {...createProps({ onValueChange })} />);
    const baseEvent: WebKeyboardEvent = {
      key: "ArrowDown",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      defaultPrevented: false,
      target: null,
      preventDefault: jest.fn(),
    };

    keyDownListener?.({ ...baseEvent, ctrlKey: true });
    keyDownListener?.({
      ...baseEvent,
      target: { tagName: "DIV", isContentEditable: true },
    });
    keyDownListener?.({
      ...baseEvent,
      target: { tagName: "INPUT" },
    });
    keyDownListener?.({
      ...baseEvent,
      target: {
        tagName: "SPAN",
        parentElement: { tagName: "INPUT", parentElement: null },
      },
    });
    keyDownListener?.({ ...baseEvent, key: "Enter" });
    keyDownListener?.({ ...baseEvent, defaultPrevented: true });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("traverses non-editable web ancestors before handling arrow keys", async () => {
    setPlatform("web");
    let keyDownListener: ((event: WebKeyboardEvent) => void) | undefined;
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        addEventListener: (
          _type: "keydown",
          listener: (event: WebKeyboardEvent) => void,
        ) => {
          keyDownListener = listener;
        },
        removeEventListener: jest.fn(),
      } satisfies WebDocument,
    });
    const onValueChange = jest.fn();
    await render(
      <WebPickerColumn
        {...createProps({
          onValueChange,
          reserveColumnNavigationButtonSpace: false,
        })}
      />,
    );
    const event: WebKeyboardEvent = {
      key: "ArrowDown",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      defaultPrevented: false,
      target: {
        tagName: "SPAN",
        parentElement: { tagName: "DIV", parentElement: null },
      },
      preventDefault: jest.fn(),
    };

    await act(async () => keyDownListener?.(event));

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("gamma", 2);
  });

  it("falls back to the first web option and works without a document", async () => {
    setPlatform("web");
    await render(
      <WebPickerColumn
        {...createProps({
          selectedValue: "missing",
          reserveColumnNavigationButtonSpace: false,
        })}
      />,
    );

    expect(
      screen.getByLabelText("Column 1").props.accessibilityValue.text,
    ).toBe("Alpha, 1 of 3");
  });

  it("navigates upward on the web and ignores movement beyond either edge", async () => {
    setPlatform("web");
    let keyDownListener: ((event: WebKeyboardEvent) => void) | undefined;
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        addEventListener: (
          _type: "keydown",
          listener: (event: WebKeyboardEvent) => void,
        ) => {
          keyDownListener = listener;
        },
        removeEventListener: jest.fn(),
      } satisfies WebDocument,
    });
    const onValueChange = jest.fn();
    await render(
      <WebPickerColumn
        {...createProps({ selectedValue: "beta", onValueChange })}
      />,
    );
    const event: WebKeyboardEvent = {
      key: "ArrowUp",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      defaultPrevented: false,
      target: null,
      preventDefault: jest.fn(),
    };

    await act(async () => keyDownListener?.(event));

    expect(onValueChange).toHaveBeenCalledWith("alpha", 0);

    const atTop = { ...event, key: "ArrowUp" };
    await act(async () => keyDownListener?.(atTop));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("does not register web keyboard handling outside single-column mode", async () => {
    setPlatform("web");
    const addEventListener = jest.fn();
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        addEventListener,
        removeEventListener: jest.fn(),
      } satisfies WebDocument,
    });

    await render(
      <WebPickerColumn {...createProps({ isSingleColumn: false })} />,
    );

    expect(addEventListener).not.toHaveBeenCalled();
  });

  it("does not navigate an empty Android column", async () => {
    const onValueChange = jest.fn();
    await render(
      <AndroidPickerColumn
        {...createProps({
          column: [],
          selectedValue: null,
          showColumnNavigationButtons: true,
          onValueChange,
        })}
      />,
    );

    await fireEvent.press(screen.getByLabelText("Next 1"));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
