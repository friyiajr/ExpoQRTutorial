import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";

export default function Home() {
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
}
