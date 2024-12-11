import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Unlock, Lock1, Link2, Chart } from "iconsax-react-native";

export default function PollCard({
  title,
  description,
  isActive,
  total_vote,
  url,
  id,
}: any) {
  const router = useRouter();

  return (
    <View style={styles.cardContainer}>
      {/* Background Image */}
      <Image
        source={{ uri: url }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.footerRow}>
            {isActive ? (
              <Unlock size={15} color="white" />
            ) : (
              <Lock1 size={15} color="white" />
            )}
            <Text style={styles.footerText}>
              {isActive ? "Voting Open" : "Voting Closed"}
            </Text>
          </View>
          <View style={styles.footerRow}>
            <Link2 size={20} color="white" />
            <Text style={styles.footerText}>{total_vote} votes</Text>
          </View>
        </View>

        <View style={styles.footerRight}>
          <Chart size={20} color="white" />
          <TouchableOpacity
            style={styles.voteButton}
            onPress={() => router.push(`/${id}`)}
          >
            <Text style={styles.voteButtonText}>Vote</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 200,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    padding: 15,
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 20,
    fontFamily: "InterMedium",
    color: "white",
  },
  description: {
    fontFamily: "InterMedium",
    color: "lightgray",
    marginTop: 5,
  },
  footer: {
    backgroundColor: "#0F52BA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    zIndex: 2,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footerLeft: {
    justifyContent: "space-between",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  footerText: {
    color: "white",
    fontFamily: "InterMedium",
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  voteButton: {
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  voteButtonText: {
    fontFamily: "InterLight",
    color: "#0F52BA",
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
});
