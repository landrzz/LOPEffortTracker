import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { upsertUserProfile } from "./user-profile";

type AuthContextType = {
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

declare global {
  interface Window {
    google: any;
    handleSignInWithGoogle: (response: { credential: string }) => Promise<void>;
    supabase: typeof supabase;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Function to handle user profile upsert
  const handleUserProfileUpsert = async (user: User | null) => {
    if (user) {
      try {
        const { error } = await upsertUserProfile(user);
        if (error) {
          console.error("Error upserting user profile:", error);
        }
      } catch (err) {
        console.error("Exception while upserting user profile:", err);
      }
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Upsert user profile if there's a user
      if (currentUser) {
        handleUserProfileUpsert(currentUser);
      }
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Upsert user profile if the auth state change involves a user
      if (currentUser) {
        handleUserProfileUpsert(currentUser);
      }
    });

    // Initialize Google Sign-In
    const script = document.createElement("script");
    script.innerHTML = `
      window.handleSignInWithGoogle = async (response) => {
        const { data, error } = await window.supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        });
        if (error) console.error('Error:', error.message);
      };
    `;
    document.head.appendChild(script);

    const googleSignInDiv = document.createElement("div");
    googleSignInDiv.id = "g_id_onload";
    googleSignInDiv.setAttribute(
      "data-client_id",
      "290146856004-tb62kev5scqmino8npgha74q08p5mqto.apps.googleusercontent.com",
    );
    googleSignInDiv.setAttribute("data-context", "signin");
    googleSignInDiv.setAttribute("data-ux_mode", "popup");
    googleSignInDiv.setAttribute("data-callback", "handleSignInWithGoogle");
    googleSignInDiv.setAttribute("data-auto_select", "true");
    googleSignInDiv.setAttribute("data-itp_support", "true");
    document.body.appendChild(googleSignInDiv);

    // Make supabase available globally for the callback
    window.supabase = supabase;

    return () => {
      subscription.unsubscribe();
      document.body.removeChild(googleSignInDiv);
      document.head.removeChild(script);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
