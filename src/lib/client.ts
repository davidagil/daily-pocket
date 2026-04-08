import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from '@supabase/supabase-js';

const supbabaseUrl = process.env.EXPO_PUBLIC_SUPABSE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABSE_ANON_KEY!;

export const supabase = createClient(supbabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        detectSessionInUrl: false,
    },
}); 