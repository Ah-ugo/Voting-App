import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar } from "react-native-paper";
import {
  Avatar,
  Button,
  Paragraph,
  SizableText,
  Stack,
  XStack,
  YStack,
  Input,
} from "tamagui";
import { SearchNormal1 } from "iconsax-react-native";
import PollCard from "@/components/PollCard";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Ongoing");
  const tabs = ["Ongoing", "Voted", "Ended"];
  const [polls, setPolls] = useState([]);
  const [votingHistory, setVotingHistory] = useState([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getAuthDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const profileUrl = await AsyncStorage.getItem("profilePictureUrl");

      if (!token) {
        Alert.alert("Error", "Access token is missing. Please sign in again.");
        return;
      }

      setAccessToken(token);
      setProfilePictureUrl(profileUrl);
    } catch (e) {
      console.error("Error fetching auth details:", e);
      Alert.alert("Error", "Failed to load authentication details.");
    }
  };

  const getAllPolls = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://blockchain-voting-app-kappa.vercel.app/polls/"
      );
      setPolls(res.data);
    } catch (e) {
      console.error("Error fetching polls:", e);
    } finally {
      setLoading(false);
    }
  };

  const getVotingHistory = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const res = await axios.get(
        "https://blockchain-voting-app-kappa.vercel.app/voting_history/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setVotingHistory(res.data.voting_history);
    } catch (e) {
      console.error("Error fetching voting history:", e);
      Alert.alert("Error", "Failed to fetch voting history.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([getAllPolls(), getVotingHistory()]);
    setRefreshing(false);
  };

  const filteredPolls = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    switch (activeTab) {
      case "Ongoing":
        return polls
          .filter((poll: any) => poll.is_active)
          .filter((poll: any) =>
            poll.title.toLowerCase().includes(lowerCaseQuery)
          );
      case "Voted":
        return votingHistory
          .map((history: any) =>
            polls.find((poll: any) => poll._id === history.poll_id)
          )
          .filter(
            (poll: any) =>
              poll && poll.title.toLowerCase().includes(lowerCaseQuery)
          );
      case "Ended":
        return polls
          .filter((poll: any) => !poll.is_active)
          .filter((poll: any) =>
            poll.title.toLowerCase().includes(lowerCaseQuery)
          );
      default:
        return [];
    }
  };

  useEffect(() => {
    const fetchAuthDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const profileUrl = await AsyncStorage.getItem("profilePictureUrl");
        setAccessToken(token);
        setProfilePictureUrl(profileUrl);

        console.log(token, "token", profileUrl);
      } catch (e) {
        console.error("Error fetching auth details:", e);
      }
    };

    fetchAuthDetails();
    getAuthDetails();
  }, []);

  useEffect(() => {
    if (accessToken) {
      getAllPolls();
      getVotingHistory();
    }
  }, [accessToken]);

  //   useEffect(() => {
  //     getAllPolls();
  //   }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && (
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* App Bar */}
      <Appbar.Header
        statusBarHeight={0}
        style={{ backgroundColor: "transparent" }}
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          width={"100%"}
          paddingHorizontal={"$3"}
        >
          <SizableText style={{ fontFamily: "InterBlack", fontSize: 20 }}>
            Election
          </SizableText>

          <Avatar circular size="$3">
            <Avatar.Image
              accessibilityLabel="User Profile"
              src={
                profilePictureUrl
                  ? profilePictureUrl
                  : "https://via.placeholder.com/100"
              }
            />
            <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
          </Avatar>
        </XStack>
      </Appbar.Header>

      {/* Search and Tabs */}
      <View style={{ paddingBottom: 20 }}>
        <XStack
          height={40}
          marginTop={2}
          marginBottom={10}
          marginHorizontal="$4"
          alignItems="center"
        >
          <Input
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            flex={1}
            placeholder="Search..."
            paddingLeft={50}
            height={40}
            borderColor={"#AEACAC"}
            value={searchQuery}
            onChangeText={(query) => setSearchQuery(query)}
          />
          <Stack
            position="absolute"
            left={0}
            bottom={0}
            height={40}
            width={40}
            alignItems="center"
            justifyContent="center"
          >
            <SearchNormal1 size="24" color="#AEACAC" />
          </Stack>
        </XStack>

        <XStack
          paddingHorizontal={"$4"}
          borderRadius="$pill"
          overflow="hidden"
          gap={15}
          marginTop={2}
        >
          {tabs.map((tab) => (
            <Button
              key={tab}
              size="$3"
              style={{ fontFamily: "InterMedium", borderRadius: 10 }}
              onPress={() => setActiveTab(tab)}
              backgroundColor={activeTab === tab ? "white" : "transparent"}
              color={activeTab === tab ? "black" : "$gray11"}
              hoverStyle={{
                backgroundColor: activeTab === tab ? "white" : "$gray3",
              }}
              pressStyle={{
                backgroundColor: "white",
              }}
            >
              {tab}
            </Button>
          ))}
        </XStack>
      </View>

      {/* Polls Display */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <YStack marginHorizontal={"$4"} marginTop={"$2"} gap={"$3"}>
          {filteredPolls().length > 0 ? (
            filteredPolls().map((poll: any) => (
              <PollCard
                key={poll._id}
                title={poll.title}
                description={poll.description}
                isActive={poll.is_active}
                url={poll.poll_image_url}
                total_vote={poll.total_votes}
                id={poll._id}
              />
            ))
          ) : (
            <Paragraph fontSize="$4" color="$gray9" textAlign="center">
              No polls found.
            </Paragraph>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
