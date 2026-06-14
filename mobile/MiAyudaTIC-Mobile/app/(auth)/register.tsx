import { useAuth } from '@/features/auth/auth-context';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas';
import { ApiError } from '@/shared/api/client';
import { colors } from '@/shared/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AuthScaffold } from '@/shared/ui/AuthScaffold';
import { FormField } from '@/shared/ui/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
} from 'react-native';

const ROLE_OPTIONS = [
  { label: 'Funcionario', value: 'funcionario' as const },
  { label: 'Técnico', value: 'tecnico' as const },
];

export default function RegisterScreen() {
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      correo: '',
      rol: 'funcionario',
      telefono: '',
      password: '',
      confirmPassword: '',
    },
  });

  const selectedRole = watch('rol');

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la galería para seleccionar una foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFotoUri(result.assets[0].uri);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const result = await register({
        ...values,
        correo: values.correo.trim(),
        fotoUri,
      });

      if (!result.ok) {
        Alert.alert('Registro', result.message);
        return;
      }

      if (result.kind === 'tecnico_pending') {
        router.replace({
          pathname: '/(auth)/pending-approval',
          params: { message: result.message },
        });
        return;
      }

      router.replace('/(auth)/session');
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'No se pudo completar el registro.';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScaffold
      headerImage={require('../../assets/images/signup_top.png')}
      headerImageHeight={100}
    >
      <Text style={styles.title}>REGISTRO</Text>

      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Nombre"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.nombre?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="correo"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Correo"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.correo?.message}
          />
        )}
      />

      <Text style={styles.label}>Rol</Text>
      <View style={styles.roleRow}>
        {ROLE_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => setValue('rol', option.value, { shouldValidate: true })}
            style={[
              styles.roleChip,
              selectedRole === option.value && styles.roleChipActive,
            ]}
          >
            <Text
              style={[
                styles.roleChipText,
                selectedRole === option.value && styles.roleChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {errors.rol?.message ? <Text style={styles.error}>{errors.rol.message}</Text> : null}

      <Controller
        control={control}
        name="telefono"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Teléfono"
            keyboardType="phone-pad"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.telefono?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Contraseña"
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

      <Pressable onPress={pickPhoto} style={styles.photoButton}>
        <Text style={styles.photoButtonText}>
          {fotoUri ? 'Cambiar foto de perfil (opcional)' : 'Agregar foto de perfil (opcional)'}
        </Text>
      </Pressable>
      {fotoUri ? (
        <Image source={{ uri: fotoUri }} style={styles.preview as ImageStyle} contentFit="cover" />
      ) : null}

      <AppButton label="Registrar" loading={submitting} onPress={onSubmit} />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>¿Tienes una cuenta?</Text>
        <Pressable onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.link}> Iniciar sesión</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.brandGreen,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.inputWhite,
    alignItems: 'center',
  },
  roleChipActive: {
    backgroundColor: colors.brandGreen,
  },
  roleChipText: {
    color: colors.brandBlue,
    fontWeight: '600',
  },
  roleChipTextActive: {
    color: colors.white,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 8,
  },
  toggle: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  toggleText: {
    color: colors.textDark,
    fontSize: 13,
  },
  photoButton: {
    backgroundColor: colors.inputWhite,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  photoButtonText: {
    color: colors.brandBlue,
    fontWeight: '600',
  },
  preview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: colors.brandBlue,
    fontSize: 11,
  },
  link: {
    color: colors.brandGreen,
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
