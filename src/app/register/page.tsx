// src/app/register/page.tsx
'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
// Import UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Import Icons - Added Home
import { Eye, EyeOff, User, Mail, Lock, Home } from "lucide-react";
// Import utility and styles
import { cn } from "@/lib/utils";
import styles from './register.module.css'; // Import the CSS module

const Register = () => {
  const router=useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    course: "",
    year: "",
    location: "",
    bio: "",
    github: "",
    portfolio: "",
    skills: "",
    interests: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!formData.name || !formData.email || !formData.password || !formData.university || !formData.course || !formData.year) {
      setError("Please fill in all required fields.");
      return;
    }


    try {
      setLoading(true);
      const response = await axios.post("/api/register", {
        ...formData,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()).filter(s => s) : [],
        interests: formData.interests ? formData.interests.split(",").map((i) => i.trim()).filter(i => i) : []
      }); //

      setSuccess("Account created successfully!");
      router.push("/signin")
      console.log("API response:", response.data);
      // Optional: Clear form or redirect
      // setFormData({ name: "", email: "", ... initial state ... });
      // setTimeout(() => { window.location.href = "/signin"; }, 1500);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || "Something went wrong during registration");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim() !== "" &&
                      formData.email.trim() !== "" &&
                      formData.password.trim() !== "" &&
                      formData.confirmPassword.trim() !== "" &&
                      formData.university.trim() !== "" &&
                      formData.course.trim() !== "" &&
                      formData.year.trim() !== "";


  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* Back link removed from here */}

        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
             {/* Home Icon Button Container (Left) */}
            <div className={styles.homeButtonContainer}>
              <Button variant="ghost" size="icon" asChild className={styles.homeButton}>
                <Link href="/" aria-label="Back to Home">
                  <Home className={styles.homeIcon} />
                </Link>
              </Button>
            </div>

            {/* Header Text Container (Center) */}
            <div className={styles.headerTextContainer}>
              <h3 className={styles.cardTitle}> {/* Use h3 for semantics */}
                Join HackTeams
              </h3>
              <p className={styles.cardDescription}> {/* Use p for semantics */}
                Create your account to start building amazing teams
              </p>
            </div>

             {/* Placeholder (Right) */}
             <div className={styles.headerPlaceholder} aria-hidden="true"></div>
          </CardHeader>

          <CardContent className={styles.cardContent}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Feedback Messages */}
              {error && <p className={styles.errorMessage}>{error}</p>}
              {success && <p className={styles.successMessage}>{success}</p>}

              {/* Form Fields */}
              {/* Name */}
              <div className={styles.inputGroup}>
                <Label htmlFor="name" className={styles.label}>Full Name <span className={styles.requiredIndicator}>*</span></Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className={styles.inputField}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className={styles.inputGroup}>
                <Label htmlFor="email" className={styles.label}>Email <span className={styles.requiredIndicator}>*</span></Label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@university.edu"
                    className={cn(styles.inputField, styles.inputFieldIconPadding)}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

               {/* University */}
              <div className={styles.inputGroup}>
                <Label htmlFor="university" className={styles.label}>University <span className={styles.requiredIndicator}>*</span></Label>
                <Input
                  id="university"
                  name="university"
                  type="text"
                  placeholder="e.g., Stanford University"
                  className={styles.inputField}
                  value={formData.university}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              {/* Course */}
              <div className={styles.inputGroup}>
                <Label htmlFor="course" className={styles.label}>Course <span className={styles.requiredIndicator}>*</span></Label>
                <Input
                  id="course"
                  name="course"
                  type="text"
                  placeholder="e.g., Computer Science"
                  className={styles.inputField}
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

               {/* Academic Year */}
              <div className={styles.inputGroup}>
                <Label htmlFor="year" className={styles.label}>Academic Year <span className={styles.requiredIndicator}>*</span></Label>
                <Input
                  id="year"
                  name="year"
                  type="text"
                  placeholder="e.g., Sophomore, Junior"
                  className={styles.inputField}
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              {/* Optional Fields Section */}
              <hr className={styles.separator} />
              <p className={styles.optionalFieldsHeader}>Optional Information</p>

               {/* Location */}
              <div className={styles.inputGroup}>
                <Label htmlFor="location" className={styles.label}>Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="City, Country"
                   className={styles.inputField}
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

               {/* Bio */}
              <div className={styles.inputGroup}>
                <Label htmlFor="bio" className={styles.label}>Short Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  type="text"
                  placeholder="Tell us about yourself"
                  className={styles.inputField}
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* GitHub */}
              <div className={styles.inputGroup}>
                <Label htmlFor="github" className={styles.label}>GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  type="text"
                  placeholder="https://github.com/username"
                  className={styles.inputField}
                  value={formData.github}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* Portfolio */}
              <div className={styles.inputGroup}>
                <Label htmlFor="portfolio" className={styles.label}>Portfolio</Label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  type="text"
                  placeholder="https://yourportfolio.com"
                  className={styles.inputField}
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* Skills */}
              <div className={styles.inputGroup}>
                <Label htmlFor="skills" className={styles.label}>Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  type="text"
                  placeholder="React, Node.js, Figma"
                  className={styles.inputField}
                  value={formData.skills}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* Interests */}
              <div className={styles.inputGroup}>
                <Label htmlFor="interests" className={styles.label}>Interests (comma separated)</Label>
                <Input
                  id="interests"
                  name="interests"
                  type="text"
                  placeholder="AI, Hackathons, Web Dev"
                  className={styles.inputField}
                  value={formData.interests}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <hr className={styles.separator} />

              {/* Password */}
              <div className={styles.inputGroup}>
                <Label htmlFor="password" className={styles.label}>Password <span className={styles.requiredIndicator}>*</span></Label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={cn(styles.inputField, styles.inputFieldIconPadding, styles.inputFieldPasswordPadding)}
                    value={formData.password}
                    onChange={handleInputChange}
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

              {/* Confirm Password */}
              <div className={styles.inputGroup}>
                <Label htmlFor="confirmPassword" className={styles.label}>Confirm Password <span className={styles.requiredIndicator}>*</span></Label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                     className={cn(styles.inputField, styles.inputFieldIconPadding, styles.inputFieldPasswordPadding)}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                     className={styles.passwordToggleButton}
                     aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className={styles.passwordToggleIcon} /> : <Eye className={styles.passwordToggleIcon} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className={cn(
                  styles.submitButtonBase,
                  isFormValid && !loading
                    ? styles.submitButtonActive
                    : styles.submitButtonDisabled
                )}
                size="lg"
                disabled={loading || !isFormValid}
              >
                <User className={styles.submitButtonIcon} />
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Sign in link */}
              <div className={styles.signInLinkContainer}>
                <span className={styles.signInLinkText}>Already have an account? </span>
                <Link href="/signin" className={styles.signInLink}>
                  Sign in {/* Changed text */}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className={styles.footerText}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default Register;