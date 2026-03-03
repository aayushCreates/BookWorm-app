import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@/components/SafeScreen";
import COLORS from "@/constants/colors";
import styles from "@/assets/styles/savedBooks.styles";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const SAVED_BOOKS_DUMMY = [
  {
    id: "1",
    title: "The Hunger Games",
    author: "Suzanne Collins",
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg",
    rating: 4.8,
    category: "Dystopian",
  },
  {
    id: "2",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
    rating: 4.5,
    category: "Classic",
  },
  {
    id: "3",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595703765i/23692271.jpg",
    rating: 4.9,
    category: "History",
  },
];

const SavedBooks = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedBooks, setSavedBooks] = useState(SAVED_BOOKS_DUMMY);
  const { token } = useAuthStore();

  const filteredBooks = savedBooks.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSavedBooks = async ()=> {
    try {
        const { data } = await axios.get(`http://10.0.2.2:5050/api/v1/books/saved`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          if(!data.success) {
            throw new Error(data.message || "Something went wrong");
          }
    
          setSavedBooks(data.data);
    }catch(err: any) {
        Alert.alert("Error", err.message);
    }
  }

  const handleRemoveSavedBook = async (bookId: string)=> {
    try {
        const { data } = await axios.delete(`http://10.0.2.2:5050/api/v1/books/saved/${bookId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          if(!data.success) {
            throw new Error(data.message || "Something went wrong");
          }
    
        setSavedBooks((prev) => prev.filter((book) => book.id !== bookId));
    }catch(err: any) {
        Alert.alert("Error", err.message);
    }
  }

  useEffect(()=> {
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

  const renderItem = ({ item }: { item: typeof SAVED_BOOKS_DUMMY[0] }) => (
    <TouchableOpacity
      style={styles.bookItem}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/book-details/[id]",
          params: { id: item.id },
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
            by {item.author}
          </Text>
          {renderStars(item.rating)}
        </View>
        
        <View style={styles.bottomRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item.id, item.title)}
            activeOpacity={0.6}
          >
            <Ionicons name="trash" size={18} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          keyExtractor={(item) => item.id}
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
