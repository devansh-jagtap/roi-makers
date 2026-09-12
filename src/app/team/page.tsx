import TeamShowcase, { TeamInfo } from "@/components/ui/shared/TeamShowcase";

const teamImages = [
  "/team_picture/1.webp",
  "/team_picture/2.webp",
  "/team_picture/3.webp",
  "/team_picture/5.webp",
  "/team_picture/4.webp",
  "/team_picture/6.webp",
];

const teamNames = [
  "Team",
  "Sankesh",
  "Tripti",
  "Harshita",
  "Vijay",
  "Amit",
  "Pankaj",
];

const teamInfo: TeamInfo[] = [
  {
    fullName: "Sankesh Pate",
    role: "Senior Graphic Designer",
    bio: "Sankesh designs compelling visual identities that capture brand essence perfectly.",
    fun: "Master of creative design solutions.",
  },
  {
    fullName: "Tripti Ray",
    role: "Digital Marketing Strategist",
    bio: "Tripti crafts comprehensive digital marketing strategies that deliver measurable results.",
    fun: "Loves analyzing market trends.",
  },
  {
    fullName: "Harshita Sharma",
    role: "Social Media Strategist",
    bio: "Harshita creates engaging social media campaigns that build brand communities.",
    fun: "Expert in viral content creation.",
  },
  {
    fullName: "Vijay Vishwakarma",
    role: "Senior Motion Graphic Designer",
    bio: "Vijay brings brands to life through stunning motion graphics and visual storytelling.",
    fun: "Creates award-winning animations.",
  },
   {
    fullName: "Amit Sharma",
    role: "Founder & CEO",
    bio: "Amit leads the company with vision and innovation, driving growth and success.",
    fun: "Amit is a passionate entrepreneur and a lifelong learner, always seeking new challenges and opportunities to grow.",
  },
  {
    fullName: "Pankaj Vishwakarma",
    role: "Wordpress & Shopify Developer",
    bio: "Pankaj builds high-performance websites and e-commerce solutions that convert.",
    fun: "Code optimization enthusiast.",
  },
];

export default function TeamPage() {
  return (
    <TeamShowcase
      teamNames={teamNames}
      teamImages={teamImages}
      teamInfo={teamInfo}
      title="{ Meet The }"
    />
  );
}