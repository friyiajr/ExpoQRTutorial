import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

const outer = rrect(rect(0, 0, width, height), 0, 0); // Full screen outer
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2, // Center the inner rectangle horizontally
    height / 2 - innerDimension / 2, // Center the inner rectangle vertically
    innerDimension,
    innerDimension
  ),
  20, // Rounded corners for the inner box
  20
);

export const Overlay = () => {
  return (
    <Canvas
      style={StyleSheet.absoluteFillObject} // Fill the entire screen
    >
      {/* Outer black background with transparency */}
      <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />

      {/* Inner rectangle with a white background and slight opacity */}
      <DiffRect inner={inner} outer={outer} color="white" opacity={0.1} />
    </Canvas>
  );
};
