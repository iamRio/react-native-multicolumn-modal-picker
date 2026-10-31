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
  columnAccessibilityLabel,
  previousOptionAccessibilityLabel,
  nextOptionAccessibilityLabel,
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
    previousOptionAccessibilityLabel={previousOptionAccessibilityLabel}
    nextOptionAccessibilityLabel={nextOptionAccessibilityLabel}
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
      columnAccessibilityLabel={columnAccessibilityLabel}
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
