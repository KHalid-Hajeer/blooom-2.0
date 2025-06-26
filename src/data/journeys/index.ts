import innerChild from "@/components/journeys/innerChild";
import lettingGo from "@/components/journeys/lettingGo";
import becomingYou from "@/components/journeys/becomingYou";

export const journeys = [innerChild, lettingGo, becomingYou];

export const getJourneyById = (id: string) => {
  return journeys.find((j) => j.id === id);
};
