import innerChild from "@/components/journeys/innerChild";
import lettingGo from "@/components/journeys/lettingGo";
import becomingYou from "@/components/journeys/becomingYou";

export const journeys = [innerChild, lettingGo, becomingYou];

export const getJourneyById = (id: string) => {
  if (!id) return undefined;
  // Make the comparison case-insensitive to prevent router/param issues.
  return journeys.find((j) => j.id.toLowerCase() === id.toLowerCase());
};
