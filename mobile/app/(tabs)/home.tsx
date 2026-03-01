import React from "react";
import { View, Text, ScrollView, FlatList, ActivityIndicator } from "react-native";
import styles from "@/assets/styles/home.styles";
import COLORS from "@/constants/colors";

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: undefined, fontWeight: "800" }]}>
          BookWorm🧾
        </Text>
        <Text style={styles.headerSubtitle}>
          Discover great reads from the community
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No books found</Text>
          <Text style={styles.emptySubtext}>
            Be the first to share a book with the community!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
