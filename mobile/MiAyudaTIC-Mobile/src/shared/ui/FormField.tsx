import { Text, TextInput, type TextInputProps } from 'react-native';
import { formStyles } from './form-styles';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormField({ label, error, style, ...props }: FormFieldProps) {
  return (
    <>
      <Text style={formStyles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#999"
        style={[formStyles.input, style]}
        {...props}
      />
      {error ? <Text style={formStyles.error}>{error}</Text> : null}
    </>
  );
}
