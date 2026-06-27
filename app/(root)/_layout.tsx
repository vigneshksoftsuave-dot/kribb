import { useUserSync } from "@/hooks/useUserSync";
import { userStore } from "@/store/userStore";
import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";
import React from "react";

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  const isAdmin = userStore((state) => state.isAdmin);

  useUserSync();

  if (!isLoaded) return null;

  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return <Slot />;
}
