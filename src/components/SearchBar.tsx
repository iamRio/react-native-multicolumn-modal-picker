import React from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { TextStyle } from "react-native";
import type { SearchBarProps } from "../types";
import { styles } from "../styles";

// React Native Web supports "none", although React Native's TextStyle type does not.
const webSearchInputStyle = {
  outlineStyle: "none",
} as unknown as TextStyle;

export const SearchBar = ({
  backgroundColor,
  clearButtonColor,
  clearTextColor,
  inputColor,
  placeholder,
  placeholderTextColor,
  searchValue,
  searchBoxStyle,
  searchTextStyle,
  inputRef,
  searchBarBorderRadius,
  searchClearButtonBorderRadius,
  searchMaxLength,
  onChangeText,
  onClear,
  onFocus,
  onBlur,
}: SearchBarProps) => {
  const clearButton = (
    <TouchableOpacity
      style={[
        styles.searchClearBtn,
        {
          backgroundColor: clearButtonColor,
          borderRadius: searchClearButtonBorderRadius,
        },
      ]}
      onPress={onClear}
    >
      <Text style={[styles.searchClearText, { color: clearTextColor }]}>X</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.searchBarWrapper}>
      <View
        style={[
          styles.searchBar,
          { backgroundColor, borderRadius: searchBarBorderRadius },
          searchBoxStyle,
        ]}
      >
        <TextInput
          style={[
            styles.searchInput,
            { color: inputColor },
            searchTextStyle,
            Platform.OS === "web" && webSearchInputStyle,
          ]}
          ref={inputRef}
          maxLength={searchMaxLength ?? undefined}
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholder}
          onFocus={onFocus}
          spellCheck={false}
          value={searchValue}
          onChangeText={onChangeText}
          onBlur={onBlur}
        />
        {searchValue.length > 0 &&
          (Platform.OS === "web" ? (
            <View onPointerDown={(event) => event.preventDefault()}>
              {clearButton}
            </View>
          ) : (
            clearButton
          ))}
      </View>
    </View>
  );
};
