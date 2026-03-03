import styles from "@/assets/styles/home.styles";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/auth.store";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

interface Book {
  _id: string;
  title: string;
  image: string;
  userId: {
    _id: string;
    name: string;
    avatar: string;
  }
  auther?: string;
  caption: string;
  rating: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuthStore();
  const [books, setBooks] = useState<Book[]>([]);

  const getBooks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://10.0.2.2:5050/api/v1/book`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      setBooks(data.data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getBooks();
  }, []);

  const filteredPosts = books.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Pressable 
                key={post._id}
                onPress={()=> router.push({
                  pathname: '/book-details/[id]',
                  params: {
                    id: post._id
                  }
                })}
              >
                <View style={styles.bookCard}>
                  <View style={styles.userInfo}>
                    <Image
                      source={{ uri: post.userId.avatar || `https://ui-avatars.com/api/?name=${post.userId.name}&background=random` }}
                      style={styles.avatar}
                    />
                    <Text style={styles.username}>{post.userId.name}</Text>
                  </View>

                  <View style={styles.bookImageContainer}>
                    <Image
                      source={{ uri: post.image }}
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
                      <Text style={styles.bookTitle}>{post.title}</Text>
                      {post.category && (
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
                            {post.category.toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                    {renderStars(post.rating)}
                    <Text style={styles.caption} numberOfLines={3}>{post.caption}</Text>
                    <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
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
      )}
    </View>
  );
};

export default Index;
