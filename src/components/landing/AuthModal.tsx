import React, { useState } from "react";
import { X, Mail, Github, Chrome, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithGitHub,
} from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "signin",
}) => {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [userType, setUserType] = useState<"brand" | "influencer">("brand");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }

        const { data, error } = await signUpWithEmail(email, password, {
          user_type: userType,
          full_name: email.split("@")[0],
        });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
        onClose();
      } else {
        const { data, error } = await signInWithEmail(email, password);
        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        onClose();
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      const { error } =
        provider === "google"
          ? await signInWithGoogle()
          : await signInWithGitHub();

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to sign in with ${provider}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md mx-4"
        >
          <Card className="bg-white shadow-2xl border-0">
            <CardHeader className="relative pb-6">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                {mode === "signin" ? "Welcome Back" : "Join Commisafe"}
              </CardTitle>
              <p className="text-center text-gray-600 mt-2">
                {mode === "signin"
                  ? "Sign in to your account to continue"
                  : "Create your account and start earning commissions"}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* User Type Selection (only for signup) */}
              {mode === "signup" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    I am a:
                  </Label>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant={userType === "brand" ? "default" : "outline"}
                      className={`flex-1 ${userType === "brand" ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-purple-50 hover:border-purple-300"}`}
                      onClick={() => setUserType("brand")}
                    >
                      Brand
                    </Button>
                    <Button
                      type="button"
                      variant={
                        userType === "influencer" ? "default" : "outline"
                      }
                      className={`flex-1 ${userType === "influencer" ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-purple-50 hover:border-purple-300"}`}
                      onClick={() => setUserType("influencer")}
                    >
                      Influencer
                    </Button>
                  </div>
                </div>
              )}

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 hover:bg-gray-50 border-gray-300"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={isLoading}
                >
                  <Chrome className="h-4 w-4" />
                  <span>Continue with Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 hover:bg-gray-50 border-gray-300"
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={isLoading}
                >
                  <Github className="h-4 w-4" />
                  <span>Continue with GitHub</span>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Please wait..."
                    : mode === "signin"
                      ? "Sign In"
                      : "Create Account"}
                </Button>
              </form>

              {/* Toggle Mode */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {mode === "signin"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <Button
                    type="button"
                    variant="link"
                    className="ml-1 p-0 h-auto font-medium text-purple-600 hover:text-purple-700"
                    onClick={() =>
                      setMode(mode === "signin" ? "signup" : "signin")
                    }
                  >
                    {mode === "signin" ? "Sign up" : "Sign in"}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
