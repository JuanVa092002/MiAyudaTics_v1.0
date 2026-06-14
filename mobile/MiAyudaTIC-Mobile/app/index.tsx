import { useAuth } from '@/features/auth/auth-context';
import { AppButton } from '@/shared/ui/AppButton';
import { BrandTitle } from '@/shared/ui/BrandTitle';
import { colors } from '@/shared/theme/colors';
import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.brandGreen} />
      </View>
    );
  }

  if (status === 'authenticated') {
    return <Redirect href="/(auth)/session" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/icons/sena-verde.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <Image
          source={require('../assets/icons/logoSena.png')}
          style={styles.logoSecondary}
          contentFit="contain"
        />
        <BrandTitle size="large" />
        <View style={styles.actions}>
          <AppButton
            label="Iniciar Sesión"
            variant="green"
            onPress={() => router.push('/(auth)/login')}
          />
          <AppButton
            label="Registrarse"
            variant="blue"
            onPress={() => router.push('/(auth)/register')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  logo: {
    width: 180,
    height: 120,
  },
  logoSecondary: {
    width: 100,
    height: 48,
  },
  actions: {
    marginTop: 50,
    width: '100%',
    gap: 20,
    alignItems: 'center',
  },
});
