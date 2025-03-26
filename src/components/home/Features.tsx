
import React from 'react';
import { Clock, Rocket, BarChart, Users, Zap, Award } from 'lucide-react';

const features = [
  {
    icon: <Clock className="h-6 w-6 text-blue-500" />,
    title: "30-Second Video Pitches",
    description: "Distill your startup vision into a concise, powerful pitch that investors can quickly absorb."
  },
  {
    icon: <Users className="h-6 w-6 text-blue-500" />,
    title: "Community Upvotes",
    description: "Get real validation as users and investors upvote the most promising ideas to the top."
  },
  {
    icon: <Zap className="h-6 w-6 text-blue-500" />,
    title: "AI-Powered Analysis",
    description: "Receive instant feedback and suggestions to improve your pitch's clarity and impact."
  },
  {
    icon: <Rocket className="h-6 w-6 text-blue-500" />,
    title: "Investor Access",
    description: "Connect directly with interested investors who engage with your pitch."
  },
  {
    icon: <BarChart className="h-6 w-6 text-blue-500" />,
    title: "Real-Time Analytics",
    description: "Track views, engagement, and investor interest with comprehensive analytics."
  },
  {
    icon: <Award className="h-6 w-6 text-blue-500" />,
    title: "Viral Exposure",
    description: "The best pitches get featured in newsletters and social media for maximum visibility."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Why Founders Choose PitchHouse
          </h2>
          <p className="text-lg text-muted-foreground">
            We've reimagined startup pitching for today's fast-paced, video-first world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 rounded-xl card-hover"
            >
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
