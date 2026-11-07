import { fireEvent, render } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { TestInstance } from "test-renderer";
import MultiColumnModalPicker from "../src";
import type { MultiColumnModalPickerProps } from "../src/types";

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
};

export const getModalInstances = (root: TestInstance | null) =>
  root?.queryAll((instance) => instance.type === "Modal", {
    includeSelf: true,
  }) ?? [];

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
) =>
  render(pickerElement(props, metrics)).then(async (result) => {
    const showOverlayModal = async () => {
      const overlayModal = getModalInstances(result.root)[0];
      if (overlayModal) await fireEvent(overlayModal, "show");
    };

    if (props.visible !== false) await showOverlayModal();

    return {
      ...result,
      rerender: async (element: Parameters<typeof result.rerender>[0]) => {
        await result.rerender(element);
        await showOverlayModal();
      },
    };
  });
