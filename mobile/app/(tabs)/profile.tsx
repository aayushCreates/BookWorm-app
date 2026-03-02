import styles from "@/assets/styles/profile.styles";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/auth.store";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DUMMY_RECOMMENDATIONS = [
  {
    id: "1",
    title: "The Catcher in the Rye",
    rating: 3,
    review:
      "A classic coming-of-age novel about teenage alienation and rebellion.",
    date: "3/9/2025",
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg",
  },
  {
    id: "2",
    title: "The Hunger Games",
    rating: 4,
    review: "A dystopian tale of survival, rebellion, and sacrifice.",
    date: "3/9/2025",
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg",
  },
  {
    id: "3",
    title: "Sapiens",
    rating: 5,
    review:
      "A thought-provoking exploration of human history and our species' evolution.",
    date: "3/9/2025",
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595703765i/23692271.jpg",
  },
];

const Profile = () => {
  const { user, logout, token } = useAuthStore();
  const router = useRouter();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "John Doe");
  const [editedEmail, setEditedEmail] = useState(
    user?.email || "john@gmail.com"
  );
  const [editedImage, setEditedImage] = useState<string | null>("");

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const requestPermission = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !mediaPermission.granted) {
      Alert.alert("Permission required");
      return false;
    }

    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setEditedImage(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setEditedImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data } = await axios.patch(
        "http://10.0.2.2:5050/api/v1/book",
        {
          image: editedImage,
          email: editedEmail,
          name: editedName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditModalVisible(false);
    } catch (err: any) {
      Alert.alert("Error", err.message);
      setIsEditModalVisible(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={14}
            color={star <= rating ? "#FFD700" : "#C1C1C1"}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header Section */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: editedImage || "https://i.pravatar.cc/150?u=john" }}
            style={styles.profileImage}
          />
          <TouchableOpacity 
            style={styles.editBadge} 
            activeOpacity={0.8}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Ionicons name="camera" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username} numberOfLines={1}>{editedName}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>{editedEmail}</Text>
          </View>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setIsEditModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>19</Text>
          <Text style={styles.statLabel}>Books</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>124</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>85</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>

      {/* Recommendations Section */}
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Reads</Text>
          <Text style={styles.sectionSubtitle}>
            {DUMMY_RECOMMENDATIONS.length} Shared
          </Text>
        </View>

        {DUMMY_RECOMMENDATIONS.map((item) => (
          <View key={item.id} style={styles.bookItem}>
            <Image
              source={{ uri: item.image }}
              style={styles.bookImage}
              resizeMode="cover"
            />
            <View style={styles.bookInfo}>
              <View>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                {renderStars(item.rating)}
                <Text style={styles.bookCaption} numberOfLines={2}>
                  {item.review}
                </Text>
              </View>
              <View style={styles.bookFooter}>
                <Text style={styles.bookDate}>{item.date}</Text>
                <TouchableOpacity style={styles.deleteButton} activeOpacity={0.6}>
                  <Ionicons name="trash-outline" size={18} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={22} color="#FF5252" />
        <Text style={styles.logoutButtonText}>Logout Account</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader} />
            <Text style={styles.modalTitle}>Update Profile</Text>

            <View style={styles.modalAvatarContainer}>
              <Image
                source={{ uri: editedImage || "https://i.pravatar.cc/150?u=john" }}
                style={styles.modalAvatar}
              />
              <View style={styles.imagePickerOptions}>
                <TouchableOpacity style={styles.imageOptionButton} onPress={takePhoto} activeOpacity={0.7}>
                  <Ionicons name="camera" size={20} color={COLORS.primary} />
                  <Text style={styles.imageOptionText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageOptionButton} onPress={pickFromGallery} activeOpacity={0.7}>
                  <Ionicons name="image" size={20} color={COLORS.primary} />
                  <Text style={styles.imageOptionText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.modalLabel}>Full Name</Text>
            <TextInput
              style={styles.modalInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textSecondary}
            />

            <Text style={styles.modalLabel}>Email Address</Text>
            <TextInput
              style={styles.modalInput}
              value={editedEmail}
              onChangeText={setEditedEmail}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;