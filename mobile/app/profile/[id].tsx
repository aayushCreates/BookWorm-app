import styles from "@/assets/styles/profile.styles";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/auth.store";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Book {
  _id: string;
  title: string;
  image: string;
  caption?: string;
  rating: number;
  createdAt: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  postedBooks: Book[];
  followers: string[];
  followings: string[];
}

const PublicProfile = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const { token } = useAuthStore();
  const [userDetail, setUserDetail] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://10.0.2.2:5050/api/v1/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      setUserDetail(data.data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [id]);

  const booksCount = userDetail?.postedBooks?.length || 0;
  const followersCount = userDetail?.followers?.length || 0;
  const followingCount = userDetail?.followings?.length || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
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

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!userDetail) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Back Button Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 20, fontWeight: "800", color: COLORS.textPrimary }}
        >
          Profile
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: userDetail.avatar || "https://i.pravatar.cc/150" }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username} numberOfLines={1}>
              {userDetail.name}
            </Text>
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={COLORS.textSecondary}
              />
              <Text style={styles.infoText}>
                Joined {formatJoinedDate(userDetail.createdAt)}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.editProfileButton,
                {
                  backgroundColor: isFollowing ? COLORS.white : COLORS.primary,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                },
              ]}
              onPress={() => setIsFollowing(!isFollowing)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.editProfileButtonText,
                  { color: isFollowing ? COLORS.primary : COLORS.white },
                ]}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{booksCount}</Text>
            <Text style={styles.statLabel}>Books</Text>
          </View>

          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>

          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* postedBooks Section */}
        <View style={{ marginTop: 10 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {userDetail.name.split(" ")[0]}'s Reads
            </Text>
            <Text style={styles.sectionSubtitle}>
              {userDetail.postedBooks?.length || 0} Shared
            </Text>
          </View>

          {userDetail.postedBooks && userDetail.postedBooks.length > 0 ? (
            userDetail.postedBooks.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.bookItem}
                onPress={() =>
                  router.push({
                    pathname: "/book-details/[id]",
                    params: { id: item._id },
                  })
                }
              >
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
                      {item.caption}
                    </Text>
                  </View>
                  <View style={styles.bookFooter}>
                    <Text style={styles.bookDate}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ alignItems: "center", padding: 40 }}>
              <Ionicons name="book-outline" size={48} color={COLORS.border} />
              <Text
                style={{
                  marginTop: 10,
                  color: COLORS.textSecondary,
                  fontWeight: "600",
                }}
              >
                No postedBooks yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PublicProfile;
