import React from "react";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import styles from "@/assets/styles/onboarding.styles";

export default function Index() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/(auth)/Login");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.illustrationContainer}>
          <Image
            source={require("@/assets/images/i.png")}
            style={styles.image}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome to BookWorm</Text>
          <Text style={styles.subtitle}>
            Your ultimate companion for reading adventures. Track your progress, share reviews, and find your next favorite book.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={styles.secondaryButtonText}>
              Don't have an account? <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
