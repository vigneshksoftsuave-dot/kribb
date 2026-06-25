import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 12 }}>
        Page not found
      </Text>
      <Text style={{ textAlign: "center", marginBottom: 24, color: "#555" }}>
        The route you tried does not exist. Please go back to the home screen.
      </Text>
      <Link
        href="/"
        style={{
          backgroundColor: "#2563eb",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Go home</Text>
      </Link>
    </View>
  );
}
