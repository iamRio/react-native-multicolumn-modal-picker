import {
  comparePickerItems,
  matchesPickerItem,
  normalizeSearchText,
} from "../src/utils/search";
import type { PickerItem } from "../src/types";

describe("normalizeSearchText", () => {
  it("removes accents and ignores case", () => {
    expect(normalizeSearchText("Crème BRÛLÉE")).toBe("creme brulee");
  });
});

describe("matchesPickerItem", () => {
  const item: PickerItem = { label: "Crème brûlée", value: 42 };

  it("matches a label without regard to accents or case", () => {
    expect(matchesPickerItem(item, "CREME")).toBe(true);
  });

  it("matches a stringified numeric value", () => {
    expect(matchesPickerItem(item, "42")).toBe(true);
  });

  it("returns false when neither the label nor value matches", () => {
    expect(matchesPickerItem(item, "coffee")).toBe(false);
  });
});

describe("comparePickerItems", () => {
  it("orders items by the position of the query in their labels", () => {
    const items: PickerItem[] = [
      { label: "Pineapple", value: "pineapple" },
      { label: "Apple", value: "apple" },
      { label: "Grape", value: "grape" },
    ];

    expect(
      [...items].sort((first, second) =>
        comparePickerItems(first, second, "ap"),
      ),
    ).toEqual([items[1], items[2], items[0]]);
  });

  it("compares label positions without regard to accents or case", () => {
    expect(
      comparePickerItems(
        { label: "À la carte", value: "a" },
        { label: "Table", value: "b" },
        "A",
      ),
    ).toBeLessThan(0);
  });
});
