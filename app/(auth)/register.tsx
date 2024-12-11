import React, { useState } from "react";
import { View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  Avatar,
  Button,
  Input,
  Label,
  SizableText,
  XStack,
  YStack,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Handle Image Selection
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  /// Handle Signup Request
  const handleSignUp = async () => {
    if (!username || !password || !profilePicture) {
      setMessage("Please fill in all fields and select a profile picture.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("username", username); // Ensure field names match backend
      formData.append("password", password);
      formData.append("profile_picture", {
        uri: profilePicture,
        type: "image/jpeg", // Adjust this type if the image is not JPEG
        name: "profile_picture.jpeg", // Always include a name
      });

      // Log FormData keys for debugging
      for (let key of formData.keys()) {
        console.log(`${key}:`, formData.get(key));
      }

      const apiResponse = await axios.post(
        "https://blockchain-voting-app-kappa.vercel.app/register/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      setMessage(apiResponse.data.message || "Registration successful!");
      console.log(apiResponse.data);
      router.replace("/login");
    } catch (error: any) {
      if (error.response) {
        console.error("Server Response:", error.response.data);
        setMessage(error.response.data.message || "Registration failed.");
      } else if (error.request) {
        console.error("No Response from Server:", error.request);
        setMessage("Network error. Please check your connection.");
      } else {
        console.error("Unknown Error:", error.message);
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <View
        style={{
          marginTop: 30,
          marginBottom: 30,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SizableText size={"$9"} style={{ fontFamily: "InterSemiBold" }}>
          Create Account
        </SizableText>
        <SizableText
          size={"$2"}
          style={{ fontFamily: "InterLight" }}
          color={"#AEACAC"}
        >
          Fill your details below to register
        </SizableText>
      </View>
      <YStack gap={10}>
        {/* Username Input */}
        <YStack>
          <Label htmlFor="username" style={{ fontFamily: "InterLight" }}>
            Username
          </Label>
          <Input
            size={"$4"}
            id="username"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            style={{ fontFamily: "InterReg" }}
          />
        </YStack>

        {/* Password Input */}
        <YStack>
          <Label htmlFor="password" style={{ fontFamily: "InterLight" }}>
            Password
          </Label>
          <Input
            size={"$4"}
            id="password"
            placeholder="Enter password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={{ fontFamily: "InterReg" }}
          />
        </YStack>

        {/* Profile Picture Upload */}
        <YStack>
          <Label style={{ fontFamily: "InterLight" }}>Profile Picture</Label>
          {profilePicture && (
            <Avatar circular size="$6">
              <Avatar.Image src={profilePicture} />
              {/* <Avatar.Fallback bc="red" /> */}
            </Avatar>
          )}
          <Button onPress={pickImage} backgroundColor={"#0F52BA"} color="white">
            {profilePicture ? "Change Picture" : "Upload Picture"}
          </Button>
        </YStack>

        {/* Error/Success Message */}
        {message && (
          <SizableText
            size={"$3"}
            color={message.includes("successful") ? "green" : "red"}
          >
            {message}
          </SizableText>
        )}

        {/* Signup Button */}
        <Button
          color={"white"}
          fontWeight={"800"}
          backgroundColor={"#0F52BA"}
          marginTop={20}
          style={{ color: "white" }}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
