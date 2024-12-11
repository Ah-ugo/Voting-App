import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appbar } from "react-native-paper";
import { Avatar, Button, SizableText, XStack } from "tamagui";
import PollCard from "@/components/PollCard";

export default function PollsScreen() {
  const [activeTab, setActiveTab] = useState("Ongoing");
  const tabs = ["Ongoing", "Voted", "Ended"];
  const [polls, setPolls] = useState([]);
  const [votingHistory, setVotingHistory] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getAuthDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const profileUrl = await AsyncStorage.getItem("profilePictureUrl");
      if (!token) {
        alert("Access token is missing. Please sign in again.");
        return;
      }
      setAccessToken(token);
      setProfilePictureUrl(profileUrl);
    } catch (e) {
      console.error("Error fetching auth details:", e);
      alert("Failed to load authentication details.");
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
      alert("Failed to fetch voting history.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([getAllPolls(), getVotingHistory()]);
    setRefreshing(false);
  };

  const getPollsByTab = () => {
    switch (activeTab) {
      case "Ongoing":
        return polls.filter((poll: any) => poll.is_active);
      case "Voted":
        return votingHistory
          .map((history: any) =>
            polls.find((poll: any) => poll._id === history.poll_id)
          )
          .filter((poll) => poll);
      case "Ended":
        return polls.filter((poll: any) => !poll.is_active);
      default:
        return [];
    }
  };

  useEffect(() => {
    getAuthDetails();
    getAllPolls();
  }, []);

  useEffect(() => {
    if (accessToken) {
      getVotingHistory();
    }
  }, [accessToken]);

  const displayedPolls = getPollsByTab();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

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

      {/* Tabs */}
      <View style={{ paddingBottom: 20 }}>
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

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.pollsContainer}>
          {displayedPolls.length > 0 ? (
            displayedPolls.map((poll: any) => (
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
            <Text style={styles.noPollsText}>No polls found.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  pollsContainer: {
    padding: 10,
  },
  noPollsText: {
    textAlign: "center",
    color: "#6c757d",
  },
});
