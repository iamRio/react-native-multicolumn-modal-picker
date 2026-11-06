import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Platform, TextInput } from "react-native";
import type { ComponentRef } from "react";
import type { SearchBarProps } from "../src/types";
import { SearchBar } from "../src/components/SearchBar";

const createProps = (
  overrides: Partial<SearchBarProps> = {},
): SearchBarProps => ({
  backgroundColor: "white",
  clearButtonColor: "gray",
  clearTextColor: "white",
  inputColor: "black",
  placeholder: "Search",
  accessibilityLabel: "Search options",
  clearButtonAccessibilityLabel: "Clear search",
  placeholderTextColor: "gray",
  searchValue: "",
  searchBarBorderRadius: 10,
  searchClearButtonBorderRadius: 10,
  searchMaxLength: 30,
  inputRef: createRef<ComponentRef<typeof TextInput>>(),
  onChangeText: jest.fn(),
  onClear: jest.fn(),
  onBlur: jest.fn(),
  ...overrides,
});

describe("SearchBar", () => {
  afterEach(() => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
  });

  it("renders a labeled input with search configuration", async () => {
    const props = createProps();
    await render(<SearchBar {...props} />);

    const input = screen.getByLabelText("Search options");
    expect(input.props.placeholder).toBe("Search");
    expect(input.props.maxLength).toBe(30);
    expect(screen.queryByText("X")).toBeNull();
  });

  it("forwards text, focus, and blur interactions", async () => {
    const props = createProps({ onFocus: jest.fn() });
    await render(<SearchBar {...props} />);
    const input = screen.getByLabelText("Search options");

    await fireEvent.changeText(input, "coffee");
    await fireEvent(input, "focus");
    await fireEvent(input, "blur");

    expect(props.onChangeText).toHaveBeenCalledWith("coffee");
    expect(props.onFocus).toHaveBeenCalledTimes(1);
    expect(props.onBlur).toHaveBeenCalledTimes(1);
  });

  it("renders a clear button only for a non-empty query", async () => {
    const props = createProps({ searchValue: "coffee", searchMaxLength: null });
    await render(<SearchBar {...props} />);

    expect(screen.getByLabelText("Clear search")).toBeTruthy();
    expect(screen.getByLabelText("Search options").props.maxLength).toBe(
      undefined,
    );
    await fireEvent.press(screen.getByLabelText("Clear search"));
    expect(props.onClear).toHaveBeenCalledTimes(1);
  });

  it("prevents web clear-button pointer interaction from blurring the input", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    await render(<SearchBar {...createProps({ searchValue: "coffee" })} />);
    const preventDefault = jest.fn();
    const clearButtonWrapper = screen.getByText("X").parent;

    await fireEvent(clearButtonWrapper, "pointerDown", { preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
  });
});
