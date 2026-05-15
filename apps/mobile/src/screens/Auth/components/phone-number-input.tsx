import { Text, TextInput, View } from "react-native";
import { styles } from "@/src/screens/Auth/phone-auth-artboard";

const MAX_NATIONAL_DIGITS = 10;

type PhoneNumberInputProps = {
  value: string;
  onChangeText: (nationalNumber: string) => void;
};

/** Indian mobile field — fixed +91 prefix; stores up to 10 national digits only. */
export function PhoneNumberInput({ value, onChangeText }: PhoneNumberInputProps) {
  const onChange = (text: string) => {
    onChangeText(text.replace(/\D/g, "").slice(0, MAX_NATIONAL_DIGITS));
  };

  return (
    <View style={styles.inputShell}>
      <View style={styles.phoneInputRow}>
        <Text style={styles.phonePrefix}>+91</Text>
        <TextInput
          accessibilityLabel="Mobile number"
          keyboardType="phone-pad"
          maxLength={MAX_NATIONAL_DIGITS}
          onChangeText={onChange}
          placeholder="XXXXXXXXXX"
          placeholderTextColor="#989898"
          style={styles.phoneInputField}
          value={value}
        />
      </View>
    </View>
  );
}
