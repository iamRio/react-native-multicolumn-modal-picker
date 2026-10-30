import { StyleSheet } from "react-native";
import { pickerTokens } from "../constants/tokens";

export const styles = StyleSheet.create({
  mainText: {
    fontSize: pickerTokens.typography.body,
  },
  titleText: {
    textAlign: "center",
    fontSize: pickerTokens.typography.title,
  },
  rightInfoContainer: {
    position: "absolute",
    right: pickerTokens.layout.selectionHighlightInset,
    top: 0,
    bottom: 0,
    minWidth: pickerTokens.layout.rightInfoMinWidth,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: pickerTokens.spacing.sm,
  },
  rightInfoText: {
    fontSize: pickerTokens.typography.body,
  },
  modalMainContainer: {
    width: "100%",
    maxWidth: pickerTokens.layout.modalMaxWidth,
    alignSelf: "center",
    paddingHorizontal: pickerTokens.layout.modalHorizontalPadding,
    zIndex: 1,
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  pickerWrapperStyle: {
    shadowColor: pickerTokens.shadow.color,
    shadowOffset: { width: 0, height: pickerTokens.layout.shadowOffset },
    shadowOpacity: pickerTokens.shadow.opacity,
    shadowRadius: pickerTokens.shadow.radius,
    elevation: pickerTokens.layout.elevation,
  },
  buttonsContainer: {
    minHeight: pickerTokens.layout.actionButtonMinHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  acceptBtn: {
    paddingRight: pickerTokens.layout.acceptButtonRightPadding,
    alignItems: "flex-end",
  },
  topCancelButton: {
    paddingLeft: pickerTokens.layout.cancelButtonLeftPadding,
  },
  topCancelButtonText: {
    width: "100%",
    textAlign: "start",
  },
  topAcceptButtonText: {
    width: "100%",
    textAlign: "end",
  },
  buttonAltView: {
    minHeight: pickerTokens.layout.actionButtonMinHeight,
    marginTop: pickerTokens.layout.cancelButtonContainerMarginTop,
    shadowColor: pickerTokens.shadow.color,
    shadowOffset: { width: 0, height: pickerTokens.layout.shadowOffset },
    shadowOpacity: pickerTokens.shadow.subtleOpacity,
    shadowRadius: pickerTokens.shadow.subtleRadius,
    elevation: pickerTokens.layout.elevation,
  },
  buttonAlt: {
    alignSelf: "stretch",
    minHeight: pickerTokens.layout.actionButtonMinHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonAltText: {
    width: "100%",
    textAlign: "center",
  },
  acceptBtnAlt: {
    minHeight: pickerTokens.layout.actionButtonMinHeight,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  titleView: {
    alignSelf: "center",
    paddingVertical: pickerTokens.layout.titleVerticalPadding,
    paddingHorizontal: pickerTokens.spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerContentRow: {
    position: "relative",
    flexDirection: "row",
    height: pickerTokens.layout.pickerHeight,
    alignItems: "center",
  },
  pickerColumnsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: pickerTokens.spacing.sm,
  },
  horizontalPaddingSpacer: {
    flexShrink: 0,
  },
  selectionHighlight: {
    position: "absolute",
    top: "50%",
    marginTop: -pickerTokens.layout.selectionHighlightHeight / 2,
    left: pickerTokens.layout.selectionHighlightInset,
    width: pickerTokens.layout.selectionHighlightWidth,
    height: pickerTokens.layout.selectionHighlightHeight,
    opacity: pickerTokens.layout.selectionHighlightOpacity,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    width: pickerTokens.layout.searchBarWidth,
    marginTop: pickerTokens.spacing.xl,
    paddingHorizontal: pickerTokens.layout.searchBarHorizontalPadding,
  },
  searchBarWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    minHeight: pickerTokens.layout.searchInputMinHeight,
    fontSize: pickerTokens.typography.body,
  },
  searchClearBtn: {
    marginLeft: pickerTokens.layout.searchClearButtonMarginLeft,
    minHeight: pickerTokens.layout.searchClearButtonMinSize,
    minWidth: pickerTokens.layout.searchClearButtonMinSize,
    alignItems: "center",
    justifyContent: "center",
  },
  searchClearText: {
    fontSize: pickerTokens.typography.label,
    fontWeight: pickerTokens.typography.fontWeight.extraBold,
  },
});
