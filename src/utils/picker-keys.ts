import type { PickerItem } from "../types";

export const getPickerItemKey = (item: PickerItem, index: number) =>
  `${typeof item.value}:${String(item.value)}:${index}`;
