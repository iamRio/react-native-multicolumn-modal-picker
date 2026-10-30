import React, { useCallback, useMemo } from "react";
import type {
  PickerColumnViewProps,
  WebGlobal,
  WebKeyboardEvent,
} from "../types";
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
}: PickerColumnViewProps) => {
  const selectedIndex = useMemo(() => {
    const index = column.findIndex((item) =>
      Object.is(item.value, selectedValue),
    );
    return index < 0 ? 0 : index;
  }, [column, selectedValue]);
  const selectedIndexRef = React.useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;

  const navigateBy = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = selectedIndexRef.current + direction;
      if (nextIndex < 0 || nextIndex >= column.length) return;

      selectedIndexRef.current = nextIndex;
      const item = column[nextIndex];
      if (item) onValueChange?.(item.value, nextIndex);
    },
    [column, onValueChange],
  );

  React.useEffect(() => {
    if (!isSingleColumn) return;

    const webDocument = (globalThis as WebGlobal).document;
    if (!webDocument) return;

    const handleKeyDown = (event: WebKeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      let target = event.target;
      while (target) {
        const tagName = target.tagName?.toLowerCase();
        if (
          target.isContentEditable ||
          tagName === "input" ||
          tagName === "textarea" ||
          tagName === "select"
        ) {
          return;
        }
        target = target.parentElement ?? null;
      }

      const direction =
        event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : null;
      if (direction === null) return;

      event.preventDefault();
      navigateBy(direction);
    };

    webDocument.addEventListener("keydown", handleKeyDown);
    return () => webDocument.removeEventListener("keydown", handleKeyDown);
  }, [isSingleColumn, navigateBy]);

  return (
    <PickerColumnNavigationButtons
      column={column}
      columnIndex={columnIndex}
      selectedValue={selectedValue}
      columnNavigationButtonsColor={columnNavigationButtonsColor}
      showColumnNavigationButtons={showColumnNavigationButtons}
      reserveColumnNavigationButtonSpace={reserveColumnNavigationButtonSpace}
      onValueChange={onValueChange}
      tabIndex={isSingleColumn ? 0 : undefined}
      nativeID={`picker-column-${columnIndex}`}
      style={[styles.column, { height: pickerHeight }]}
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
        animateSelectedValueChange
        onValueChange={onValueChange}
      />
    </PickerColumnNavigationButtons>
  );
};

const styles = {
  column: {
    flex: 1,
    alignItems: "stretch" as const,
  },
};
