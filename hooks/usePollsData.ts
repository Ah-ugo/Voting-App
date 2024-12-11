import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

export function usePollsData() {
  const [polls, setPolls] = useState([]);
  const [votingHistory, setVotingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("Ongoing");

  const getAuthDetails = useCallback(async () => {
    try {
      const [token, profileUrl] = await Promise.all([
        AsyncStorage.getItem("accessToken"),
        AsyncStorage.getItem("profilePictureUrl"),
      ]);

      if (!token) {
        Alert.alert("Error", "Access token is missing. Please sign in again.");
        return null;
      }

      setProfilePictureUrl(profileUrl);
      return token;
    } catch (error) {
      console.error("Error fetching auth details:", error);
      Alert.alert("Error", "Failed to load authentication details.");
      return null;
    }
  }, []);

  const getAllPolls = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://blockchain-voting-app-kappa.vercel.app/polls/"
      );
      setPolls(response.data);
    } catch (error) {
      console.error("Error fetching polls:", error);
      Alert.alert("Error", "Failed to load polls.");
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAllPolls();
    setRefreshing(false);
  }, [getAllPolls]);

  const filteredPolls = useCallback(() => {
    switch (activeTab) {
      case "Ongoing":
        return polls.filter((poll: any) => poll.is_active);
      case "Voted":
        return votingHistory
          .map((history: any) =>
            polls.find((poll: any) => poll._id === history.poll_id)
          )
          .filter(Boolean);
      case "Ended":
        return polls.filter((poll: any) => !poll.is_active);
      default:
        return [];
    }
  }, [polls, votingHistory, activeTab]);

  useEffect(() => {
    const initializeData = async () => {
      const token = await getAuthDetails();
      if (token) {
        await getAllPolls();
      }
      setLoading(false);
    };

    initializeData();
  }, [getAuthDetails, getAllPolls]);

  return {
    polls,
    loading,
    refreshing,
    profilePictureUrl,
    activeTab,
    setActiveTab,
    handleRefresh,
    filteredPolls,
  };
}
