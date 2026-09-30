import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type AndroidPickerNoticeProps = {
  visible: boolean;
  onClose: () => void;
  tone: "night" | "travel";
};

const AndroidPickerNotice = ({
  visible,
  onClose,
  tone,
}: AndroidPickerNoticeProps) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    statusBarTranslucent
    onRequestClose={onClose}
  >
    <View style={styles.overlay}>
      <Pressable
        accessibilityLabel="Dismiss notice"
        style={StyleSheet.absoluteFill}
        onPress={onClose}
      />
      <View
        style={[
          styles.dialog,
          tone === "night" ? styles.nightDialog : styles.travelDialog,
        ]}
      >
        <View
          style={[
            styles.accent,
            tone === "night" ? styles.nightAccent : styles.travelAccent,
          ]}
        />
        <Text
          style={[
            styles.title,
            tone === "night" ? styles.nightTitle : styles.travelTitle,
          ]}
        >
          Android support in progress
        </Text>
        <Text
          style={[
            styles.message,
            tone === "night" ? styles.nightMessage : styles.travelMessage,
          ]}
        >
          This picker example is currently available on iOS.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={({ pressed }) => [
            styles.button,
            tone === "night" ? styles.nightButton : styles.travelButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              tone === "night"
                ? styles.nightButtonText
                : styles.travelButtonText,
            ]}
          >
            Got it
          </Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

export default AndroidPickerNotice;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(18, 27, 34, 0.58)",
  },
  dialog: {
    width: "100%",
    maxWidth: 340,
    overflow: "hidden",
    padding: 24,
    paddingTop: 28,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 8,
  },
  accent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  nightDialog: {
    backgroundColor: "#17212B",
    borderColor: "#293744",
  },
  travelDialog: {
    backgroundColor: "#F1E9DE",
    borderColor: "#E4D6C5",
  },
  nightAccent: {
    backgroundColor: "#79E2C0",
  },
  travelAccent: {
    backgroundColor: "#D46A4C",
  },
  title: {
    marginTop: 2,
    color: "#29231F",
    fontSize: 22,
    fontWeight: "800",
  },
  nightTitle: {
    color: "#F5F8FC",
  },
  travelTitle: {
    color: "#29231F",
  },
  message: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 18,
  },
  nightMessage: {
    color: "#9AAAC2",
  },
  travelMessage: {
    color: "#9D897A",
  },
  button: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    borderRadius: 10,
  },
  nightButton: {
    backgroundColor: "#79E2C0",
  },
  travelButton: {
    backgroundColor: "#29231F",
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "800",
  },
  nightButtonText: {
    color: "#10221F",
  },
  travelButtonText: {
    color: "#F4B09C",
  },
});
