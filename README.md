# react-native-multicolumn-modal-picker

[![npm](https://img.shields.io/npm/v/react-native-multicolumn-modal-picker?label=npm%20version)](https://www.npmjs.com/package/react-native-multicolumn-modal-picker)
[![monthly downloads](https://img.shields.io/npm/dm/react-native-multicolumn-modal-picker?label=monthly%20downloads)](https://www.npmjs.com/package/react-native-multicolumn-modal-picker)
[![platform](https://img.shields.io/badge/platform-iOS-lightgrey)](https://github.com/iamRio/react-native-multicolumn-modal-picker)
[![license](https://img.shields.io/npm/l/react-native-multicolumn-modal-picker)](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/LICENSE)

A flexible React Native modal picker with up to three configurable columns, optional single-column search, custom themes, and localized default text.

<!-- markdownlint-disable MD033 -->
<img src="https://raw.githubusercontent.com/iamRio/react-native-multicolumn-modal-picker/main/assets/twoColumnSelector.gif" alt="Two-column picker" height="220" />

## Features

- Configure up to three picker columns.
- Search a single-column picker by label or value.
- Place or hide action buttons.
- Customize colors, theme styling, spacing, labels, and text styles.
- Use built-in light/dark theming or define custom color schemes with `theme` and `customColorScheme`.
- Automatic device localization for default buttons and search placeholder, with manual `locale` override support.

## Requirements

- React `>=18.2.0`
- React Native `>=0.72.10`
- `@react-native-picker/picker` `>=2.4.10`
- `react-native-safe-area-context` `>=4.6.3`
- iOS (Android support in development)

## Installation

```bash
npm install react-native-multicolumn-modal-picker
```

or:

```bash
yarn add react-native-multicolumn-modal-picker
```

### For Expo projects

The package supports Expo SDK 49 and later. This applies only to Expo projects; bare React Native projects do not require Expo.

```bash
npx expo install react-native-multicolumn-modal-picker @react-native-picker/picker react-native-safe-area-context
```

The picker and safe-area packages are peer dependencies, so install them in the consuming app. `react-native-safe-area-context` is used to keep the modal clear of device safe areas, while `@react-native-picker/picker` provides the native picker columns.

When the modal opens, the picker slides up while the customizable backdrop fades independently.

## Example App

Try the package in the included example app:

[Open example app](https://github.com/iamRio/react-native-multicolumn-modal-picker/tree/main/example-app)

## Demo

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="https://raw.githubusercontent.com/iamRio/react-native-multicolumn-modal-picker/main/assets/singleColumnSelector.gif" alt="Single-column picker" height="400" style="margin: 5px;"/>
  <img src="https://raw.githubusercontent.com/iamRio/react-native-multicolumn-modal-picker/main/assets/singleColumnSelectorSearchBar.gif" alt="Single-column picker with search" height="400" style="margin: 5px;"/>
</p>

## Usage

### Plan and billing picker

For a fully styled implementation, check out [`MultiColumnsExample`](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/example-app/components/multi-columns-example.tsx) in the [example app](https://github.com/iamRio/react-native-multicolumn-modal-picker/tree/main/example-app).

```tsx
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import MultiColumnModalPicker from "react-native-multicolumn-modal-picker";

const plans = [
  { label: "Starter", value: "starter" },
  { label: "Creator", value: "creator" },
  { label: "Studio", value: "studio" },
  { label: "Team", value: "team" },
  { label: "Business", value: "business" },
];

const billingCycles = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const PlanPickerExample = () => {
  const [visible, setVisible] = useState(false);
  const [plan, setPlan] = useState("creator");
  const [billingCycle, setBillingCycle] = useState("yearly");

  return (
    <View>
      <Pressable onPress={() => setVisible(true)}>
        <Text>Choose plan</Text>
      </Pressable>
      <Text>
        {plan} / {billingCycle}
      </Text>

      <MultiColumnModalPicker
        visible={visible}
        theme="night"
        actionButtonsPosition="bottom"
        acceptButtonText="Apply plan"
        cancelButtonText="Keep current"
        columns={[plans, billingCycles]}
        selectedValues={[plan, billingCycle]}
        itemStyle={{ color: "#F5F8FC", fontSize: 18 }}
        horizontalPadding={0}
        customColorScheme={{
          night: {
            modalBackground: "#101A2A",
            overlay: "rgba(5, 12, 24, 0.72)",
            buttonText: "#79E2C0",
            pickerItemText: "#F5F8FC",
            cancelText: "#FF9E9E",
          },
        }}
        onValueChange={(value, columnIndex) => {
          if (typeof value !== "string") return;
          if (columnIndex === 0) setPlan(value);
          if (columnIndex === 1) setBillingCycle(value);
        }}
        onClose={() => setVisible(false)}
      />
    </View>
  );
};
```

`onClose` is called for both the accept and cancel flows. Tapping outside the picker follows the accept path, so it calls `onAccept` (when provided) and then `onClose`; it does not call `onCancel`.

The cancel button and the modal request-close event restore the values from when the modal opened, call `onCancel` (when provided), and then call `onClose`.

### Destination search picker

For a fully styled implementation, check out [`SingleColumnWithSearchExample`](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/example-app/components/single-column-with-search-example.tsx) in the [example app](https://github.com/iamRio/react-native-multicolumn-modal-picker/tree/main/example-app).

Search is available when exactly one column is active. This example keeps the picker synchronized with the device appearance by using `theme="auto"`.

```tsx
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import MultiColumnModalPicker from "react-native-multicolumn-modal-picker";

const destinations = [
  { label: "Barcelona · BCN", value: "BCN" },
  { label: "Copenhagen · CPH", value: "CPH" },
  { label: "Lisbon · LIS", value: "LIS" },
  { label: "London · LHR", value: "LHR" },
  { label: "New York · JFK", value: "JFK" },
  { label: "Paris · CDG", value: "CDG" },
  { label: "Tokyo · HND", value: "HND" },
];

const DestinationSearchExample = () => {
  const [visible, setVisible] = useState(false);
  const [destinationCode, setDestinationCode] = useState("CDG");

  return (
    <View>
      <Pressable onPress={() => setVisible(true)}>
        <Text>Find a destination</Text>
      </Pressable>
      <Text>Destination: {destinationCode}</Text>

      <MultiColumnModalPicker
        visible={visible}
        enableSearch
        theme="auto"
        actionButtonsPosition="bottom"
        acceptButtonText="Use destination"
        cancelButtonText="Back to itinerary"
        columns={[destinations]}
        selectedValues={[destinationCode]}
        rightInfo={destinationCode}
        searchPlaceholder="Search city or airport code"
        searchBarBorderRadius={18}
        searchClearButtonBorderRadius={16}
        actionButtonsBorderRadius={20}
        searchBoxStyle={{
          width: "92%",
          minHeight: 52,
          borderColor: "rgba(128, 128, 128, 0.28)",
          borderWidth: 1,
        }}
        horizontalPadding={0}
        onValueChange={(value) => {
          if (typeof value === "string") setDestinationCode(value);
        }}
        onClose={() => setVisible(false)}
      />
    </View>
  );
};
```

## API

### Public types

The package exposes the public value, item, column, locale, theme, palette, and callback types used by `MultiColumnModalPickerProps` for editor autocomplete and static typing.

### New API surface

The defaults below reflect the actual TypeScript contract in `MultiColumnModalPickerProps`. Optional props resolve to `undefined` and the component applies runtime fallbacks from the selected theme/locale when needed.

| Prop                             | Type                                                                             | Default                             | Description                                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `visible`                        | `boolean`                                                                        | `required`                          | Controls modal visibility.                                                                                    |
| `columns`                        | `readonly [PickerColumn, PickerColumn?, PickerColumn?]`                          | `undefined`                         | Full column set passed as a tuple.                                                                            |
| `selectedValues`                 | `readonly [PickerValue \| null, (PickerValue \| null)?, (PickerValue \| null)?]` | `undefined`                         | Selected values for all columns.                                                                              |
| `onValueChange`                  | `(value: PickerValue \| null, columnIndex: number, index?: number) => void`      | `undefined`                         | Called when a picker value changes.                                                                           |
| `actionButtonsPosition`          | `ActionButtonsPosition`                                                          | `"none"`                            | Position of the action buttons row.                                                                           |
| `onAccept`                       | `() => void`                                                                     | `undefined`                         | Called when the user confirms the current selection.                                                          |
| `onCancel`                       | `() => void`                                                                     | `undefined`                         | Called when the user cancels without accepting.                                                               |
| `onClose`                        | `() => void`                                                                     | `required`                          | Called when the modal closes.                                                                                 |
| `acceptButtonText`               | `string`                                                                         | `undefined`                         | Custom text for the accept button. If omitted, the localized default applies.                                 |
| `cancelButtonText`               | `string`                                                                         | `undefined`                         | Custom text for the cancel button. If omitted, the localized default applies.                                 |
| `title`                          | `string`                                                                         | `undefined`                         | Optional title shown above the picker.                                                                        |
| `rightInfo`                      | `string`                                                                         | `undefined`                         | Static text shown to the right side of the picker columns.                                                    |
| `enableSearch`                   | `boolean`                                                                        | `false`                             | Enables search in single-column mode.                                                                         |
| `onSearchFocus`                  | `() => void`                                                                     | `undefined`                         | Called when the rendered search field receives focus. Only applies with search enabled and one active column. |
| `onSearchBlur`                   | `() => void`                                                                     | `undefined`                         | Called when the rendered search field loses focus. Only applies with search enabled and one active column.    |
| `searchPlaceholder`              | `string`                                                                         | `undefined`                         | Custom placeholder for the search field. If omitted, the localized default applies.                           |
| `horizontalPadding`              | `number`                                                                         | `undefined`                         | Horizontal padding applied around the picker content.                                                         |
| `modalBorderRadius`              | `number`                                                                         | `10`                                | Border radius applied to the modal container.                                                                 |
| `selectionHighlightBorderRadius` | `number`                                                                         | `10`                                | Reserved for the selected-item highlight when that visual is enabled. Currently has no visible effect.        |
| `searchBarBorderRadius`          | `number`                                                                         | `10`                                | Border radius applied to the search bar.                                                                      |
| `searchClearButtonBorderRadius`  | `number`                                                                         | `10`                                | Border radius applied to the search clear button.                                                             |
| `actionButtonsBorderRadius`      | `number`                                                                         | `10`                                | Border radius for action buttons rendered outside the modal. Integrated buttons keep the modal radius.        |
| `theme`                          | `PickerThemeName`                                                                | `undefined` (device theme fallback) | Theme key used to select the base palette. Omitted means use the active system theme.                         |
| `customColorScheme`              | `Partial<Record<string, Partial<PickerPalette>>>`                                | `undefined`                         | Final color overrides applied on top of the selected base theme.                                              |
| `locale`                         | `PickerLocale`                                                                   | device locale, then `"en"`          | Localizes the built-in default texts when explicit overrides are not provided.                                |

### Styling props

| Prop                    | Type                   | Description                                  |
| ----------------------- | ---------------------- | -------------------------------------------- |
| `titleStyle`            | `StyleProp<TextStyle>` | Style for the title text.                    |
| `itemStyle`             | `StyleProp<TextStyle>` | Style applied to picker item labels.         |
| `rightInfoTextStyle`    | `StyleProp<TextStyle>` | Style for the right-side info text.          |
| `acceptButtonTextStyle` | `StyleProp<TextStyle>` | Accept button label style.                   |
| `cancelButtonTextStyle` | `StyleProp<TextStyle>` | Cancel button label style.                   |
| `searchBoxStyle`        | `StyleProp<ViewStyle>` | Style applied to the search input container. |
| `searchTextStyle`       | `StyleProp<TextStyle>` | Style for the search input text.             |
| `pickerItemTextStyle`   | `StyleProp<TextStyle>` | Compatibility alias for `itemStyle`.         |

> All custom color styling should go through `customColorScheme`. Individual color props were removed from the recommended API because they duplicate the same responsibility and make the theme model harder to reason about.

The selected-value highlight is currently disabled. `selectionHighlight` and `selectionHighlightBorderRadius` remain part of the compatibility surface, but they do not change the current appearance.

### Deprecated aliases

The following props are still supported for compatibility, but they are deprecated as of version 1.1.1 and should be replaced in new code. They remain available only to avoid breaking existing integrations, and they are expected to be removed in a future major version.

| Deprecated prop            | Deprecated since | Replace with            | Notes                                                             |
| -------------------------- | ---------------- | ----------------------- | ----------------------------------------------------------------- |
| `actionButtons`            | `1.1.1`          | `actionButtonsPosition` | Kept for backward compatibility.                                  |
| `bgColor`                  | `1.1.1`          | `customColorScheme`     | Legacy color alias; prefer the palette override model.            |
| `cancelButtonBgColor`      | `1.1.1`          | `customColorScheme`     | Legacy color alias; prefer the palette override model.            |
| `actionButtonsBorderColor` | `1.1.1`          | `customColorScheme`     | Legacy color alias; prefer the palette override model.            |
| `hPadding`                 | `1.1.1`          | `horizontalPadding`     | Kept for backward compatibility.                                  |
| `onValueChange1`           | `1.1.1`          | `onValueChange`         | Kept for backward compatibility.                                  |
| `onValueChange2`           | `1.1.1`          | `onValueChange`         | Kept for backward compatibility.                                  |
| `onValueChange3`           | `1.1.1`          | `onValueChange`         | Kept for backward compatibility.                                  |
| `onValuesChange`           | `1.1.1`          | `onValueChange`         | Kept for backward compatibility.                                  |
| `searchBar`                | `1.1.1`          | `enableSearch`          | Kept for backward compatibility.                                  |
| `searchElementsColor`      | `1.1.1`          | `customColorScheme`     | Legacy color alias; prefer the palette override model.            |
| `selectionHighlightColor`  | `1.1.1`          | `customColorScheme`     | Legacy alias; the selected-value highlight is currently disabled. |

### Search behavior

Search is optional and only applies when a single non-empty column is active. Matching ignores case and accents in both labels and values. An exact value match is preferred; otherwise the first label-ranked match is selected. Clearing the field or finding no match restores the value that was selected when that search query began. `onSearchFocus` and `onSearchBlur` run when the search field receives or loses focus, but only when the search bar is actually rendered. If either callback is defined without an active single-column search bar, it has no effect.

All configurable border-radius props default to `10`. `actionButtonsBorderRadius` applies only to action buttons rendered outside the modal, such as the separate cancel action. Buttons integrated into the modal remain clipped and shaped by `modalBorderRadius`, so changing the radius does not break the attached layout.

### Localization

`locale` only provides the fallback translations for the built-in default texts: the accept button text, the cancel button text, and the search placeholder. If you pass `acceptButtonText`, `cancelButtonText`, or `searchPlaceholder` explicitly, those values take precedence and the locale no longer changes them.

In other words, the precedence is:

1. explicit `acceptButtonText` / `cancelButtonText` / `searchPlaceholder`
2. fallback translations from the selected `locale`
3. package defaults

Supported locales in the current public API:

- English (`en`)
- Español (`es`)
- Français (`fr`)
- Deutsch (`de`)
- Italiano (`it`)
- Português (`pt`)
- Русский (`ru`)
- 日本語 (`ja`)
- 한국어 (`ko`)
- 中文 (`zh`)
- Arabic (`ar`)
- हिन्दी (`hi`)
- Türkçe (`tr`)
- Nederlands (`nl`)
- Polski (`pl`)
- Svenska (`sv`)
- Norsk (`nb`)
- Dansk (`da`)
- Suomi (`fi`)
- Čeština (`cs`)
- Ελληνικά (`el`)
- Bahasa Indonesia (`id`)
- ไทย (`th`)
- Українська (`uk`)
- Hebrew (`he`)
- Română (`ro`)
- Magyar (`hu`)
- Slovenčina (`sk`)
- Tiếng Việt (`vi`)

The device locale `nn` (Norwegian Nynorsk) is detected and normalized to the
`nb` translation. It is not a separate manual `locale` value.

The built-in locales are defaults, not a limitation. If your app already uses another language or an i18n library, pass its translated values directly through `acceptButtonText`, `cancelButtonText`, and `searchPlaceholder`.

```tsx
<MultiColumnModalPicker locale="es" {...props} />
```

### Theme and custom color schemes

`theme` selects the base palette. `customColorScheme` is the final override layer: you provide only the colors you want to replace, and any omitted values fall back to the selected base theme. The `PickerPalette.overlay` color controls the animated backdrop displayed behind the modal. The selected-value highlight is currently disabled, so `selectionHighlight` is intentionally omitted from new schemes.

```tsx
<MultiColumnModalPicker
  visible={visible}
  theme="midnight"
  customColorScheme={{
    light: {
      modalBackground: "#F5F5F5",
      overlay: "rgba(0, 0, 0, 0.42)",
      border: "#D8D8D8",
    },
    dark: {
      modalBackground: "#1E1E1E",
      overlay: "rgba(0, 0, 0, 0.58)",
      border: "#3A3A3A",
    },
    midnight: {
      modalBackground: "#111827",
      overlay: "rgba(0, 0, 0, 0.72)",
      border: "#374151",
      buttonText: "#F9FAFB",
    },
  }}
  columns={[countries]}
  selectedValues={[countryCode]}
  onClose={() => setVisible(false)}
/>
```

Partial overrides are supported, and a custom scheme name is only active when `theme` is set to that same name. You can use any theme name from your app and override only the colors you need; omitted colors fall back to the selected base theme.

### TypeScript support

The package exports `MultiColumnModalPickerProps`, `PickerLocale`, `PickerValue`, `PickerItem`, `PickerColumn`, `ActionButtonsPosition`, `PickerThemeMode`, `PickerPalette`, `PickerThemeName`, and the callback helper types for editor autocomplete and validation.

## What's new in 1.1.1

- More flexible picker configuration with clearer controls for columns, actions, search, styling, and themes.
- New light, dark, and custom theme options with an animated, customizable modal backdrop.
- Built-in localized defaults for 29 languages, plus support for any additional language through your app's own translations.
- More reliable search and selection behavior, including accent-insensitive matching.
- Updated examples and documentation showing practical multi-column and searchable picker flows.

For the complete version history, see [CHANGELOG.md](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/CHANGELOG.md).

## Feedback

Please open an [issue](https://github.com/iamRio/react-native-multicolumn-modal-picker/issues) or join the [discussion](https://github.com/iamRio/react-native-multicolumn-modal-picker/discussions/1).

If this package is useful, consider giving it a [star on GitHub](https://github.com/iamRio/react-native-multicolumn-modal-picker).

## Author

_**Río**_ · [marcosdelrio.dev@gmail.com](mailto:marcosdelrio.dev@gmail.com)

## License

MIT. See [LICENSE](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/LICENSE)
