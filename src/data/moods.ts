// src/data/moods.ts

/**
 * Defines the visual properties for each mood, inspired by the color
 * variables in globals.css to ensure a cohesive theme.
 */
export const moodConfig = {
    joy: {
        color: 'bg-[#FFD1BA]',
        gradient: 'from-[var(--color-joy-start)] to-[var(--color-joy-end)]', // from-[#FFE6B3] to-[#FFD1BA]
    },
    sadness: {
        color: 'bg-[#A5B1C7]',
        gradient: 'from-[var(--color-sadness-start)] to-[var(--color-sadness-end)]', // from-[#5F637A] to-[#A5B1C7]
    },
    anger: {
        color: 'bg-[#FFB48C]',
        gradient: 'from-[var(--color-anger-start)] to-[var(--color-anger-end)]', // from-[#D98B8C] to-[#FFB48C]
    },
    fear: {
        color: 'bg-[#847BA9]',
        gradient: 'from-[var(--color-fear-start)] to-[var(--color-fear-end)]', // from-[#BDAFE2] to-[#847BA9]
    },
    calm: {
        color: 'bg-[#A8D9B3]',
        gradient: 'from-[#D3E4CD] to-[#A8D9B3]', // Soft, gentle green
    },
    powerful: {
        color: 'bg-[#53478A]',
        gradient: 'from-[#7D6DB3] to-[#53478A]', // Deep indigo/purple
    },
    thoughtful: {
        color: 'bg-[#B0B8C0]',
        gradient: 'from-[#D1D5DB] to-[#B0B8C0]', // Muted, neutral grey
    },
};

// Defines the type for a single mood, derived from the keys of the config object.
export type Mood = keyof typeof moodConfig;

// Exports an array of all possible mood names for use in dropdowns or lists.
export const moods = Object.keys(moodConfig) as Mood[];