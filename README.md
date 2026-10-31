# react-native-multicolumn-modal-picker

## A modal picker for React Native on Android, iOS, and Web. Features up to 3 configurable columns, optional search, theming, and localization. Easy to adapt to any design

[![npm version](https://img.shields.io/npm/v/react-native-multicolumn-modal-picker?logo=npm&logoColor=white)](https://www.npmjs.com/package/react-native-multicolumn-modal-picker)
[![downloads](https://img.shields.io/npm/dm/react-native-multicolumn-modal-picker?label=downloads)](https://www.npmjs.com/package/react-native-multicolumn-modal-picker)
[![license](https://img.shields.io/npm/l/react-native-multicolumn-modal-picker)](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/LICENSE)
[![Platforms: Android, iOS, Web](https://raw.githubusercontent.com/iamRio/react-native-multicolumn-modal-picker/main/assets/platforms-supported.svg)](https://github.com/iamRio/react-native-multicolumn-modal-picker)
[![Support on Patreon](https://img.shields.io/badge/support-Patreon-FF424D?logo=patreon&logoColor=white)](https://www.patreon.com/rio_fores)
[![Support on Ko-fi](https://img.shields.io/badge/support-Ko--fi-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/rio_fores)

[**▶ Download Fores Play for Android and try the picker (APK)**](https://github.com/iamRio/react-native-multicolumn-modal-picker/releases/download/fores-play-apk/fores-play.apk)

[**▶ Try the interactive web demo**](https://playground.getfores.com/)

The web demo is a quick way to try the picker in your browser. Its appearance and interaction can differ from the native iOS and Android experience.

<!-- markdownlint-disable MD033 -->
<img src="https://raw.githubusercontent.com/iamRio/react-native-multicolumn-modal-picker/main/assets/twoColumnSelector.gif" alt="Two-column picker" height="220" />
<!-- markdownlint-enable MD033 -->

## Features

- Configure up to three picker columns.
- Search a single-column picker by exact value or partial label match.
- Place or hide action buttons.
- Customize colors, theme styling, spacing, labels, and text styles.
- Use built-in light/dark theming or define custom color schemes with `theme` and `customColorScheme`.
- Automatic device localization for default buttons and search placeholder, with manual `locale` override support.
- Adapts the picker layout to portrait, landscape, and tablet-sized screens.
- Supports Android, iOS and Web; single-column pickers on Web can also be navigated with the keyboard arrow keys.
- Handles large option lists efficiently across Android, iOS and Web.

## Requirements

- React `>=18.2.0`
- React Native `>=0.72.10`
- `react-native-safe-area-context` `>=4.6.3`
- iOS: `@react-native-picker/picker` `>=2.4.10` (optional peer dependency; required when targeting iOS)
- Web: `react-native-web` `>=0.19.0` and `react-dom` `>=18.2.0` (optional peer dependencies; required when targeting Web)
- Android, iOS or Web

## Installation

```bash
npm install react-native-multicolumn-modal-picker
```

or:

```bash
yarn add react-native-multicolumn-modal-picker
```

### For Expo projects

The package supports Expo SDK 49 and later, including SDK 58. This applies only to Expo projects; bare React Native projects do not require Expo.

```bash
npx expo install react-native-multicolumn-modal-picker react-native-safe-area-context
```

`react-native-safe-area-context` is required on all supported platforms to keep the modal clear of device safe areas. For Expo projects targeting Web, install the optional Web peer dependencies with:

```bash
npx expo install react-dom react-native-web
```

Install the native picker separately when the app targets iOS:

```bash
npx expo install @react-native-picker/picker
```

`@react-native-picker/picker` is an optional peer dependency used for the native iOS picker columns. Android uses the package's built-in scrollable wheel and does not require this dependency.

When the modal opens, the picker slides up while the customizable backdrop fades independently.

## Picker previews

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="https://raw.githubusercontent.com/iamRio/react-native-multicolumn-modal-picker/main/assets/singleColumnSelector.gif" alt="Single-column picker" height="400" style="margin: 5px;"/>
  <img src="https://raw.githubusercontent.com/iamRio/react-native-multicolumn-modal-picker/main/assets/singleColumnSelectorSearchBar.gif" alt="Single-column picker with search" height="400" style="margin: 5px;"/>
</p>
<!-- markdownlint-enable MD033 -->

## Usage

### Plan and billing picker

```tsx
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import MultiColumnModalPicker from "react-native-multicolumn-modal-picker";

const plans = [
  { label: "Starter", value: "starter" },
  { label: "Creator", value: "creator" },
  { label: "Studio", value: "studio" },
  { label: "Enterprise", value: "enterprise" },
];

const billingCycles = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "Two years", value: "two-years" },
];

const TwoColumnsExample = () => {
  const [visible, setVisible] = useState(false);
  const [plan, setPlan] = useState("creator");
  const [billingCycle, setBillingCycle] = useState("yearly");
  const selectedPlan = plans.find((item) => item.value === plan);
  const selectedBillingCycle = billingCycles.find(
    (item) => item.value === billingCycle,
  );

  return (
    <View>
      <Pressable onPress={() => setVisible(true)}>
        <Text>Explore plans</Text>
      </Pressable>
      <Text>
        {selectedPlan?.label} / {selectedBillingCycle?.label}
      </Text>

      <MultiColumnModalPicker
        visible={visible}
        theme="night"
        actionButtonsPosition="bottom"
        title="Choose a plan"
        submitButtonText="Apply selection"
        cancelButtonText="Cancel"
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

`onClose` is called for both the submit and cancel flows. Tapping outside the picker follows the submit path, so it calls `onSubmit` (when provided) and then `onClose`; it does not call `onCancel`.

The cancel button and the modal request-close event restore the values from when the modal opened, call `onCancel` (when provided), and then call `onClose`.

### Destination search picker

Search is available when exactly one column is active. This example demonstrates a destination-selection flow.

```tsx
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import MultiColumnModalPicker from "react-native-multicolumn-modal-picker";

const destinations = [
  { label: "Copenhagen · CPH", value: "CPH", city: "Copenhagen" },
  { label: "Lisbon · LIS", value: "LIS", city: "Lisbon" },
  { label: "London · LHR", value: "LHR", city: "London" },
  { label: "Mexico City · MEX", value: "MEX", city: "Mexico City" },
  { label: "New York · JFK", value: "JFK", city: "New York" },
  { label: "Paris · CDG", value: "CDG", city: "Paris" },
  { label: "Seoul · ICN", value: "ICN", city: "Seoul" },
  { label: "Tokyo · HND", value: "HND", city: "Tokyo" },
];

const SingleColumnWithSearchExample = () => {
  const [visible, setVisible] = useState(false);
  const [destinationCode, setDestinationCode] = useState("CDG");
  const [lastAction, setLastAction] = useState<"ready" | "selected" | "kept">(
    "ready",
  );
  const [isSearching, setIsSearching] = useState(false);
  const selectedDestination = destinations.find(
    (item) => item.value === destinationCode,
  );

  return (
    <View>
      <Pressable onPress={() => setVisible(true)}>
        <Text>Search destinations</Text>
      </Pressable>
      <Text>
        Destination: {selectedDestination?.city} ({destinationCode})
      </Text>
      <Text>
        {isSearching
          ? "Searching destinations…"
          : lastAction === "ready"
            ? "Where would you like to go?"
            : lastAction === "selected"
              ? "Destination selected"
              : "Destination unchanged"}
      </Text>

      <MultiColumnModalPicker
        visible={visible}
        enableSearch
        theme="auto"
        actionButtonsPosition="bottom"
        submitButtonText="Choose destination"
        cancelButtonText="Cancel"
        columns={[destinations]}
        selectedValues={[destinationCode]}
        rightInfo={destinationCode}
        searchPlaceholder="Search by city or airport code"
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
        onSearchFocus={() => setIsSearching(true)}
        onSearchBlur={() => setIsSearching(false)}
        onSubmit={() => setLastAction("selected")}
        onCancel={() => setLastAction("kept")}
        onClose={() => setVisible(false)}
      />
    </View>
  );
};
```

## API

### Public types

The package exposes the public value, item, column, locale, theme, palette, and callback types used by `MultiColumnModalPickerProps` for editor autocomplete and static typing.

### Picker props

The defaults below reflect the actual TypeScript contract in `MultiColumnModalPickerProps`. Optional props resolve to `undefined` and the component applies runtime fallbacks from the selected theme/locale when needed.

| Category             | Prop                          | Type                                                                             | Default                    | Description                                                                                                                     |
| -------------------- | ----------------------------- | -------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Presentation**     | `visible`                     | `boolean`                                                                        | `required`                 | Controls modal visibility.                                                                                                      |
| **Columns & values** | `columns`                     | `readonly [PickerColumn, PickerColumn?, PickerColumn?]`                          | `undefined`                | Full column set passed as a tuple.                                                                                              |
|                      | `rightInfo`                   | `string`                                                                         | `undefined`                | Static text displayed to the right side of the picker columns.                                                                  |
|                      | `selectedValues`              | `readonly [PickerValue \| null, (PickerValue \| null)?, (PickerValue \| null)?]` | `undefined`                | Selected values for all columns.                                                                                                |
| **Content**          | `title`                       | `string`                                                                         | `undefined`                | Optional title shown above the picker.                                                                                          |
| **Selection**        | `onValueChange`               | `(value: PickerValue \| null, columnIndex: number, index?: number) => void`      | `undefined`                | Called when a picker value changes.                                                                                             |
| **Actions**          | `actionButtonsPosition`       | `ActionButtonsPosition`                                                          | `"none"`                   | Layout for action buttons: `"top"` inside the modal, `"bottom"` with submit inside and cancel below, or `"none"` to hide them.  |
|                      | `cancelButtonText`            | `string`                                                                         | `undefined`                | Custom text for the cancel button. If omitted, the localized default applies.                                                   |
|                      | `onCancel`                    | `() => void`                                                                     | `undefined`                | Called when the user cancels without submitting.                                                                                |
|                      | `onClose`                     | `() => void`                                                                     | `required`                 | Called when the modal closes.                                                                                                   |
|                      | `onSubmit`                    | `() => void`                                                                     | `undefined`                | Called when the user submits the current selection.                                                                             |
|                      | `showCancelButton`            | `boolean`                                                                        | `true`                     | Shows or hides the cancel button in the selected layout.                                                                        |
|                      | `showSubmitButton`            | `boolean`                                                                        | `true`                     | Shows or hides the submit button in the selected layout.                                                                        |
|                      | `submitButtonText`            | `string`                                                                         | `undefined`                | Custom text for the submit button. If omitted, the localized default applies.                                                   |
| **Search**           | `enableSearch`                | `boolean`                                                                        | `false`                    | Enables search in single-column mode.                                                                                           |
|                      | `onSearchBlur`                | `() => void`                                                                     | `undefined`                | Called when the rendered search field loses focus. Only applies with search enabled and one active column.                      |
|                      | `onSearchFocus`               | `() => void`                                                                     | `undefined`                | Called when the rendered search field receives focus. Only applies with search enabled and one active column.                   |
|                      | `searchMaxLength`             | `number \| null`                                                                 | `30`                       | Maximum number of characters in the search field. Must be a positive integer; set to `null` for no limit.                       |
|                      | `searchPlaceholder`           | `string`                                                                         | `undefined`                | Custom placeholder for the search field. If omitted, the localized default applies.                                             |
| **Behavior**         | `showColumnNavigationButtons` | `boolean \| readonly [boolean?, boolean?, boolean?]`                             | automatic                  | Controls column navigation buttons on every platform. A boolean applies to all columns; a tuple overrides columns individually. |
| **Localization**     | `locale`                      | `PickerLocale`                                                                   | device locale, then `"en"` | Localizes the built-in default texts when explicit overrides are not provided.                                                  |

`actionButtonsPosition` accepts three current values:

- `"top"` places enabled buttons inside the modal.
- `"bottom"` shows submit inside the modal and cancel below it.
- `"none"` hides both buttons.

Set `showSubmitButton` or `showCancelButton` to `false` to hide either action. To show only the cancel button below the modal, use `actionButtonsPosition="bottom"` with `showSubmitButton={false}`.

When no submit button is rendered, choosing an item in a single-column picker submits the selection and closes the modal automatically. With multiple columns, the picker stays open so the user can finish changing values; tapping the backdrop submits the current selection, while the device back action cancels and restores the values from when the modal opened. These close behaviors also apply when the corresponding action button is hidden.

By default, column navigation buttons are shown only on non-touch Web devices. On Web, touch and hybrid detection checks the `pointer`, `hover`, `any-pointer`, and `any-hover` media features; they remain hidden by default on native platforms. Set `showColumnNavigationButtons={true}` to show buttons on every column on any platform, `false` to hide them, or pass a tuple such as `showColumnNavigationButtons={[true, false]}` to control columns independently. Unspecified tuple slots retain automatic detection.

### Styling props

| Category                | Prop                             | Type                                              | Default                        | Purpose                                                                                |
| ----------------------- | -------------------------------- | ------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| **Theme & palette**     | `customColorScheme`              | `Partial<Record<string, Partial<PickerPalette>>>` | `undefined`                    | Overrides colors for built-in or named themes.                                         |
|                         | `theme`                          | `PickerThemeName`                                 | device theme                   | Selects the base palette; omitted means use the active system theme.                   |
| **Container & layout**  | `horizontalPadding`              | `number`                                          | `undefined`                    | Horizontal padding around the picker content.                                          |
|                         | `modalBorderRadius`              | `number`                                          | `10`                           | Border radius of the modal container.                                                  |
|                         | `titleStyle`                     | `StyleProp<TextStyle>`                            | default title style            | Style for the title text.                                                              |
| **Columns & selection** | `itemStyle`                      | `StyleProp<TextStyle>`                            | default item style             | Style applied to picker item labels.                                                   |
|                         | `rightInfoTextStyle`             | `StyleProp<TextStyle>`                            | default right-info style       | Style for the right-side info text.                                                    |
|                         | `selectionHighlightBorderRadius` | `number`                                          | `10`                           | Corner radius of the selected-row highlight on Android.                                |
| **Action buttons**      | `actionButtonsBorderRadius`      | `number`                                          | `10`                           | Border radius for buttons outside the modal; integrated buttons keep the modal radius. |
|                         | `cancelButtonContainerStyle`     | `StyleProp<ViewStyle>`                            | default button container style | Style for the cancel button container.                                                 |
|                         | `cancelButtonTextStyle`          | `StyleProp<TextStyle>`                            | default button text style      | Style for the cancel button label.                                                     |
|                         | `submitButtonContainerStyle`     | `StyleProp<ViewStyle>`                            | default button container style | Style for the submit button container.                                                 |
|                         | `submitButtonTextStyle`          | `StyleProp<TextStyle>`                            | default button text style      | Style for the submit button label.                                                     |
| **Search field**        | `searchBarBorderRadius`          | `number`                                          | `10`                           | Border radius of the search bar.                                                       |
|                         | `searchBoxStyle`                 | `StyleProp<ViewStyle>`                            | default search box style       | Style applied to the search input container.                                           |
|                         | `searchClearButtonBorderRadius`  | `number`                                          | `10`                           | Border radius of the search clear button.                                              |
|                         | `searchTextStyle`                | `StyleProp<TextStyle>`                            | default search text style      | Style for the search input text.                                                       |

All custom color styling should go through `customColorScheme`. Individual color props were removed from the recommended API because they duplicate the same responsibility and make the theme model harder to reason about.

The Android wheel shows a selected-row highlight. Set `selectionHighlight` in `customColorScheme` and use `selectionHighlightBorderRadius` to style it. On iOS, the native picker controls its own selection appearance.

### Deprecated aliases

The following props are still supported for compatibility and should be replaced in new code. They remain available to avoid breaking existing integrations and are expected to be removed in a future major version.

| Deprecated prop/value            | Deprecated since | Replace with                                                  | Notes                                                                        |
| -------------------------------- | ---------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `acceptButtonText`               | `1.2.0`          | `submitButtonText`                                            | Kept for backward compatibility.                                             |
| `acceptButtonTextStyle`          | `1.2.0`          | `submitButtonTextStyle`                                       | Kept for backward compatibility.                                             |
| `actionButtons`                  | `1.1.1`          | `actionButtonsPosition`                                       | Kept for backward compatibility.                                             |
| `actionButtonsBorderColor`       | `1.1.0`          | `customColorScheme`                                           | Legacy color alias; prefer the palette override model.                       |
| `actionButtonsPosition="cancel"` | `1.2.0`          | `actionButtonsPosition="bottom"` + `showSubmitButton={false}` | Kept for backward compatibility; shows only cancel unless submit is enabled. |
| `bgColor`                        | `1.1.0`          | `customColorScheme`                                           | Legacy color alias; prefer the palette override model.                       |
| `cancelButtonBgColor`            | `1.1.0`          | `customColorScheme`                                           | Legacy color alias; prefer the palette override model.                       |
| `hPadding`                       | `1.1.0`          | `horizontalPadding`                                           | Kept for backward compatibility.                                             |
| `onAccept`                       | `1.2.0`          | `onSubmit`                                                    | Kept for backward compatibility.                                             |
| `onValueChange1`                 | `1.1.1`          | `onValueChange`                                               | Kept for backward compatibility.                                             |
| `onValueChange2`                 | `1.1.1`          | `onValueChange`                                               | Kept for backward compatibility.                                             |
| `onValueChange3`                 | `1.1.1`          | `onValueChange`                                               | Kept for backward compatibility.                                             |
| `onValuesChange`                 | `1.1.1`          | `onValueChange`                                               | Kept for backward compatibility.                                             |
| `pickerItemTextStyle`            | Not specified    | `itemStyle`                                                   | Deprecated alias for item label styling; use `itemStyle` in new code.        |
| `searchBar`                      | `1.1.0`          | `enableSearch`                                                | Kept for backward compatibility.                                             |
| `searchElementsColor`            | `1.1.0`          | `customColorScheme`                                           | Legacy color alias; prefer the palette override model.                       |
| `selectionHighlightColor`        | `1.1.0`          | `customColorScheme`                                           | Legacy color override for the Android selected-row highlight.                |

The deprecated button text and style props remain supported when their `submit` equivalents are omitted. If both versions of a text or style prop are provided, the `submit` prop takes precedence. If both `onAccept` and `onSubmit` are provided, only `onSubmit` is called.

### Search behavior

Search is optional and appears when search is enabled and exactly one non-empty column is active. Matching ignores case and accents: an exact match against an item's `value` is preferred, otherwise a partial match against its `label` is selected. If the query has no match, the latest matching selection is kept. Clearing the query also keeps the current selection, and the clear button can be used without dismissing the keyboard.

The search field allows up to 30 characters by default. Set `searchMaxLength` to a positive integer to choose another limit, or to `null` to allow queries of any length. Other values, including zero, negative numbers, and decimals, are rejected.

`onSearchFocus` and `onSearchBlur` run when the search field receives or loses focus, but only when the search bar is actually rendered. If either callback is defined without an active single-column search bar, it has no effect.

All configurable border-radius props default to `10`. `actionButtonsBorderRadius` applies only to action buttons rendered outside the modal, such as the separate cancel action. Buttons integrated into the modal remain clipped and shaped by `modalBorderRadius`, so changing the radius does not break the attached layout.

### Localization

`locale` only provides the fallback translations for the built-in default texts: the submit button text, the cancel button text, and the search placeholder. If you pass `submitButtonText`, `cancelButtonText`, or `searchPlaceholder` explicitly, those values take precedence and the locale no longer changes them.

#### In other words, the precedence is

1. explicit `submitButtonText` / `cancelButtonText` / `searchPlaceholder`
2. fallback translations from the selected `locale`
3. package defaults

#### Available built-in languages

<!-- markdownlint-disable MD033 -->
<table>
  <tbody>
    <tr>
      <td>Arabic (`ar`)<br />Chinese (`zh`)<br />Czech (`cs`)<br />Danish (`da`)<br />Dutch (`nl`)<br />English (`en`)</td>
      <td>Finnish (`fi`)<br />French (`fr`)<br />German (`de`)<br />Greek (`el`)<br />Hebrew (`he`)<br />Hindi (`hi`)</td>
      <td>Hungarian (`hu`)<br />Indonesian (`id`)<br />Italian (`it`)<br />Japanese (`ja`)<br />Korean (`ko`)<br />Norwegian (`nb`)</td>
      <td>Norwegian Nynorsk (`nn`)<br />Polish (`pl`)<br />Portuguese (`pt`)<br />Romanian (`ro`)<br />Russian (`ru`)<br />Slovak (`sk`)</td>
      <td>Spanish (`es`)<br />Swedish (`sv`)<br />Thai (`th`)<br />Turkish (`tr`)<br />Ukrainian (`uk`)<br />Vietnamese (`vi`)</td>
    </tr>
  </tbody>
</table>
<!-- markdownlint-enable MD033 -->

Norwegian Nynorsk (`nn`) is detected automatically and uses the Norwegian (`nb`) translation. To select Norwegian explicitly with `locale`, use `nb`.

The built-in locales are defaults, not a limitation. If your app already uses another language or an i18n library, pass its translated values directly through `submitButtonText`, `cancelButtonText`, and `searchPlaceholder`. To override automatic locale selection, set `locale="es"` on the picker.

### Theme and custom color schemes

`theme` selects the palette mode. If omitted, the picker follows the device's light or dark setting; `"auto"` does the same explicitly. Each entry in `customColorScheme` can include only the colors you want to change—neither every theme nor every color is required. Colors you omit keep their built-in values for the active mode.

Use the `light` and `dark` entries to customize either mode independently. You can also select a custom theme name other than the built-in `"light"`, `"dark"`, and `"auto"` values—for example, `"brand"`—with `theme`; its colors are applied on top of the active light or dark palette. This lets you share brand colors across modes while retaining separate mode-specific adjustments. If the named theme and the active mode both define the same color, the named theme's value is used.

For example, the following configuration changes two colors in light mode, five in dark mode, and three additional colors for the selected `"brand"` theme. Any other colors continue to use their built-in values:

```tsx
<MultiColumnModalPicker
  visible={visible}
  theme="brand"
  customColorScheme={{
    light: {
      modalBackground: "#FFFFFF",
      border: "#D7DEE8",
    },
    dark: {
      modalBackground: "#151B26",
      border: "#354154",
      buttonText: "#E6EDF7",
      inputText: "#E6EDF7",
      searchBackground: "#202A39",
    },
    brand: {
      buttonText: "#3157A4",
      columnNavigationButtons: "#3157A4",
      selectionHighlight: "#DCE7FF",
    },
  }}
  columns={[countries]}
  selectedValues={[countryCode]}
  onClose={() => setVisible(false)}
/>
```

When the device uses light mode, the picker uses the light palette and applies the two `light` overrides, followed by the three `brand` overrides. In dark mode, it applies the five `dark` overrides and then the `brand` overrides. The named theme only applies when selected with `theme`; without it, only the matching `light` or `dark` entry is used. Use any color keys from the exported `PickerPalette` type.

## What's new in 1.2.0

- Android support with a scrollable picker wheel; iOS continues to use the native picker.
- Layout adapts to landscape and tablet-sized screens.
- Custom color schemes can override any subset of colors independently for light mode, dark mode, and named themes.
- Search, themes, and localized default labels remain available on both platforms.

For the complete version history, see [CHANGELOG.md](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/CHANGELOG.md).

## Feedback

Please open an [issue](https://github.com/iamRio/react-native-multicolumn-modal-picker/issues) or join the [discussion](https://github.com/iamRio/react-native-multicolumn-modal-picker/discussions/1).

If this package is useful, consider giving it a [star on GitHub](https://github.com/iamRio/react-native-multicolumn-modal-picker).

## Author

**Marcos Del Río** · [marcosdelrio.dev@gmail.com](mailto:marcosdelrio.dev@gmail.com)

## License

MIT. See [LICENSE](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/LICENSE)

## Support

If you find `react-native-multicolumn-modal-picker` useful, consider supporting its development:

- Become a sponsor on [Patreon](https://www.patreon.com/rio_fores)
- Support the project on [Ko-fi](https://ko-fi.com/rio_fores)

### Hall of Fame & Backer Credits 🏆

_Backers at US$10/month or more will be recognized here with their chosen name and link._
_(Special thanks to our early supporters)._
