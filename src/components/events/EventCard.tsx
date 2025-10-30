import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
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

const EventCard = ({ 
  id, 
  title, 
  description, 
  date, 
  location, 
  organizer, 
  maxTeamSize, 
  registrationDeadline,
  tags,
  registeredTeams,
  status 
}: EventCardProps) => {
  const statusColors = {
    upcoming: "bg-info text-info-foreground",
    ongoing: "bg-success text-success-foreground", 
    past: "bg-muted text-muted-foreground"
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {title}
              </h3>
              <Badge className={statusColors[status]} variant="secondary">
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Max team size: {maxTeamSize} | {registeredTeams} teams registered</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Register by: {registrationDeadline}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          Organized by <span className="font-medium">{organizer}</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex gap-3 w-full">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/events/${id}`}>View Details</Link>
          </Button>
          {status === "upcoming" && (
            <Button asChild className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Link href={`/events/${id}/register`}>Register</Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;