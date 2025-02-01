import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Text,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [hasPermission, setHasPermission] = useState(null); // For camera permissions

  // Check for camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    checkPermissions();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (hasPermission === null) {
    return <SafeAreaView style={styles.centered}><Text>Requesting camera permission...</Text></SafeAreaView>;
  }

  if (hasPermission === false) {
    return <SafeAreaView style={styles.centered}><Text>No access to camera</Text></SafeAreaView>;
  }

  // Function to sanitize the URL (ensure it's valid)
  const sanitizeUrl = (url) => {
    if (!url) return null;

    // If the URL doesn't already start with 'http://' or 'https://', add 'http://'
    if (!/^https?:\/\//i.test(url)) {
      url = `http://${url}`;
    }
    return url;
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(async () => {
              try {
                const sanitizedUrl = sanitizeUrl(data); // Sanitize the QR data into a proper URL
                if (sanitizedUrl) {
                  const isUrlValid = await Linking.canOpenURL(sanitizedUrl);
                  if (isUrlValid) {
                    await Linking.openURL(sanitizedUrl);
                  } else {
                    Alert.alert("Invalid URL", "The scanned QR code does not contain a valid URL.");
                  }
                } else {
                  Alert.alert("Invalid QR Code", "The scanned QR code does not contain a valid URL.");
                }
              } catch (error) {
                Alert.alert("Error", "An error occurred while trying to open the URL.");
              } finally {
                qrLock.current = false; // Unlock after processing
              }
            }, 500); // Small delay before allowing another scan
          }
        }}
      />
      <Overlay />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
