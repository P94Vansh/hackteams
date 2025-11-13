// src/components/Navbar.tsx
'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
// Import new icons and Dropdown components
import { User, Bell, Menu, LogOut, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Header = () => {
    // We no longer need isMenuOpen state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get("/api/user"); 
                if (response.status === 200) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    // Logout handler remains the same
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            setIsLoggedIn(false);
            router.push("/");
            router.refresh(); // Force a refresh to update state
        } catch (error) {
            console.error("Logout failed", error);
        }
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

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    {/* --- DESKTOP ACTIONS (Hidden on Mobile) --- */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Button variant="ghost" size="icon" aria-label="Notifications">
                            <Link href={'/notifications'}>
                            <Bell className="h-5 w-5" />
                            </Link>
                        </Button>

                        <Button variant="ghost" size="icon" aria-label="User Menu">
                            <Link href={'/profile'}>
                            <User className="h-5 w-5" />
                            </Link>
                        </Button>
                        
                        {isLoading ? (
                            <Button variant="outline" size="sm" disabled>...</Button>
                        ) : isLoggedIn ? (
                            // --- THIS BUTTON WAS CHANGED ---
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" /> 
                                Logout
                            </Button>
                            // ---------------------------------
                        ) : (
                            <Button variant="outline" size="sm">
                                <Link href={'/signin'}>
                                Sign In
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* --- MOBILE MENU DROPDOWN (Hidden on Desktop) --- */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden" // Only show on mobile
                                aria-label="Toggle Menu"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 md:hidden">
                            {isLoading ? (
                                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                            ) : isLoggedIn ? (
                                <>
                                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/notifications')}>
                                        <Bell className="mr-2 h-4 w-4" />
                                        <span>Notifications</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <DropdownMenuItem onClick={() => router.push('/signin')}>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    <span>Sign In</span>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
            
        </header>
    );
};

export default Header;