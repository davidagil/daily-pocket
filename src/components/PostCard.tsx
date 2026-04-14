import { darkColors, lightColors, useThemeMode } from "@/context/ThemeContext";
import { Post, PostLink } from "@/hooks/usePosts";
import { formatTimeAgo, formatTimeRemaining } from "@/lib/date-helper";
import { Image } from "expo-image";
import React from "react";
import {
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

const PostCard = ({ post }: PostCardProps) => {
  const { isDark } = useThemeMode();
  const colors = isDark ? darkColors : lightColors;

  const postUser = post.profiles;
  const numColumns = post.postLinks.length > 1 ? 3 : 1;

  const renderPostLink = ({ item }: { item: PostLink }) => {
    return (
      <TouchableOpacity
        style={[
          styles.linkCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() => Linking.openURL(item.url)}
        activeOpacity={0.7}
      >
        <Text style={[styles.linkTitle, { color: colors.text }]}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.postContainer,
        {
          backgroundColor: colors.cardBackground,
          shadowOpacity: isDark ? 0.18 : 0.1,
        },
      ]}
    >
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          {postUser?.profile_image_url ? (
            <Image
              cachePolicy="none"
              source={{ uri: postUser.profile_image_url }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                styles.avatarPlaceholder,
                { backgroundColor: colors.card },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  { color: colors.mutedText },
                ]}
              >
                {postUser?.name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
          )}

          <View>
            <Text style={[styles.username, { color: colors.text }]}>
              @{postUser?.username}
            </Text>
            <Text style={[styles.timeAgo, { color: colors.mutedText }]}>
              {formatTimeAgo(post.created_at)}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.timeRemainingBadge,
            {
              backgroundColor: colors.text,
            },
          ]}
        >
          <Text
            style={[
              styles.timeRemainingText,
              { color: isDark ? colors.background : "#fff" },
            ]}
          >
            {formatTimeRemaining(post.expired_at)}
          </Text>
        </View>
      </View>

      <Image
        cachePolicy="none"
        source={{ uri: post.image_url }}
        style={[
          styles.postImage,
          { backgroundColor: colors.card },
        ]}
        contentFit="cover"
      />

      <View style={styles.postFooter}>
        {post.description && (
          <Text style={[styles.postDescription, { color: colors.text }]}>
            {post.description}
          </Text>
        )}

        {post.postLinks?.length > 0 && (
          <FlatList
            key={`post-links-${post.id}-${numColumns}`}
            data={post.postLinks}
            renderItem={renderPostLink}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            scrollEnabled={false}
            columnWrapperStyle={numColumns > 1 ? styles.linksRow : undefined}
            contentContainerStyle={styles.linksContainer}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  timeAgo: {
    fontSize: 12,
  },
  timeRemainingBadge: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeRemainingText: {
    fontSize: 12,
    fontWeight: "600",
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
  },
  postFooter: {
    padding: 16,
    gap: 10,
  },
  postDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  linksContainer: {
    gap: 8,
  },
  linksRow: {
    gap: 8,
    marginBottom: 8,
  },
  linkCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default PostCard;