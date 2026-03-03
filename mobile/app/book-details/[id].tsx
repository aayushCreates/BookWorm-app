import styles from "@/assets/styles/bookDetails.styles";
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
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Comment {
  _id: string;
  content: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

interface BookDetail {
  _id: string;
  title: string;
  image: string;
  caption?: string;
  rating: number;
  category?: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

const Details = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const { token, user } = useAuthStore();
  const [bookDetail, setBookDetail] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const getBookDetail = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://10.0.2.2:5050/api/v1/book/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      setBookDetail(data.data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getBookDetail();
    }
  }, [id]);

  const renderStars = (rating: number, size: number = 18) => {
    return (
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color={star <= rating ? "#FFD700" : "#C1C1C1"}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!bookDetail) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: COLORS.textSecondary }}>Book not found</Text>
        <TouchableOpacity 
          style={{ marginTop: 20, backgroundColor: COLORS.primary, padding: 12, borderRadius: 10 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: COLORS.white, fontWeight: '700' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formattedDate = new Date(bookDetail.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Immersive Image Header */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: bookDetail.image }}
          style={styles.bookImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerInfo}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{bookDetail.category || "General"}</Text>
          </View>
          <Text style={styles.title}>{bookDetail.title}</Text>
          <View style={styles.ratingRow}>
            {renderStars(bookDetail.rating)}
            <Text style={styles.ratingText}>
              {bookDetail.rating.toFixed(1)} Rating
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={COLORS.textSecondary}
            />
            <Text style={styles.dateText}>Posted on {formattedDate}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared By</Text>
          <Pressable 
            onPress={() => router.push({
              pathname: '/profile/[id]',
              params: { id: bookDetail.userId._id }
            })}
          >
            <View style={styles.userInfo}>
              <Image
                source={{ uri: bookDetail.userId.avatar || `https://ui-avatars.com/api/?name=${bookDetail.userId.name}&background=random` }}
                style={styles.userAvatar}
              />
              <View>
                <Text style={styles.userName}>{bookDetail.userId.name}</Text>
                <Text style={styles.userRole}>Avid Reader</Text>
              </View>
              {user && user._id !== bookDetail.userId._id && (
                <TouchableOpacity
                  style={[
                    styles.followButton,
                    isFollowing && styles.followingButton,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setIsFollowing(!isFollowing)}
                >
                  <Text
                    style={[
                      styles.followButtonText,
                      isFollowing && styles.followingButtonText,
                    ]}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Pressable>
        </View>

        {/* Review Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Review & Thoughts</Text>
          <Text style={styles.reviewText}>{bookDetail.caption}</Text>
        </View>

        <View style={styles.divider} />

        {/* Community Ratings & Comments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Reviews ({bookDetail.comments?.length || 0})</Text>

          {/* Add Comment Input */}
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a review..."
              placeholderTextColor={COLORS.placeholderText}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} activeOpacity={0.7}>
              <Ionicons name="send" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 24 }}>
            {bookDetail.comments && bookDetail.comments.length > 0 ? (
              bookDetail.comments.map((comment) => (
                <View key={comment._id} style={styles.commentItem}>
                  <Image
                    source={{ uri: comment.userId.avatar || `https://ui-avatars.com/api/?name=${comment.userId.name}&background=random` }}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentContent}>
                    <View style={styles.commentUserRow}>
                      <Text style={styles.commentUserName}>{comment.userId.name}</Text>
                      <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
                    </View>
                    {/* {renderStars(comment.rating || 0, 14)} */}
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text style={{ color: COLORS.textSecondary, fontStyle: 'italic' }}>No reviews yet. Be the first to share your thoughts!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Ionicons
              name="bookmark-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Text style={styles.actionButtonText}>Add to My List</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Details;
