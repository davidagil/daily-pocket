import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/client";
import { uploadPostImage } from "@/lib/storage";
import { useEffect, useState } from "react";

type PostLinkInput = {
    url: string,
    description: string,
}

export interface PostUser {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
}

export interface PostLink {
    id: string;
    url: string;
    description: string;
    postUuid: string;
    createdAt?: string;
  }

export interface Post {
    id: string;
    user_id: string;
    image_url: string;
    description?: string;
    created_at: string;
    expired_at: string;
    is_active: boolean;
    profiles?: PostUser;
    postLinks: PostLink[];
}

export const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        loadPosts()
    }, [])

    const loadPosts = async () => {
        if (!user) return;
      
        setIsLoading(true);
      
        try {
          const { data: postsData, error: postsError } = await supabase
            .from("posts")
            .select(`
              *,
              profiles (
                id,
                name,
                username,
                profile_image_url
              ),
              post_links (
                id,
                url,
                description,
                post_uuid,
                created_at
              )
            `)
            .eq("is_active", true)
            .gt("expired_at", new Date().toISOString())
            .order("created_at", { ascending: false });
      
          if (postsError) {
            console.error("Error loading posts: ", postsError);
            throw postsError;
          }
      
          if (!postsData || postsData.length === 0) {
            setPosts([]);
            return;
          }
      
          const formattedPosts = postsData.map((post) => ({
            ...post,
            profiles: post.profiles ?? null,
            postLinks: (post.post_links ?? []).map((link: any) => ({
                id: link.id,
                url: link.url,
                description: link.description,
                postUuid: link.post_uuid,
                createdAt: link.created_at,
              })),
          }));
      
          setPosts(formattedPosts);
        } catch (error) {
          console.log("Error in loadPosts: ", error);
        } finally {
          setIsLoading(false);
        }
      };

    const createPost = async (imageUri: string, description?: string, links: PostLinkInput[] = []) =>{
        if(!user) {
            throw new Error("User not authenticated");
        }

        try {
             // Deactivate any existing posts
            const { error: deactivateError } = await supabase
                .from("posts")
                .update({ is_active: false })
                .eq("user_id", user.id)
                .eq("is_active", true);

            if (deactivateError) {
            console.error("Error deactivating old posts:", deactivateError);
            }


            const imageUrl = await uploadPostImage(user.id, imageUri);
            console.log(imageUrl);
            // Calculate expiration time
            const now = new Date();
            const expiredAt = new Date(now.getTime() + 24 * 60  * 60 * 1000)

            const { data: post, error: postError } = await supabase.from("posts").insert({
                user_id: user.id,
                image_url: imageUrl,
                description: description,
                expired_at: expiredAt.toISOString(),
                is_active: true
            })
            .select()
            .single();

            if (postError) throw postError;

           let formattedLinks: any[] = [];

            if(links.length > 0) {
                formattedLinks = links.map((link) => ({
                    post_uuid: post.id,
                    url: link.url,
                    description: link.description
                }))
            }

            const { error: linksError } = await supabase.from("post_links").insert(formattedLinks);

            if(linksError) {
                throw linksError;
            }

           await loadPosts;
        } catch (error) {
            console.error("Error creating post: ", error);
            throw error;
        }
    }

    const refreshPosts = async () => {
        await loadPosts();
    }

    return { createPost, posts, refreshPosts };
}