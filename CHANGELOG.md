# Changelog

## [1.2.0] - 2026-10-26

### Added

- Allowed partial color overrides for light, dark, and named themes. Unspecified colors retain the built-in colors for the active mode, and named theme values take precedence when a color is defined in both entries.
- Added Android support with virtualized scrollable picker wheels that match the existing iOS modal styling.
- Added Web support, including keyboard arrow navigation for single-column pickers.
- Optimized picker columns on Android and Web to handle large option lists efficiently.
- Added `showColumnNavigationButtons` to show or hide column navigation buttons on every platform globally or independently per column. By default, buttons are shown only on non-touch Web devices, based on the `pointer`, `hover`, `any-pointer`, and `any-hover` media features.
- Added the `columnNavigationButtons` palette color for theming column navigation buttons on every platform.
- Added `submitButtonText`, `submitButtonTextStyle`, and `onSubmit` as the preferred names for button text, styling, and submission callbacks.
- Added `showSubmitButton` and `showCancelButton` to control each action independently; both default to `true`.
- Added `submitButtonContainerStyle` and `cancelButtonContainerStyle` to style each action button's touchable container independently from its label.
- Added the `searchMaxLength` prop to configure the search input character limit. It defaults to `30`, accepts positive safe integers, and can be set to `null` for no limit.

### Changed

- When no submit button is rendered, selecting an item in a single-column picker submits the selection and closes the modal. Multi-column pickers remain open; the backdrop submits the current values, while the system back action still cancels.
- Adapted the modal layout for landscape and tablet-sized screens.
- Made `@react-native-picker/picker` an optional peer dependency; it is required only for iOS.
- Updated Expo compatibility to support SDK 58.
- Updated the package and example documentation to include Android support.

### Deprecated

- Deprecated `actionButtonsPosition="cancel"`. Use `actionButtonsPosition="bottom"` with `showSubmitButton={false}` instead. The old value remains supported with its existing behavior for compatibility.
- Deprecated `acceptButtonText`, `acceptButtonTextStyle`, and `onAccept`; use `submitButtonText`, `submitButtonTextStyle`, and `onSubmit`.

### Fixed

- Improved search interactions: editing, clearing, and submitting a query no longer unexpectedly changes the selected item.

## [1.1.2] - 2026-09-22

### Changed (1.1.2)

- Set the minimum supported peer dependency versions to `@react-native-picker/picker >=2.4.10`, React `>=18.2.0`, React Native `>=0.72.10`, and `react-native-safe-area-context >=4.6.3`.
- Set the minimum supported Expo SDK version to 49 (`expo ~49.0.23`).

### Fixed (1.1.2)

- Improved the modal closing animation and reduced visual flickering during dismissal.

## [1.1.1] - 2026-09-22

### Added (1.1.1)

- Standardized API names with full TypeScript support and backward-compatible deprecated aliases.
- A centralized theming model built around `theme` and `customColorScheme` for clean palette configuration.
- Built-in UI text translations via the `locale` prop for 29 supported languages, including automatic device detection for Norwegian Nynorsk (`nn`) normalized to `nb`.
- Added built-in localized defaults, custom themes, flexible styling options, and a native-driver modal overlay.
- Added the `overlay` palette color for customizing the modal backdrop.
- New, clearer prop names including `actionButtonsPosition`, `enableSearch`, `horizontalPadding`, `itemStyle`, `onValueChange`, `selectedValues`, `columns`, and `theme`.
- Explicit text props (`acceptButtonText`, `cancelButtonText`, `searchPlaceholder`) now take precedence over localized defaults.
- Added optional `onSearchFocus` and `onSearchBlur` callbacks for single-column search interactions.
- Added configurable border-radius properties for the modal, search bar, search clear button, and action buttons (all defaulting to `10`).
- Added `react-native-safe-area-context` as a peer dependency for safe-area layout handling.
- Exported TypeScript types and helper definitions for the public picker API.
- Kept the selected-value highlight inactive for now; its compatibility props remain available but have no visible effect.

### Changed (1.1.1)

- Improved search reliability with case- and accent-insensitive matching and proper selection state restoration.
- Refined multi-column rendering and fixed lifecycle callback order for cancellation actions.
- Preserved backward compatibility for legacy aliases while introducing the new theming and localization API.
- Optimized package distribution with React Native-aware exports and generated CommonJS outputs.
- Updated peer dependencies to include `react-native-safe-area-context`.
- Updated documentation and reference examples for multi-column pickers and theme-aware search flows.

### Deprecated (1.1.1)

The following props still work for compatibility, but they were deprecated in `1.1.1` and will be removed in a future major version:

- `actionButtons` -> `actionButtonsPosition`
- `onValueChange1`, `onValueChange2`, `onValueChange3` -> `onValueChange`
- `onValuesChange` -> `onValueChange`
- `bgColor` -> `customColorScheme`
- `cancelButtonBgColor` -> legacy override for cancel button background; use `theme` + `customColorScheme` instead
- `actionButtonsBorderColor` -> `customColorScheme`
- `searchElementsColor` -> `customColorScheme`
- `selectionHighlightColor` -> retained for compatibility (currently inactive)
- `hPadding` -> `horizontalPadding`
- `searchBar` -> `enableSearch`

### Removed (1.1.1)

- Removed the runtime `prop-types` dependency in favor of native TypeScript definitions.

### Notes (1.1.1)

Legacy aliases from 1.0.x remain supported as deprecated compatibility shims. New projects should use the current prop names, explicit text overrides for custom localizations, and `theme` + `customColorScheme` for styling. See the [README](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/README.md) for migration details.

## [1.0.9] - 2023-11-07

### Changed (1.0.9)

- Adjustments were made to improve compatibility and performance.

### Notes (1.0.9)

- Documentation was improved.

## [1.0.8] - 2023-11-04

### Added (1.0.8)

- Added `postinstall` script to automatically install the peer dependency `@react-native-picker/picker` using `npm`, `expo`, or `yarn`, depending on the package manager the user is using to install `react-native-multicolumn-modal-picker`.

### Notes (1.0.8)

- Documentation was improved.

## [1.0.7] - 2023-10-30

### Changed (1.0.7)

- The dependency `@react-native-picker/picker` has been moved to peerDependencies to enhance the flexibility of the package, allowing compatibility with any version of `@react-native-picker/picker`. This gives users greater control over dependency versions. Additionally, if `npm v7` or higher is used, `@react-native-picker/picker` will automatically install if it is not present in the project, simplifying dependency management.

### Notes (1.0.7)

- Documentation was improved.

## [1.0.6] - 2023-10-26

### Fixed (1.0.6)

- Fixed a significant bug introduced in `1.0.5`.

## [1.0.5] - 2023-10-26

### Added (1.0.5)

- New property `actionButtons` has been added. This property controls both the visibility and the position of the “Accept” and “Cancel” action buttons. It supports several values including `"none"`, `"cancel"`, `"top"`, and `"bottom"`. For more details, please refer to the [documentation](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/README.md).
- New property `actionButtonsBorderColor` has been added. This property allows you to set the border color of the action buttons.
- `prop-types` dependency for runtime prop type validation, enhancing error detection and code quality. It also eases component implementation by providing autocomplete with a brief description of each prop and its data type.

### Changed (1.0.5)

- Improved the performance of the search bar focus and blur animations in the selector by using the native driver. This change provides a smoother animation experience.
- The property name `extraView` has been changed to `hPadding` for improved clarity and consistency in property naming.
- Property `searchPlaceholderTextColor` has been changed to `searchElementsColor`. The new property `searchElementsColor`, in addition to defining the color of the search bar placeholder, also defines the color of the clear button in the search bar.
- Performance adjustments and minor corrections.

### Removed (1.0.5)

- The `showActionButtons` and `showCancelButton` properties have been removed. The functionality of these properties has been absorbed by the new `actionButtons` property.

### Notes (1.0.5)

- The release introduces the new `actionButtons` API and updates the naming of related props for a clearer and more consistent public interface.

## [1.0.4] - 2023-10-22

### Changed (1.0.4)

- Limited package use to `iOS` only. This decision was made to prevent potential errors and dissatisfaction for developers using the package for `Android` applications. For more details see the [README](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/README.md).
- Discontinued support for versions prior to `1.0.4`. Developers are encouraged to update to the latest version. Thanks for understanding.
- Important performance adjustments and minor corrections.

### Added (1.0.4)

- Implemented the search bar in the selector. See the [current README](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/README.md) for the current search API.
- Added search and styling properties for the selector.

### Changed (1.0.4) - naming updates

- The property name `highlightSelectionColor` has been changed to `selectionHighlightColor` for improved clarity and consistency in property naming.

### Removed (1.0.4)

- Removed properties: `acceptButtonTextColor`, `allItemsColor`, `cancelButtonTextColor`, `col1ItemsColor`, `col2ItemsColor`, `col3ItemsColor`, `rightInfoSize`, `rightInfoTextColor`, `showOnTop`, `titleComponent`, `theme`.

## [1.0.3] - 2023-10-17

### Changed (1.0.3)

- Minor bug fixes were made.
- Adjustments were made to improve compatibility and performance.
- Documentation was improved.

## [1.0.2] - 2023-10-17

### Changed (1.0.2)

- Minor bug fixes were made.
- Adjustments were made to improve compatibility and performance.
- Documentation was improved.

## [1.0.1] - 2023-10-16

### Changed (1.0.1)

- Minor bug fixes were made.
- Adjustments were made to improve compatibility and performance.
- Documentation was improved.

## [1.0.0] - 2023-10-15

### Added (1.0.0)

- Creation of the package ‘react-native-multicolumn-modal-picker’, a highly customizable React Native component for the ‘iOS’ platform that allows you to configure up to 3 selection columns in the same picker.
- Inclusion of the dependency ‘@react-native-picker/picker’ which is automatically installed with my package.
- Compatibility with existing React Native projects, whether you’re using ‘Expo’ or pure ‘React Native’.

### Support

Thank you for using this package. If you find it useful, please consider giving it a [star on GitHub](https://github.com/iamRio/react-native-multicolumn-modal-picker). Your support helps motivate continued development and new features.
