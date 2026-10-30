import React from "react";
import type { PickerColumnsProps } from "../types";
import { PickerColumnView } from "./PickerColumn";

export const PickerColumns = React.memo(
  ({
    columns,
    selectedValues,
    itemStyle,
    itemTextColor,
    columnNavigationButtonsColor,
    pickerHeight,
    isSingleColumn,
    showColumnNavigationButtons,
    reserveColumnNavigationButtonSpace,
    onValueChanges,
  }: PickerColumnsProps) => {
    return (
      <>
        {columns.map((column, columnIndex) => {
          if (!column || column.length === 0) {
            return null;
          }

          return (
            <PickerColumnView
              key={`picker-wrapper-${columnIndex}`}
              column={column}
              columnIndex={columnIndex}
              selectedValue={selectedValues[columnIndex]}
              itemStyle={itemStyle}
              itemTextColor={itemTextColor}
              columnNavigationButtonsColor={columnNavigationButtonsColor}
              pickerHeight={pickerHeight}
              isSingleColumn={isSingleColumn}
              showColumnNavigationButtons={
                showColumnNavigationButtons[columnIndex]
              }
              reserveColumnNavigationButtonSpace={
                reserveColumnNavigationButtonSpace
              }
              onValueChange={onValueChanges[columnIndex]}
            />
          );
        })}
      </>
    );
  },
);
