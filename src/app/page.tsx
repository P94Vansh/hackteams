import EventCard from "@/components/events/EventCard";
import TeamPostCard from "@/components/teams/TeamPostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Calendar, Zap, Trophy, Star, Github } from "lucide-react";
import Link from "next/link";

const Index = () => {
  const featuredEvents = [
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
      status: "upcoming" as const
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
      status: "upcoming" as const
    }
  ];

  const featuredTeamPosts = [
    {
      id: "1",
      title: "Looking for Frontend Developer - AI Health App",
      description: "Building an AI-powered health monitoring app for the Stanford AI Hackathon. We have backend and ML engineers, need someone skilled in React/Next.js.",
      author: {
        name: "Sarah Chen",
        avatar: "",
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
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={"./hackathon.jpg"} 
            alt="Students collaborating on hackathon projects"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        </div>
        
        <div className="relative container py-24 lg:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              🚀 Join 10,000+ students building the future
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Find Your Perfect Hackathon Team
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with talented students, discover amazing hackathons, and build 
              innovative projects that shape tomorrow's technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8">
                <Link href="/teams">
                  Find Teams <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Hackathons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">2,500+</div>
              <div className="text-muted-foreground">Teams Formed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Universities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Build Great Teams
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy to find the right teammates, discover exciting 
              hackathons, and showcase your projects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Team Matching</h3>
                <p className="text-muted-foreground">
                  Our algorithm matches you with teammates based on skills, interests, 
                  and project compatibility for better collaboration.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Discover Events</h3>
                <p className="text-muted-foreground">
                  Find hackathons at top universities across the country. Filter by 
                  technology, location, and dates to find your perfect event.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Showcase Projects</h3>
                <p className="text-muted-foreground">
                  Build your portfolio by showcasing hackathon projects, connecting 
                  with mentors, and getting recognition for your work.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already collaborating, learning, 
            and building the future through hackathons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Sign Up Free
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/events">Explore Teams</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">H</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  HackTeams
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                The ultimate platform for college hackathon team formation and collaboration.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link href="/events" className="block text-muted-foreground hover:text-foreground">Events</Link>
                <Link href="/teams" className="block text-muted-foreground hover:text-foreground">Teams</Link>
                <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground">Dashboard</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground">Help Center</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Guidelines</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Best Practices</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground">About</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Privacy</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Terms</a>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 HackTeams. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;