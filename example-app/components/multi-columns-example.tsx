import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MultiColumnModalPicker from "react-native-multicolumn-modal-picker";
import AndroidPickerNotice from "./android-picker-notice";
import { commonStyles } from "../styles/common";

const plans = [
  { label: "Starter", value: "starter" },
  { label: "Creator", value: "creator" },
  { label: "Studio", value: "studio" },
  { label: "Team", value: "team" },
  { label: "Business", value: "business" },
  { label: "Scale", value: "scale" },
  { label: "Enterprise", value: "enterprise" },
  { label: "Custom", value: "custom" },
];

const billingCycles = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const MultiColumnsExample = () => {
  const [visible, setVisible] = useState(false);
  const [androidNoticeVisible, setAndroidNoticeVisible] = useState(false);
  const [plan, setPlan] = useState("creator");
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [lastAction, setLastAction] = useState("Ready to choose");
  const selectedPlan = plans.find((item) => item.value === plan);
  const selectedBillingCycle = billingCycles.find(
    (item) => item.value === billingCycle,
  );
  const handleOpenPicker = () => {
    if (Platform.OS === "android") {
      setAndroidNoticeVisible(true);
      return;
    }
    setVisible(true);
  };

  return (
    <View style={[commonStyles.exampleItem, styles.card]}>
      <View style={styles.cardTopLine}>
        <View style={styles.eyebrowRow}>
          <View style={styles.statusDot} />
          <Text style={[commonStyles.exampleLabel, styles.eyebrowLabel]}>
            SIGNAL SELECTOR
          </Text>
        </View>
        <Text style={styles.versionLabel}>01</Text>
      </View>
      <Text style={styles.title}>Choose your plan</Text>
      <Text style={styles.description}>
        A two-column picker with custom colors and explicit actions.
      </Text>
      <View style={styles.selectionPanel}>
        <View>
          <Text style={styles.selectionCaption}>CURRENT SELECTION</Text>
          <Text style={styles.selectionValue}>
            {selectedPlan?.label} / {selectedBillingCycle?.label}
          </Text>
        </View>
        <View style={styles.selectionBadge}>
          <Text style={styles.selectionBadgeText}>ACTIVE</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleOpenPicker}
        style={styles.openButton}
        activeOpacity={0.8}
      >
        <Text style={styles.openButtonText}>Open plan picker</Text>
        <Text style={styles.openButtonArrow}>{"->"}</Text>
      </TouchableOpacity>
      <View style={styles.footerRow}>
        <Text style={styles.actionText}>{lastAction}</Text>
        <Text style={styles.hintText}>2 columns</Text>
      </View>
      <MultiColumnModalPicker
        visible={visible}
        actionButtonsPosition="bottom"
        acceptButtonText="Apply plan"
        cancelButtonText="Keep current"
        locale="en"
        title="Select a plan"
        titleStyle={styles.modalTitle}
        columns={[plans, billingCycles]}
        selectedValues={[plan, billingCycle]}
        itemStyle={styles.modalItem}
        modalBorderRadius={18}
        searchBarBorderRadius={12}
        searchClearButtonBorderRadius={10}
        actionButtonsBorderRadius={14}
        acceptButtonTextStyle={styles.applyButtonText}
        horizontalPadding={0}
        theme="night"
        customColorScheme={{
          night: {
            modalBackground: "#101A2A",
            overlay: "rgba(5, 12, 24, 0.72)",
            border: "#263753",
            buttonText: "#79E2C0",
            cancelButtonText: "#9AAAC2",
            secondaryText: "#9AAAC2",
            rightInfoText: "#79E2C0",
            inputText: "#F5F8FC",
            pickerItemText: "#F5F8FC",
            cancelText: "#FF9E9E",
          },
        }}
        onValueChange={(value, columnIndex) => {
          if (typeof value !== "string") return;
          if (columnIndex === 0) setPlan(value);
          if (columnIndex === 1) setBillingCycle(value);
        }}
        onAccept={() => setLastAction("Plan updated just now")}
        onCancel={() => setLastAction("Selection kept")}
        onClose={() => setVisible(false)}
      />
      <AndroidPickerNotice
        visible={androidNoticeVisible}
        onClose={() => setAndroidNoticeVisible(false)}
        tone="night"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 300,
    padding: 20,
    backgroundColor: "#17212B",
    borderColor: "#293744",
    shadowColor: "#17212B",
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  cardTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyebrowLabel: {
    marginBottom: 0,
  },
  statusDot: {
    width: 7,
    height: 7,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: "#79E2C0",
  },
  versionLabel: {
    color: "#79E2C0",
    fontSize: 12,
    fontWeight: "800",
  },
  title: {
    marginTop: 8,
    color: "#F5F8FC",
    fontSize: 27,
    fontWeight: "800",
  },
  description: {
    maxWidth: 290,
    marginTop: 7,
    color: "#AEBBC9",
    fontSize: 14,
    lineHeight: 20,
  },
  selectionPanel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    padding: 14,
    backgroundColor: "#223242",
    borderColor: "#304759",
    borderRadius: 12,
    borderWidth: 1,
  },
  selectionCaption: {
    color: "#8EABBA",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  selectionValue: {
    marginTop: 4,
    color: "#F5F8FC",
    fontSize: 18,
    fontWeight: "700",
  },
  selectionBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    backgroundColor: "#315E5B",
    borderRadius: 8,
  },
  selectionBadgeText: {
    color: "#9FF0D5",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
    marginTop: 14,
    paddingHorizontal: 16,
    backgroundColor: "#79E2C0",
    borderRadius: 10,
  },
  openButtonText: {
    color: "#10221F",
    fontSize: 14,
    fontWeight: "800",
  },
  openButtonArrow: {
    color: "#10221F",
    fontSize: 18,
    fontWeight: "800",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionText: {
    color: "#9FF0D5",
    fontSize: 12,
  },
  hintText: {
    color: "#8090A0",
    fontSize: 12,
  },
  modalTitle: {
    color: "#F5F8FC",
    fontSize: 18,
    fontWeight: "800",
    paddingTop: 10,
  },
  modalItem: {
    color: "#F5F8FC",
    fontSize: 18,
    fontWeight: "600",
  },
  applyButtonText: {
    fontWeight: "700",
  },
});

export default MultiColumnsExample;
