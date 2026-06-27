import FeaturedCard from "@/components/FeaturedCard";
import { PropertyCard } from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [isLoading, setLoading] = useState<Boolean>(false);

  const fetchProperties = async () => {
    setLoading(true);

    const { data: featuredData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: true });

    const { data: recommendedData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", false)
      .order("created_at", { ascending: true });

    setRecommended(recommendedData ?? []);
    setFeatured(featuredData ?? []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  return (
    <SafeAreaView>
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header Image */}
            <View className="flex-row justify-between items-center px-5 pt-4 pb-5">
              <Image
                source={require("@/assets/images/kribb.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
              />
              <View className="items-end gap-1">
                <Text className="text-gray-800 font-[500]">
                  Good Morning 👋
                </Text>
                <Text className="font-bold">{user?.firstName ?? "User"}</Text>
              </View>
            </View>

            {/*Search Bar */}
            <View>
              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/search")}
                className="mx-5 mb-5 flex-row justify-start items-center bg-white rounded-2xl px-4 py-3 gap-3"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.06,
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <Ionicons name="search-outline" size={18} color={"#9CA3AF"} />
                <Text className="text-gray-400 text-sm flex-1">
                  {" "}
                  Search Propeties and cities...
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push("/(root)/(tabs)/search?openFilters=true")
                  }
                  className="w-8 h-8 rounded-xl items-center justify-center bg-blue-400"
                >
                  <Ionicons name="options-outline" size={18} color={"white"} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            {/* Featured Component */}

            <View>
              <Text className="text-gray-800 text-xl font-bold px-5 py-4">
                Featured
              </Text>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <>
                  <FlatList
                    data={featured}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <FeaturedCard property={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                  />
                </>
              )}
            </View>

            {/* Recommended Heading */}
            <View>
              <View>
                <Text className="text-gray-800 text-xl font-bold px-5 py-4">
                  Recommended
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-5 py-1">
            <PropertyCard property={item} />
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No Properties Found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
