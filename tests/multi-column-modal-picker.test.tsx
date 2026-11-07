import { act, fireEvent, screen } from "@testing-library/react-native";
import { Platform } from "react-native";
import { pickerElement, renderPicker } from "./test-utils";
import type { MultiColumnModalPickerProps } from "../src/types";
import type { WebMediaQueryList } from "../src/types";

const column = [
  { label: "Basic", value: "basic" },
  { label: "Pro", value: "pro" },
  { label: "Enterprise", value: "enterprise" },
];

const createProps = (
  overrides: Partial<MultiColumnModalPickerProps> = {},
): Partial<MultiColumnModalPickerProps> => ({
  columns: [column],
  selectedValues: ["basic"],
  locale: "en",
  ...overrides,
});

describe("MultiColumnModalPicker", () => {
  afterEach(() => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
    delete (globalThis as { window?: unknown }).window;
  });

  it("submits and closes from the top action button", async () => {
    const onSubmit = jest.fn();
    const onClose = jest.fn();
    await renderPicker(
      createProps({ actionButtonsPosition: "top", onSubmit, onClose }),
    );

    await fireEvent.press(screen.getAllByLabelText("Accept")[0]);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("uses the legacy accept callback and text when modern props are absent", async () => {
    const onAccept = jest.fn();
    const onClose = jest.fn();
    await renderPicker(
      createProps({
        actionButtons: "top",
        acceptButtonText: "Continue",
        onAccept,
        onClose,
      }),
    );

    await fireEvent.press(screen.getAllByLabelText("Continue")[0]);

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("prefers modern submit props when both modern and deprecated props exist", async () => {
    const onSubmit = jest.fn();
    const onAccept = jest.fn();
    await renderPicker(
      createProps({
        actionButtonsPosition: "top",
        submitButtonText: "Submit plan",
        acceptButtonText: "Accept plan",
        onSubmit,
        onAccept,
      }),
    );

    await fireEvent.press(screen.getAllByLabelText("Submit plan")[0]);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onAccept).not.toHaveBeenCalled();
  });

  it("renders bottom and detached action buttons", async () => {
    await renderPicker(createProps({ actionButtonsPosition: "bottom" }));

    expect(screen.getAllByLabelText("Accept")).toHaveLength(1);
    expect(screen.getAllByLabelText("Cancel")).toHaveLength(2);
    await fireEvent.press(screen.getAllByLabelText("Accept")[0]);
  });

  it("submits and cancels from the bottom inline action row", async () => {
    const onCancel = jest.fn();
    const onSubmit = jest.fn();
    const onClose = jest.fn();
    await renderPicker(
      createProps({
        actionButtonsPosition: "bottomInline",
        onCancel,
        onSubmit,
        onClose,
      }),
    );

    await fireEvent.press(screen.getAllByLabelText("Cancel")[1]);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getAllByLabelText("Accept")[0]);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("supports the deprecated cancel-only action position", async () => {
    await renderPicker(
      createProps({
        actionButtons: "cancel",
        showSubmitButton: false,
      }),
    );

    expect(screen.getAllByLabelText("Cancel")).toHaveLength(1);
    expect(screen.getAllByLabelText("Accept")).toHaveLength(1);
  });

  it("does not render a top action row when both actions are disabled", async () => {
    await renderPicker(
      createProps({
        actionButtonsPosition: "top",
        showSubmitButton: false,
        showCancelButton: false,
      }),
    );

    expect(screen.getAllByLabelText("Accept")).toHaveLength(1);
    expect(screen.queryByText("Cancel")).toBeNull();
  });

  it("submits from the backdrop when the submit button is not rendered", async () => {
    const onSubmit = jest.fn();
    const onClose = jest.fn();
    const onCancel = jest.fn();
    await renderPicker(createProps({ onSubmit, onCancel, onClose }));

    await fireEvent.press(screen.getAllByLabelText("Accept")[0]);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("submits from the backdrop when showSubmitButton hides the action", async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const onClose = jest.fn();
    await renderPicker(
      createProps({
        actionButtonsPosition: "bottomInline",
        showSubmitButton: false,
        onSubmit,
        onCancel,
        onClose,
      }),
    );

    await fireEvent.press(screen.getByLabelText("Accept"));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("cancels from the backdrop when the submit button is rendered", async () => {
    const onValueChange = jest.fn();
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const onClose = jest.fn();
    const props = createProps({
      actionButtonsPosition: "bottomInline",
      onValueChange,
      onSubmit,
      onCancel,
      onClose,
    });
    const result = await renderPicker(props);
    await fireEvent(screen.getByLabelText("Column 1"), "valueChange", "pro", 1);
    await result.rerender(pickerElement({ ...props, selectedValues: ["pro"] }));

    await fireEvent.press(screen.getAllByLabelText("Cancel")[0]);

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith("basic", 0);
  });

  it("cancels, restores changed controlled values, and calls close handlers", async () => {
    const onValueChange = jest.fn();
    const onValueChange1 = jest.fn();
    const onValuesChange = jest.fn();
    const onCancel = jest.fn();
    const onClose = jest.fn();
    const props = createProps({
      actionButtonsPosition: "top",
      onValueChange,
      onValueChange1,
      onValuesChange,
      onCancel,
      onClose,
    });
    const result = await renderPicker(props);
    const picker = screen.getByLabelText("Column 1");

    await fireEvent(picker, "valueChange", "pro", 1);
    await result.rerender(pickerElement({ ...props, selectedValues: ["pro"] }));

    await fireEvent.press(screen.getAllByLabelText("Cancel")[1]);

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("basic", 0);
    expect(onValueChange1).toHaveBeenCalledWith("basic");
    expect(onValuesChange).toHaveBeenCalledWith(["basic", null, null]);
  });

  it("uses null defaults for unselected columns when dispatching changes", async () => {
    const onValuesChange = jest.fn();
    await renderPicker(
      createProps({
        selectedValues: [null],
        actionButtonsPosition: "top",
        onValuesChange,
      }),
    );

    await fireEvent(screen.getByLabelText("Column 1"), "valueChange", "pro", 1);

    expect(onValuesChange).toHaveBeenCalledWith(["pro", null, null]);
  });

  it("restores initial null values when the modal receives a close request", async () => {
    const onValueChange = jest.fn();
    const onValueChange1 = jest.fn();
    const onValueChange2 = jest.fn();
    const onValueChange3 = jest.fn();
    const onCancel = jest.fn();
    const onClose = jest.fn();
    const props = createProps({
      columns: [column, column, column],
      selectedValues: [null, "basic", "basic"],
      actionButtonsPosition: "top",
      onValueChange,
      onValueChange1,
      onValueChange2,
      onValueChange3,
      onCancel,
      onClose,
    });
    const result = await renderPicker(props);
    await result.rerender(
      pickerElement({ ...props, selectedValues: ["pro", "pro", "pro"] }),
    );
    const modal = result.container.queryAll(
      ({ props }) => typeof props.onRequestClose === "function",
    )[0];
    if (!modal) throw new Error("Picker modal was not rendered.");
    await fireEvent(modal, "requestClose");

    expect(onValueChange).toHaveBeenNthCalledWith(1, null, 0);
    expect(onValueChange).toHaveBeenNthCalledWith(2, "basic", 1);
    expect(onValueChange).toHaveBeenNthCalledWith(3, "basic", 2);
    expect(onValueChange1).toHaveBeenCalledWith(null);
    expect(onValueChange2).toHaveBeenCalledWith("basic");
    expect(onValueChange3).toHaveBeenCalledWith("basic");
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("uses explicit callback values without repeating an unchanged selection", async () => {
    const onValueChange = jest.fn();
    await renderPicker(
      createProps({
        actionButtonsPosition: "top",
        onValueChange,
      }),
    );

    await fireEvent(
      screen.getByLabelText("Column 1"),
      "valueChange",
      "basic",
      0,
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("dispatches changes to modern and legacy callbacks by column", async () => {
    const onValueChange = jest.fn();
    const onValueChange1 = jest.fn();
    const onValueChange2 = jest.fn();
    const onValueChange3 = jest.fn();
    const onValuesChange = jest.fn();
    await renderPicker({
      columns: [column, column, column],
      selectedValues: ["basic", "basic", "basic"],
      locale: "en",
      actionButtonsPosition: "top",
      onValueChange,
      onValueChange1,
      onValueChange2,
      onValueChange3,
      onValuesChange,
    });

    await fireEvent(screen.getByLabelText("Column 1"), "valueChange", "pro", 1);
    await fireEvent(screen.getByLabelText("Column 2"), "valueChange", "pro", 1);
    await fireEvent(screen.getByLabelText("Column 3"), "valueChange", "pro", 1);

    expect(onValueChange.mock.calls).toEqual([
      ["pro", 0, 1],
      ["pro", 1, 1],
      ["pro", 2, 1],
    ]);
    expect(onValueChange1).toHaveBeenCalledWith("pro", 1);
    expect(onValueChange2).toHaveBeenCalledWith("pro", 1);
    expect(onValueChange3).toHaveBeenCalledWith("pro", 1);
    expect(onValuesChange).toHaveBeenNthCalledWith(1, [
      "pro",
      "basic",
      "basic",
    ]);
    expect(onValuesChange).toHaveBeenNthCalledWith(2, [
      "basic",
      "pro",
      "basic",
    ]);
    expect(onValuesChange).toHaveBeenNthCalledWith(3, [
      "basic",
      "basic",
      "pro",
    ]);
  });

  it("auto-submits an iOS single-column change when no submit action is visible", async () => {
    const onSubmit = jest.fn();
    const onClose = jest.fn();
    await renderPicker(
      createProps({ onSubmit, onClose, actionButtonsPosition: "none" }),
    );

    await fireEvent(screen.getByLabelText("Column 1"), "valueChange", "pro", 1);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("blurs search before submitting and forwards the search blur callback", async () => {
    const onSearchBlur = jest.fn();
    const onSubmit = jest.fn();
    await renderPicker(
      createProps({
        enableSearch: true,
        actionButtonsPosition: "top",
        onSearchBlur,
        onSubmit,
      }),
    );
    const input = screen.getByLabelText("Search options");

    await fireEvent(input, "focus");
    await fireEvent(input, "blur");
    await fireEvent.press(screen.getAllByLabelText("Accept")[0]);

    expect(onSearchBlur).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("blurs search before cancelling", async () => {
    const onSearchBlur = jest.fn();
    const onCancel = jest.fn();
    await renderPicker(
      createProps({
        enableSearch: true,
        actionButtonsPosition: "top",
        onSearchBlur,
        onCancel,
      }),
    );
    const input = screen.getByLabelText("Search options");
    await fireEvent(input, "focus");
    await fireEvent(input, "blur");
    await fireEvent.press(screen.getAllByLabelText("Cancel")[1]);

    expect(onSearchBlur).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("selects an exact search value and clears the query without dismissing", async () => {
    const onValueChange = jest.fn();
    await renderPicker(
      createProps({
        enableSearch: true,
        onValueChange,
      }),
    );
    const search = screen.getByLabelText("Search options");

    await fireEvent.changeText(search, "pro");
    expect(onValueChange).toHaveBeenCalledWith("pro", 0, undefined);
    expect(screen.getByDisplayValue("pro")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Clear search"));
    expect(screen.getByDisplayValue("")).toBeTruthy();
  });

  it("keeps a null selection when search text and its query are cleared", async () => {
    const onValueChange = jest.fn();
    await renderPicker(
      createProps({
        selectedValues: [null],
        enableSearch: true,
        onValueChange,
      }),
    );
    const search = screen.getByLabelText("Search options");

    await fireEvent.changeText(search, "pro");
    await fireEvent.press(screen.getByLabelText("Clear search"));
    await fireEvent.changeText(search, "pro");
    await fireEvent.changeText(search, "");

    expect(screen.getByDisplayValue("")).toBeTruthy();
    expect(onValueChange).toHaveBeenNthCalledWith(1, "pro", 0, undefined);
    expect(onValueChange).toHaveBeenNthCalledWith(2, "pro", 0, undefined);
  });

  it("keeps the last search match when a query has no match", async () => {
    const onValueChange = jest.fn();
    await renderPicker(
      createProps({
        enableSearch: true,
        onValueChange,
      }),
    );
    const search = screen.getByLabelText("Search options");

    await fireEvent.changeText(search, "pro");
    await fireEvent.changeText(search, "no match");

    expect(onValueChange).toHaveBeenLastCalledWith("pro", 0, undefined);
  });

  it("finds partial label matches, prefers an exact value, and resets on empty input", async () => {
    const onValueChange = jest.fn();
    const choices = [
      { label: "Pro Monthly", value: "monthly-pro" },
      { label: "Pro Annual", value: "annual-pro" },
      { label: "Annual", value: "pro" },
    ];
    await renderPicker(
      createProps({
        columns: [choices],
        selectedValues: ["monthly-pro"],
        enableSearch: true,
        onValueChange,
      }),
    );
    const search = screen.getByLabelText("Search options");

    await fireEvent.changeText(search, "pro");
    expect(onValueChange).toHaveBeenLastCalledWith("pro", 0, undefined);
    await fireEvent.changeText(search, "annual");
    expect(onValueChange).toHaveBeenLastCalledWith("pro", 0, undefined);
    await fireEvent.changeText(search, "");
    expect(screen.getByDisplayValue("")).toBeTruthy();
  });

  it("uses search callbacks only while a single non-empty column is active", async () => {
    const onSearchFocus = jest.fn();
    const onSearchBlur = jest.fn();
    await renderPicker({
      columns: [column, column],
      enableSearch: true,
      onSearchFocus,
      onSearchBlur,
    });

    expect(screen.queryByLabelText("Search options")).toBeNull();
    expect(onSearchFocus).not.toHaveBeenCalled();
    expect(onSearchBlur).not.toHaveBeenCalled();
  });

  it("rejects fractional and unsafe search lengths", async () => {
    await expect(
      renderPicker(createProps({ searchMaxLength: 1.5 })),
    ).rejects.toThrow(RangeError);
    await expect(
      renderPicker(
        createProps({ searchMaxLength: Number.MAX_SAFE_INTEGER + 1 }),
      ),
    ).rejects.toThrow(RangeError);
  });

  it("detects touch-capable web media queries and removes listeners on unmount", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    const mediaQueries: Array<{
      matches: boolean;
      addEventListener?: jest.Mock;
      removeEventListener?: jest.Mock;
      addListener?: jest.Mock;
      removeListener?: jest.Mock;
    }> = [];
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        matchMedia: jest.fn(() => {
          const query: WebMediaQueryList & {
            addEventListener: jest.Mock;
            removeEventListener: jest.Mock;
          } = {
            matches: false,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
          };
          mediaQueries.push(query);
          return query;
        }),
      },
    });
    const result = await renderPicker(
      createProps({ showColumnNavigationButtons: undefined }),
    );

    expect(mediaQueries).toHaveLength(4);
    mediaQueries[2].matches = true;
    const updateDeviceType = mediaQueries[2].addEventListener?.mock.calls[0][1];
    await act(async () => updateDeviceType?.());
    expect(screen.queryByLabelText("Next option in column 1")).toBeNull();

    await result.unmount();
    for (const mediaQuery of mediaQueries) {
      expect(mediaQuery.removeEventListener).toHaveBeenCalledTimes(1);
    }
  });

  it("supports older web media-query listener APIs", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    const addListener = jest.fn();
    const removeListener = jest.fn();
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        matchMedia: jest.fn(() => ({
          matches: false,
          addListener,
          removeListener,
        })),
      },
    });
    const result = await renderPicker();

    expect(addListener).toHaveBeenCalledTimes(4);
    await result.unmount();
    expect(removeListener).toHaveBeenCalledTimes(4);
  });

  it("rejects a non-positive search length", async () => {
    await expect(
      renderPicker(createProps({ searchMaxLength: 0 })),
    ).rejects.toThrow(RangeError);
  });
});
