import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import styles from "@/assets/styles/profile.styles";
import COLORS from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const DUMMY_RECOMMENDATIONS = [
  {
    id: "1",
    title: "The Catcher in the Rye",
    rating: 3,
    review: "A classic coming-of-age novel about teenage alienation and rebellion.",
    date: "3/9/2025",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg",
  },
  {
    id: "2",
    title: "The Hunger Games",
    rating: 4,
    review: "A dystopian tale of survival, rebellion, and sacrifice.",
    date: "3/9/2025",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg",
  },
  {
    id: "3",
    title: "Sapiens",
    rating: 5,
    review: "A thought-provoking exploration of human history and our species' evolution.",
    date: "3/9/2025",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595703765i/23692271.jpg",
  },
];

const Profile = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
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
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Profile Header Section */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: "https://i.pravatar.cc/150?u=john" }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editBadge} activeOpacity={0.8}>
            <Ionicons name="camera" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.name || "John Doe"}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{user?.email || "john@gmail.com"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>Joined March 2025</Text>
          </View>
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

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout} 
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={20} color="#FF5252" />
        <Text style={styles.logoutButtonText}>Logout Account</Text>
      </TouchableOpacity>

      {/* Recommendations Section */}
      <View style={{ marginTop: 10 }}>
        <View style={styles.booksHeader}>
          <Text style={styles.booksTitle}>Your Recommendations</Text>
          <Text style={styles.booksCount}>{DUMMY_RECOMMENDATIONS.length} shared</Text>
        </View>

        {DUMMY_RECOMMENDATIONS.map((item) => (
          <View key={item.id} style={styles.bookItem}>
            <Image source={{ uri: item.image }} style={styles.bookImage} resizeMode="cover" />
            <View style={styles.bookInfo}>
              <View>
                <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
                {renderStars(item.rating)}
                <Text style={styles.bookCaption} numberOfLines={2}>{item.review}</Text>
              </View>
              <Text style={styles.bookDate}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} activeOpacity={0.6}>
              <Ionicons name="trash-outline" size={20} color="#FF5252" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Profile;