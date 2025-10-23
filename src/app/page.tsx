import styles from './page.module.css'; // Import the CSS module
import { cn } from "@/lib/utils"; // Import cn utility

import EventCard from "@/components/events/EventCard";
import TeamPostCard from "@/components/teams/TeamPostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Calendar, Trophy, Github } from "lucide-react";
import Link from "next/link";

// --- Type Definitions ---
interface FeaturedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  maxTeamSize: number;
  registrationDeadline: string;
  tags: string[];
  registeredTeams: number;
  status: "upcoming" | "ongoing" | "past";
}
interface FeaturedTeamPost {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    college: string;
    year: string;
  };
  rolesNeeded: string[];
  techStack: string[];
  openSlots: number;
  event?: {
    id: string;
    title: string;
  };
  deadline?: string;
  postedAt: string;
  matchScore?: number;
}
// --- End Type Definitions ---


const Index = () => {
  // --- Mock Data ---
  const featuredEvents: FeaturedEvent[] = [
    {
      id: "1",
      title: "Stanford AI Hackathon 2024",
      description: "Build the next generation of AI applications. 48 hours to create innovative solutions using cutting-edge AI technologies.",
      date: "March 15-17, 2024",
      location: "Stanford University, CA",
      organizer: "Stanford AI Club",
      maxTeamSize: 4,
      registrationDeadline: "March 10, 2024",
      tags: ["AI", "Machine Learning", "Deep Learning"],
      registeredTeams: 42,
      status: "upcoming"
    },
    {
      id: "2",
      title: "MIT FinTech Challenge",
      description: "Revolutionary financial technology solutions for the modern world. Focus on blockchain, payments, and financial inclusion.",
      date: "April 2-4, 2024",
      location: "MIT Campus, Cambridge, MA",
      organizer: "MIT Entrepreneurship Club",
      maxTeamSize: 5,
      registrationDeadline: "March 28, 2024",
      tags: ["FinTech", "Blockchain", "Web3"],
      registeredTeams: 28,
      status: "upcoming"
    }
  ];
  const featuredTeamPosts: FeaturedTeamPost[] = [
    {
      id: "1",
      title: "Looking for Frontend Developer - AI Health App",
      description: "Building an AI-powered health monitoring app for the Stanford AI Hackathon. We have backend and ML engineers, need someone skilled in React/Next.js.",
      author: {
        name: "Sarah Chen",
        avatar: "", // Add a placeholder or actual avatar URL
        college: "Stanford University",
        year: "Junior"
      },
      rolesNeeded: ["Frontend Developer", "UI/UX Designer"],
      techStack: ["React", "Next.js", "TypeScript", "TensorFlow"],
      openSlots: 2,
      event: {
        id: "1",
        title: "Stanford AI Hackathon 2024"
      },
      deadline: "March 10, 2024",
      postedAt: "2 hours ago",
      matchScore: 87
    }
    // Add another featured team post if available
  ];
  // --- End Mock Data ---

  return (
    <div className="min-h-screen bg-background w-full"> {/* Added w-full */}

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackgroundContainer}>
          <img
            src={"./hackathon.jpg"}
            alt="Students collaborating on hackathon projects"
            className={styles.heroBackgroundImage}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={cn("container mx-auto", styles.heroContentContainer)}>
          <div className={styles.heroTextContent}>
            <Badge className={cn("bg-primary/10 text-white hover:bg-primary/20 text-sm py-1 px-3", styles.heroBadge)}>
              🚀 Join 10,000+ students building the future
            </Badge>
            <h1 className={styles.heroTitle}>
              Find Your Perfect Hackathon Team
            </h1>
            <p className={styles.heroDescription}>
              Connect with talented students, discover amazing hackathons, and build
              innovative projects that shape tomorrow's technology.
            </p>
            <div className={cn("flex flex-col sm:flex-row gap-4 justify-center", styles.heroActions)}>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-gray-400 text-gray-200 hover:bg-white/10 hover:border-white hover:text-white">
                <Link href="/teams">
                  Find Teams <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-gray-400 text-gray-200 hover:bg-white/10 hover:border-white hover:text-white">
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
            <div className="text-center">
              <div className={styles.statItemValue}>10,000+</div>
              <div className={styles.statItemLabel}>Active Students</div>
            </div>
             <div className="text-center">
               <div className={styles.statItemValue}>500+</div>
               <div className={styles.statItemLabel}>Hackathons</div>
             </div>
             <div className="text-center">
               <div className={styles.statItemValue}>2,500+</div>
               <div className={styles.statItemLabel}>Teams Formed</div>
             </div>
             <div className="text-center">
               <div className={styles.statItemValue}>150+</div>
               <div className={styles.statItemLabel}>Universities</div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.sectionPadding}>
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className={styles.sectionTitle}>
              Everything You Need to Build Great Teams
            </h2>
            <p className={styles.sectionDescription}>
              Our platform makes it easy to find the right teammates, discover exciting
              hackathons, and showcase your projects.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            <Card className="text-center hover:shadow-xl transition-shadow duration-300 border-border/50">
               <CardContent className={styles.featureCardContent}>
                 <div className={cn(styles.featureIconWrapper, styles.featureIconPrimaryBg)}>
                   <Users className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className={styles.featureTitle}>Smart Team Matching</h3>
                 <p className={styles.featureDescription}>
                   Our algorithm matches you with teammates based on skills, interests,
                   and project compatibility for better collaboration.
                 </p>
               </CardContent>
             </Card>
             <Card className="text-center hover:shadow-xl transition-shadow duration-300 border-border/50">
               <CardContent className={styles.featureCardContent}>
                 <div className={cn(styles.featureIconWrapper, styles.featureIconAccentBg)}>
                   <Calendar className="h-8 w-8 text-accent" />
                 </div>
                 <h3 className={styles.featureTitle}>Discover Events</h3>
                 <p className={styles.featureDescription}>
                   Find hackathons at top universities across the country. Filter by
                   technology, location, and dates to find your perfect event.
                 </p>
               </CardContent>
             </Card>
             <Card className="text-center hover:shadow-xl transition-shadow duration-300 border-border/50">
                <CardContent className={styles.featureCardContent}>
                 <div className={cn(styles.featureIconWrapper, styles.featureIconSuccessBg)}>
                   <Trophy className="h-8 w-8 text-green-500" />
                 </div>
                 <h3 className={styles.featureTitle}>Showcase Projects</h3>
                 <p className={styles.featureDescription}>
                   Build your portfolio by showcasing hackathon projects, connecting
                   with mentors, and getting recognition for your work.
                 </p>
               </CardContent>
             </Card>
          </div>
        </div>
      </section>

      {/* Featured Events Section - RESTORED MAPPING */}
      <section className={cn(styles.sectionPadding, "bg-muted/50")}>
        <div className="container mx-auto">
           <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
             <h2 className="text-3xl lg:text-4xl font-bold text-center sm:text-left">Featured Events</h2>
             <Button variant="ghost" asChild className="text-primary hover:text-primary/80">
               <Link href="/events">View All Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
             </Button>
           </div>
           {/* ** This is where the events are mapped ** */}
           <div className="grid md:grid-cols-2 gap-8">
             {featuredEvents.map((event) => (
               <EventCard key={event.id} {...event} />
             ))}
           </div>
        </div>
      </section>

      {/* Featured Teams Section - RESTORED MAPPING */}
      <section className={styles.sectionPadding}>
         <div className="container mx-auto">
           <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
             <h2 className="text-3xl lg:text-4xl font-bold text-center sm:text-left">Find Teammates</h2>
             <Button variant="ghost" asChild className="text-primary hover:text-primary/80">
               <Link href="/teams">View All Posts <ArrowRight className="ml-2 h-4 w-4" /></Link>
             </Button>
           </div>
           {/* ** This is where the team posts are mapped ** */}
           <div className="grid md:grid-cols-2 gap-8">
              {featuredTeamPosts.map((post) => (
                <TeamPostCard key={post.id} {...post} />
              ))}
           </div>
         </div>
       </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl lg:text-2xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students who are already collaborating, learning,
            and building the future through hackathons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Sign Up Free
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors">
              <Link href="/teams">Explore Teams</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Footer Columns... (keep as is) */}
             <div>
               <div className="flex items-center space-x-2 mb-4">
                 <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                   <span className="text-primary-foreground font-bold text-lg">H</span>
                 </div>
                 <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                   HackTeams
                 </span>
               </div>
               <p className="text-muted-foreground text-sm leading-relaxed">
                 The ultimate platform for college hackathon team formation and collaboration.
               </p>
                <div className="flex gap-4 mt-4">
                  <a href="#" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="h-5 w-5"/></a>
                </div>
             </div>
             <div>
               <h4 className="font-semibold text-foreground mb-4">Platform</h4>
               <nav className="flex flex-col space-y-2 text-sm">
                 <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">Events</Link>
                 <Link href="/teams" className="text-muted-foreground hover:text-foreground transition-colors">Teams</Link>
                 <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                 <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
               </nav>
             </div>
             <div>
               <h4 className="font-semibold text-foreground mb-4">Resources</h4>
               <nav className="flex flex-col space-y-2 text-sm">
                 <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a>
                 <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community Guidelines</a>
                 <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a>
               </nav>
             </div>
             <div>
               <h4 className="font-semibold text-foreground mb-4">Company</h4>
               <nav className="flex flex-col space-y-2 text-sm">
                 <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a>
                 <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                 <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                 <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
               </nav>
             </div>
          </div>

          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} HackTeams. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;