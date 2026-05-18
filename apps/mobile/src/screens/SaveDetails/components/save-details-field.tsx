import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  SAVE_FIELD_LABEL_LEFT,
  SAVE_FIELD_SHELL_H,
  SAVE_FIELD_SHELL_LEFT,
  SAVE_FIELD_SHELL_W,
} from "@/src/screens/SaveDetails/save-details-layout";

type SaveDetailsFieldProps = {
  label: string;
  top: { labelTop: number; shellTop: number };
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  accessibilityLabel: string;
  autoCapitalize?: "none" | "words" | "sentences";
  multiline?: boolean;
};

export function SaveDetailsField({
  label,
  top,
  value,
  onChangeText,
  editable = true,
  placeholder,
  keyboardType = "default",
  accessibilityLabel,
  autoCapitalize = "sentences",
  multiline = false,
}: SaveDetailsFieldProps) {
  return (
    <>
      <Text style={[fieldStyles.label, { top: top.labelTop }]}>{label}</Text>
      <View style={[fieldStyles.shell, { top: top.shellTop }]}>
        <TextInput
          accessibilityLabel={accessibilityLabel}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          editable={editable}
          keyboardType={keyboardType}
          multiline={multiline}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#989898"
          style={[
            fieldStyles.input,
            !editable && fieldStyles.inputReadOnly,
            multiline && fieldStyles.inputMultiline,
          ]}
          value={value}
        />
      </View>
    </>
  );
}

const fieldStyles = StyleSheet.create({
  label: {
    position: "absolute",
    left: SAVE_FIELD_LABEL_LEFT,
    zIndex: 2,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 40.374,
    lineHeight: 50.467,
    letterSpacing: -1.2617,
    color: "#2a2a2a",
  },
  shell: {
    position: "absolute",
    left: SAVE_FIELD_SHELL_LEFT,
    zIndex: 2,
    width: SAVE_FIELD_SHELL_W,
    height: SAVE_FIELD_SHELL_H,
    borderRadius: 30.28,
    borderWidth: 5,
    borderColor: "#e1e1e1",
    backgroundColor: "#fffdf8",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  input: {
    fontFamily: "Poppins_500Medium",
    fontSize: 40.374,
    letterSpacing: -1.2617,
    color: "#1e1e1e",
    paddingVertical: 0,
  },
  inputReadOnly: {
    color: "#545454",
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 8,
  },
});
