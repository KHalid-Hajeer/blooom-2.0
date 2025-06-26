export type Stage = {
  id: string;
  title: string;
  quote: string;
  groundingPractice: string;
  reflectionPrompt: string;
  optionalPractice?: string;
};

export type Journey = {
  id: string;
  title: string;
  themeColor: 'journey-blue' | 'journey-green' | 'journey-purple' | 'journey-gold';
  stages: Stage[];
};

export const journeys: Journey[] = [
  {
    id: 'path-of-stillness',
    title: 'Path of Stillness',
    themeColor: 'journey-blue',
    stages: [
      {
        id: 'stillness-1',
        title: 'The First Breath',
        quote: 'Begin again, gently.',
        groundingPractice: 'Take three deep, slow breaths. Feel the air fill your lungs and the gentle release as you exhale. Notice the quiet space between each breath.',
        reflectionPrompt: 'What one word describes your inner state right now?',
        optionalPractice: 'Find a comfortable seat for 5 minutes, close your eyes, and simply listen to the sounds around you without judgment.',
      },
      {
        id: 'stillness-2',
        title: 'Body Scan Anchor',
        quote: 'Your body is your home. Be present in it.',
        groundingPractice: 'Bring your awareness to your feet. Feel their connection to the ground. Slowly scan your attention up through your legs, torso, arms, and to the crown of your head.',
        reflectionPrompt: 'Where in your body do you feel the most at ease?',
        optionalPractice: 'Go for a 10-minute walk without your phone. Pay attention to the sensation of your feet on the ground.',
      },
      {
        id: 'stillness-3',
        title: 'The Gentle Heart',
        quote: 'Compassion is a landscape you can learn to walk.',
        groundingPractice: 'Place a hand over your heart. Feel its steady rhythm. Offer yourself a moment of kindness, without needing a reason.',
        reflectionPrompt: 'What is one kind thing you can do for yourself today?',
        optionalPractice: 'Write down three things you are grateful for, no matter how small.',
      },
    ],
  },
  {
    id: 'path-of-creativity',
    title: 'Path of Creativity',
    themeColor: 'journey-green',
    stages: [
       {
        id: 'creativity-1',
        title: 'The Open Field',
        quote: 'Creativity is not a task, but a way of seeing.',
        groundingPractice: 'Look around you and find an object. Spend one minute observing its color, texture, and shape as if you’ve never seen it before.',
        reflectionPrompt: 'What color is your mood today?',
        optionalPractice: 'Doodle for five minutes with no goal in mind. Let your hand move freely.',
      },
      {
        id: 'creativity-2',
        title: 'The First Mark',
        quote: 'Every creation starts with a single, brave mark.',
        groundingPractice: 'Hold a pen or pencil. Feel its weight. Make one mark on a piece of paper—a dot, a line, a swirl. That’s it. You’ve begun.',
        reflectionPrompt: 'What idea, big or small, has been visiting you lately?',
        optionalPractice: 'Take a photo of something that catches your eye today.',
      },
    ],
  },
];