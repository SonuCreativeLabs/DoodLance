"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const setupSession = async () => {
      try {
        // Get the hash fragment from the URL
        const hash = window.location.hash.substring(1); // Remove the # symbol
        if (!hash) {
          setError("No recovery token found. Please request a new password reset link.");
          return;
        }

        // Parse the hash parameters
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (!accessToken || type !== "recovery") {
          setError("Invalid recovery link. Please request a new password reset link.");
          return;
        }

        // Set up the session
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ""
        });

        if (sessionError) {
          console.error("Session setup error:", sessionError);
          setError("Failed to initialize recovery session. Please request a new password reset link.");
          return;
        }

        // Verify we have a valid session
        const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
        if (getSessionError || !session) {
          console.error("Get session error:", getSessionError);
          setError("Unable to verify recovery session. Please request a new password reset link.");
          return;
        }

        console.log("Session successfully initialized");
      } catch (err) {
        console.error("Recovery setup error:", err);
        setError("An error occurred during recovery setup. Please try again.");
      }
    };

    setupSession();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      setSuccess(true);
      // Sign out the user after successful password reset
      await supabase.auth.signOut();
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    } catch (error: any) {
      console.error("Password update error:", error);
      setError(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white text-center">Reset Password</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-900/50 border-red-800">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 bg-green-900/50 border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400">Password reset successful! Redirecting to login...</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading || !!error}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/auth/signin")}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              Back to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 