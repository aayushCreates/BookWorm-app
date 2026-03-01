import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import styles from "@/assets/styles/create.styles";
import COLORS from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");

  return (
    <ScrollView style={styles.scrollViewStyle} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Share a Book 📖</Text>
        <Text style={styles.subtitle}>Help others find their next great read</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Title</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="book-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter book name"
                placeholderTextColor={COLORS.placeholderText}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Review</Text>
            <TextInput
              style={styles.textArea}
              placeholder="What did you think of this book?"
              placeholderTextColor={COLORS.placeholderText}
              multiline
              value={review}
              onChangeText={setReview}
            />
          </View>

          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Post Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddBook;
