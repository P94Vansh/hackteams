'use client'

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, User, Bell, Menu, X } from "lucide-react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
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

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
  <Link href="/teams" className="text-foreground hover:text-primary transition-colors">
    Find Teams
  </Link>
  <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
    Dashboard
  </Link>
</nav>


                {/* Actions */}
                <div className="flex items-center space-x-3">
                    <div className="hidden md:flex space-x-2">
                        <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Link href="/profile">
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Button className="bg-white">
                            Sign In
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background shadow-sm">
                    <nav className="flex flex-col space-y-3 py-4 px-4">
                        <Link href="/teams" className="text-foreground/80 hover:text-foreground transition-colors">
                            Find Teams
                        </Link>
                        <Link href="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                            Dashboard
                        </Link>
                        <Button className="w-full bg-gradient-to-r from-primary to-accent text-black hover:opacity-90">
                            Sign In
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
