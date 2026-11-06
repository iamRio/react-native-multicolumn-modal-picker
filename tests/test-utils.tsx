import { render } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MultiColumnModalPicker from "../src";
import type { MultiColumnModalPickerProps } from "../src/types";

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
};

export const pickerElement = (
  props: Partial<MultiColumnModalPickerProps> = {},
  metrics: typeof initialMetrics = initialMetrics,
) => (
  <SafeAreaProvider initialMetrics={metrics}>
    <MultiColumnModalPicker
      visible
      onClose={jest.fn()}
      columns={[[{ label: "Basic", value: "basic" }]]}
      locale="en"
      {...props}
    />
  </SafeAreaProvider>
);

export const renderPicker = (
  props: Partial<MultiColumnModalPickerProps> = {},
  metrics: typeof initialMetrics = initialMetrics,
) => render(pickerElement(props, metrics));
