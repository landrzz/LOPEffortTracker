import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/**
 * Upserts a user profile in the user_profiles table
 * This should be called whenever a user signs in
 * 
 * @param user The authenticated user object from Supabase Auth
 * @returns The result of the upsert operation
 */
export async function upsertUserProfile(user: User) {
  if (!user) return { error: "No user provided" };

  const now = new Date().toISOString();
  
  // Extract display name from user metadata
  const displayName = user.user_metadata?.name || 
                      user.user_metadata?.full_name || 
                      null;
                      
  // You may want to store these values in user metadata or use defaults
  const locationId = user.user_metadata?.location_id || null;
  const loId = user.user_metadata?.lo_id || null;
  const phone = user.user_metadata?.phone || null;

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        uid: user.id,
        email: user.email || "",
        display_name: displayName,
        location_id: locationId,
        lo_id: loId,
        phone: phone,
        // Only set created_at on insert (not on update)
        // Supabase will use the DEFAULT now() for new records
        updated_at: now,
      },
      { 
        onConflict: "uid",
        ignoreDuplicates: false, 
      }
    )
    .select("*")
    .single();

  return { data, error };
}
