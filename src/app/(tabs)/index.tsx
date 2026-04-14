// import PostCard from '@/components/PostCard';
// import { useAuth } from '@/context/AuthContext';
// import { Post, usePosts } from '@/hooks/usePosts';
// import { Image } from 'expo-image';
// import * as ImagePicker from 'expo-image-picker';
// import React, { useState } from "react";
// import { ActivityIndicator, Alert, FlatList, Modal, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// type PostLinkInput = {
//   url: string;
//   description: string;
// }


// export default function Index() {
//   // Auth
//   const { user } = useAuth();

//   // State
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [description, setDescription] = useState<string>("");
//   const [showPreview, setShowPreview] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [refreshing, setIsRefreshing] = useState(false);
//   const [links, setLinks] = useState<PostLinkInput[]>([
//     {url: "", description: ""},
//   ])

//   // Hooks
//   const { createPost, posts, refreshPosts } = usePosts();

//    // Check if user has an active post
//    const userActivePost = posts?.find(
//     (post) =>
//       post.user_id === user?.id &&
//       post.is_active &&
//       new Date(post.expired_at) > new Date(),
//   );

//   const hasActivePost = !!userActivePost;

//   const onRefresh = async () => {
//     setIsRefreshing(true);
//     try {
//       await refreshPosts();
//     } catch (error) {
//       console.error("Error refreshing posts:", error);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   posts?.forEach((post) => {
//     console.log("checking post", {
//       postUserId: post.user_id,
//       currentUserId: user?.id,
//       sameUser: post.user_id === user?.id,
//       isActive: post.is_active,
//       expiredAt: post.expired_at,
//       expiresInFuture: new Date(post.expired_at).getTime() > Date.now(),
//     });
//   });

//   const handlePost = async () => {
//     if (!previewImage) return;

//     const validLinks = links.filter(
//       (link) => link.url.trim() && link.description.trim()
//     );
    
//     setIsUploading(true);
//     try {
//       await createPost(previewImage, description, validLinks);
//       resetModal();

//     } catch (err) {
//       console.error("Error creating post: ", err);
//       Alert.alert("Error", "Failed to create post. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   }

//   const pickImage = async () =>  {
//     const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission to access camera roll.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'],
//       allowsEditing: true,
//       // A square because avatar is a circle
//       aspect: [1,1],
//       quality: 0.8
//     });

//     // If they picked an image
//     if(!result.canceled && result.assets[0]){
//       setPreviewImage(result.assets[0].uri);
//       setShowPreview(true);
//       setDescription("");
//     }
//   }

//   const takePhoto = async () => {
//     const {status} = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission to access camera.');
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       // A square because avatar is a circle
//       aspect: [1,1],
//       quality: 0.8
//     });

//     // If they picked an image
//     if(!result.canceled && result.assets[0]){
//       setPreviewImage(result.assets[0].uri);
//       setShowPreview(true);
//       setDescription("");
//     }
//   }

//   const showImagePicker = () => {
//     Alert.alert("Select Profile Image", "Choose an option", [
//       {text: 'Camera', onPress: takePhoto},
//       {text: 'Photo Library', onPress: pickImage},
//       {text: "Cancel", style: 'cancel'}
//     ])
//   }

//   const addLinkField = () => {
//     setLinks((prev) => [...prev, { url: "", description: "" }]);
//   };
  
//   const removeLinkField = (index: number) => {
//     setLinks((prev) => prev.filter((_, i) => i !== index));
//   };
  
//   const updateLinkField = (
//     index: number,
//     field: keyof PostLinkInput,
//     value: string
//   ) => {
//     setLinks((prev) =>
//       prev.map((link, i) =>
//         i === index ? { ...link, [field]: value } : link
//       )
//     );
//   };
  
//   const resetModal = () => {
//     setShowPreview(false);
//     setPreviewImage(null);
//     setDescription("");
//     setLinks([{ url: "", description: "" }]);
//   };

//   const renderPost = ({item}: {item: Post}) => (
//     <PostCard post={item} currentUserId={user?.id} />
//   )

//   return (
//     <SafeAreaView style={styles.container} edges={["bottom", "top"]}>
//       {/* Post List */}
//       <FlatList 
//         data={posts} 
//         renderItem={renderPost} 
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={posts?.length === 0 ? styles.emptyContent : styles.content}
//         ListEmptyComponent={<Text>No Posts found</Text>}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
//       />
    

//       <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
//         <Text style={styles.fabText}>{hasActivePost ? "↻" : "+"}</Text>
//         {/* <Text style={styles.fabText}>+</Text>  */}
//       </TouchableOpacity>

//     <Modal visible={showPreview} transparent animationType='fade'>
//     <ScrollView>
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>{hasActivePost ? "Update Today's Carry": "Preview Today's Carry"}</Text>
//           {/* <Text style={styles.modalTitle}>Preview today's carry</Text> */}
//           {previewImage && (<Image source={{uri: previewImage}} style={styles.previewImage} contentFit='cover'/>)}

//           <TextInput style={styles.descriptionInput}
//             placeholder="Description (optional)"
//             placeholderTextColor="#999"
//             value={description}
//             onChangeText={setDescription}
//             multiline
//             maxLength={500}
//             textAlignVertical='top'
//           />

//         <Text style={styles.sectionTitle}>Links</Text>

//         {links.map((link, index) => (
//           <View key={index} style={styles.linkCard}>
//             <TextInput
//               style={styles.linkInput}
//               placeholder="https://example.com"
//               placeholderTextColor="#999"
//               value={link.url}
//               onChangeText={(text) => updateLinkField(index, "url", text)}
//               autoCapitalize="none"
//               keyboardType="url"
//             />

//               <TextInput
//                 style={styles.linkInput}
//                 placeholder="Link description"
//                 placeholderTextColor="#999"
//                 value={link.description}
//                 onChangeText={(text) => updateLinkField(index, "description", text)}
//               />

//           {links.length > 1 && (
//             <TouchableOpacity
//               style={styles.removeLinkButton}
//               onPress={() => removeLinkField(index)}
//             >
//               <Text style={styles.removeLinkButtonText}>Remove</Text>
//             </TouchableOpacity>
//           )}
//           </View>
//           ))}

//           <TouchableOpacity style={styles.addLinkButton} onPress={addLinkField}>
//             <Text style={styles.addLinkButtonText}>+ Add Link</Text>
//           </TouchableOpacity>

//           <View style={styles.modalButtons}>
//             <TouchableOpacity style={[styles.modalButton, styles.postButton]} onPress={handlePost} disabled={isUploading}>
//               {isUploading ? <ActivityIndicator size={24} color="#fff" /> : (
//                 <Text style={styles.postButtonText}>"Post"</Text>
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={resetModal}>
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//       </ScrollView>
//     </Modal>
  
//    </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   fab: {
//     position: "absolute",
//     bottom: 104,
//     right: 24,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8
//   },
//   fabText: {
//     color: "#fff",
//     fontSize: 32,
//     fontWeight: "300",
//     lineHeight: 32,
//   },
//   image: {
//     width: 100,
//     height: 100,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.8)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//     overflowY: "show"
//   },
//   modalContent: {
//     marginTop: 35,
//     marginBottom: 35,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 24,
//     width: "100%",
//     maxWidth: 400,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   previewImage: {
//     width: "100%",
//     aspectRatio: 1,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   descriptionInput: {
//     width: "100%",
//     minHeight: 80,
//     maxHeight: 120,
//     backgroundColor: "f5f5f5",
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     color: "#000",
//   },
//   modalButtons: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   modalButton: {
//     flex :1,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   cancelButton: {
//     backgroundColor: "#f5f5f5"
//   },
//   cancelButtonText: {
//     color: "#000",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   postButton: {
//     backgroundColor: "#000"
//   },
//   postButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 12,
//     color: "#000",
//   },
//   linkCard: {
//     backgroundColor: "#fafafa",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//   },
//   linkInput: {
//     width: "100%",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 15,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     color: "#000",
//   },
//   addLinkButton: {
//     borderWidth: 1,
//     borderColor: "#000",
//     borderRadius: 12,
//     padding: 12,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   addLinkButtonText: {
//     color: "#000",
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   removeLinkButton: {
//     alignSelf: "flex-end",
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//   },
//   removeLinkButtonText: {
//     color: "#d11a2a",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   emptyContent: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 100,
//   }
// });

import PostCard from "@/components/PostCard";
import { useAuth } from "@/context/AuthContext";
import { darkColors, lightColors, useThemeMode } from "@/context/ThemeContext";
import { Post, usePosts } from "@/hooks/usePosts";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PostLinkInput = {
  url: string;
  description: string;
};

export default function Index() {
  const { user } = useAuth();
  const { isDark } = useThemeMode();
  const colors = isDark ? darkColors : lightColors;

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [refreshing, setIsRefreshing] = useState(false);
  const [links, setLinks] = useState<PostLinkInput[]>([
    { url: "", description: "" },
  ]);

  const { createPost, posts, refreshPosts } = usePosts();

  const userActivePost = posts?.find(
    (post) =>
      post.user_id === user?.id &&
      post.is_active &&
      new Date(post.expired_at) > new Date()
  );

  const hasActivePost = !!userActivePost;

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshPosts();
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePost = async () => {
    if (!previewImage) return;

    const validLinks = links.filter(
      (link) => link.url.trim() && link.description.trim()
    );

    setIsUploading(true);
    try {
      await createPost(previewImage, description, validLinks);
      resetModal();
    } catch (err) {
      console.error("Error creating post: ", err);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access camera roll.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPreviewImage(result.assets[0].uri);
      setShowPreview(true);
      setDescription("");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPreviewImage(result.assets[0].uri);
      setShowPreview(true);
      setDescription("");
    }
  };

  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const addLinkField = () => {
    setLinks((prev) => [...prev, { url: "", description: "" }]);
  };

  const removeLinkField = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLinkField = (
    index: number,
    field: keyof PostLinkInput,
    value: string
  ) => {
    setLinks((prev) =>
      prev.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    );
  };

  const resetModal = () => {
    setShowPreview(false);
    setPreviewImage(null);
    setDescription("");
    setLinks([{ url: "", description: "" }]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard post={item} currentUserId={user?.id} />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom", "top"]}
    >
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          posts?.length === 0 ? styles.emptyContent : styles.content
        }
        ListEmptyComponent={
          <Text style={{ color: colors.mutedText }}>No Posts found</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.text }]}
        onPress={showImagePicker}
      >
        <Text
          style={[
            styles.fabText,
            { color: isDark ? colors.background : "#fff" },
          ]}
        >
          {hasActivePost ? "↻" : "+"}
        </Text>
      </TouchableOpacity>

      <Modal visible={showPreview} transparent animationType="fade">
        <ScrollView>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.9)"
                  : "rgba(0, 0, 0, 0.8)",
              },
            ]}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {hasActivePost
                  ? "Update Today's Carry"
                  : "Preview Today's Carry"}
              </Text>

              {previewImage && (
                <Image
                  source={{ uri: previewImage }}
                  style={styles.previewImage}
                  contentFit="cover"
                />
              )}

              <TextInput
                style={[
                  styles.descriptionInput,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Description (optional)"
                placeholderTextColor={colors.mutedText}
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
                textAlignVertical="top"
              />

              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Links
              </Text>

              {links.map((link, index) => (
                <View
                  key={index}
                  style={[
                    styles.linkCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <TextInput
                    style={[
                      styles.linkInput,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="https://example.com"
                    placeholderTextColor={colors.mutedText}
                    value={link.url}
                    onChangeText={(text) =>
                      updateLinkField(index, "url", text)
                    }
                    autoCapitalize="none"
                    keyboardType="url"
                  />

                  <TextInput
                    style={[
                      styles.linkInput,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="Link description"
                    placeholderTextColor={colors.mutedText}
                    value={link.description}
                    onChangeText={(text) =>
                      updateLinkField(index, "description", text)
                    }
                  />

                  {links.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeLinkButton}
                      onPress={() => removeLinkField(index)}
                    >
                      <Text style={styles.removeLinkButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={[
                  styles.addLinkButton,
                  { borderColor: colors.text },
                ]}
                onPress={addLinkField}
              >
                <Text
                  style={[styles.addLinkButtonText, { color: colors.text }]}
                >
                  + Add Link
                </Text>
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.postButton,
                    { backgroundColor: colors.text },
                  ]}
                  onPress={handlePost}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator
                      size={24}
                      color={isDark ? colors.background : "#fff"}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.postButtonText,
                        { color: isDark ? colors.background : "#fff" },
                      ]}
                    >
                      Post
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.cancelButton,
                    { backgroundColor: colors.card },
                  ]}
                  onPress={resetModal}
                >
                  <Text
                    style={[styles.cancelButtonText, { color: colors.text }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    bottom: 104,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
  },
  image: {
    width: 100,
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    marginTop: 35,
    marginBottom: 35,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  descriptionInput: {
    width: "100%",
    minHeight: 80,
    maxHeight: 120,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {},
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postButton: {},
  postButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  linkCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  linkInput: {
    width: "100%",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
  },
  addLinkButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addLinkButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  removeLinkButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  removeLinkButtonText: {
    color: "#d11a2a",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
});
