import { supabase } from "@/lib/client";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    // Optional fields have the "?"
    profileImage?: string;
    onboardingCompleted?: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signUp: (email: string,  password: string) => Promise<void>;
    signIn: (email: string,  password: string) => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}:{children: ReactNode}) => {
    const[user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const signOut = async () => {
      await supabase.auth.signOut()
      setUser(null);
    }

    const checkSession = async () => {
        setIsLoading(true);
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
    
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            setUser(profile);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error checking session:", error);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };

    const fetchUserProfile = async (userId: string): Promise<User | null> => {
        try {
            const {data, error} = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if(error) {
                console.error("Error fetching profile: ", error);
                return null;
            }

            if(!data) {
                console.error("No profile data returned");
                return null;
            }

            const authUser = await supabase.auth.getUser();
            if(!authUser.data.user) {
                console.error("No auth user found");
                return null;
            }

            return {
                id: data.id,
                name: data.name,
                username: data.username,
                email: authUser.data.user.email || "",
                profileImage: data.profile_image_url,
                onboardingCompleted: data.onboarding_completed
            }
        } catch(error) {
            console.error("Error: ", error);
            return null;
        }
    }

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
      
          if (error) throw error;
      
          if (data.user) {
            const profile = await fetchUserProfile(data.user.id);
            setUser(profile);
          }
    }

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
    
        if (error) throw error;
    
        if (data.user) {
          const profile = await fetchUserProfile(data.user.id);
          setUser(profile);
        }
    };

    const updateUser = async (userData: Partial<User>) => {
        if (!user) return;
      
        try {
          const updateData: any = {};
          if (userData.name !== undefined) updateData.name = userData.name;
          if (userData.username !== undefined) updateData.username = userData.username;
          if (userData.profileImage !== undefined) {
            updateData.profile_image_url = userData.profileImage;
          }
          if (userData.onboardingCompleted !== undefined) {
            updateData.onboarding_completed = userData.onboardingCompleted;
          }
      
          const { error } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", user.id);
      
          if (error) throw error;
      
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  ...userData,
                }
              : prev
          );
        } catch (error) {
          console.error("Error updating user:", error);
          throw error;
        }
      };

    return (
        <AuthContext.Provider value={{  user, isLoading, signUp, updateUser, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error("useAuth: Must be inside the provider.")
    }
    return context;
}