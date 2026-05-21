import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";

const { width, height } = Dimensions.get("window");
const IMAGE_HEIGHT = height * 0.52;

export default function DetailsScreen({ route, navigation }) {
  const { destination } = route.params;
  const scrollY = useRef(new Animated.Value(0)).current;

  const imageTranslate = scrollY.interpolate({
    inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
    outputRange: [IMAGE_HEIGHT * 0.5, 0, -IMAGE_HEIGHT * 0.3],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [IMAGE_HEIGHT - 100, IMAGE_HEIGHT - 40],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const stats = [
    { label: "Rating", value: destination.rating ?? "4.8", unit: "★" },
    { label: "Duration", value: destination.duration ?? "5–7", unit: "days" },
    { label: "Distance", value: destination.distance ?? "2.4", unit: "km" },
  ];

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <Text style={styles.stickyTitle} numberOfLines={1}>
          {destination.title}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroll}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Animated.Image
            source={{ uri: destination.image }}
            style={[
              styles.heroImage,
              { transform: [{ translateY: imageTranslate }] },
            ]}
            resizeMode="cover"
          />
          <View style={styles.imageGradient} />
          <View style={styles.heroTextWrap}>
            {destination.country && (
              <View style={styles.countryTag}>
                <Text style={styles.countryText}>{destination.country}</Text>
              </View>
            )}
            <Text style={styles.heroTitle}>{destination.title}</Text>
            {destination.location && (
              <Text style={styles.heroLocation}>⌖ {destination.location}</Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <Text style={styles.description}>{destination.description}</Text>
          {destination.tags && destination.tags.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>HIGHLIGHTS</Text>
              <View style={styles.tagsWrap}>
                {destination.tags.map((tag, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fdf8f3",
  },

  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: "#1a1209",
    paddingTop: Platform.OS === "ios" ? 52 : 36,
    paddingBottom: 14,
    paddingHorizontal: 68,
    alignItems: "center",
  },
  stickyTitle: {
    color: "#fdf8f3",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.3,
  },

  scroll: {
    flex: 1,
  },

  imageContainer: {
    height: IMAGE_HEIGHT,
    overflow: "hidden",
  },
  heroImage: {
    width,
    height: IMAGE_HEIGHT * 1.3,
    position: "absolute",
    top: 0,
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT * 0.65,
    backgroundColor: "transparent",
    borderBottomLeftRadius: 0,
  },
  heroTextWrap: {
    position: "absolute",
    bottom: 28,
    left: 24,
    right: 24,
  },
  countryTag: {
    alignSelf: "flex-start",
    backgroundColor: "#c9956a",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  countryText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: -0.8,
    lineHeight: 42,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 6,
  },
  heroLocation: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.4,
  },

  card: {
    backgroundColor: "#fdf8f3",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingTop: 28,
    paddingHorizontal: 24,
    minHeight: height * 0.6,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2.5,
    color: "#c9956a",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: "#4a3828",
    lineHeight: 26,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.15,
    marginBottom: 24,
  },

  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: "#fff5ec",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f0ddd0",
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#8a7060",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.3,
  },
});
