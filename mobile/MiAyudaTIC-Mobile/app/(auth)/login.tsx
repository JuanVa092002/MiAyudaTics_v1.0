import { useAuth } from '@/features/auth/auth-context';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas';
import { colors } from '@/shared/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AuthScaffold } from '@/shared/ui/AuthScaffold';
import { FormField } from '@/shared/ui/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const result = await login(values.correo.trim(), values.password);
      if (result.ok) {
        router.replace('/(auth)/session');
        return;
      }

      if (result.kind === 'pending_approval') {
        router.push({
          pathname: '/(auth)/pending-approval',
          params: { message: result.message },
        });
        return;
      }

      if (result.kind === 'lider') {
        router.push('/(auth)/lider-not-supported');
        return;
      }

      Alert.alert('No se pudo ingresar', result.message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScaffold
      headerImage={require('../../assets/images/main_top.png')}
      headerImageHeight={100}
    >
      <Text style={styles.title}>INICIO DE SESIÓN</Text>

      <Controller
        control={control}
        name="correo"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.correo?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <FormField
              label="Contraseña"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.password?.message}
            />
            <Pressable onPress={() => setShowPassword((prev) => !prev)} style={styles.toggle}>
              <Text style={styles.toggleText}>
                {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              </Text>
            </Pressable>
          </View>
        )}
      />

      <AppButton label="Ingresar" loading={submitting} onPress={onSubmit} />

      <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={styles.linkWrap}>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </Pressable>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.link}> Regístrate</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.brandGreen,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 18,
  },
  toggle: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 12,
  },
  toggleText: {
    color: colors.textDark,
    fontSize: 13,
  },
  linkWrap: {
    marginTop: 16,
    alignItems: 'center',
  },
  link: {
    color: colors.brandGreen,
    fontSize: 16,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    color: colors.brandBlue,
    fontSize: 12,
  },
});
