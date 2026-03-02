import styles from "@/assets/styles/home.styles";
import COLORS from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES = [
  "All",
  "Fiction",
  "Classic",
  "Dystopian",
  "Fantasy",
  "History",
];

const DUMMY_POSTS = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=john",
    },
    book: {
      title: "The Hunger Games",
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg",
      rating: 4,
      review: "A dystopian tale of survival, rebellion, and sacrifice.",
      date: "3/9/2025",
      category: "Dystopian",
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
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
      rating: 5,
      review:
        "A classic story of wealth, love, and the American dream in the 1920s.",
      date: "3/9/2025",
      category: "Classic",
    },
  },
  {
    id: "3",
    user: {
      name: "Alex Smith",
      avatar: "https://i.pravatar.cc/150?u=alex",
    },
    book: {
      title: "Sapiens",
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595703765i/23692271.jpg",
      rating: 5,
      review:
        "A thought-provoking exploration of human history and our species' evolution.",
      date: "3/9/2025",
      category: "History",
    },
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();

  const filteredPosts = DUMMY_POSTS.filter((post) => {
    const matchesSearch = post.book.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

      {/* search input */}
      <View style={{ marginBottom: 15 }}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a book..."
            placeholderTextColor={COLORS.placeholderText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* filters */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={{ paddingRight: 32 }}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryBadge,
                selectedCategory === category && styles.categoryBadgeActive,
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* books post */}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Pressable 
            key={post.id}
            onPress={()=> router.push({
              pathname: '/book-details/[id]',
              params: {
                id: post.id
              }
            })}
            >
              <View key={post.id} style={styles.bookCard}>
                <View style={styles.userInfo}>
                  <Image
                    source={{ uri: post.user.avatar }}
                    style={styles.avatar}
                  />
                  <Text style={styles.username}>{post.user.name}</Text>
                </View>

                <View style={styles.bookImageContainer}>
                  <Image
                    source={{ uri: post.book.image }}
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.bookDetails}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.bookTitle}>{post.book.title}</Text>
                    <View
                      style={{
                        backgroundColor: COLORS.background,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "700",
                          color: COLORS.primary,
                        }}
                      >
                        {post.book.category.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  {renderStars(post.book.rating)}
                  <Text style={styles.caption}>{post.book.review}</Text>
                  <Text style={styles.date}>{post.book.date}</Text>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubtext}>
              Try searching for a different title or category
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
