import { useAuth } from '@/features/auth/auth-context';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/features/auth/schemas';
import { ApiError } from '@/shared/api/client';
import { colors } from '@/shared/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AuthScaffold } from '@/shared/ui/AuthScaffold';
import { FormField } from '@/shared/ui/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

export default function ResetPasswordScreen() {
  const { resetPassword } = useAuth();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!token) {
      Alert.alert('Error', 'El enlace de recuperación no es válido.');
      return;
    }

    setSubmitting(true);
    try {
      const message = await resetPassword(token, values.password, values.confirmPassword);
      Alert.alert('Contraseña actualizada', message, [
        { text: 'Ir a login', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'No se pudo restablecer la contraseña.';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScaffold showBrand brandSize="small">
      <Text style={styles.title}>NUEVA CONTRASEÑA</Text>
      <Text style={styles.subtitle}>Crea una contraseña segura de al menos 8 caracteres.</Text>

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Nueva contraseña"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Confirmar contraseña"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.confirmPassword?.message}
          />
        )}
      />

      <Pressable onPress={() => setShowPassword((prev) => !prev)} style={styles.toggle}>
        <Text style={styles.toggleText}>
          {showPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
        </Text>
      </Pressable>

      <AppButton label="Guardar contraseña" loading={submitting} onPress={onSubmit} />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.brandGreen,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textDark,
    marginBottom: 20,
  },
  toggle: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  toggleText: {
    color: colors.textDark,
    fontSize: 13,
  },
});
