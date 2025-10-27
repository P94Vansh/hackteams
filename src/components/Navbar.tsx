// src/components/Navbar.tsx
'use client'

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, User, Bell, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator // Optional: if you want separators
} from "@/components/ui/dropdown-menu"; // Make sure you've added dropdown-menu via shadcn/ui
import { cn } from "@/lib/utils"; // Import cn utility

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close mobile menu when a link is clicked (optional but good UX)
    const handleMobileLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r
  from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400">
                            HackTeams
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation Removed */}

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    <div className="hidden md:flex items-center space-x-2">
                        <Button variant="ghost" size="icon" aria-label="Search">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Notifications">
                            <Link href={'/notifications'}>
                            <Bell className="h-5 w-5" />
                            </Link>
                        </Button>

                        {/* Dropdown Menu for Profile & Main Nav */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="User Menu">
                              <User className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          {/* === ADDED bg-white HERE === */}
                          <DropdownMenuContent align="end" className={cn("w-48", "bg-white")}> {/* Explicitly set background to white */}
                            <DropdownMenuItem asChild>
                              <Link href="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/teams">Find Teams</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/dashboard">Dashboard</Link>
                            </DropdownMenuItem>
                            {/* Optional Separator */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              {/* Add Logout functionality here later */}
                              Log out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                          {/* === END OF CHANGE === */}
                        </DropdownMenu>
                        {/* End Dropdown Menu */}

                        <Button variant="outline" size="sm">
                            Sign In
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
                    {/* Simplified mobile nav, assuming dropdown covers main links */}
                    <nav className="flex flex-col space-y-3 py-4 px-4">
                        <Link href="/profile" className="text-foreground/80 hover:text-foreground transition-colors" onClick={handleMobileLinkClick}>
                           Profile
                        </Link>
                        {/* You might still want quick access links here */}
                        <Link href="/teams" className="text-foreground/80 hover:text-foreground transition-colors" onClick={handleMobileLinkClick}>
                            Find Teams
                        </Link>
                        <Link href="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors" onClick={handleMobileLinkClick}>
                            Dashboard
                        </Link>
                         <DropdownMenuSeparator /> {/* Optional separator */}
                        <Button variant="outline" className="w-full">
                            Sign In
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;