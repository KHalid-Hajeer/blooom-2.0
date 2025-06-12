'use client'

import { useState, useEffect } from 'react'
import type { FC, JSX } from 'react'
import { SparklesIcon, HeartIcon, CheckCircleIcon, BookOpenIcon, GlobeAltIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

// --- TypeScript Definitions (Updated) ---
type Testimonial = {
  text: string;
  author: string;
  achievement: string;
  icon: JSX.Element;
};

type JourneyStep = {
  icon: JSX.Element;
  title: string;
  description: string;
  visual_description: string;
};

// --- Component Data (Updated) ---
const testimonials: Testimonial[] = [
  {
    text: "Bloom didn't just help me build habits—it made me fall in love with the process of growing.",
    author: "Sarah M.",
    achievement: "Lost 30lbs and gained confidence",
    icon: <HeartIcon className="h-6 w-6 text-primary" />
  },
  {
    text: "I used to give up after a week. Now I celebrate small wins daily. Bloom changed how I see progress.",
    author: "Marcus T.",
    achievement: "Wrote a novel in 6 months",
    icon: <BookOpenIcon className="h-6 w-6 text-primary" />
  },
  {
    text: "The cherry blossom visualization made my goals feel alive. Each day blooming was magical.",
    author: "Elena K.",
    achievement: "Learned Spanish fluently",
    icon: <GlobeAltIcon className="h-6 w-6 text-primary" />
  },
];

const journeySteps: JourneyStep[] = [
    {
        icon: <CheckCircleIcon className="h-8 w-8 text-primary" />,
        title: "Plant an Intention",
        description: "Start by planting a clear intention — a simple, meaningful goal to begin your journey.",        
        visual_description: "5 examples of goals to set."
      },
      {
        icon: <SparklesIcon className="h-8 w-8 text-primary" />,
        title: "Nurture with Joy",
        description: "Watch your intention grow through stages of commitment. ",
        visual_description: "Do it once, week, month, 6 months, year (seed stages to left of each"
      },
      {
        icon: <HeartIcon className="h-8 w-8 text-primary" />,
        title: "Grow with Bloom",
        description: "Celebrate your progress by seeing your personal garden flourish—a vibrant space filled with the fruits of your consistent effort.",
        visual_description: "a personal blooming garden where every seed has blossomed"
      },
];


const Home: FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // A simple timeout to simulate loading and let the animation play.
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const activeTestimonial = testimonials[currentTestimonial];

  return (
    <>
      {/* Preloader Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-1000 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <p className="text-primary text-xl font-display animate-pulse">Blooming...</p>
      </div>

      <div className="min-h-screen bg-background font-body text-text">
        {/* Header Section */}
        <header className="relative text-center pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
          {/* Refined background element to feel more "alive" */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-primary/10 rounded-full blur-3xl animate-pulse -z-10" />
          <h1 className="text-6xl md:text-8xl font-bold font-display text-primary leading-tight">
            Bloom
          </h1>
          <h2 className="mt-4 text-xl md:text-4xl font-normal font-body text-text/70 max-w-2xl mx-auto">
            Experience your growth unfold.
          </h2>
        </header>

        {/* Visual Promise Section - The "Show, Don't Tell" centerpiece */}
        <section className="container mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto aspect-video rounded-3xl flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20 shadow-lg border border-primary/20 p-4">
            <p className="text-text/60 font-body text-center max-w-sm">
              [Visual Placeholder] [Illustration placeholder: A gentle cycle showing a seed growing through stages — seed, sprout, bud, full bloom — repeating in a seamless loop.]
              (Custom hand-drawn or digitally created frames will replace this.)
            </p>
          </div>
        </section>

        {/* Journey Section - A "Guided Adventure" */}
        <section className="container mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-primary">A journey that feels different.</h2>
          </div>

          <div className="space-y-20 md:space-y-28">
            {journeySteps.map((step, index) => (
              <div key={step.title} className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2 text-center md:text-left">
                  <div className="inline-flex items-center gap-4">
                    <span className="p-3 bg-primary/10 rounded-full">{step.icon}</span>
                    <h3 className="text-3xl font-bold font-display text-text">{step.title}</h3>
                  </div>
                  <p className="mt-6 text-lg font-body text-text/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="bg-primary/5 aspect-square rounded-3xl shadow-xl border border-primary/20 flex items-center justify-center p-8">
                     {/* Updated placeholder to be more descriptive */}
                    <p className="text-text/60 font-body text-center">Animation: "{step.visual_description}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Testimonials Section - Building "Affection" and "Trust" */}
        <section className="bg-primary/10 py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-center text-3xl font-display text-primary/80 mb-12">What bloom feels like.</h2>
              <div className="rounded-3xl p-8 md:p-12 text-center transition-all duration-500 ease-in-out bg-background shadow-xl min-h-[300px] flex flex-col justify-center">

                {activeTestimonial ? (
                  <>
                    <p className="text-2xl md:text-3xl font-light font-body text-text leading-snug">
                      "{activeTestimonial.text}"
                    </p>
                    <div className="mt-8">
                       {/* Added icon for a personal touch */}
                      <div className="flex justify-center items-center gap-3">
                        {activeTestimonial.icon}
                        <p className="font-bold text-lg font-display text-primary">
                          {activeTestimonial.author}
                        </p>
                      </div>
                      <p className="text-sm font-body text-text/60 mt-1">
                        {activeTestimonial.achievement}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-text/60 font-body">Loading testimonials...</p>
                )}
              </div>

              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to testimonial ${index + 1}`}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-primary scale-125'
                        : 'bg-primary/30 hover:bg-primary/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section - Sparking "Exploration" */}
        <section className="text-center py-24 md:py-32 px-6">
          <p className="mt-4 text-xl font-body text-text/70 max-w-2xl mx-auto">
          Your garden of progress awaits. Step in, explore, and watch yourself bloom.          </p>
           {/* Updated button with a micro-interaction to add "delight" */}
           <Link href="/sign-up">
            <button className="mt-10 group relative px-12 py-6 text-xl font-bold font-display text-background rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 overflow-hidden">
              <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform-gpu scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-in-out origin-bottom" />
              <span className="relative z-10">Start Blooming</span>
            </button>
          </Link>
        </section>
      </div>
    </>
  );
};

export default Home;