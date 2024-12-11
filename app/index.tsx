import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { SizableText, YStack } from "tamagui";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const navigateToHome = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        router.replace("/(auth)/login");
      } catch (error) {
        console.error("Navigation error:", error);
      }
    };

    navigateToHome();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/images/logo2.png")}
      />
      <YStack>
        <SizableText
          color={"black"}
          style={{
            fontFamily: "InterRegular",
            fontSize: 20,
            fontWeight: "600",
          }}
        >
          Blockchain Voting
        </SizableText>
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  image: {
    width: "100%",
    resizeMode: "contain",
    height: "70%",
  },
});
