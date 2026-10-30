import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import type { PickerColumnViewProps } from "../types";
import { pickerTokens } from "../constants/tokens";

const CONTROL_HEIGHT = 48;
const HOLD_REPEAT_INTERVAL = 180;
const HOLD_REPEAT_DELAY = 500;

type PickerColumnNavigationButtonsProps = Pick<
  PickerColumnViewProps,
  | "column"
  | "columnIndex"
  | "selectedValue"
  | "columnNavigationButtonsColor"
  | "showColumnNavigationButtons"
  | "reserveColumnNavigationButtonSpace"
  | "onValueChange"
> & {
  children: React.ReactNode;
  nativeID?: string;
  style?: StyleProp<ViewStyle>;
  tabIndex?: -1 | 0;
};

export const PickerColumnNavigationButtons = ({
  column,
  columnIndex,
  selectedValue,
  columnNavigationButtonsColor,
  showColumnNavigationButtons,
  reserveColumnNavigationButtonSpace,
  onValueChange,
  children,
  nativeID,
  style,
  tabIndex,
}: PickerColumnNavigationButtonsProps) => {
  const selectedIndex = React.useMemo(() => {
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
      const item = column[nextIndex];
      if (!item) return false;

      selectedIndexRef.current = nextIndex;
      onValueChange?.(item.value, nextIndex);
      return true;
    },
    [column, onValueChange],
  );
  const previousNavigation = useNavigationPress(() => navigateBy(-1));
  const nextNavigation = useNavigationPress(() => navigateBy(1));

  return (
    <View
      nativeID={nativeID}
      style={[styles.column, style]}
      tabIndex={tabIndex}
    >
      {showColumnNavigationButtons && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Previous option in column ${columnIndex + 1}`}
          disabled={selectedIndex === 0}
          delayLongPress={HOLD_REPEAT_DELAY}
          onPressIn={previousNavigation.onPressIn}
          onPress={previousNavigation.onPress}
          onLongPress={previousNavigation.onLongPress}
          onPressOut={previousNavigation.onPressOut}
          style={styles.control}
        >
          <Text
            style={[
              styles.controlText,
              { color: columnNavigationButtonsColor },
            ]}
          >
            ▲
          </Text>
        </Pressable>
      )}
      {!showColumnNavigationButtons && reserveColumnNavigationButtonSpace && (
        <View style={styles.control} />
      )}
      {children}
      {showColumnNavigationButtons && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Next option in column ${columnIndex + 1}`}
          disabled={selectedIndex === column.length - 1}
          delayLongPress={HOLD_REPEAT_DELAY}
          onPressIn={nextNavigation.onPressIn}
          onPress={nextNavigation.onPress}
          onLongPress={nextNavigation.onLongPress}
          onPressOut={nextNavigation.onPressOut}
          style={styles.control}
        >
          <Text
            style={[
              styles.controlText,
              { color: columnNavigationButtonsColor },
            ]}
          >
            ▼
          </Text>
        </Pressable>
      )}
      {!showColumnNavigationButtons && reserveColumnNavigationButtonSpace && (
        <View style={styles.control} />
      )}
    </View>
  );
};

function useNavigationPress(onNavigate: () => boolean) {
  const onNavigateRef = React.useRef(onNavigate);
  const repeatTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const navigatedOnPressIn = React.useRef(false);
  const pressActive = React.useRef(false);
  onNavigateRef.current = onNavigate;

  const stopRepeating = useCallback(() => {
    if (repeatTimer.current !== null) {
      clearInterval(repeatTimer.current);
      repeatTimer.current = null;
    }
  }, []);

  const onPressIn = useCallback(() => {
    pressActive.current = true;
    navigatedOnPressIn.current = onNavigateRef.current();
  }, []);

  const onPress = useCallback(() => {
    if (!navigatedOnPressIn.current) onNavigateRef.current();
    navigatedOnPressIn.current = false;
  }, []);

  const onLongPress = useCallback(() => {
    if (!pressActive.current) return;

    stopRepeating();
    repeatTimer.current = setInterval(() => {
      if (!pressActive.current || !onNavigateRef.current()) stopRepeating();
    }, HOLD_REPEAT_INTERVAL);
  }, [stopRepeating]);

  const onPressOut = useCallback(() => {
    pressActive.current = false;
    stopRepeating();
  }, [stopRepeating]);

  React.useEffect(
    () => () => {
      pressActive.current = false;
      stopRepeating();
    },
    [stopRepeating],
  );

  return { onPressIn, onPress, onLongPress, onPressOut };
}

export const columnNavigationControlHeight = CONTROL_HEIGHT;

const styles = {
  column: {
    flex: 1,
    alignItems: "stretch" as const,
  },
  control: {
    height: CONTROL_HEIGHT,
    flexShrink: 0,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  controlText: {
    fontSize: pickerTokens.typography.body,
    fontWeight: pickerTokens.typography.fontWeight.medium,
    lineHeight: pickerTokens.typography.body * 1.5,
  },
};
