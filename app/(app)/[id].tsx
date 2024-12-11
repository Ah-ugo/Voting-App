import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Pressable,
  Alert,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Appbar } from "react-native-paper";
import { Card, SizableText, XStack, YStack } from "tamagui";
import { ArrowLeft2, Link2, Lock1, Unlock } from "iconsax-react-native";
import CandidatesCard from "@/components/CandidatesCard";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Details() {
  const { id } = useLocalSearchParams();
  const [detail, setDetail] = useState<any>({
    candidates: [],
    total_votes: 0,
  });
  const [userVote, setUserVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Fetch user vote status and poll details
  const fetchPollData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) throw new Error("No token found. Please log in again.");

      // Fetch poll details
      const pollResponse = await axios.get(
        `https://blockchain-voting-app-kappa.vercel.app/polls/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const pollData = pollResponse.data;

      // Check if poll is active
      if (!pollData.is_active) {
        Alert.alert("Poll Closed", "This poll is no longer active.");
        navigation.goBack(); // Navigate back if poll is inactive
        return;
      }

      setDetail(pollData); // Set poll details

      // Fetch votes for this poll
      const votesResponse = await axios.get(
        `https://blockchain-voting-app-kappa.vercel.app/admin/polls/${id}/votes/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Map the votes to candidates
      const updatedCandidates = pollData.candidates.map((candidate: any) => ({
        ...candidate,
        votes: votesResponse.data.votes[candidate.id] || 0, // Assign vote count, default to 0 if not found
      }));

      setDetail((prevDetail: any) => ({
        ...prevDetail,
        candidates: updatedCandidates,
      }));

      // Check voting history
      const voteResponse = await axios.get(
        "https://blockchain-voting-app-kappa.vercel.app/voting_history/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const voteHistory = voteResponse.data.voting_history;
      const existingVote = voteHistory.find(
        (vote: { poll_id: string }) => vote.poll_id === id
      );

      if (existingVote) setUserVote(existingVote.candidate_id);
      else setUserVote(null);
    } catch (error: any) {
      console.error(
        "Error fetching poll or vote status:",
        error.message || error
      );
      Alert.alert("Error", "Failed to fetch poll data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle back press
  const handleBackPress = () => navigation.goBack();

  // Handle vote action
  const handleVote = async (candidateId: string) => {
    if (userVote) {
      Alert.alert(
        "You have already voted",
        "You can only vote once in this poll."
      );
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) throw new Error("No token found. Please log in again.");

      await axios.post(
        "https://blockchain-voting-app-kappa.vercel.app/cast_vote/",
        { poll_id: id, candidate_id: candidateId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUserVote(candidateId); // Set the user's vote after successful submission
      Alert.alert("Vote Submitted", "Your vote has been successfully cast.");
      await fetchPollData(); // Refresh data after voting
    } catch (error: any) {
      console.error("Vote Error:", error.response || error.message);
      Alert.alert("Vote Failed", "Unable to cast vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPollData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPollData();
  }, []);

  const { width } = Dimensions.get("window");

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 30 }}>
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
      <View>
        <Appbar.Header
          statusBarHeight={0}
          style={{ backgroundColor: "transparent", marginTop: 20 }}
        >
          <XStack
            justifyContent="space-between"
            alignItems="center"
            style={{ width: "100%" }}
            paddingHorizontal={"$3"}
          >
            <Pressable onPress={handleBackPress} accessibilityLabel="Go back">
              <ArrowLeft2 size="20" color="#000" />
            </Pressable>
            <SizableText style={{ fontFamily: "InterMedium", fontSize: 20 }}>
              Vote
            </SizableText>
            <View />
          </XStack>
        </Appbar.Header>

        <View style={{ marginHorizontal: 15 }}>
          <Card
            elevate
            radiused
            animation="bouncy"
            style={{ height: 200, width: width * 0.9, borderRadius: 20 }}
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            pressStyle={{ scale: 0.875 }}
          >
            <Card.Header
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              }}
            >
              <SizableText
                style={{
                  color: "white",
                  fontSize: 20,
                  fontFamily: "InterMedium",
                }}
              >
                {detail?.title}
              </SizableText>
            </Card.Header>

            <Card.Footer style={{ marginHorizontal: 20, marginBottom: 20 }}>
              <YStack gap={"$1"}>
                <XStack alignItems="center" gap={5}>
                  {detail.is_active ? (
                    <Unlock size={15} color="white" />
                  ) : (
                    <Lock1 size={15} color="white" />
                  )}
                  <SizableText
                    style={{
                      color: "white",
                      fontFamily: "InterMedium",
                      fontSize: 15,
                    }}
                  >
                    {detail.is_active ? "Voting Open" : "Voting Closed"}
                  </SizableText>
                </XStack>
                <XStack alignItems="center" gap={5}>
                  <Link2 size={20} color="white" />
                  <SizableText
                    style={{ color: "white", fontFamily: "InterMedium" }}
                  >
                    {detail.total_votes} votes
                  </SizableText>
                </XStack>
              </YStack>
            </Card.Footer>
            <Card.Background>
              <Image
                style={{
                  height: 200,
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: 10,
                }}
                source={{ uri: detail.poll_image_url }}
              />
            </Card.Background>
          </Card>
        </View>

        <View style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 20 }}>
          <SizableText style={{ fontFamily: "InterMedium", fontSize: 20 }}>
            Candidates
          </SizableText>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <YStack marginHorizontal={15} gap={"$3"}>
            {detail?.candidates?.map((candidate: any) => (
              <CandidatesCard
                key={candidate.id}
                name={candidate.name}
                party={candidate.party}
                image={candidate.image_url}
                handleVote={() => handleVote(candidate.id)}
                hasVoted={userVote === candidate.id}
                votes={candidate.votes}
              />
            ))}
          </YStack>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
