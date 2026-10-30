import React from "react";
import type { MultiColumnModalPickerProps } from "./types";
import MultiColumnModalPickerImplementation from "./components/MultiColumnModalPicker";

export type {
  ActionButtonsPosition,
  MultiColumnModalPickerProps,
  PickerColumn,
  PickerColumnValueChangeHandler,
  PickerItem,
  PickerLocale,
  PickerPalette,
  PickerThemeMode,
  PickerThemeName,
  PickerValue,
  PickerValueChangeHandler,
  PickerValuesChangeHandler,
} from "./types";

const MultiColumnModalPicker = (props: MultiColumnModalPickerProps) => (
  <MultiColumnModalPickerImplementation {...props} />
);

export default MultiColumnModalPicker;
