import SafeScreen from "@/components/SafeScreen";
import { useAuthStore } from "@/store/auth.store";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const { checkAuth } = useAuthStore();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeScreen>
      <StatusBar barStyle="dark-content" />
    </SafeAreaProvider>
  );
}
