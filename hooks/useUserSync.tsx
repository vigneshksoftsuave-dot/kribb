import { userStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { useSupabase } from "./useSupabase";

export const useUserSync = () => {
  const { user } = useUser();

  const setIsAdmin = userStore((state) => state.setIsAdmin);

  const authSupabase = useSupabase();

  const syncUser = async () => {
    if (!user?.id) {
      console.warn("useUserSync: Clerk user is not available yet.");
      return;
    }

    const userEmail =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress;

    if (!userEmail) {
      console.warn(
        "useUserSync: No Clerk email address available for user",
        user.id,
      );
      return;
    }

    const { data, error: findError } = await authSupabase
      .from("users")
      .select("clerk_id, is_admin")
      .eq("clerk_id", user.id)
      .maybeSingle();

    if (findError) {
      console.warn(
        "useUserSync: Supabase select failed",
        findError.message,
        findError,
      );
      return;
    }

    if (data) {
      setIsAdmin(data.is_admin ?? false);
      return;
    }

    const { data: newUser, error } = await authSupabase
      .from("users")
      .insert({
        clerk_id: user.id,
        email: userEmail,
        first_name: user.firstName,
        last_name: user.lastName,
        avatar_url: user.imageUrl,
      })
      .select("is_admin")
      .single();

    console.log("auth supabase triggred");

    if (error) {
      console.warn(
        "useUserSync: Failed to insert Clerk user into Supabase",
        error.message,
        error,
      );
      return;
    }

    setIsAdmin(newUser?.is_admin ?? false);
  };

  useEffect(() => {
    if (!user) return;
    syncUser();
  }, [user]);
};
