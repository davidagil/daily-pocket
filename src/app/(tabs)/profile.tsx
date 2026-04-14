// import { useAuth } from "@/context/AuthContext";
// import { darkColors, lightColors, useThemeMode } from "@/context/ThemeContext";
// import { Image } from "expo-image";
// import React, { useState } from "react";
// import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { uploadProfileImage } from "@/lib/storage";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";

// export default function Profile() {

//   const router = useRouter();

//   const { user, updateUser, signOut } = useAuth();
//   const [isUpdating, setIsUpdating] = useState(false);

//   const { isDark, toggleTheme } = useThemeMode();
//   const colors = isDark ? darkColors : lightColors;

//   const handleSignOut = async () => {
//     Alert.alert("Sign Out", "Are you sure you would like to sign out?", [
//       {text: "Cancel", style: "cancel"},
//       {text: "Sign Out", style: "destructive", onPress: async () => {
//         await signOut();
//         router.replace("/(auth)/login");
//       }},
//     ])
//   }

//   const handleUpdateProfileImage = async () => {
//     if(!user) return

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
//       setIsUpdating(true);
//       try {
//         const imageUrl = await uploadProfileImage(user.id, result.assets[0].uri);
//         await updateUser({profileImage: imageUrl})
//         Alert.alert("Success", "Profile image updated.");
//         return;
//       } catch (error) {
//         Alert.alert("Error", "Failed to update profile image.")
//         console.error("Error updating profile image: ", error);
//       } finally {
//         setIsUpdating(false);
//       }
//     }
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={["top", "bottom"]}>

//       <ScrollView contentContainerStyle={styles.content}>
//         <View style={styles.profileSection}>
//           <TouchableOpacity onPress={handleUpdateProfileImage} disabled={isUpdating}>
//             <View>
//             {user?.profileImage ? (
//                   <Image
//                     cachePolicy={"none"}
//                     source={{ uri: user.profileImage }}
//                     style={styles.profileImage}
//                   />
//                 ) : (
//                   <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
//                     <Text style={styles.profileImageText}>
//                       {user?.name?.[0]?.toUpperCase() || "U"}
//                     </Text>
//                   </View>
//                 )}

//                 <View style={styles.editBadge}>
//                   <Text style={styles.editBadgeText}>
//                     Edit
//                   </Text>
//                 </View>
//             </View>
//           </TouchableOpacity>
//           <Text style={styles.name}>{user?.name || "No Name"}</Text>
//           <Text style={styles.username}>@{user?.username || "No Username"}</Text>
//           <Text style={styles.email}>{user?.email}</Text>
//         </View>

//         <View style={[styles.row, styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
//           <Text style={[styles.label, { color: colors.text }]}>Dark mode</Text>
//           <Switch value={isDark} onValueChange={toggleTheme} />
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Account</Text>
//           <TouchableOpacity style={styles.settingItem}>
//             <Text style={styles.settingLabel}>Edit Profile</Text>
//             <Text style={styles.settingValue}>→</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.settingItem}>
//             <Text style={styles.settingLabel}>Notifications</Text>
//             <Text style={styles.settingValue}>→</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.settingItem}>
//             <Text style={styles.settingLabel}>Privacy</Text>
//             <Text style={styles.settingValue}>→</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>About</Text>
//           <TouchableOpacity style={styles.settingItem}>
//             <Text style={styles.settingLabel}>Help & Support</Text>
//             <Text style={styles.settingValue}>→</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.settingItem}>
//             <Text style={styles.settingLabel}>Terms of Service</Text>
//             <Text style={styles.settingValue}>→</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.settingItem}>
//             <Text style={styles.settingLabel}>Privacy Policy</Text>
//             <Text style={styles.settingValue}>→</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.section}>
//           <TouchableOpacity style={[styles.settingItem, styles.signOutButton]}>
//             <Text onPress={handleSignOut} style={styles.signOutText}>Sign Out</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.settingItem, styles.deleteButton]}>
//             <Text style={styles.deleteText}>Delete Account</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff"
//   },
//  content: {
//   padding: 32,
//  },
//  profileSection: {
//   alignItems: "center",
//   marginBottom: 32,
//   paddingBottom: 32,
//   borderBottomWidth: 1,
//   borderBottomColor: "#f0f0f0",
//  },
//  profileScreen: {

//  },
//  profileImage: {
//   width: 100,
//   height: 100,
//   borderRadius:50,
//   marginBottom: 10
//  },
//  profileImagePlaceholder: {
//   backgroundColor: "#f0f0f0",
//   justifyContent: "center",
//   alignItems: "center",
//  },
//  profileImageText: {
//   fontSize: 40,
//   fontWeight: "600",
//   color: "#666",
//  },
//  editBadge: {
//   position: "absolute",
//   bottom: 6,
//   left: "50%",
//   transform: [{translateX: -22}],
//   backgroundColor: "#000",
//   paddingHorizontal: 12,
//   paddingVertical: 6,
//   borderRadius: 16,
//  },
//  editBadgeText: {
//   color: "#fff",
//   fontSize: 12,
//   fontWeight: "600",
//  },
//  name: {
//   fontSize: 24,
//   fontWeight: "bold",
//   marginBottom: 4,
//   color: "#000"
//  },
//  username: {
//   fontSize: 16,
//   color:  "#666",
//   marginBottom: 4,
//  },
//  email: {
//   fontSize: 14,
//   color:  "#999",
//  },
//  section: {
//   marginBottom: 32
//  },
//  sectionTitle: {
//   fontSize: 18,
//   fontWeight: "600",
//   marginBottom: 16,
//   color: "#000"
//  },
//  settingItem: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "center",
//   paddingVertical: 16,
//   paddingHorizontal: 16,
//   backgroundColor: "#f9f9f9",
//   borderRadius: 12,
//   marginBottom: 8
//  },
//  settingLabel: {
//   fontSize: 18,
//   color: "#999"
//  },
//  settingValue: {
    
//  },
//  signOutButton: {
//   backgroundColor: "#f5f5f5",
//   marginBottom: 8
//  },
//  signOutText: {
//   fontSize: 16,
//   color: "#000",
//   fontWeight: "500"
//  },
//  deleteButton: {
//   fontSize: 16,
//   backgroundColor: "#fff",
//   borderColor: "#ff3b30",
//   borderWidth: 1
//  },
//  deleteText: {
//   fontSize: 16,
//   color: "#ff3b30",
//   fontWeight: "bold"
//  },
//  row: {
//   borderWidth: 1,
//   borderRadius: 14,
//   padding: 16,
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "center",
// },
// label: {
//   fontSize: 16,
//   fontWeight: "600",
// },
// });

import { useAuth } from "@/context/AuthContext";
import { darkColors, lightColors, useThemeMode } from "@/context/ThemeContext";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { uploadProfileImage } from "@/lib/storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  const { user, updateUser, signOut } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const { isDark, toggleTheme } = useThemeMode();
  const colors = isDark ? darkColors : lightColors;

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you would like to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleUpdateProfileImage = async () => {
    if (!user) return;

    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      setIsUpdating(true);
      try {
        const imageUrl = await uploadProfileImage(
          user.id,
          result.assets[0].uri
        );
        await updateUser({ profileImage: imageUrl });

        Alert.alert("Success", "Profile image updated.");
      } catch (error) {
        Alert.alert("Error", "Failed to update profile image.");
        console.error(error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile */}
        <View
          style={[
            styles.profileSection,
            { borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity
            onPress={handleUpdateProfileImage}
            disabled={isUpdating}
          >
            <View>
              {user?.profileImage ? (
                <Image
                  cachePolicy="none"
                  source={{ uri: user.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={[
                    styles.profileImage,
                    styles.profileImagePlaceholder,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <Text
                    style={[
                      styles.profileImageText,
                      { color: colors.mutedText },
                    ]}
                  >
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </Text>
                </View>
              )}

              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>Edit</Text>
              </View>
            </View>
          </TouchableOpacity>

          <Text style={[styles.name, { color: colors.text }]}>
            {user?.name || "No Name"}
          </Text>

          <Text style={[styles.username, { color: colors.mutedText }]}>
            @{user?.username || "No Username"}
          </Text>

          <Text style={[styles.email, { color: colors.mutedText }]}>
            {user?.email}
          </Text>
        </View>

        {/* Dark Mode Toggle */}
        <View
          style={[
            styles.row,
            styles.section,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.label, { color: colors.text }]}>
            Dark mode
          </Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account
          </Text>

          {["Edit Profile", "Notifications", "Privacy"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.settingItem,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[styles.settingLabel, { color: colors.text }]}
              >
                {item}
              </Text>
              <Text style={{ color: colors.mutedText }}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>

          {["Help & Support", "Terms of Service", "Privacy Policy"].map(
            (item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.settingItem,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.settingLabel,
                    { color: colors.text },
                  ]}
                >
                  {item}
                </Text>
                <Text style={{ color: colors.mutedText }}>→</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.settingItem,
              { backgroundColor: colors.card },
            ]}
            onPress={handleSignOut}
          >
            <Text style={[styles.signOutText, { color: colors.text }]}>
              Sign Out
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingItem,
              styles.deleteButton,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
 content: {
  padding: 32,
 },
 profileSection: {
  alignItems: "center",
  marginBottom: 32,
  paddingBottom: 32,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0",
 },
 profileScreen: {

 },
 profileImage: {
  width: 100,
  height: 100,
  borderRadius:50,
  marginBottom: 10
 },
 profileImagePlaceholder: {
  backgroundColor: "#f0f0f0",
  justifyContent: "center",
  alignItems: "center",
 },
 profileImageText: {
  fontSize: 40,
  fontWeight: "600",
  color: "#666",
 },
 editBadge: {
  position: "absolute",
  bottom: 6,
  left: "50%",
  transform: [{translateX: -22}],
  backgroundColor: "#000",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
 },
 editBadgeText: {
  color: "#fff",
  fontSize: 12,
  fontWeight: "600",
 },
 name: {
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: 4,
  color: "#000"
 },
 username: {
  fontSize: 16,
  color:  "#666",
  marginBottom: 4,
 },
 email: {
  fontSize: 14,
  color:  "#999",
 },
 section: {
  marginBottom: 32
 },
 sectionTitle: {
  fontSize: 18,
  fontWeight: "600",
  marginBottom: 16,
  color: "#000"
 },
 settingItem: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 16,
  paddingHorizontal: 16,
  backgroundColor: "#f9f9f9",
  borderRadius: 12,
  marginBottom: 8
 },
 settingLabel: {
  fontSize: 18,
  color: "#999"
 },
 settingValue: {
    
 },
 signOutButton: {
  backgroundColor: "#f5f5f5",
  marginBottom: 8
 },
 signOutText: {
  fontSize: 16,
  color: "#000",
  fontWeight: "500"
 },
 deleteButton: {
  fontSize: 16,
  backgroundColor: "#fff",
  borderColor: "#ff3b30",
  borderWidth: 1
 },
 deleteText: {
  fontSize: 16,
  color: "#ff3b30",
  fontWeight: "bold"
 },
 row: {
  borderWidth: 1,
  borderRadius: 14,
  padding: 16,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
label: {
  fontSize: 16,
  fontWeight: "600",
},
});