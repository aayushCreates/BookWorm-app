import styles from "@/assets/styles/create.styles";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/auth.store";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const { token } = useAuthStore();

  const handleUploadImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePostBook = async () => {
    try {
      console.log("title", title);
      console.log("rating", rating);
      console.log("image", image);
      console.log("caption", caption);
      const { data } = await axios.post(
        "http://10.0.2.2:5050/api/v1/book",
        {
          title: title,
          rating: rating,
          image: image,
          caption: caption,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const getRatingText = () => {
    switch (rating) {
      case 1: return "Terrible";
      case 2: return "Poor";
      case 3: return "Average";
      case 4: return "Good";
      case 5: return "Excellent";
      default: return "Select Rating";
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
              color={star <= rating ? "#FFD700" : COLORS.primary}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.scrollViewStyle}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Add Book Recommendation</Text>
        <Text style={styles.subtitle}>
          Share your favorite reads with others
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Title</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="book-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter book title"
                placeholderTextColor={COLORS.placeholderText}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          {/* Rating */}
          <View style={styles.formGroup}>
            <View style={styles.ratingHeader}>
              <Text style={styles.label}>Your Rating</Text>
              {rating > 0 && (
                <Text style={styles.ratingValue}>
                  {rating}/5 - {getRatingText()}
                </Text>
              )}
            </View>
            {renderStars()}
          </View>

          {/* Book IMG */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Image</Text>
            <TouchableOpacity style={styles.imagePicker} activeOpacity={0.7} onPress={handleUploadImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons
                    name="image-outline"
                    size={48}
                    color={COLORS.primary}
                  />
                  <Text style={styles.placeholderText}>
                    Tap to select image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Caption */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Caption</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write your review or thoughts about this book..."
              placeholderTextColor={COLORS.placeholderText}
              multiline
              value={caption}
              onChangeText={setCaption}
            />
          </View>

          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color={COLORS.white}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Post Recommendation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddBook;
