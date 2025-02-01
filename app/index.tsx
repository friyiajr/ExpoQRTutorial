import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import { useCameraPermissions } from "expo-camera";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "QR Scanner", headerShown: false }} />
      <Text style={styles.title}>QR Code Scanner</Text>
      <View style={styles.buttonContainer}>
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Request Permissions</Text>
        </Pressable>
        <Link href={"/scanner"} asChild>
          <Pressable disabled={!isPermissionGranted} style={[styles.button, { opacity: !isPermissionGranted ? 0.5 : 1 }]}>
            <Text style={styles.buttonText}>Scan Code</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: "#0E7AFE",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
