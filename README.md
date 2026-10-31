# react-native-multicolumn-modal-picker

## A modal picker for React Native on Android, iOS, and Web. Features up to 3 configurable columns, optional search, theming, and localization. Easy to adapt to any design

[![npm version](https://img.shields.io/npm/v/react-native-multicolumn-modal-picker?logo=npm&logoColor=white)](https://www.npmjs.com/package/react-native-multicolumn-modal-picker)
[![downloads](https://img.shields.io/npm/dm/react-native-multicolumn-modal-picker?label=downloads)](https://www.npmjs.com/package/react-native-multicolumn-modal-picker)
[![license](https://img.shields.io/npm/l/react-native-multicolumn-modal-picker?color=green)](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/LICENSE)
[![Platforms: Android, iOS, Web](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Web-8B5CF6)](https://github.com/iamRio/react-native-multicolumn-modal-picker)
[![Support on Patreon](https://img.shields.io/badge/support-Patreon-FF424D?logo=patreon&logoColor=white)](https://www.patreon.com/rio_fores)
[![Support on Ko-fi](https://img.shields.io/badge/support-Ko--fi-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/rio_fores)

[**▶ Download Fores Play for Android and try the picker (APK)**](https://github.com/iamRio/react-native-multicolumn-modal-picker/releases/download/fores-play-apk/fores-play.apk)

[**▶ Try the interactive web demo**](https://playground.getfores.com/)

The web demo is a quick way to try the picker in your browser. Its appearance and interaction can differ from the native iOS and Android experience.

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="https://raw.githubusercontent.com/iamRio/react-native-multicolumn-modal-picker/main/assets/features-overview.svg" alt="The eight picker features beside an Android phone showing a coffee app and a three-column latte customization picker." width="100%" />
</p>
<!-- markdownlint-enable MD033 -->

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

TypeScript types are available for picker props, values, columns, locales, themes, palettes, and callbacks.

### Picker props

The table summarizes the available props, types, and defaults.

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

By default, column navigation buttons are shown only on non-touch Web devices and hidden on native platforms. Set `showColumnNavigationButtons` to `true` or `false` to show or hide them on every platform, or pass a tuple such as `[true, false]` to control columns independently. Unspecified tuple slots use the default behavior.

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

Use `customColorScheme` to customize picker colors.

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

`locale` selects the built-in button labels and search placeholder. Explicit `submitButtonText`, `cancelButtonText`, or `searchPlaceholder` values take precedence.

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

`theme` selects the palette mode. If omitted, the picker follows the device's light or dark setting; `"auto"` does the same explicitly. In `customColorScheme`, include only the colors you want to change; other colors keep their built-in values.

Use the `light` and `dark` entries to customize each mode independently. To share brand colors across modes, define a named theme (for example, `"brand"`) and select it with `theme`. Named theme colors override matching colors in the active light or dark palette.

See the [changelog](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/CHANGELOG.md) for release notes and version history.

## Feedback

Please open an [issue](https://github.com/iamRio/react-native-multicolumn-modal-picker/issues) or join the [discussion](https://github.com/iamRio/react-native-multicolumn-modal-picker/discussions/1).

## Author

**Marcos Del Río** · [marcosdelrio.dev@gmail.com](mailto:marcosdelrio.dev@gmail.com)

## License

MIT. See [LICENSE](https://github.com/iamRio/react-native-multicolumn-modal-picker/blob/main/LICENSE)

## Support

If you find this package useful:

- ⭐ [Star it on GitHub](https://github.com/iamRio/react-native-multicolumn-modal-picker)
- ❤️ [Support development on Patreon](https://www.patreon.com/rio_fores)
- ☕ [Support development on Ko-fi](https://ko-fi.com/rio_fores)

### Hall of Fame & Backer Credits 🏆

_Backers at US$10/month or more will be recognized here with their chosen name and link._
_(Special thanks to our early supporters)._
