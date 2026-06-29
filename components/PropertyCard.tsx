import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const PropertyCard = ({
  property,
  onUnSave,
  showSave = false,
  isSaved = false,
}: {
  property: Property;
  onUnSave?: () => void;
  showSave?: boolean;
  isSaved?: boolean;
}) => {
  const imageSource =
    property.images.length > 0
      ? { uri: property.images[0] }
      : require("@/assets/images/kribb.png");

  return (
    <TouchableOpacity
      className="flex-row rounded-2xl overflow-hidden bg-white"
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
      <Image source={imageSource} className="w-28 h-28" resizeMode="cover" />
      <View className="flex-1 p-3 justify-between">
        <View>
          <Text
            className="text-sm font-bold text-gray-500 mmb-1"
            numberOfLines={1}
          >
            {property.title}
          </Text>

          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={11} color={"#ccc"} />
            <Text className="text-sm font-[500] text-gray-300">
              {property.city}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-[500] text-blue-600">
            {formatPrice(property.price)}
          </Text>
          {property.is_sold && (
            <View className="bg-red-50 rounded-full px-3 py-1">
              <Text className="text-red-500 text-xs">Sold</Text>
            </View>
          )}
          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={13} color="#6B7280" />
              <Text className="text-xs text-gray-500">{property.bedrooms}</Text>
            </View>
            {property.area_sqft != null && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="expand-outline" size={13} color="#6B7280" />
                <Text className="text-xs text-gray-500">
                  {property.area_sqft} ft2
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      {showSave && (
        <TouchableOpacity
          className="w-10 items-center pt-3"
          onPress={isSaved ? onUnSave : undefined}
        >
          <Ionicons
            name={isSaved ? "heart" : "heart-outline"}
            size={18}
            color={isSaved ? "#EF4444" : "#9CA3AF"}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};
