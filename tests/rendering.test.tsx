import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { renderPicker } from "./test-utils";

describe("React Native component rendering", () => {
  it("renders accessible text", async () => {
    await render(<Text>Ready</Text>);

    expect(screen.getByText("Ready")).toBeTruthy();
  });

  it("renders the public picker API with localized action controls", async () => {
    await renderPicker({
      actionButtonsPosition: "top",
      title: "Choose a plan",
      locale: "en",
    });

    expect(screen.getByText("Choose a plan")).toBeTruthy();
    expect(screen.getAllByLabelText("Accept")[1]).toBeTruthy();
    expect(screen.getByLabelText("Cancel")).toBeTruthy();
    expect(screen.getByLabelText("Column 1")).toBeTruthy();
  });
});
