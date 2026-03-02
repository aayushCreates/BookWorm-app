import styles from "@/assets/styles/bookDetails.styles";
import COLORS from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DUMMY_POSTS = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=john",
    },
    book: {
      title: "The Hunger Games",
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg",
      rating: 4,
      review:
        "A dystopian tale of survival, rebellion, and sacrifice. Follow Katniss Everdeen as she navigates the deadly Hunger Games, a televised competition where teenagers from Panem's districts must fight to the death. A gripping story of courage and defiance against an oppressive regime.",
      date: "March 9, 2025",
      category: "Dystopian",
    },
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=jane",
    },
    book: {
      title: "The Great Gatsby",
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
      rating: 5,
      review:
        "A classic story of wealth, love, and the American dream in the 1920s. Jay Gatsby's mysterious past and his obsession with Daisy Buchanan unfold in the opulent world of Long Island's elite. F. Scott Fitzgerald's masterpiece explore the tragic illusions of success and the pursuit of lost time.",
      date: "March 9, 2025",
      category: "Classic",
    },
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Alex Smith",
      avatar: "https://i.pravatar.cc/150?u=alex",
    },
    book: {
      title: "Sapiens",
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595703765i/23692271.jpg",
      rating: 5,
      review:
        "A thought-provoking exploration of human history and our species' evolution. Yuval Noah Harari takes us on a journey from the emergence of Homo sapiens in Africa to the scientific and technological revolutions of the present day. Discover how myths, money, and empires shaped our world.",
      date: "March 9, 2025",
      category: "History",
    },
  },
];

const DUMMY_COMMENTS = [
  {
    id: "c1",
    user: "Sarah Wilson",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    rating: 5,
    text: "Absolutely loved this book! The characters are so well-developed and the plot kept me on the edge of my seat.",
    date: "2 days ago",
  },
  {
    id: "c2",
    user: "Michael Brown",
    avatar: "https://i.pravatar.cc/150?u=mike",
    rating: 4,
    text: "Great read, although the middle part was a bit slow. Highly recommended nonetheless.",
    date: "5 days ago",
  },
];

const Details = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  const bookPost = DUMMY_POSTS.find((p) => p.id === id) || DUMMY_POSTS[0];

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
          source={{ uri: bookPost.book.image }}
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
            <Text style={styles.categoryText}>{bookPost.book.category}</Text>
          </View>
          <Text style={styles.title}>{bookPost.book.title}</Text>
          <View style={styles.ratingRow}>
            {renderStars(bookPost.book.rating)}
            <Text style={styles.ratingText}>
              {bookPost.book.rating.toFixed(1)} Rating
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={COLORS.textSecondary}
            />
            <Text style={styles.dateText}>Posted on {bookPost.book.date}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared By</Text>
          <Pressable 
            onPress={() => router.push({
              pathname: '/profile/[id]',
              params: { id: bookPost.user.id }
            })}
          >
            <View style={styles.userInfo}>
              <Image
                source={{ uri: bookPost.user.avatar }}
                style={styles.userAvatar}
              />
              <View>
                <Text style={styles.userName}>{bookPost.user.name}</Text>
                <Text style={styles.userRole}>Avid Reader</Text>
              </View>
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
            </View>
          </Pressable>
        </View>

        {/* Review Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Review & Thoughts</Text>
          <Text style={styles.reviewText}>{bookPost.book.review}</Text>
        </View>

        <View style={styles.divider} />

        {/* Community Ratings & Comments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Reviews</Text>

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
            {DUMMY_COMMENTS.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Image
                  source={{ uri: comment.avatar }}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <View style={styles.commentUserRow}>
                    <Text style={styles.commentUserName}>{comment.user}</Text>
                    <Text style={styles.commentDate}>{comment.date}</Text>
                  </View>
                  {renderStars(comment.rating, 14)}
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))}
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
