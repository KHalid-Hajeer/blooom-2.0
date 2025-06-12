// --- UNIFIED TYPE DEFINITIONS ---

export interface Plant {
  id: string;
  intention: string;
  plotId: number;
  growthScore: number;
  rhythm: {
    primary: string;
    secondary: "Once a month" | "Once a week" | "3 times a week" | "Once a day" | "Morning & Night";
  };
  creationDate: string;
  lastTendedDate: string;
  tendingHistory?: string[]; // ISO date strings
}

export interface GardenPlot {
  id: number;
  x: number;
  y: number;
  isOccupied: boolean;
}

export interface GrowthStage {
  score: number;
  emoji: string;
  status: string;
}

// --- CONSTANTS ---
export const GRID_SIZE = 5;
export const PLOT_SIZE = 100; // in pixels
export const BASE_GROWTH_VALUE = 10;
export const PATIENCE_FACTOR = 1;
export const GROWTH_STAGES: GrowthStage[] = [
  { score: 0, emoji: '🌰', status: "A dormant seed" },
  { score: 1, emoji: '🌱', status: "A tiny sprout emerges" },
  { score: 26, emoji: '🌿', status: "A sturdy seedling" },
  { score: 76, emoji: '🌸', status: "Growing taller and fuller" },
  { score: 150, emoji: '🌺', status: "Beautifully in bloom" }
];

// --- DAY-BASED GROWTH LOGIC ---

/**
 * Returns the start of the given date (midnight).
 */
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * Returns the number of full days between two dates.
 */
const daysBetween = (a: Date, b: Date) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((startOfDay(a).getTime() - startOfDay(b).getTime()) / msPerDay);
};

/**
 * Returns the number of days required between tending based on rhythm.
 */
const getDaysForRhythm = (rhythm: Plant['rhythm']): number => {
  switch (rhythm.secondary) {
    case "Morning & Night": return 0.5; // Twice a day
    case "Once a day": return 1;
    case "3 times a week": return 2; // Every ~2 days (special logic below)
    case "Once a week": return 7;
    case "Once a month": return 30;
    default: return 1;
  }
};

/**
 * Returns the {year, week} for a given date (ISO week).
 */
const getWeekYear = (date: Date) => {
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  const week1 = new Date(temp.getFullYear(), 0, 4);
  return {
    year: temp.getFullYear(),
    week: 1 + Math.round(
      ((temp.getTime() - week1.getTime()) / 86400000
        - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  };
};

/**
 * Checks if a plant is due for tending.
 * - For "3 times a week": due if tended < 3 times this week.
 * - For others: due if not tended within the rhythm's days.
 */
export const isPlantDue = (plant: Plant): boolean => {
  if (plant.rhythm.secondary === "3 times a week" && plant.tendingHistory) {
    const now = new Date();
    const { year: currentYear, week: currentWeek } = getWeekYear(now);

    const countThisWeek = plant.tendingHistory.filter(dateStr => {
      const date = new Date(dateStr);
      const { year, week } = getWeekYear(date);
      return year === currentYear && week === currentWeek;
    }).length;

    return countThisWeek < 3;
  }

  // Fallback: day-based logic for other rhythms
  if (!plant.lastTendedDate) return true;

  const today = startOfDay(new Date());
  const lastTended = startOfDay(new Date(plant.lastTendedDate));
  const daysSinceTended = daysBetween(today, lastTended);
  const dueDays = getDaysForRhythm(plant.rhythm);

  return daysSinceTended >= dueDays;
};

/**
 * Calculates the new Growth Score (GS) based on day-based logic.
 */
export const calculateNewGrowthScore = (plant: Plant): number => {
  const today = startOfDay(new Date());
  const lastTended = startOfDay(new Date(plant.lastTendedDate));
  const dueDays = getDaysForRhythm(plant.rhythm);
  const daysSinceTended = daysBetween(today, lastTended);

  // On time if tended within double the rhythm window (in days)
  const isOnTime = daysSinceTended < (dueDays * 2);
  const consistencyMultiplier = isOnTime ? 1.5 : 1.0;

  // Penalty for missed days (logarithmic, only if more than 1 day overdue)
  const daysOverdue = daysSinceTended - dueDays;
  const missedDaysMultiplier = daysOverdue > 1 ? Math.log10(daysOverdue) : 0;
  const penalty = PATIENCE_FACTOR * missedDaysMultiplier;
  const growth = BASE_GROWTH_VALUE * consistencyMultiplier;

  const newScore = plant.growthScore + growth - penalty;
  return Math.max(0, Math.round(newScore));
};

/**
 * Determines the visual representation of a plant based on its Growth Score.
 */
export const getPlantVisual = (score: number): GrowthStage => {
  return GROWTH_STAGES.slice().reverse().find(stage => score >= stage.score) || GROWTH_STAGES[0];
};