import styles from "@/assets/styles/savedBooks.styles";
import SafeScreen from "@/components/SafeScreen";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SavedBook {
  _id: string;
  title: string;
  image: string;
  auther?: string;
  caption: string;
  rating: number;
  category?: string;
}

const SavedBooks = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const filteredBooks = savedBooks.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.auther && book.auther.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSavedBooks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://10.0.2.2:5050/api/v1/books/saved`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      setSavedBooks(data.data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleRemoveSavedBook = async (bookId: string) => {
    try {
      const { data } = await axios.delete(`http://10.0.2.2:5050/api/v1/books/save/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      setSavedBooks((prev) => prev.filter((book) => book._id !== bookId));
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  }

  useEffect(() => {
    getSavedBooks();
  }, []);

  const handleRemove = (id: string, title: string) => {
    Alert.alert(
      "Remove from List",
      `Are you sure you want to remove "${title}" from your saved books?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            handleRemoveSavedBook(id);
          },
        },
      ]
    );
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= fullStars ? "star" : "star-outline"}
            size={14}
            color={star <= fullStars ? "#FFD700" : "#C1C1C1"}
            style={{ marginRight: 2 }}
          />
        ))}
        <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginLeft: 4, fontWeight: '600' }}>
          {rating.toFixed(1)}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: SavedBook }) => (
    <TouchableOpacity
      style={styles.bookItem}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/book-details/[id]",
          params: { id: item._id },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.bookImage} resizeMode="cover" />
      <View style={styles.bookDetails}>
        <View>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            by {item.auther || "Unknown Author"}
          </Text>
          {renderStars(item.rating)}
        </View>
        
        <View style={styles.bottomRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category || "General"}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item._id, item.title)}
            activeOpacity={0.6}
          >
            <Ionicons name="trash" size={18} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && savedBooks.length === 0) {
    return (
      <SafeScreen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>My List 📚</Text>
            <Text style={styles.headerSubtitle}>Saved for later</Text>
          </View>
          {savedBooks.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{savedBooks.length} Books</Text>
            </View>
          )}
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your list..."
            placeholderTextColor={COLORS.placeholderText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {savedBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={[styles.emptyContainer, { marginTop: 40 }]}>
              <Ionicons name="search-outline" size={60} color={COLORS.border} />
              <Text style={styles.emptyTitle}>No matches found</Text>
              <Text style={styles.emptySubtitle}>
                Try a different search term to find your book.
              </Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={{ backgroundColor: COLORS.white, padding: 30, borderRadius: 50, marginBottom: 10 }}>
            <Ionicons name="bookmark" size={80} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your list is empty</Text>
          <Text style={styles.emptySubtitle}>
            Start exploring books and save your favorites here to read them later!
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            activeOpacity={0.8}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.exploreButtonText}>Discover Books 🐛</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeScreen>
  );
};

export default SavedBooks;
