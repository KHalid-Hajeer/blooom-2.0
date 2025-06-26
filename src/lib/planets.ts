export type MoonData = {
  name: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  colorVar: string;
};

export type PlanetData = {
  name: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  route: string;
  gradient: {
    startVar: string;
    endVar: string;
  };
  glowColorVar: string;
  moons?: MoonData[];
};

export const planets: PlanetData[] = [
  {
    name: 'Garden',
    size: 22,
    orbitRadius: 140,
    orbitSpeed: 0.004,
    route: '/garden',
    gradient: {
      startVar: '--planet-garden-start',
      endVar: '--planet-garden-end',
    },
    glowColorVar: '--planet-garden-ripple',
  },
  {
    name: 'Journey',
    size: 26,
    orbitRadius: 200,
    orbitSpeed: 0.0035,
    route: '/journeys',
    gradient: {
      startVar: '--planet-journey-start',
      endVar: '--planet-journey-end',
    },
    glowColorVar: '--planet-journey-ripple',
  },
  {
    name: 'Reflections',
    size: 20,
    orbitRadius: 260,
    orbitSpeed: 0.0032,
    route: '/chronicles',
    gradient: {
      startVar: '--planet-reflections-start',
      endVar: '--planet-reflections-end',
    },
    glowColorVar: '--planet-reflections-ripple',
  },
  {
    name: 'Companion',
    size: 24,
    orbitRadius: 320,
    orbitSpeed: 0.0028,
    route: '/companion',
    gradient: {
      startVar: '--planet-companion-start',
      endVar: '--planet-companion-end',
    },
    glowColorVar: '--planet-companion-ripple',
    moons: [
      {
        name: 'Echo',
        size: 6,
        orbitRadius: 28,
        orbitSpeed: 0.015,
        colorVar: '--planet-companion-end'
      }
    ]
  },
  {
    name: 'Settings',
    size: 18,
    orbitRadius: 390,
    orbitSpeed: 0.0025,
    route: '/settings',
    gradient: {
      startVar: '--planet-settings-start',
      endVar: '--planet-settings-end',
    },
    glowColorVar: '--planet-settings-ripple',
  }
];
