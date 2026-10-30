import React from "react";
import type { PickerColumnViewProps } from "../types";
import { PickerWheel } from "./PickerWheel";
import {
  columnNavigationControlHeight,
  PickerColumnNavigationButtons,
} from "./PickerColumnNavigationButtons";

export const PickerColumnView = ({
  column,
  columnIndex,
  selectedValue,
  itemStyle,
  itemTextColor,
  columnNavigationButtonsColor,
  pickerHeight,
  isSingleColumn,
  showColumnNavigationButtons,
  reserveColumnNavigationButtonSpace,
  onValueChange,
}: PickerColumnViewProps) => (
  <PickerColumnNavigationButtons
    column={column}
    columnIndex={columnIndex}
    selectedValue={selectedValue}
    columnNavigationButtonsColor={columnNavigationButtonsColor}
    showColumnNavigationButtons={showColumnNavigationButtons}
    reserveColumnNavigationButtonSpace={reserveColumnNavigationButtonSpace}
    onValueChange={onValueChange}
    style={{ height: pickerHeight }}
  >
    <PickerWheel
      column={column}
      columnIndex={columnIndex}
      selectedValue={selectedValue}
      itemStyle={itemStyle}
      itemTextColor={itemTextColor}
      pickerHeight={
        pickerHeight -
        (reserveColumnNavigationButtonSpace
          ? columnNavigationControlHeight * 2
          : 0)
      }
      isSingleColumn={isSingleColumn}
      onValueChange={onValueChange}
    />
  </PickerColumnNavigationButtons>
);
