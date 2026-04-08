import { File } from 'expo-file-system';
import { supabase } from './client';

export const uploadProfileImage = async (userId: string, imageUri: string) => {
    try {
        const fileExtension = imageUri.split('.').pop() || 'jpg';
        const filename = `${userId}/${Date.now()}.${fileExtension}`;
        const file = new File(imageUri);
        const bytes = await file.bytes();

        const {error} = await supabase.storage.from('profiles').upload(filename, bytes, {
            contentType: `image/${fileExtension}`,
            // inserts if no existing image, upadates if there is
            upsert: true,
        });

        if(error) {
            throw error;
        }

        const {data: urlData} = supabase.storage.from('profiles').getPublicUrl(filename);
        return urlData.publicUrl;

    } catch (err) {
        console.error(err);
    }
}

export const uploadPostImage = async (userId: string, imageUri: string) => {
  try {
    const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${userId}/${Date.now()}.${fileExtension}`;

    const file = new File(imageUri);
    const bytes = await file.bytes();

    const contentType =
      fileExtension === "png"
        ? "image/png"
        : fileExtension === "webp"
        ? "image/webp"
        : "image/jpeg";

    const { error } = await supabase.storage.from("posts").upload(filename, bytes, {
      contentType,
      upsert: false,
    });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage.from("posts").getPublicUrl(filename);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL for uploaded image");
    }

    return urlData.publicUrl;
  } catch (err) {
    console.error("Error uploading post image: ", err);
    throw err;
  }
};