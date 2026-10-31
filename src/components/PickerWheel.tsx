import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import type {
  PickerWheelProps,
  PickerItem,
  PickerItemRenderInfo,
  PickerWheelItemProps,
} from "../types";
import { pickerTokens } from "../constants/tokens";
import { getPickerItemKey } from "../utils/picker-keys";

const ITEM_HEIGHT = pickerTokens.layout.pickerWheelItemHeight;
const WHEEL_RADIUS_IN_ITEM_HEIGHTS = 2.75;
const INITIAL_RENDER_COUNT = 7;
const COMMIT_DELAY = 120;
const PROGRAMMATIC_SCROLL_DELAY = 350;
const ACCESSIBILITY_ACTIONS = [{ name: "increment" }, { name: "decrement" }];
const WHEEL_EFFECT_STEPS = [-3, -2, -1, 0, 1, 2, 3];
const OPACITY_OUTPUT_RANGE = [0.04, 0.18, 0.56, 1, 0.56, 0.18, 0.04];

const keyExtractor = getPickerItemKey;

const PickerWheelItem = React.memo(
  ({
    item,
    itemIndex,
    selected,
    itemHeight,
    scrollOffset,
    itemStyle,
    itemTextColor,
  }: PickerWheelItemProps) => {
    const animatedStyle = useMemo(() => {
      const itemOffset = itemHeight * itemIndex;
      const wheelRadius = itemHeight * WHEEL_RADIUS_IN_ITEM_HEIGHTS;
      const inputRange = WHEEL_EFFECT_STEPS.map(
        (distance) => itemOffset + itemHeight * distance,
      );
      const rotationOutputRange = WHEEL_EFFECT_STEPS.map((distance) => {
        const angle =
          ((-distance * itemHeight) / wheelRadius) * (180 / Math.PI);

        return `${angle.toFixed(1)}deg`;
      });
      const verticalCorrectionOutputRange = WHEEL_EFFECT_STEPS.map(
        (distance) => {
          const flatOffset = distance * itemHeight;
          // Map each row from the flat list onto the virtual cylinder.
          const curvedOffset = wheelRadius * Math.sin(flatOffset / wheelRadius);

          return flatOffset - curvedOffset;
        },
      );

      return {
        opacity: scrollOffset.interpolate({
          inputRange,
          outputRange: OPACITY_OUTPUT_RANGE,
          extrapolate: "clamp",
        }),
        transform: [
          { perspective: 800 },
          {
            translateY: scrollOffset.interpolate({
              inputRange,
              outputRange: verticalCorrectionOutputRange,
              extrapolate: "clamp",
            }),
          },
          {
            rotateX: scrollOffset.interpolate({
              inputRange,
              outputRange: rotationOutputRange,
              extrapolate: "clamp",
            }),
          },
        ],
      };
    }, [itemHeight, itemIndex, scrollOffset]);

    return (
      <Animated.View
        style={[styles.item, { height: itemHeight }, animatedStyle]}
      >
        <Text
          accessible={false}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.itemText,
            { color: itemTextColor },
            selected && styles.selectedItemText,
            itemStyle,
          ]}
        >
          {item.label}
        </Text>
      </Animated.View>
    );
  },
);

export const PickerWheel = React.memo(
  ({
    column,
    columnIndex,
    selectedValue,
    itemStyle,
    itemTextColor,
    columnAccessibilityLabel,
    pickerHeight,
    scrollEnabled = true,
    animateSelectedValueChange = false,
    onValueChange,
  }: PickerWheelProps) => {
    const { fontScale } = useWindowDimensions();
    const itemHeight = Math.max(
      ITEM_HEIGHT,
      pickerTokens.layout.accessiblePickerMinItemHeight * fontScale,
    );
    const edgePadding = Math.max(0, (pickerHeight - itemHeight) / 2);
    const selectedIndex = useMemo(() => {
      const index = column.findIndex((item) =>
        Object.is(item.value, selectedValue),
      );
      return index < 0 ? 0 : index;
    }, [column, selectedValue]);
    const listRef = useRef<FlatList<PickerItem>>(null);
    const scrollOffset = useRef(
      new Animated.Value(selectedIndex * itemHeight),
    ).current;
    const isScrolling = useRef(false);
    const hasMomentum = useRef(false);
    const shouldNotifyOnScrollEnd = useRef(true);
    const isWebSnapping = useRef(false);
    const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const webSnapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const getItemLayout = useCallback(
      (_: ArrayLike<PickerItem> | null | undefined, index: number) => ({
        length: itemHeight,
        offset: itemHeight * index,
        index,
      }),
      [itemHeight],
    );
    const clearCommitTimer = useCallback(() => {
      if (commitTimer.current !== null) {
        clearTimeout(commitTimer.current);
        commitTimer.current = null;
      }
    }, []);

    const clearWebSnapTimer = useCallback(() => {
      if (webSnapTimer.current !== null) {
        clearTimeout(webSnapTimer.current);
        webSnapTimer.current = null;
      }
    }, []);

    const finishScroll = useCallback(
      (offset: number) => {
        clearCommitTimer();
        isScrolling.current = false;
        hasMomentum.current = false;

        const index = Math.min(
          column.length - 1,
          Math.max(0, Math.round(offset / itemHeight)),
        );
        const snappedOffset = index * itemHeight;
        const item = column[index];

        if (Platform.OS === "web" && Math.abs(offset - snappedOffset) > 1) {
          clearWebSnapTimer();
          isWebSnapping.current = true;
          isScrolling.current = true;
          shouldNotifyOnScrollEnd.current = false;
          listRef.current?.scrollToOffset({
            offset: snappedOffset,
            animated: true,
          });
          webSnapTimer.current = setTimeout(() => {
            isWebSnapping.current = false;
            isScrolling.current = false;
            hasMomentum.current = false;
            shouldNotifyOnScrollEnd.current = true;
            webSnapTimer.current = null;
          }, PROGRAMMATIC_SCROLL_DELAY);
        } else {
          shouldNotifyOnScrollEnd.current = true;
        }

        if (item) {
          onValueChange?.(item.value, index);
        }
      },
      [clearCommitTimer, clearWebSnapTimer, column, itemHeight, onValueChange],
    );

    const handleWebScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (
          Platform.OS !== "web" ||
          isWebSnapping.current ||
          !shouldNotifyOnScrollEnd.current
        ) {
          return;
        }

        clearCommitTimer();
        const offset = event.nativeEvent.contentOffset.y;
        commitTimer.current = setTimeout(() => {
          if (!hasMomentum.current && shouldNotifyOnScrollEnd.current) {
            finishScroll(offset);
          }
        }, COMMIT_DELAY);
      },
      [clearCommitTimer, finishScroll],
    );

    const handleScroll = useMemo(
      () =>
        Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
          {
            useNativeDriver: Platform.OS !== "web",
            listener: Platform.OS === "web" ? handleWebScroll : undefined,
          },
        ),
      [handleWebScroll, scrollOffset],
    );

    const scrollToIndex = useCallback(
      (index: number, animated: boolean, notifyOnFinish = animated) => {
        if (index < 0 || index >= column.length) {
          return;
        }

        clearCommitTimer();
        shouldNotifyOnScrollEnd.current = notifyOnFinish;
        isScrolling.current = true;
        hasMomentum.current = false;
        if (!animated) {
          scrollOffset.setValue(index * itemHeight);
        }
        listRef.current?.scrollToOffset({
          offset: index * itemHeight,
          animated,
        });

        if (animated) {
          commitTimer.current = setTimeout(() => {
            if (notifyOnFinish) {
              finishScroll(index * itemHeight);
            } else {
              isScrolling.current = false;
              hasMomentum.current = false;
              shouldNotifyOnScrollEnd.current = true;
              commitTimer.current = null;
            }
          }, PROGRAMMATIC_SCROLL_DELAY);
        } else {
          isScrolling.current = false;
        }
      },
      [clearCommitTimer, column.length, finishScroll, itemHeight, scrollOffset],
    );

    const previousSelectedIndex = useRef(selectedIndex);
    const previousItemHeight = useRef(itemHeight);
    useEffect(() => {
      const selectedIndexChanged =
        previousSelectedIndex.current !== selectedIndex;
      const itemHeightChanged = previousItemHeight.current !== itemHeight;
      previousSelectedIndex.current = selectedIndex;
      previousItemHeight.current = itemHeight;

      if (
        (!selectedIndexChanged && !itemHeightChanged) ||
        isWebSnapping.current ||
        (isScrolling.current && !animateSelectedValueChange)
      ) {
        return;
      }

      scrollToIndex(selectedIndex, animateSelectedValueChange, false);
    }, [animateSelectedValueChange, itemHeight, scrollToIndex, selectedIndex]);

    useEffect(
      () => () => {
        clearCommitTimer();
        clearWebSnapTimer();
      },
      [clearCommitTimer, clearWebSnapTimer],
    );

    const handleScrollEndDrag = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        clearCommitTimer();
        const offset = event.nativeEvent.contentOffset.y;
        commitTimer.current = setTimeout(() => {
          if (!hasMomentum.current) {
            finishScroll(offset);
          }
        }, COMMIT_DELAY);
      },
      [clearCommitTimer, finishScroll],
    );

    const handleMomentumScrollBegin = useCallback(() => {
      hasMomentum.current = true;
      clearCommitTimer();
    }, [clearCommitTimer]);

    const handleScrollBeginDrag = useCallback(() => {
      clearCommitTimer();
      clearWebSnapTimer();
      isWebSnapping.current = false;
      isScrolling.current = true;
      hasMomentum.current = false;
      shouldNotifyOnScrollEnd.current = true;
    }, [clearCommitTimer, clearWebSnapTimer]);

    const handleMomentumScrollEnd = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (Platform.OS === "web" && isWebSnapping.current) {
          return;
        }

        if (shouldNotifyOnScrollEnd.current) {
          finishScroll(event.nativeEvent.contentOffset.y);
        } else {
          clearCommitTimer();
          isScrolling.current = false;
          hasMomentum.current = false;
          shouldNotifyOnScrollEnd.current = true;
        }
      },
      [clearCommitTimer, finishScroll],
    );

    const handleAccessibilityAction = useCallback(
      (event: NativeSyntheticEvent<{ actionName: string }>) => {
        if (event.nativeEvent.actionName === "increment") {
          scrollToIndex(selectedIndex + 1, true);
        } else if (event.nativeEvent.actionName === "decrement") {
          scrollToIndex(selectedIndex - 1, true);
        }
      },
      [scrollToIndex, selectedIndex],
    );

    const renderItem = useCallback(
      ({ item, index }: PickerItemRenderInfo) => (
        <PickerWheelItem
          item={item}
          itemIndex={index}
          selected={index === selectedIndex}
          itemHeight={itemHeight}
          scrollOffset={scrollOffset}
          itemStyle={itemStyle}
          itemTextColor={itemTextColor}
        />
      ),
      [itemHeight, itemStyle, itemTextColor, selectedIndex],
    );

    const selectedItem = column[selectedIndex];

    return (
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={columnAccessibilityLabel.replace(
          "{column}",
          String(columnIndex + 1),
        )}
        accessibilityValue={{
          text: selectedItem
            ? `${selectedItem.label}, ${selectedIndex + 1} of ${column.length}`
            : undefined,
        }}
        accessibilityActions={ACCESSIBILITY_ACTIONS}
        onAccessibilityAction={handleAccessibilityAction}
        style={[styles.column, { height: pickerHeight }]}
      >
        <Animated.FlatList
          ref={listRef}
          data={column}
          extraData={selectedIndex}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialScrollIndex={selectedIndex}
          initialNumToRender={INITIAL_RENDER_COUNT}
          maxToRenderPerBatch={INITIAL_RENDER_COUNT}
          windowSize={5}
          // Keep the 3D-transformed wheel rows attached to avoid clipping them during rotation.
          removeClippedSubviews={false}
          snapToInterval={itemHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          scrollEnabled={scrollEnabled}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.listContent,
            { paddingVertical: edgePadding },
          ]}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollBegin={handleMomentumScrollBegin}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        />
      </View>
    );
  },
);

const styles = {
  column: {
    flex: 1,
    overflow: "hidden" as const,
  },
  listContent: {},
  item: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: pickerTokens.spacing.xs,
  },
  itemText: {
    width: "100%" as const,
    textAlign: "center" as const,
    fontSize: pickerTokens.typography.body,
  },
  selectedItemText: {
    fontWeight: pickerTokens.typography.fontWeight.medium,
  },
};
