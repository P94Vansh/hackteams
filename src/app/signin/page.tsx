// src/app/signin/page.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
// Import UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Import Icons
import { Mail, Lock, Eye, EyeOff, Home } from "lucide-react";
// Import utility and styles
import { cn } from "@/lib/utils";
import styles from './signin.module.css'; // Import the CSS module

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isFormValid = useMemo(() => {
    return email.trim() !== "" && password.trim() !== "";
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError("");
    setSuccess("");

    let res: Response | null = null;

    try {
      res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

    } catch (err) {
      setError("Something went wrong during login.");
      setLoading(false);
    }
  };


  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>

        <Card className={styles.card}>

          <CardHeader className={styles.cardHeader}>
             {/* Back to Home Icon Button Container */}
            <div className={styles.homeButtonContainer}>
              <Button variant="ghost" size="icon" asChild className={styles.homeButton}>
                <Link href="/" aria-label="Back to Home">
                  <Home className={styles.homeIcon} />
                </Link>
              </Button>
            </div>

            {/* Text content */}
            <div className={styles.headerTextContainer}>
              <h3 className={styles.headerTitle}>
                Welcome Back
              </h3>
              <p className={styles.headerDescription}>
                Sign in to continue
              </p>
            </div>

             {/* Placeholder */}
             <div className={styles.headerPlaceholder} aria-hidden="true"></div>
          </CardHeader>

          <CardContent className={styles.cardContent}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Feedback Messages */}
              {error && (
                <p className={styles.errorMessage}>
                  {error}
                </p>
              )}
               {success && (
                <p className={styles.successMessage}>
                  {success}
                </p>
              )}

              {/* Email */}
              <div className={styles.inputGroup}>
                <Label htmlFor="email" className={styles.label}>Email</Label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@university.edu"
                    className={cn(styles.inputField, styles.inputFieldIconPadding)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.inputGroup}>
                <Label htmlFor="password" className={styles.label}>Password</Label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={cn(
                      styles.inputField,
                      styles.inputFieldIconPadding,
                      styles.inputFieldPasswordPadding // Extra padding for eye icon
                    )}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggleButton}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className={styles.passwordToggleIcon} /> : <Eye className={styles.passwordToggleIcon} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className={cn(
                  styles.submitButtonBase,
                  isFormValid && !loading
                    ? styles.submitButtonActive // Active state styles
                    : styles.submitButtonDisabled // Disabled/Invalid state styles
                )}
                size="lg"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Register link */}
              <div className={styles.registerLinkContainer}>
                <span className={styles.registerLinkText}>Don’t have an account? </span>
                <Link href="/register" className={styles.registerLink}>
                  Register here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}