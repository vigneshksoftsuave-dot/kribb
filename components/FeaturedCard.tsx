import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="w-72 mr-2 rounded-3xl overflow-hidden bg-white"
      style={{
        opacity: property.is_sold ? 0.5 : 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
      //   onPress={() => router.push(`/(root)/(tabs)/property/${property.id}`)}
    >
      <Image
        source={{ uri: property.images[0] }}
        className="w-full h-44"
        resizeMode="cover"
      />

      {/* Property Type */}

      <View className="absolute top-3 left-3 min-w-14 bg-white/90 rounded-3xl px-3 py-1 flex items-center justify-center">
        <Text className="text-blue-600 text-xs">
          {property.type
            ? property.type.charAt(0).toUpperCase() + property.type.slice(1)
            : property.type}
        </Text>
      </View>

      {/* Sold Bage */}

      {property.is_sold && (
        <View className="absolute top-3 right-3 bg-red-500 rounded-full px-3 py-1">
          <Text className="text-white text-xs">Sold</Text>
        </View>
      )}

      {/* Property Title */}

      <View className="p-4">
        <Text
          className="text-base font-bold text-gray-800 mb-1"
          numberOfLines={1}
        >
          {property.title}
        </Text>

        {/* Property Address */}

        <View className="flex-row items-center gap-1 mb-3">
          <Ionicons name="location-outline" size={13} color={"#ccc"} />
          <Text className="text-sm font-[500] text-gray-300">
            {property.address}, {property.city}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-[500] text-blue-600">
            {formatPrice(property.price)}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={13} color="#6B7280" />
              <Text className="text-xs text-gray-500">{property.bedrooms}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="water-outline" size={13} color="#6B7280" />
              <Text className="text-xs text-gray-500">
                {property.bathrooms}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
