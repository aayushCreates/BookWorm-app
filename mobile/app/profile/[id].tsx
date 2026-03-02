import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import styles from "@/assets/styles/profile.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "@/constants/colors";

const DUMMY_USERS = {
  "u1": {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?u=john",
    joined: "March 2025",
    stats: { books: 12, followers: 450, following: 120 },
    recommendations: [
      {
        id: "1",
        title: "The Hunger Games",
        rating: 4,
        review: "A dystopian tale of survival, rebellion, and sacrifice.",
        date: "3/9/2025",
        image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg",
      },
      {
        id: "2",
        title: "The Great Gatsby",
        rating: 5,
        review: "A classic story of wealth, love, and the American dream.",
        date: "3/8/2025",
        image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
      }
    ]
  },
  "u2": {
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/150?u=jane",
    joined: "January 2025",
    stats: { books: 8, followers: 890, following: 340 },
    recommendations: []
  },
  "u3": {
    name: "Alex Smith",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/150?u=alex",
    joined: "February 2025",
    stats: { books: 5, followers: 230, following: 95 },
    recommendations: [
      {
        id: "3",
        title: "Sapiens",
        rating: 5,
        review: "A thought-provoking exploration of human history.",
        date: "3/7/2025",
        image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595703765i/23692271.jpg",
      }
    ]
  }
};

const PublicProfile = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  
  const userData = DUMMY_USERS[id as keyof typeof DUMMY_USERS] || DUMMY_USERS["u1"];

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Back Button Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.textPrimary }}>Profile</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: userData.avatar }} 
              style={styles.profileImage} 
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username} numberOfLines={1}>{userData.name}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>Joined {userData.joined}</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.editProfileButton, 
                { backgroundColor: isFollowing ? COLORS.white : COLORS.primary, borderWidth: 1, borderColor: COLORS.primary }
              ]}
              onPress={() => setIsFollowing(!isFollowing)}
              activeOpacity={0.7}
            >
              <Text style={[styles.editProfileButtonText, { color: isFollowing ? COLORS.primary : COLORS.white }]}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.stats.books}</Text>
            <Text style={styles.statLabel}>Books</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.stats.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.stats.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Recommendations Section */}
        <View style={{ marginTop: 10 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{userData.name.split(' ')[0]}'s Reads</Text>
            <Text style={styles.sectionSubtitle}>
              {userData.recommendations.length} Shared
            </Text>
          </View>

          {userData.recommendations.length > 0 ? (
            userData.recommendations.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.bookItem}
                onPress={() => router.push({
                  pathname: '/book-details/[id]',
                  params: { id: item.id }
                })}
              >
                <Image source={{ uri: item.image }} style={styles.bookImage} resizeMode="cover" />
                <View style={styles.bookInfo}>
                  <View>
                    <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
                    {renderStars(item.rating)}
                    <Text style={styles.bookCaption} numberOfLines={2}>{item.review}</Text>
                  </View>
                  <View style={styles.bookFooter}>
                    <Text style={styles.bookDate}>{item.date}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Ionicons name="book-outline" size={48} color={COLORS.border} />
              <Text style={{ marginTop: 10, color: COLORS.textSecondary, fontWeight: '600' }}>No recommendations yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PublicProfile;