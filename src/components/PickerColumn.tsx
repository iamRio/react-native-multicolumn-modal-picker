import React from "react";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import type { PickerColumnViewProps } from "../types";
import { pickerTokens } from "../constants/tokens";
import { getPickerItemKey } from "../utils/picker-keys";
import {
  columnNavigationControlHeight,
  PickerColumnNavigationButtons,
} from "./PickerColumnNavigationButtons";

export const PickerColumnView = React.memo(function PickerColumnView({
  column,
  columnIndex,
  selectedValue,
  itemStyle,
  itemTextColor,
  columnNavigationButtonsColor,
  pickerHeight,
  showColumnNavigationButtons,
  reserveColumnNavigationButtonSpace,
  onValueChange,
}: PickerColumnViewProps) {
  const items = React.useMemo(
    () =>
      column.map((item, itemIndex) => (
        <Picker.Item
          key={getPickerItemKey(item, itemIndex)}
          label={item.label}
          value={item.value}
        />
      )),
    [column],
  );

  return (
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
      <Picker
        style={[
          styles.picker,
          {
            height:
              pickerHeight -
              (reserveColumnNavigationButtonSpace
                ? columnNavigationControlHeight * 2
                : 0),
          },
        ]}
        itemStyle={[styles.itemText, { color: itemTextColor }, itemStyle]}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {items}
      </Picker>
    </PickerColumnNavigationButtons>
  );
});

const styles = StyleSheet.create({
  picker: {
    flex: 1,
  },
  itemText: {
    fontSize: pickerTokens.typography.body,
  },
});
