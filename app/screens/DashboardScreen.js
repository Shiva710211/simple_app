import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
} from "react-native";

import DestinationCard from "../components/DestinationCard";
import { destinationsData } from "../data/destination";

const { width } = Dimensions.get("window");

const CATEGORIES = ["All", "Beach", "Mountain", "City", "Forest"];

export default function DashboardScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [destinations, setDestinations] = useState(destinationsData);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;

  const toggleFavorite = (id) => {
    const updated = destinations.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item,
    );
    updated.sort((a, b) => b.favorite - a.favorite);
    setDestinations(updated);
  };

  const filteredData = destinations.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const onSearchFocus = () => {
    setSearchFocused(true);
    Animated.timing(searchAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const onSearchBlur = () => {
    setSearchFocused(false);
    Animated.timing(searchAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const searchBorder = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e8ddd0", "#c9956a"],
  });

  const favCount = destinations.filter((d) => d.favorite).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf8f3" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning ✦</Text>
          <Text style={styles.headline}>Where to next?</Text>
        </View>
        <View style={styles.favBadgeWrap}>
          <View style={styles.favBadge}>
            <Text style={styles.favIcon}>♡</Text>
            {favCount > 0 && (
              <View style={styles.favCount}>
                <Text style={styles.favCountText}>{favCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Animated.View style={[styles.searchWrap, { borderColor: searchBorder }]}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          placeholder="Search destinations..."
          placeholderTextColor="#b8a898"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
          selectionColor="#c9956a"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>
          {search ? `Results for "${search}"` : "Featured Destinations"}
        </Text>
        <Text style={styles.sectionCount}>{filteredData.length} places</Text>
      </View>

      <FlatList
        horizontal
        data={filteredData}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardList}
        snapToInterval={width * 0.72 + 16}
        decelerationRate="fast"
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyGlyph}>◎</Text>
            <Text style={styles.emptyText}>No destinations found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <DestinationCard
            item={item}
            onFavorite={() => toggleFavorite(item.id)}
            onPress={() =>
              navigation.navigate("Details", { destination: item })
            }
          />
        )}
      />

      <View style={styles.bottomHint}>
        <Text style={styles.bottomHintText}>
          Swipe to explore · Tap to discover
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf8f3",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 12,
    color: "#c9956a",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headline: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1209",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: -0.8,
  },
  favBadgeWrap: {
    paddingTop: 6,
  },
  favBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#fff5ec",
    borderWidth: 1.5,
    borderColor: "#f0ddd0",
    alignItems: "center",
    justifyContent: "center",
  },
  favIcon: {
    fontSize: 20,
    color: "#c9956a",
  },
  favCount: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#c9956a",
    alignItems: "center",
    justifyContent: "center",
  },
  favCountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 2,
    shadowColor: "#c9956a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    color: "#b8a898",
    marginRight: 8,
    lineHeight: 28,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1a1209",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.2,
  },
  clearBtn: {
    fontSize: 13,
    color: "#b8a898",
    paddingHorizontal: 4,
  },

  chipsRow: {
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5ede4",
    borderWidth: 1,
    borderColor: "#e8ddd0",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#c9956a",
    borderColor: "#c9956a",
    shadowColor: "#c9956a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  chipText: {
    fontSize: 13,
    color: "#8a7060",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1209",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: -0.2,
  },
  sectionCount: {
    fontSize: 12,
    color: "#b8a898",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },

  cardList: {
    paddingLeft: 24,
    paddingRight: 8,
  },

  emptyWrap: {
    width: width - 48,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5ede4",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#e8ddd0",
    borderStyle: "dashed",
  },
  emptyGlyph: {
    fontSize: 36,
    color: "#c9956a",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#b8a898",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },

  bottomHint: {
    paddingVertical: 20,
    alignItems: "center",
  },
  bottomHintText: {
    fontSize: 11,
    color: "#c9b8a8",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
});
