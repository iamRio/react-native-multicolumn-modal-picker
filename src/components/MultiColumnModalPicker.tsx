import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Modal,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {
  MultiColumnModalPickerProps,
  PickerColumn,
  PickerValue,
  WebGlobal,
} from "../types";
import { PickerColumns } from "./PickerColumns";
import { SearchBar } from "./SearchBar";
import { normalizeSearchText } from "../utils/search";
import { styles } from "../styles";
import { resolvePalette } from "../constants/colors";
import { resolveLocale } from "../i18n/locale";
import { translations } from "../i18n/translations";
import { pickerTokens } from "../constants/tokens";
import { columnNavigationControlHeight } from "./PickerColumnNavigationButtons";

const emptyColumn: PickerColumn = [];

const validateSearchMaxLength = (value: number | null): number | null => {
  if (value !== null && (!Number.isSafeInteger(value) || value <= 0)) {
    throw new RangeError("searchMaxLength must be a positive integer or null.");
  }

  return value;
};

const MultiColumnModalPickerContent = ({
  actionButtons,
  bgColor,
  cancelButtonBgColor,
  hPadding,
  onValuesChange: legacyOnValuesChange,
  onValueChange1: newOnValueChange1,
  onValueChange2: newOnValueChange2,
  onValueChange3: newOnValueChange3,
  searchBar,
  actionButtonsBorderColor,
  searchElementsColor,
  selectionHighlightColor,
  selectionHighlightBorderRadius = pickerTokens.radius.default,
  acceptButtonText: legacyAcceptButtonText,
  acceptButtonTextStyle: legacyAcceptButtonTextStyle,
  submitButtonText,
  submitButtonTextStyle,
  submitButtonContainerStyle,
  actionButtonsPosition,
  showSubmitButton,
  showCancelButton = true,
  cancelButtonText,
  cancelButtonContainerStyle,
  cancelButtonTextStyle,
  column1: legacyColumn1,
  column2: legacyColumn2,
  column3: legacyColumn3,
  columns: newColumns,
  showColumnNavigationButtons,
  horizontalPadding,
  itemStyle,
  pickerItemTextStyle: legacyPickerItemTextStyle,
  locale,
  onAccept: legacyOnAccept,
  onSubmit,
  onCancel,
  onClose,
  onValueChange: newOnValueChange,
  rightInfo,
  rightInfoTextStyle,
  enableSearch = false,
  searchMaxLength = 30,
  onSearchFocus,
  onSearchBlur,
  modalBorderRadius = pickerTokens.radius.default,
  searchBarBorderRadius = pickerTokens.radius.default,
  searchClearButtonBorderRadius = pickerTokens.radius.default,
  actionButtonsBorderRadius = pickerTokens.radius.default,
  searchBoxStyle,
  searchPlaceholder,
  searchTextStyle,
  selectedValue1: legacySelectedValue1,
  selectedValue2: legacySelectedValue2,
  selectedValue3: legacySelectedValue3,
  selectedValues: newSelectedValues,
  title,
  titleStyle,
  theme,
  customColorScheme,
  visible,
}: MultiColumnModalPickerProps) => {
  const resolvedSearchMaxLength = validateSearchMaxLength(searchMaxLength);
  const searchRef = useRef<ComponentRef<typeof TextInput>>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const pickerTranslateY = useRef(new Animated.Value(0)).current;
  const modalAnimationId = useRef(0);
  const colorScheme = useColorScheme();
  const [isTouchOrHybridDevice, setIsTouchOrHybridDevice] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const webWindow = (globalThis as WebGlobal).window;
    if (!webWindow?.matchMedia) return;

    const pointerCoarse = webWindow.matchMedia("(pointer: coarse)");
    const hoverUnavailable = webWindow.matchMedia("(hover: none)");
    const anyPointerCoarse = webWindow.matchMedia("(any-pointer: coarse)");
    const anyHoverUnavailable = webWindow.matchMedia("(any-hover: none)");
    const mediaQueries = [
      pointerCoarse,
      hoverUnavailable,
      anyPointerCoarse,
      anyHoverUnavailable,
    ];
    const updateDeviceType = () => {
      setIsTouchOrHybridDevice(
        pointerCoarse.matches ||
          hoverUnavailable.matches ||
          anyPointerCoarse.matches ||
          anyHoverUnavailable.matches,
      );
    };

    mediaQueries.forEach((mediaQuery) => {
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", updateDeviceType);
      } else {
        mediaQuery.addListener?.(updateDeviceType);
      }
    });
    updateDeviceType();

    return () => {
      mediaQueries.forEach((mediaQuery) => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", updateDeviceType);
        } else {
          mediaQuery.removeListener?.(updateDeviceType);
        }
      });
    };
  }, []);
  const insets = useSafeAreaInsets();
  const {
    height: windowHeight,
    width: windowWidth,
    fontScale,
  } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const isWideScreen =
    isLandscape || Math.min(windowWidth, windowHeight) >= 600;
  const actionButtonHeight = isLandscape
    ? Math.max(
        pickerTokens.layout.landscapeActionButtonMinHeight,
        Math.min(
          pickerTokens.layout.actionButtonMinHeight,
          windowHeight * 0.14,
        ),
      )
    : pickerTokens.layout.actionButtonMinHeight;
  const titleVerticalPadding = isLandscape
    ? pickerTokens.layout.landscapeTitleVerticalPadding
    : pickerTokens.layout.titleVerticalPadding;
  const searchTopMargin = isLandscape
    ? pickerTokens.layout.landscapeSearchTopMargin
    : pickerTokens.spacing.xl;
  const cancelButtonContainerMarginTop = isLandscape
    ? pickerTokens.layout.landscapeCancelButtonContainerMarginTop
    : pickerTokens.layout.cancelButtonContainerMarginTop;
  const windowHeightRef = useRef(windowHeight);
  windowHeightRef.current = windowHeight;

  const legacyColorOverrides = useMemo(
    () => ({
      modalBackground: bgColor,
      border: actionButtonsBorderColor,
      searchElements: searchElementsColor,
      selectionHighlight: selectionHighlightColor,
    }),
    [
      bgColor,
      actionButtonsBorderColor,
      searchElementsColor,
      selectionHighlightColor,
    ],
  );

  const colors = resolvePalette({
    theme,
    customColorScheme,
    colorScheme,
    legacyColorOverrides,
  });

  const resolvedLocale = resolveLocale(locale);
  const localizedTexts = translations[resolvedLocale];
  const resolvedSubmitButtonText =
    submitButtonText ?? legacyAcceptButtonText ?? localizedTexts.accept;
  const resolvedCancelButtonText = cancelButtonText ?? localizedTexts.cancel;
  const resolvedSearchPlaceholder =
    searchPlaceholder ?? localizedTexts.searchPlaceholder;

  const column1 = newColumns?.[0] ?? legacyColumn1 ?? emptyColumn;
  const column2 = newColumns?.[1] ?? legacyColumn2;
  const column3 = newColumns?.[2] ?? legacyColumn3;
  const navigationButtonsByColumn = useMemo<[boolean, boolean, boolean]>(() => {
    const resolveVisibility = (columnIndex: number) => {
      if (typeof showColumnNavigationButtons === "boolean") {
        return showColumnNavigationButtons;
      }

      return (
        showColumnNavigationButtons?.[columnIndex] ??
        (Platform.OS === "web" && !isTouchOrHybridDevice)
      );
    };

    return [resolveVisibility(0), resolveVisibility(1), resolveVisibility(2)];
  }, [isTouchOrHybridDevice, showColumnNavigationButtons]);

  const singleActiveColumn = useMemo<[number, PickerColumn] | undefined>(() => {
    const candidates: Array<[number, PickerColumn | undefined]> = [
      [0, column1],
      [1, column2],
      [2, column3],
    ];
    const activeColumns = candidates.filter(
      (entry): entry is [number, PickerColumn] =>
        entry[1] !== undefined && entry[1].length > 0,
    );

    return activeColumns.length === 1 ? activeColumns[0] : undefined;
  }, [column1, column2, column3]);

  const isSingleColumn = singleActiveColumn !== undefined;
  const searchColumnIndex = singleActiveColumn?.[0] ?? 0;
  const searchColumn = singleActiveColumn?.[1] ?? emptyColumn;

  const selectedValue1 =
    newSelectedValues?.[0] !== undefined
      ? newSelectedValues[0]
      : (legacySelectedValue1 ?? null);
  const selectedValue2 =
    newSelectedValues?.[1] !== undefined
      ? newSelectedValues[1]
      : (legacySelectedValue2 ?? null);
  const selectedValue3 =
    newSelectedValues?.[2] !== undefined
      ? newSelectedValues[2]
      : (legacySelectedValue3 ?? null);

  const resolvedHPadding = horizontalPadding ?? hPadding;
  const resolvedItemStyle = itemStyle ?? legacyPickerItemTextStyle;
  const resolvedActionButtons =
    actionButtonsPosition ?? actionButtons ?? "none";
  const isLegacyCancelPosition = resolvedActionButtons === "cancel";
  const shouldShowSubmitButton = showSubmitButton ?? !isLegacyCancelPosition;
  const shouldShowCancelButton = showCancelButton;
  const shouldShowTopButtons =
    resolvedActionButtons === "top" &&
    (shouldShowSubmitButton || shouldShowCancelButton);
  const shouldShowBottomSubmitButton =
    (resolvedActionButtons === "bottom" || isLegacyCancelPosition) &&
    shouldShowSubmitButton;
  const shouldShowDetachedCancelButton =
    (resolvedActionButtons === "bottom" || isLegacyCancelPosition) &&
    shouldShowCancelButton;
  const hasVisibleSubmitButton =
    shouldShowSubmitButton &&
    (resolvedActionButtons === "top" ||
      resolvedActionButtons === "bottom" ||
      isLegacyCancelPosition);
  const showSearchBar = (enableSearch || searchBar) && isSingleColumn;
  const controlsHeight =
    (shouldShowTopButtons ? actionButtonHeight : 0) +
    (title
      ? titleVerticalPadding * 2 +
        pickerTokens.typography.title +
        StyleSheet.hairlineWidth
      : 0) +
    (showSearchBar
      ? searchTopMargin + pickerTokens.layout.searchInputMinHeight
      : 0) +
    (shouldShowBottomSubmitButton ? actionButtonHeight : 0) +
    (shouldShowDetachedCancelButton
      ? actionButtonHeight + cancelButtonContainerMarginTop
      : 0);
  const modalBottomInset = isWideScreen
    ? pickerTokens.layout.modalBottomInset
    : Math.max(insets.bottom, pickerTokens.layout.modalBottomInset);
  const availablePickerHeight =
    windowHeight -
    insets.top -
    (isWideScreen ? insets.bottom : 0) -
    modalBottomInset -
    controlsHeight;
  const columnNavigationButtonsHeight = navigationButtonsByColumn.some(Boolean)
    ? columnNavigationControlHeight
    : 0;
  const pickerHeight = isLandscape
    ? Math.max(
        pickerTokens.layout.landscapePickerMinHeight +
          columnNavigationButtonsHeight,
        Math.min(
          pickerTokens.layout.pickerHeight + columnNavigationButtonsHeight,
          availablePickerHeight,
        ),
      )
    : pickerTokens.layout.pickerHeight + columnNavigationButtonsHeight;
  const selectionHighlightHeight = Math.max(
    pickerTokens.layout.selectionHighlightHeight,
    pickerTokens.layout.accessiblePickerMinItemHeight * fontScale,
  );
  const searchableItems = useMemo(
    () =>
      showSearchBar
        ? searchColumn.map((item) => ({
            item,
            label: normalizeSearchText(item.label),
            value: normalizeSearchText(String(item.value)),
          }))
        : [],
    [searchColumn, showSearchBar],
  );
  const exactValueMatches = useMemo(() => {
    const matches = new Map<string, (typeof searchableItems)[number]["item"]>();

    for (const searchableItem of searchableItems) {
      if (!matches.has(searchableItem.value)) {
        matches.set(searchableItem.value, searchableItem.item);
      }
    }

    return matches;
  }, [searchableItems]);

  const [searchValue, setSearchValue] = useState("");
  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    const animationId = ++modalAnimationId.current;

    overlayOpacity.stopAnimation();
    pickerTranslateY.stopAnimation();

    if (visible) {
      setModalVisible(true);
      pickerTranslateY.setValue(windowHeightRef.current);
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: Platform.OS !== "web",
      }).start();
      Animated.timing(pickerTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(pickerTranslateY, {
          toValue: windowHeightRef.current,
          duration: 180,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]).start(({ finished }) => {
        if (finished && animationId === modalAnimationId.current) {
          setModalVisible(false);
        }
      });
    }

    return () => {
      modalAnimationId.current += 1;
      overlayOpacity.stopAnimation();
      pickerTranslateY.stopAnimation();
    };
  }, [overlayOpacity, pickerTranslateY, visible]);

  const columns = useMemo<[PickerColumn, PickerColumn?, PickerColumn?]>(
    () => [column1, column2, column3],
    [column1, column2, column3],
  );

  const selectedValues = useMemo<
    [PickerValue | null, (PickerValue | null)?, (PickerValue | null)?]
  >(
    () => [selectedValue1, selectedValue2, selectedValue3],
    [selectedValue1, selectedValue2, selectedValue3],
  );

  const previousValues = useRef<Array<PickerValue | null>>([null, null, null]);
  const lastSearchMatch = useRef<PickerValue | null>(null);
  const pickerStateRef = useRef({
    columns,
    selectedValues,
    legacyOnValuesChange,
    newOnValueChange,
    newOnValueChange1,
    newOnValueChange2,
    newOnValueChange3,
  });

  useLayoutEffect(() => {
    pickerStateRef.current = {
      columns,
      selectedValues,
      legacyOnValuesChange,
      newOnValueChange,
      newOnValueChange1,
      newOnValueChange2,
      newOnValueChange3,
    };
  }, [
    columns,
    legacyOnValuesChange,
    newOnValueChange,
    newOnValueChange1,
    newOnValueChange2,
    newOnValueChange3,
    selectedValues,
  ]);

  useEffect(() => {
    if (visible) {
      previousValues.current = [
        selectedValue1 ?? null,
        selectedValue2 ?? null,
        selectedValue3 ?? null,
      ];
      lastSearchMatch.current = selectedValues[searchColumnIndex] ?? null;
      return;
    }

    setSearchValue("");
  }, [visible]);

  const emitValueChange = useCallback(
    (
      columnIndex: number,
      value: PickerValue | null,
      index?: number,
      legacyValuesSnapshot?: [
        PickerValue | null,
        PickerValue | null,
        PickerValue | null,
      ],
    ) => {
      const {
        columns: currentColumns,
        selectedValues: currentSelectedValues,
        legacyOnValuesChange: currentLegacyOnValuesChange,
        newOnValueChange: currentOnValueChange,
        newOnValueChange1: currentOnValueChange1,
        newOnValueChange2: currentOnValueChange2,
        newOnValueChange3: currentOnValueChange3,
      } = pickerStateRef.current;

      if (
        !currentColumns[columnIndex] ||
        Object.is(currentSelectedValues[columnIndex], value)
      ) {
        return;
      }

      const nextValues: [
        PickerValue | null,
        PickerValue | null,
        PickerValue | null,
      ] = [
        currentSelectedValues[0] ?? null,
        currentSelectedValues[1] ?? null,
        currentSelectedValues[2] ?? null,
      ];
      nextValues[columnIndex] = value;

      currentOnValueChange?.(value, columnIndex, index);
      if (columnIndex === 0) currentOnValueChange1?.(value, index);
      if (columnIndex === 1) currentOnValueChange2?.(value, index);
      if (columnIndex === 2) currentOnValueChange3?.(value, index);

      currentLegacyOnValuesChange?.(legacyValuesSnapshot ?? nextValues);
    },
    [],
  );

  const handleCancel = useCallback(() => {
    if (showSearchBar) searchRef.current?.blur();

    const restoredValues: [
      PickerValue | null,
      PickerValue | null,
      PickerValue | null,
    ] = [
      previousValues.current[0] ?? null,
      previousValues.current[1] ?? null,
      previousValues.current[2] ?? null,
    ];

    columns.forEach((column, columnIndex) => {
      if (
        !column ||
        Object.is(selectedValues[columnIndex], restoredValues[columnIndex])
      ) {
        return;
      }

      const value = restoredValues[columnIndex];
      newOnValueChange?.(value, columnIndex);
      if (columnIndex === 0) newOnValueChange1?.(value);
      if (columnIndex === 1) newOnValueChange2?.(value);
      if (columnIndex === 2) newOnValueChange3?.(value);
    });

    if (
      legacyOnValuesChange &&
      columns.some(
        (column, columnIndex) =>
          column &&
          !Object.is(selectedValues[columnIndex], restoredValues[columnIndex]),
      )
    ) {
      legacyOnValuesChange(restoredValues);
    }

    onCancel?.();
    onClose();
  }, [
    columns,
    legacyOnValuesChange,
    newOnValueChange,
    newOnValueChange1,
    newOnValueChange2,
    newOnValueChange3,
    onCancel,
    onClose,
    selectedValues,
    showSearchBar,
  ]);

  const handleSubmit = useCallback(() => {
    if (showSearchBar) searchRef.current?.blur();
    (onSubmit ?? legacyOnAccept)?.();
    onClose();
  }, [legacyOnAccept, onClose, onSubmit, showSearchBar]);

  const handlePickerValueChange = useCallback(
    (columnIndex: number, value: PickerValue | null, index?: number) => {
      emitValueChange(columnIndex, value, index);
      if (Platform.OS !== "web" && isSingleColumn && !hasVisibleSubmitButton) {
        handleSubmit();
      }
    },
    [emitValueChange, handleSubmit, hasVisibleSubmitButton, isSingleColumn],
  );

  const onValueChanges = useMemo<
    [
      (value: PickerValue | null, index?: number) => void,
      (value: PickerValue | null, index?: number) => void,
      (value: PickerValue | null, index?: number) => void,
    ]
  >(
    () => [
      (value, index) => handlePickerValueChange(0, value, index),
      (value, index) => handlePickerValueChange(1, value, index),
      (value, index) => handlePickerValueChange(2, value, index),
    ],
    [handlePickerValueChange],
  );

  const handleSearch = useCallback(
    (text: string) => {
      setSearchValue(text);

      if (text === "") {
        lastSearchMatch.current =
          pickerStateRef.current.selectedValues[searchColumnIndex] ?? null;
        return;
      }

      const normalizedText = normalizeSearchText(text);
      const exactValueMatch = exactValueMatches.get(normalizedText);
      if (exactValueMatch) {
        lastSearchMatch.current = exactValueMatch.value;
        emitValueChange(searchColumnIndex, exactValueMatch.value);
        return;
      }

      let bestMatch: (typeof searchColumn)[number] | undefined;
      let bestLabelMatchIndex = Number.POSITIVE_INFINITY;

      for (const searchableItem of searchableItems) {
        const labelMatchIndex = searchableItem.label.indexOf(normalizedText);
        const valueMatchIndex = searchableItem.value.indexOf(normalizedText);

        if (
          (labelMatchIndex >= 0 || valueMatchIndex >= 0) &&
          labelMatchIndex < bestLabelMatchIndex
        ) {
          bestMatch = searchableItem.item;
          bestLabelMatchIndex = labelMatchIndex;
        }
      }

      if (bestMatch) lastSearchMatch.current = bestMatch.value;
      emitValueChange(searchColumnIndex, lastSearchMatch.current);
    },
    [emitValueChange, exactValueMatches, searchableItems, searchColumnIndex],
  );

  const handleClearSearch = useCallback(() => {
    const currentValue =
      pickerStateRef.current.selectedValues[searchColumnIndex] ?? null;
    lastSearchMatch.current = currentValue;
    setSearchValue("");
  }, [searchColumnIndex]);

  return (
    <Modal
      animationType="none"
      transparent
      visible={modalVisible}
      statusBarTranslucent={Platform.OS === "android"}
      navigationBarTranslucent={Platform.OS === "android"}
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior="padding"
        enabled={showSearchBar}
        pointerEvents={visible ? "auto" : "none"}
        style={[
          styles.modalContentContainer,
          isWideScreen && {
            justifyContent: "center",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingHorizontal: Math.max(insets.left, insets.right),
          },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.modalBackdrop,
            { backgroundColor: colors.overlay, opacity: overlayOpacity },
          ]}
        />
        <Pressable
          style={styles.modalBackdrop}
          onPress={handleSubmit}
          accessibilityRole="button"
          accessibilityLabel={resolvedSubmitButtonText}
        />
        <Animated.View
          style={[
            styles.modalMainContainer,
            { transform: [{ translateY: pickerTranslateY }] },
            {
              paddingBottom: modalBottomInset,
            },
          ]}
        >
          <View
            style={[
              styles.pickerWrapperStyle,
              {
                backgroundColor: colors.modalBackground,
                borderRadius: modalBorderRadius,
              },
            ]}
          >
            {shouldShowTopButtons && (
              <View
                style={[
                  styles.buttonsContainer,
                  {
                    borderBottomColor: colors.border,
                    minHeight: actionButtonHeight,
                  },
                ]}
              >
                {shouldShowCancelButton && (
                  <TouchableOpacity
                    style={[
                      styles.topCancelButton,
                      {
                        minHeight: actionButtonHeight,
                        justifyContent: "center",
                      },
                      cancelButtonContainerStyle,
                    ]}
                    onPress={handleCancel}
                    accessibilityRole="button"
                    accessibilityLabel={resolvedCancelButtonText}
                  >
                    <Text
                      style={[
                        styles.mainText,
                        styles.topCancelButtonText,
                        { color: colors.cancelButtonText },
                        cancelButtonTextStyle,
                      ]}
                    >
                      {resolvedCancelButtonText}
                    </Text>
                  </TouchableOpacity>
                )}
                {shouldShowSubmitButton && (
                  <TouchableOpacity
                    style={[
                      styles.acceptBtn,
                      {
                        minHeight: actionButtonHeight,
                        justifyContent: "center",
                      },
                      submitButtonContainerStyle,
                    ]}
                    onPress={handleSubmit}
                    accessibilityRole="button"
                    accessibilityLabel={resolvedSubmitButtonText}
                  >
                    <Text
                      style={[
                        styles.mainText,
                        styles.topAcceptButtonText,
                        { color: colors.buttonText },
                        legacyAcceptButtonTextStyle,
                        submitButtonTextStyle,
                      ]}
                    >
                      {resolvedSubmitButtonText}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {title && (
              <View
                style={[
                  styles.titleView,
                  {
                    borderBottomColor: colors.border,
                    paddingVertical: titleVerticalPadding,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.titleText,
                    { color: colors.secondaryText },
                    titleStyle,
                  ]}
                >
                  {title}
                </Text>
              </View>
            )}

            {showSearchBar && (
              <SearchBar
                backgroundColor={colors.searchBackground}
                clearButtonColor={colors.searchClearBackground}
                clearTextColor={colors.searchClearText}
                inputColor={colors.inputText}
                inputRef={searchRef}
                onBlur={() => {
                  onSearchBlur?.();
                }}
                onChangeText={handleSearch}
                onClear={handleClearSearch}
                onFocus={onSearchFocus}
                placeholder={resolvedSearchPlaceholder}
                accessibilityLabel={localizedTexts.searchAccessibilityLabel}
                clearButtonAccessibilityLabel={localizedTexts.clearSearch}
                placeholderTextColor={colors.searchElements}
                searchBarBorderRadius={searchBarBorderRadius}
                searchClearButtonBorderRadius={searchClearButtonBorderRadius}
                searchBoxStyle={[
                  searchBoxStyle,
                  isLandscape && { marginTop: searchTopMargin },
                ]}
                searchMaxLength={resolvedSearchMaxLength}
                searchTextStyle={searchTextStyle}
                searchValue={searchValue}
              />
            )}

            <View style={[styles.pickerContentRow, { height: pickerHeight }]}>
              {(Platform.OS === "android" || Platform.OS === "web") && (
                <View
                  pointerEvents="none"
                  style={[
                    styles.selectionHighlight,
                    {
                      backgroundColor: colors.selectionHighlight,
                      borderRadius: selectionHighlightBorderRadius,
                      height: selectionHighlightHeight,
                      marginTop: -selectionHighlightHeight / 2,
                    },
                  ]}
                />
              )}
              {resolvedHPadding !== undefined && resolvedHPadding > 0 && (
                <View
                  style={[
                    styles.horizontalPaddingSpacer,
                    { minWidth: resolvedHPadding },
                  ]}
                />
              )}
              <View style={styles.pickerColumnsContainer}>
                <PickerColumns
                  columns={columns}
                  selectedValues={selectedValues}
                  itemStyle={resolvedItemStyle}
                  itemTextColor={colors.pickerItemText}
                  columnNavigationButtonsColor={colors.columnNavigationButtons}
                  columnAccessibilityLabel={
                    localizedTexts.columnAccessibilityLabel
                  }
                  previousOptionAccessibilityLabel={
                    localizedTexts.previousOptionAccessibilityLabel
                  }
                  nextOptionAccessibilityLabel={
                    localizedTexts.nextOptionAccessibilityLabel
                  }
                  onValueChanges={onValueChanges}
                  pickerHeight={pickerHeight}
                  isSingleColumn={isSingleColumn}
                  showColumnNavigationButtons={navigationButtonsByColumn}
                  reserveColumnNavigationButtonSpace={navigationButtonsByColumn.some(
                    Boolean,
                  )}
                />
              </View>
              {rightInfo && isSingleColumn && (
                <View style={styles.rightInfoContainer}>
                  <Text
                    style={[
                      styles.rightInfoText,
                      {
                        color: colors.rightInfoText,
                      },
                      rightInfoTextStyle,
                    ]}
                  >
                    {rightInfo}
                  </Text>
                </View>
              )}
            </View>

            {shouldShowBottomSubmitButton && (
              <TouchableOpacity
                style={[
                  styles.buttonAlt,
                  styles.acceptBtnAlt,
                  { borderTopColor: colors.border },
                  { minHeight: actionButtonHeight },
                  submitButtonContainerStyle,
                ]}
                onPress={handleSubmit}
                accessibilityRole="button"
                accessibilityLabel={resolvedSubmitButtonText}
              >
                <Text
                  style={[
                    styles.mainText,
                    styles.buttonAltText,
                    { color: colors.buttonText },
                    legacyAcceptButtonTextStyle,
                    submitButtonTextStyle,
                  ]}
                >
                  {resolvedSubmitButtonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {shouldShowDetachedCancelButton && (
            <View
              style={[
                styles.buttonAltView,
                {
                  backgroundColor:
                    cancelButtonBgColor ?? colors.modalBackground,
                  borderRadius: actionButtonsBorderRadius,
                  minHeight: actionButtonHeight,
                  marginTop: cancelButtonContainerMarginTop,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.buttonAlt,
                  { minHeight: actionButtonHeight },
                  cancelButtonContainerStyle,
                ]}
                onPress={handleCancel}
                accessibilityRole="button"
                accessibilityLabel={resolvedCancelButtonText}
              >
                <Text
                  style={[
                    styles.mainText,
                    styles.buttonAltText,
                    { color: colors.cancelText },
                    cancelButtonTextStyle,
                  ]}
                >
                  {resolvedCancelButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MultiColumnModalPickerContent;
