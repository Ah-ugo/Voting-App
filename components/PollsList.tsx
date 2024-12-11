import React from "react";
import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import PollCard from "./PollCard";

interface PollsListProps {
  polls: any[];
  refreshing: boolean;
  onRefresh: () => void;
}

export default function PollsList({
  polls,
  refreshing,
  onRefresh,
}: PollsListProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {polls.map((poll) => (
        <PollCard key={poll._id} {...poll} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
});
