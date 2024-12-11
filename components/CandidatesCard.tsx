import { View } from "react-native";
import React from "react";
import { Avatar, Button, Card, SizableText, XStack, YStack } from "tamagui";

export default function CandidatesCard({
  name,
  party,
  image,
  handleVote,
  hasVoted,
  votes,
}: {
  name: string;
  party: string;
  image: string;
  handleVote: () => void;
  hasVoted: boolean;
  votes: number;
}) {
  return (
    <Card
      elevate
      radiused
      animation="bouncy"
      style={{
        height: 100,
        width: "100%",
        borderRadius: 30,
      }}
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
    >
      <XStack
        justifyContent="space-between"
        alignItems="center"
        marginHorizontal={15}
        marginVertical={17}
      >
        <XStack alignItems="center" gap={"$4"}>
          <Avatar circular size="$6">
            <Avatar.Image src={image} />
          </Avatar>

          <YStack>
            <SizableText style={{ fontFamily: "InterMedium", fontSize: 18 }}>
              {name}
            </SizableText>
            <SizableText style={{ fontFamily: "InterRegular", fontSize: 15 }}>
              {party}
            </SizableText>
          </YStack>
        </XStack>

        <YStack alignItems="center">
          <SizableText
            style={{
              fontFamily: "InterRegular",
              fontSize: 16,
              color: "gray",
            }}
          >
            {votes} Votes
          </SizableText>
          <Button disabled={hasVoted} onPress={handleVote}>
            {hasVoted ? "Voted" : "Vote"}
          </Button>
        </YStack>
      </XStack>
    </Card>
  );
}
