import { useAuth } from '@/features/auth/auth-context';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/schemas';
import { ApiError } from '@/shared/api/client';
import { colors } from '@/shared/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AuthScaffold } from '@/shared/ui/AuthScaffold';
import { FormField } from '@/shared/ui/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { correo: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const message = await forgotPassword(values.correo.trim());
      Alert.alert('Solicitud enviada', message, [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'No se pudo enviar la solicitud.';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScaffold headerImage={require('../../assets/images/login_bottom.png')} headerImageHeight={80}>
      <Text style={styles.title}>RECUPERAR CONTRASEÑA</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo y te enviaremos instrucciones si la cuenta está registrada.
      </Text>

      <Controller
        control={control}
        name="correo"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.correo?.message}
          />
        )}
      />

      <AppButton label="Enviar" loading={submitting} onPress={onSubmit} />

      <Pressable onPress={() => router.back()} style={styles.linkWrap}>
        <Text style={styles.link}>Volver al inicio de sesión</Text>
      </Pressable>
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
    lineHeight: 20,
  },
  linkWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: colors.brandGreen,
    fontSize: 15,
    fontWeight: '600',
  },
});
