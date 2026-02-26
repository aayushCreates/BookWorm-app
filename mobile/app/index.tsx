import styles from "@/assets/styles/create.styles";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hellow</Text>

      <Link href="/(auth)/signup">Signup</Link>
      <Link href="/(auth)">Login</Link>
    </View>
  );
}
