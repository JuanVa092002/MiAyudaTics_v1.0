import { colors } from '@/shared/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { BrandTitle } from '@/shared/ui/BrandTitle';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LiderNotSupportedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BrandTitle />
        <Text style={styles.title}>Acceso web requerido</Text>
        <Text style={styles.message}>
          El rol Líder TIC debe usar la versión web de MiAyudaTIC. Esta aplicación móvil está
          diseñada para funcionarios y técnicos en campo.
        </Text>
        <AppButton label="Volver al inicio" variant="blue" onPress={() => router.replace('/')} />
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
