import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface BrandTitleProps {
  size?: 'large' | 'small';
}

export function BrandTitle({ size = 'large' }: BrandTitleProps) {
  const fontSize = size === 'large' ? 24 : 18;
  const subtitleSize = size === 'large' ? 16 : 12;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.brand, { fontSize, color: colors.brandGreen }]}>MI </Text>
        <Text style={[styles.brand, { fontSize }]}>AYUDA </Text>
        <Text style={[styles.brand, { fontSize, color: colors.brandGreen }]}>TICS </Text>
      </View>
      <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>Regional Cauca</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  brand: {
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    marginTop: 10,
    color: '#333',
  },
});
