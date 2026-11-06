import { getPickerItemKey } from "../src/utils/picker-keys";

describe("getPickerItemKey", () => {
  it("includes the value type, value, and index", () => {
    expect(getPickerItemKey({ label: "One", value: 1 }, 0)).toBe("number:1:0");
    expect(getPickerItemKey({ label: "One", value: "1" }, 0)).toBe(
      "string:1:0",
    );
  });

  it("distinguishes items with the same value by index", () => {
    expect(getPickerItemKey({ label: "First", value: "same" }, 0)).not.toBe(
      getPickerItemKey({ label: "Second", value: "same" }, 1),
    );
  });
});
