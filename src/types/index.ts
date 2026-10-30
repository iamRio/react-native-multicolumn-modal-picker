import type { ComponentRef, RefObject } from "react";
import type {
  Animated,
  StyleProp,
  TextInput as TextInputComponent,
  TextStyle,
  ViewStyle,
} from "react-native";
import type { ReactNode } from "react";

export type PickerValue = string | number;

export type PickerItem = {
  readonly label: string;
  readonly value: PickerValue;
};

export type PickerColumn = readonly PickerItem[];

export type PickerLocale =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ru"
  | "ja"
  | "ko"
  | "zh"
  | "ar"
  | "hi"
  | "tr"
  | "nl"
  | "pl"
  | "sv"
  | "nb"
  | "da"
  | "fi"
  | "cs"
  | "el"
  | "id"
  | "th"
  | "uk"
  | "he"
  | "ro"
  | "hu"
  | "sk"
  | "vi";

/** @deprecated Use "bottom" with `showSubmitButton={false}` instead. */
export type DeprecatedCancelActionButtonsPosition = "cancel";

export type ActionButtonsPosition =
  "top" | "bottom" | "none" | DeprecatedCancelActionButtonsPosition;

export type PickerThemeMode = "light" | "dark" | "auto";

export type PickerThemeName = PickerThemeMode | (string & {});

export type PickerPalette = {
  modalBackground: string;
  overlay: string;
  border: string;
  buttonText: string;
  columnNavigationButtons: string;
  cancelButtonText: string;
  secondaryText: string;
  rightInfoText: string;
  inputText: string;
  pickerItemText: string;
  searchBackground: string;
  searchClearBackground: string;
  searchClearText: string;
  searchElements: string;
  selectionHighlight: string;
  cancelText: string;
};

export type BasePalette = Omit<PickerPalette, "searchElements" | "cancelText">;

export type ThemePalette = BasePalette &
  Pick<PickerPalette, "searchElements" | "cancelText">;

export type PickerValueChangeHandler = (
  value: PickerValue | null,
  index?: number,
) => void;

export type PickerColumnValueChangeHandler = (
  value: PickerValue | null,
  columnIndex: number,
  index?: number,
) => void;

export type PickerValuesChangeHandler = (
  values: Array<PickerValue | null>,
) => void;

export type MultiColumnModalPickerProps = {
  /**
   * @deprecated Use actionButtonsPosition instead.
   *
   * Used only when `actionButtonsPosition` is undefined.
   */
  actionButtons?: ActionButtonsPosition;
  /**
   * @deprecated Since 1.1.0. Use customColorScheme instead.
   *
   * Type: string.
   * Default: active theme modal background. Used only when defined and when
   * no corresponding custom palette override is provided.
   */
  bgColor?: string;
  /**
   * @deprecated Since 1.1.0. Use customColorScheme instead.
   *
   * Type: string.
   * Default: active theme border color. Used only when defined and when
   * no corresponding custom palette override is provided.
   */
  actionButtonsBorderColor?: string;
  /**
   * @deprecated Since 1.1.0. Use customColorScheme instead.
   *
   * Type: string.
   * Default: active theme modal background. Applies only to detached cancel
   * actions and takes precedence over the resolved modal background.
   */
  cancelButtonBgColor?: string;
  /**
   * @deprecated Since 1.1.0. Use horizontalPadding instead.
   *
   * Type: number.
   * Default: horizontalPadding. Has no effect when `horizontalPadding` is defined.
   */
  hPadding?: number;
  /**
   * @deprecated Since 1.1.0. Use enableSearch instead.
   *
   * Type: boolean.
   * Default: false. Enables search together with `enableSearch`; the search
   * bar is rendered only when exactly one column is active.
   */
  searchBar?: boolean;
  /**
   * @deprecated Since 1.1.0. Use customColorScheme instead.
   *
   * Type: string.
   * Default: active theme search elements color. Applied only when search is
   * rendered and no corresponding custom palette override is provided.
   */
  searchElementsColor?: string;
  /**
   * @deprecated Since 1.1.0. Use customColorScheme instead.
   *
   * Type: string.
   * Default: active theme selection highlight color. Applied only to the
   * rendered overlay and when no corresponding custom palette override is provided.
   */
  selectionHighlightColor?: string;
  /**
   * @deprecated Use onValueChange instead.
   *
   * Signature: (value: string | number | null, index?: number) => void.
   * Called for changes in column 1. If both new and legacy callbacks are
   * defined, both are called.
   */
  onValueChange1?: PickerValueChangeHandler;
  /**
   * @deprecated Use onValueChange instead.
   *
   * Signature: (value: string | number | null, index?: number) => void.
   * Called for changes in column 2. If both new and legacy callbacks are
   * defined, both are called.
   */
  onValueChange2?: PickerValueChangeHandler;
  /**
   * @deprecated Use onValueChange instead.
   *
   * Signature: (value: string | number | null, index?: number) => void.
   * Called for changes in column 3. If both new and legacy callbacks are
   * defined, both are called.
   */
  onValueChange3?: PickerValueChangeHandler;
  /**
   * @deprecated Use onValueChange instead.
   *
   * Signature: (values: Array<string | number | null>) => void.
   * Called alongside `onValueChange` when a column value changes.
   */
  onValuesChange?: PickerValuesChangeHandler;
  /**
   * @deprecated Since 1.2.0. Use submitButtonText instead. This value is used
   * only when `submitButtonText` is not provided.
   */
  acceptButtonText?: string;
  /**
   * @deprecated Since 1.2.0. Use submitButtonTextStyle instead. This style is
   * applied before `submitButtonTextStyle` when both are provided.
   */
  acceptButtonTextStyle?: StyleProp<TextStyle>;
  /**
   * Text shown on the submit button.
   *
   * Type: string.
   * Default: localized default text. Has no effect when submit actions are not rendered.
   */
  submitButtonText?: string;
  /**
   * Text style for the submit button label.
   *
   * Type: StyleProp<TextStyle>.
   * Default: default button style. Applied only to rendered submit actions.
   */
  submitButtonTextStyle?: StyleProp<TextStyle>;
  /**
   * Style for the submit button's touchable container.
   *
   * Type: StyleProp<ViewStyle>.
   * Default: default button container style. Applied only to rendered submit actions.
   */
  submitButtonContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Position of the action buttons.
   *
   * `"top"` renders visible actions inside the modal, `"bottom"` renders the
   * submit action inside and the cancel action outside, and `"none"` renders
   * no action buttons.
   *
   * The `"cancel"` value is deprecated but remains supported for compatibility.
   * Use `"bottom"` with `showSubmitButton={false}` to render only cancel.
   */
  actionButtonsPosition?: ActionButtonsPosition;
  /**
   * Whether to render the submit button in the selected action layout.
   *
   * Type: boolean.
   * Default: true. For the deprecated `actionButtonsPosition="cancel"` value,
   * the button remains hidden by default to preserve its previous behavior.
   */
  showSubmitButton?: boolean;
  /**
   * Whether to render the cancel button in the selected action layout.
   *
   * Type: boolean.
   * Default: true.
   */
  showCancelButton?: boolean;
  /**
   * Border radius applied to action buttons when they are rendered outside the modal.
   * Integrated action buttons keep the modal container radius.
   *
   * Type: number.
   * Default: 10.
   */
  actionButtonsBorderRadius?: number;
  /**
   * Text shown on the cancel button.
   *
   * Type: string.
   * Default: localized default text. Has no effect when cancel actions are not rendered.
   */
  cancelButtonText?: string;
  /**
   * Style for the cancel button's touchable container.
   *
   * Type: StyleProp<ViewStyle>.
   * Default: default button container style. Applied only to rendered cancel actions.
   */
  cancelButtonContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Text style for the cancel button label.
   *
   * Type: StyleProp<TextStyle>.
   * Default: default button style. Applied only to rendered cancel actions.
   */
  cancelButtonTextStyle?: StyleProp<TextStyle>;
  /**
   * Border radius applied to the modal container.
   *
   * Type: number.
   * Default: 10.
   */
  modalBorderRadius?: number;
  /**
   * @deprecated Use `columns` instead.
   * Used only when the corresponding slot in `columns` is undefined.
   */
  column1?: PickerColumn;
  /**
   * @deprecated Use `columns` instead.
   * Used only when the corresponding slot in `columns` is undefined.
   */
  column2?: PickerColumn;
  /**
   * @deprecated Use `columns` instead.
   * Used only when the corresponding slot in `columns` is undefined.
   */
  column3?: PickerColumn;
  /**
   * Full column set for the picker. Each tuple slot represents a column.
   * New column slots take precedence over the corresponding legacy column props.
   */
  columns?: readonly [PickerColumn, PickerColumn?, PickerColumn?];
  /**
   * Controls the column navigation buttons. A boolean applies to every column;
   * a tuple can override each column independently. Undefined values use
   * automatic detection (shown only on non-touch Web devices).
   *
   * Type: boolean | readonly [boolean?, boolean?, boolean?].
   * Default: automatically hidden except on non-touch Web devices.
   */
  showColumnNavigationButtons?:
    boolean | readonly [boolean?, boolean?, boolean?];
  /**
   * Horizontal padding applied around the picker content.
   * Applied only when its value is defined; otherwise `hPadding` is used as a legacy fallback.
   */
  horizontalPadding?: number;
  /**
   * Text style applied to each picker item label.
   * Applied only to rendered picker columns.
   */
  itemStyle?: StyleProp<TextStyle>;
  /**
   * @deprecated Use `itemStyle` instead.
   * Used only when `itemStyle` is not defined.
   */
  pickerItemTextStyle?: StyleProp<TextStyle>;
  /**
   * Called when any picker column changes value.
   *
   * Signature: (value: string | number | null, columnIndex: number, index?: number) => void.
   * Default: none.
   *
   * @param value The selected value for the changed column.
   * @param columnIndex Zero-based index of the column that changed.
   * @param index Zero-based index of the selected item in that column.
   */
  onValueChange?: PickerColumnValueChangeHandler;
  /**
   * Static text displayed to the right side of the picker columns.
   *
   * Type: string.
   * Default: undefined. The text is rendered only when a value is defined.
   */
  rightInfo?: string;
  /**
   * Text style for the right-side info text.
   *
   * Type: StyleProp<TextStyle>.
   * Default: default right-info style. Applied only when `rightInfo` is defined.
   */
  rightInfoTextStyle?: StyleProp<TextStyle>;
  /**
   * Border radius applied to the selected-item overlay.
   *
   * Type: number.
   * Default: 10.
   */
  selectionHighlightBorderRadius?: number;
  /**
   * Enables the search input when only a single picker column is active.
   *
   * Type: boolean.
   * Default: false.
   */
  enableSearch?: boolean;
  /**
   * Maximum number of characters allowed in the search input.
   *
   * Type: positive integer or null.
   * Default: 30. Set to null to disable the limit.
   */
  searchMaxLength?: number | null;
  /**
   * Called when the rendered search input receives focus.
   *
   * This callback has an effect only when `enableSearch` or the legacy
   * `searchBar` prop enables search and exactly one column is active. It is
   * ignored when the search bar is not rendered, including when multiple
   * columns are configured.
   *
   * Signature: () => void.
   * Default: none.
   */
  onSearchFocus?: () => void;
  /**
   * Called when the rendered search input loses focus.
   *
   * This callback has an effect only when `enableSearch` or the legacy
   * `searchBar` prop enables search and exactly one column is active. It is
   * ignored when the search bar is not rendered, including when multiple
   * columns are configured.
   *
   * Signature: () => void.
   * Default: none.
   */
  onSearchBlur?: () => void;
  /**
   * Border radius applied to the search bar.
   *
   * Type: number.
   * Default: 10.
   */
  searchBarBorderRadius?: number;
  /**
   * Border radius applied to the search clear button.
   *
   * Type: number.
   * Default: 10.
   */
  searchClearButtonBorderRadius?: number;
  /**
   * Style applied to the search input container.
   *
   * Type: StyleProp<ViewStyle>.
   * Default: default search box style. Applied only when the search bar is rendered.
   */
  searchBoxStyle?: StyleProp<ViewStyle>;
  /**
   * Placeholder text for the search input.
   *
   * Type: string.
   * Default: localized default text. Applied only when the search bar is rendered.
   */
  searchPlaceholder?: string;
  /**
   * Text style for the search input value.
   *
   * Type: StyleProp<TextStyle>.
   * Default: default input style. Applied only when the search bar is rendered.
   */
  searchTextStyle?: StyleProp<TextStyle>;
  /**
   * @deprecated Use `selectedValues` instead.
   * Used only when the corresponding slot in `selectedValues` is undefined.
   */
  selectedValue1?: PickerValue | null;
  /**
   * @deprecated Use `selectedValues` instead.
   * Used only when the corresponding slot in `selectedValues` is undefined.
   */
  selectedValue2?: PickerValue | null;
  /**
   * @deprecated Use `selectedValues` instead.
   * Used only when the corresponding slot in `selectedValues` is undefined.
   */
  selectedValue3?: PickerValue | null;
  /**
   * Selected values for all columns, aligned by column index.
   * New selected values take precedence over the corresponding legacy selected-value props.
   */
  selectedValues?: readonly [
    PickerValue | null,
    (PickerValue | null)?,
    (PickerValue | null)?,
  ];
  /**
   * Title text displayed above the picker.
   *
   * Type: string.
   * Default: undefined. The title is rendered only when a value is defined.
   */
  title?: string;
  /**
   * Text style for the modal title.
   *
   * Type: StyleProp<TextStyle>.
   * Default: default title style. Applied only when `title` is defined.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * Controls modal visibility.
   *
   * Type: boolean.
   * Default: none. This prop is required.
   */
  visible: boolean;
  /**
   * Theme name used to select the active palette.
   *
   * Supported built-ins: "auto" | "light" | "dark" and any custom key you define.
   * When omitted, the active system color scheme selects the light or dark base palette.
   */
  theme?: PickerThemeName;
  /**
   * Custom color schemes keyed by theme name.
   *
   * Both the theme entries and colors within each entry are optional. Colors
   * omitted from the active light/dark entry keep their built-in values; when
   * `theme` is a custom name, its colors override the active light/dark entry.
   */
  customColorScheme?: Partial<Record<string, Partial<PickerPalette>>>;
  /**
   * Locale used for the built-in default texts.
   *
   * See `PickerLocale` for the supported values.
   * It affects only built-in submit, cancel, and search-placeholder text when
   * the corresponding explicit text prop is not defined.
   */
  locale?: PickerLocale;
  /**
   * @deprecated Since 1.2.0. Use onSubmit instead. Called only when
   * `onSubmit` is not provided.
   */
  onAccept?: () => void;
  /**
   * Called when the user submits the current selection.
   *
   * Signature: () => void.
   * Default: none.
   */
  onSubmit?: () => void;
  /**
   * Called when the user cancels without submitting.
   *
   * Signature: () => void.
   * Default: none.
   */
  onCancel?: () => void;
  /**
   * Called whenever the modal closes.
   *
   * Signature: () => void.
   * Default: none.
   */
  onClose: () => void;
  /**
   * Custom content rendered inside the modal. This is kept for compatibility.
   * The current picker layout does not render this prop.
   */
  children?: ReactNode;
};

export type DefaultTextSet = {
  accept: string;
  cancel: string;
  searchPlaceholder: string;
};

export type PickerColumnViewProps = {
  column: PickerColumn;
  columnIndex: number;
  selectedValue: PickerValue | null | undefined;
  itemStyle?: StyleProp<TextStyle>;
  itemTextColor: string;
  columnNavigationButtonsColor: string;
  pickerHeight: number;
  isSingleColumn: boolean;
  showColumnNavigationButtons: boolean;
  reserveColumnNavigationButtonSpace: boolean;
  onValueChange?: PickerValueChangeHandler;
};

export type PickerWheelProps = Omit<
  PickerColumnViewProps,
  | "isSingleColumn"
  | "columnNavigationButtonsColor"
  | "showColumnNavigationButtons"
  | "reserveColumnNavigationButtonSpace"
> & {
  isSingleColumn?: boolean;
  scrollEnabled?: boolean;
  animateSelectedValueChange?: boolean;
};

export type PickerWheelItemProps = {
  item: PickerItem;
  itemIndex: number;
  selected: boolean;
  itemHeight: number;
  scrollOffset: Animated.Value;
  itemStyle?: StyleProp<TextStyle>;
  itemTextColor: string;
};

export type PickerChangeHandler = (
  value: PickerValue | null,
  index?: number,
) => void;

export type PickerColumnsProps = {
  columns: [PickerColumn, PickerColumn?, PickerColumn?];
  selectedValues: [
    PickerValue | null,
    (PickerValue | null)?,
    (PickerValue | null)?,
  ];
  itemStyle?: StyleProp<TextStyle>;
  itemTextColor: string;
  columnNavigationButtonsColor: string;
  pickerHeight: number;
  isSingleColumn: boolean;
  showColumnNavigationButtons: readonly [boolean, boolean, boolean];
  reserveColumnNavigationButtonSpace: boolean;
  onValueChanges: [
    PickerChangeHandler | undefined,
    PickerChangeHandler | undefined,
    PickerChangeHandler | undefined,
  ];
};

export type SearchBarProps = {
  backgroundColor: string;
  clearButtonColor: string;
  clearTextColor: string;
  inputColor: string;
  placeholder: string;
  placeholderTextColor: string;
  searchValue: string;
  searchBarBorderRadius: number;
  searchClearButtonBorderRadius: number;
  searchMaxLength: number | null;
  searchBoxStyle?: StyleProp<ViewStyle>;
  searchTextStyle?: StyleProp<TextStyle>;
  inputRef: RefObject<ComponentRef<typeof TextInputComponent> | null>;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onFocus?: () => void;
  onBlur: () => void;
};

export type KeyboardTarget = {
  tagName?: string;
  isContentEditable?: boolean;
  parentElement?: KeyboardTarget | null;
};

export type WebKeyboardEvent = {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  defaultPrevented: boolean;
  target: KeyboardTarget | null;
  preventDefault: () => void;
};

export type WebDocument = {
  addEventListener: (
    type: "keydown",
    listener: (event: WebKeyboardEvent) => void,
  ) => void;
  removeEventListener: (
    type: "keydown",
    listener: (event: WebKeyboardEvent) => void,
  ) => void;
};

export type WebGlobal = typeof globalThis & {
  document?: WebDocument;
  window?: {
    matchMedia?: (query: string) => WebMediaQueryList;
  };
};

export type WebMediaQueryList = {
  matches: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
  addListener?: (listener: () => void) => void;
  removeListener?: (listener: () => void) => void;
};

export type PickerItemRenderInfo = {
  item: PickerItem;
  index: number;
};

export type ResolvePaletteOptions = {
  theme?: PickerThemeName;
  customColorScheme?: Partial<Record<string, Partial<PickerPalette>>>;
  colorScheme?: "light" | "dark" | null;
  legacyColorOverrides?: Partial<PickerPalette>;
};
