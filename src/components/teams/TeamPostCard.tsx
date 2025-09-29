import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, Star, MapPin } from "lucide-react";
import Link from "next/link";

interface TeamPostCardProps {
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

const TeamPostCard = ({
  id,
  title,
  description,
  author,
  rolesNeeded,
  techStack,
  openSlots,
  event,
  deadline,
  postedAt,
  matchScore
}: TeamPostCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        {/* Header with match score */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
              {title}
            </h3>
            {event && (
              <Badge variant="outline" className="mb-2">
                {event.title}
              </Badge>
            )}
          </div>
          {matchScore && (
            <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-full text-sm">
              <Star className="h-3 w-3 fill-current" />
              <span className="font-medium">{matchScore}%</span>
            </div>
          )}
        </div>

        {/* Author info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{author.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{author.college} • {author.year}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {description}
        </p>

        {/* Roles needed */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Looking for:</p>
          <div className="flex flex-wrap gap-2">
            {rolesNeeded.map((role) => (
              <Badge key={role} className="bg-primary/10 text-primary hover:bg-primary/20">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Tech Stack:</p>
          <div className="flex flex-wrap gap-2">
            {techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {techStack.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{techStack.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{openSlots} spots open</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{postedAt}</span>
          </div>
        </div>

        {deadline && (
          <div className="mt-2 text-sm">
            <span className="text-warning font-medium">Deadline: {deadline}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex gap-3 w-full">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/teams/posts/${id}`}>View Details</Link>
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
            Apply to Join
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TeamPostCard;