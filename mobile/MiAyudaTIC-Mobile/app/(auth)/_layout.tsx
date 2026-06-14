import { useAuth } from '@/features/auth/auth-context';
import { Redirect, Stack, useSegments } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

const PUBLIC_ROUTE_NAMES = new Set([
  'login',
  'register',
  'forgot-password',
  'reset-password',
  'pending-approval',
  'lider-not-supported',
]);

function isPublicAuthRoute(segments: string[]): boolean {
  return segments.some((segment) => PUBLIC_ROUTE_NAMES.has(segment));
}

export default function AuthLayout() {
  const { status, user } = useAuth();
  const segments = useSegments() as string[];
  const isPublicRoute = isPublicAuthRoute(segments);

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.brandGreen} />
      </View>
    );
  }

  if (status === 'unauthenticated' && segments.includes('session')) {
    return <Redirect href="/(auth)/login" />;
  }

  if (status === 'authenticated' && isPublicRoute && !segments.includes('session')) {
    return <Redirect href="/(auth)/session" />;
  }

  if (status === 'authenticated' && user?.rol === 'lider') {
    return <Redirect href="/(auth)/lider-not-supported" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password/[token]" />
      <Stack.Screen name="pending-approval" />
      <Stack.Screen name="lider-not-supported" />
      <Stack.Screen name="session" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
