import React, { useState } from "react";
import { View, Text, ScrollView, Image, TextInput } from "react-native";
import styles from "@/assets/styles/home.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "@/constants/colors";

const DUMMY_POSTS = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=john",
    },
    book: {
      title: "The Hunger Games",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg",
      rating: 4,
      review: "A dystopian tale of survival, rebellion, and sacrifice.",
      date: "3/9/2025",
    },
  },
  {
    id: "2",
    user: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=jane",
    },
    book: {
      title: "The Great Gatsby",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
      rating: 5,
      review: "A classic story of wealth, love, and the American dream in the 1920s.",
      date: "3/9/2025",
    },
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = DUMMY_POSTS.filter((post) =>
    post.book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={18}
            color={star <= rating ? "#FFD700" : "#C1C1C1"}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BookWorm 🐛</Text>
        <Text style={styles.headerSubtitle}>
          Discover great reads from the community 👇
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a book..."
          placeholderTextColor={COLORS.placeholderText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <View key={post.id} style={styles.bookCard}>
              <View style={styles.userInfo}>
                <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                <Text style={styles.username}>{post.user.name}</Text>
              </View>

              <View style={styles.bookImageContainer}>
                <Image source={{ uri: post.book.image }} style={styles.bookImage} resizeMode="cover" />
              </View>

              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{post.book.title}</Text>
                {renderStars(post.book.rating)}
                <Text style={styles.caption}>{post.book.review}</Text>
                <Text style={styles.date}>{post.book.date}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubtext}>
              Try searching for a different title
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;