import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentRef } from "react";
import {
  Animated,
  View,
  Text,
  Modal,
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
} from "../../types";
import { PickerColumns } from "../../ui/components/PickerColumns";
import { SearchBar } from "../../ui/components/SearchBar";
import {
  comparePickerItems,
  matchesPickerItem,
  normalizeSearchText,
} from "../../utils/search";
import { styles } from "../../styles";
import { resolvePalette } from "../../constants/colors";
import { resolveLocale } from "../../i18n/locale";
import { translations } from "../../i18n/translations";

const emptyColumn: PickerColumn = [];

const IOSMultiColumnModalPicker = ({
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
  acceptButtonText,
  acceptButtonTextStyle,
  actionButtonsPosition,
  cancelButtonText,
  cancelButtonTextStyle,
  column1: legacyColumn1,
  column2: legacyColumn2,
  column3: legacyColumn3,
  columns: newColumns,
  horizontalPadding,
  itemStyle,
  pickerItemTextStyle: legacyPickerItemTextStyle,
  locale,
  onAccept,
  onCancel,
  onClose,
  onValueChange: newOnValueChange,
  rightInfo,
  rightInfoTextStyle,
  enableSearch = false,
  onSearchFocus,
  onSearchBlur,
  modalBorderRadius = 10,
  searchBarBorderRadius = 10,
  searchClearButtonBorderRadius = 10,
  actionButtonsBorderRadius = 10,
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
  const searchRef = useRef<ComponentRef<typeof TextInput>>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const pickerTranslateY = useRef(new Animated.Value(0)).current;
  const modalAnimationId = useRef(0);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
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
  const resolvedAcceptButtonText = acceptButtonText ?? localizedTexts.accept;
  const resolvedCancelButtonText = cancelButtonText ?? localizedTexts.cancel;
  const resolvedSearchPlaceholder =
    searchPlaceholder ?? localizedTexts.searchPlaceholder;

  const column1 = newColumns?.[0] ?? legacyColumn1 ?? emptyColumn;
  const column2 = newColumns?.[1] ?? legacyColumn2;
  const column3 = newColumns?.[2] ?? legacyColumn3;

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
  const showSearchBar = (enableSearch || searchBar) && isSingleColumn;

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
        useNativeDriver: true,
      }).start();
      Animated.timing(pickerTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(pickerTranslateY, {
          toValue: windowHeightRef.current,
          duration: 180,
          useNativeDriver: true,
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
  const searchStartValue = useRef<PickerValue | null>(null);

  useEffect(() => {
    if (visible) {
      previousValues.current = [
        selectedValue1 ?? null,
        selectedValue2 ?? null,
        selectedValue3 ?? null,
      ];
      searchStartValue.current = selectedValues[searchColumnIndex] ?? null;
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
      if (
        !columns[columnIndex] ||
        Object.is(selectedValues[columnIndex], value)
      ) {
        return;
      }

      const nextValues: [
        PickerValue | null,
        PickerValue | null,
        PickerValue | null,
      ] = [
        selectedValues[0] ?? null,
        selectedValues[1] ?? null,
        selectedValues[2] ?? null,
      ];
      nextValues[columnIndex] = value;

      newOnValueChange?.(value, columnIndex, index);
      if (columnIndex === 0) newOnValueChange1?.(value, index);
      if (columnIndex === 1) newOnValueChange2?.(value, index);
      if (columnIndex === 2) newOnValueChange3?.(value, index);

      legacyOnValuesChange?.(legacyValuesSnapshot ?? nextValues);
    },
    [
      columns,
      legacyOnValuesChange,
      newOnValueChange,
      newOnValueChange1,
      newOnValueChange2,
      newOnValueChange3,
      selectedValues,
    ],
  );

  const onValueChanges = useMemo<
    [
      (value: PickerValue | null, index?: number) => void,
      (value: PickerValue | null, index?: number) => void,
      (value: PickerValue | null, index?: number) => void,
    ]
  >(
    () => [
      (value, index) => emitValueChange(0, value, index),
      (value, index) => emitValueChange(1, value, index),
      (value, index) => emitValueChange(2, value, index),
    ],
    [emitValueChange],
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

  const handleAccept = useCallback(() => {
    if (showSearchBar) searchRef.current?.blur();
    onAccept?.();
    onClose();
  }, [onAccept, onClose, showSearchBar]);

  const handleSearch = useCallback(
    (text: string) => {
      if (text !== "" && searchValue === "") {
        searchStartValue.current = selectedValues[searchColumnIndex] ?? null;
      }

      setSearchValue(text);

      if (text === "") {
        emitValueChange(searchColumnIndex, searchStartValue.current);
        return;
      }

      let bestMatch: (typeof searchColumn)[number] | undefined;
      const normalizedText = normalizeSearchText(text);

      for (const item of searchColumn) {
        if (normalizeSearchText(String(item.value)) === normalizedText) {
          bestMatch = item;
          break;
        }

        if (
          matchesPickerItem(item, text) &&
          (!bestMatch || comparePickerItems(item, bestMatch, text) < 0)
        ) {
          bestMatch = item;
        }
      }

      emitValueChange(
        searchColumnIndex,
        bestMatch?.value ?? searchStartValue.current,
      );
    },
    [
      emitValueChange,
      searchColumn,
      searchColumnIndex,
      searchValue,
      selectedValues,
    ],
  );

  return (
    <Modal
      animationType="none"
      transparent
      visible={modalVisible}
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior="padding"
        enabled={showSearchBar}
        pointerEvents={visible ? "auto" : "none"}
        style={styles.modalContentContainer}
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
          onPress={handleAccept}
          accessibilityRole="button"
          accessibilityLabel={resolvedAcceptButtonText}
        />
        <Animated.View
          style={[
            styles.modalMainContainer,
            { transform: [{ translateY: pickerTranslateY }] },
            { paddingBottom: Math.max(insets.bottom, 16) },
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
            {resolvedActionButtons === "top" && (
              <View
                style={[
                  styles.buttonsContainer,
                  { borderBottomColor: colors.border },
                ]}
              >
                <TouchableOpacity
                  style={styles.topCancelButton}
                  onPress={handleCancel}
                  accessibilityRole="button"
                  accessibilityLabel={resolvedCancelButtonText}
                >
                  <Text
                    style={[
                      styles.mainText,
                      { color: colors.cancelButtonText },
                      cancelButtonTextStyle,
                    ]}
                  >
                    {resolvedCancelButtonText}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={handleAccept}
                  accessibilityRole="button"
                  accessibilityLabel={resolvedAcceptButtonText}
                >
                  <Text
                    style={[
                      styles.mainText,
                      { color: colors.buttonText },
                      acceptButtonTextStyle,
                    ]}
                  >
                    {resolvedAcceptButtonText}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {title && (
              <View
                style={[styles.titleView, { borderBottomColor: colors.border }]}
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
                  setSearchValue("");
                  onSearchBlur?.();
                }}
                onChangeText={handleSearch}
                onFocus={onSearchFocus}
                placeholder={resolvedSearchPlaceholder}
                placeholderTextColor={colors.searchElements}
                searchBarBorderRadius={searchBarBorderRadius}
                searchClearButtonBorderRadius={searchClearButtonBorderRadius}
                searchBoxStyle={searchBoxStyle}
                searchTextStyle={searchTextStyle}
                searchValue={searchValue}
              />
            )}

            <View style={styles.pickerContentRow}>
              {/* Temporarily disabled to prevent visual overlap with the native picker highlight */}
              {/* <View
                style={{
                  ...styles.selectionHighlight,
                  backgroundColor: colors.selectionHighlight,
                  borderRadius: selectionHighlightBorderRadius,
                }}
              /> */}
              {resolvedHPadding !== undefined && resolvedHPadding > 0 && (
                <View style={{ minWidth: resolvedHPadding }} />
              )}
              <View style={styles.pickerColumnsContainer}>
                <PickerColumns
                  columns={columns}
                  selectedValues={selectedValues}
                  itemStyle={resolvedItemStyle}
                  itemTextColor={colors.pickerItemText}
                  onValueChanges={onValueChanges}
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

            {resolvedActionButtons === "bottom" && (
              <TouchableOpacity
                style={[
                  styles.buttonAlt,
                  styles.acceptBtnAlt,
                  { borderTopColor: colors.border },
                ]}
                onPress={handleAccept}
                accessibilityRole="button"
                accessibilityLabel={resolvedAcceptButtonText}
              >
                <Text
                  style={[
                    styles.mainText,
                    { color: colors.buttonText },
                    acceptButtonTextStyle,
                  ]}
                >
                  {resolvedAcceptButtonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {(resolvedActionButtons === "cancel" ||
            resolvedActionButtons === "bottom") && (
            <View
              style={[
                styles.buttonAltView,
                {
                  backgroundColor:
                    cancelButtonBgColor ?? colors.modalBackground,
                  borderRadius: actionButtonsBorderRadius,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.buttonAlt}
                onPress={handleCancel}
                accessibilityRole="button"
                accessibilityLabel={resolvedCancelButtonText}
              >
                <Text
                  style={[
                    styles.mainText,
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

export default IOSMultiColumnModalPicker;
