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

const destinations = [
  { label: "Barcelona · BCN", value: "BCN" },
  { label: "Copenhagen · CPH", value: "CPH" },
  { label: "Lisbon · LIS", value: "LIS" },
  { label: "London · LHR", value: "LHR" },
  { label: "New York · JFK", value: "JFK" },
  { label: "Paris · CDG", value: "CDG" },
  { label: "Singapore · SIN", value: "SIN" },
  { label: "Tokyo · HND", value: "HND" },
];

const SingleColumnWithSearchExample = () => {
  const [visible, setVisible] = useState(false);
  const [androidNoticeVisible, setAndroidNoticeVisible] = useState(false);
  const [destinationCode, setDestinationCode] = useState("CDG");
  const [lastAction, setLastAction] = useState("Ready to explore");
  const [isSearching, setIsSearching] = useState(false);
  const selectedDestination = destinations.find(
    (item) => item.value === destinationCode,
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
      <View style={styles.cardHeader}>
        <Text style={styles.eyebrow}>FIELD NOTE / 02</Text>
        <Text style={styles.headerMeta}>TRAVEL SEARCH</Text>
      </View>
      <View style={styles.heroBlock}>
        <View>
          <Text style={styles.kicker}>NEXT STOP</Text>
          <Text style={styles.title}>Where to next?</Text>
        </View>
        <View style={styles.compass}>
          <Text style={styles.compassMark}>+</Text>
        </View>
      </View>
      <Text style={styles.description}>
        Search cities or airport codes and keep your destination close at hand.
      </Text>
      <View style={styles.routeCard}>
        <View style={styles.pinCircle}>
          <Text style={styles.pinText}>o</Text>
        </View>
        <View style={styles.destinationCopy}>
          <Text style={styles.destinationCaption}>DESTINATION</Text>
          <Text style={styles.destinationValue}>
            {selectedDestination?.label}
          </Text>
        </View>
        <Text style={styles.destinationCode}>{destinationCode}</Text>
      </View>
      <TouchableOpacity
        onPress={handleOpenPicker}
        style={styles.openButton}
        activeOpacity={0.8}
      >
        <Text style={styles.openButtonText}>Find a destination</Text>
        <Text style={styles.openButtonArrow}>-&gt;</Text>
      </TouchableOpacity>
      <View style={styles.footerRow}>
        <Text style={styles.actionText}>
          {isSearching ? "Search is focused" : lastAction}
        </Text>
        <Text style={styles.hintText}>{destinations.length} destinations</Text>
      </View>
      <MultiColumnModalPicker
        visible={visible}
        enableSearch
        theme="auto"
        actionButtonsPosition="bottom"
        acceptButtonText="Use destination"
        cancelButtonText="Back to itinerary"
        acceptButtonTextStyle={styles.modalAcceptText}
        cancelButtonTextStyle={styles.modalCancelText}
        columns={[destinations]}
        selectedValues={[destinationCode]}
        rightInfo={destinationCode}
        rightInfoTextStyle={styles.modalRightInfo}
        itemStyle={styles.modalItem}
        searchPlaceholder="Search city or airport code"
        searchTextStyle={styles.modalSearchText}
        searchBoxStyle={styles.modalSearchBox}
        modalBorderRadius={20}
        searchBarBorderRadius={18}
        searchClearButtonBorderRadius={16}
        actionButtonsBorderRadius={20}
        horizontalPadding={0}
        onValueChange={(value) => {
          if (typeof value === "string") setDestinationCode(value);
        }}
        onSearchFocus={() => setIsSearching(true)}
        onSearchBlur={() => setIsSearching(false)}
        onAccept={() => setLastAction("Destination selected just now")}
        onCancel={() => setLastAction("Selection kept")}
        onClose={() => setVisible(false)}
      />
      <AndroidPickerNotice
        visible={androidNoticeVisible}
        onClose={() => setAndroidNoticeVisible(false)}
        tone="travel"
      />
    </View>
  );
};

export default SingleColumnWithSearchExample;

const styles = StyleSheet.create({
  card: {
    minHeight: 320,
    padding: 22,
    backgroundColor: "#F1E9DE",
    borderColor: "#E4D6C5",
    borderRadius: 24,
    shadowColor: "#594838",
    shadowOpacity: 0.14,
    shadowRadius: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomColor: "#E4D6C5",
    borderBottomWidth: 1,
  },
  eyebrow: {
    color: "#A76E5D",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  headerMeta: {
    color: "#B08D7A",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  heroBlock: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 20,
  },
  compass: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4D1C4",
    borderRadius: 21,
  },
  compassMark: {
    color: "#B64F36",
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 31,
  },
  kicker: {
    color: "#A76E5D",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  title: {
    marginTop: 4,
    color: "#29231F",
    fontSize: 28,
    fontWeight: "800",
  },
  description: {
    maxWidth: 290,
    marginTop: 8,
    color: "#75675C",
    fontSize: 14,
    lineHeight: 20,
  },
  routeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    padding: 14,
    backgroundColor: "#FFF9F1",
    borderColor: "#E5D6C3",
    borderRadius: 16,
    borderWidth: 1,
    borderLeftColor: "#D46A4C",
    borderLeftWidth: 4,
  },
  pinCircle: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4D1C4",
    borderRadius: 17,
  },
  pinText: {
    color: "#B64F36",
    fontSize: 18,
    fontWeight: "800",
  },
  destinationCopy: {
    flex: 1,
    marginLeft: 11,
  },
  destinationCaption: {
    color: "#B08D7A",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  destinationValue: {
    marginTop: 4,
    color: "#29231F",
    fontSize: 16,
    fontWeight: "700",
  },
  destinationCode: {
    color: "#D46A4C",
    fontSize: 14,
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
    backgroundColor: "#29231F",
    borderRadius: 10,
  },
  openButtonText: {
    color: "#FFF9F1",
    fontSize: 14,
    fontWeight: "800",
  },
  openButtonArrow: {
    color: "#F4B09C",
    fontSize: 18,
    fontWeight: "800",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionText: {
    color: "#A7543E",
    fontSize: 12,
  },
  hintText: {
    color: "#9D897A",
    fontSize: 12,
  },
  modalRightInfo: {
    fontSize: 14,
    fontWeight: "800",
  },
  modalItem: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalSearchBox: {
    width: "92%",
    marginTop: 28,
    paddingHorizontal: 16,
    minHeight: 52,
    borderColor: "rgba(128, 128, 128, 0.28)",
    borderWidth: 1,
  },
  modalSearchText: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
  modalCancelText: {
    color: "#aaa",
    fontWeight: "400",
    paddingVertical: 20,
  },
  modalAcceptText: {
    color: "#2E7D68",
    fontWeight: "800",
    paddingVertical: 20,
  },
});
