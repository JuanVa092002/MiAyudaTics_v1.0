import { colors } from '@/shared/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { BrandTitle } from '@/shared/ui/BrandTitle';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PendingApprovalScreen() {
  const { message } = useLocalSearchParams<{ message?: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BrandTitle />
        <Text style={styles.title}>Cuenta en revisión</Text>
        <Text style={styles.message}>
          {message ??
            'Su registro se encuentra sujeto a aprobación por parte del Líder TIC. Una vez sea aprobado, podrá ingresar al sistema.'}
        </Text>
        <AppButton
          label="Ir a iniciar sesión"
          variant="green"
          onPress={() => router.replace('/(auth)/login')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.brandBlue,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textDark,
    textAlign: 'center',
  },
});
