"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        toast.success("Welcome back! Redirecting...");
        router.push("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        toast.error("Sign in failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      toast.error(err.errors?.[0]?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      toast.error(err.errors?.[0]?.message || "Failed to sign in with Google");
    }
  };

  return (
    <div>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        {/* Left Side — branding */}
        <div className="relative hidden items-center justify-center overflow-hidden lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-linear-to-br from-[#0CF2A0]/15 via-[#0a0a0a] to-[#0a0a0a]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 px-12 text-center"
          >
            <div className="mb-8 flex items-center justify-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#0CF2A0] to-[#0CF2A0]/60">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6Z"
                    fill="#0a0a0a"
                    fillOpacity="0.8"
                  />
                  <path d="M14 2V8H20" fill="#0a0a0a" fillOpacity="0.5" />
                  <path
                    d="M14 2L20 8"
                    stroke="#0a0a0a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="12"
                    cy="15"
                    r="3.5"
                    stroke="#0CF2A0"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M10 15L11.2 16.5L14 13.5"
                    stroke="#0CF2A0"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-3xl font-bold text-white">Summarist</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-white">
              Transform your PDFs with{" "}
              <span className="text-[#0CF2A0]">AI</span>
            </h2>
            <p className="mx-auto max-w-md text-lg text-gray-400">
              Summarize, chat, and extract insights from any document in
              seconds.
            </p>
          </motion.div>
        </div>

        {/* Right Side — form */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="mb-10 flex items-center space-x-3 lg:hidden">
              <div
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-linear-to-br from-[#0CF2A0] to-[#0CF2A0]/60"
                onClick={() => router.push("/")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6Z"
                    fill="#0a0a0a"
                    fillOpacity="0.8"
                  />
                  <path d="M14 2V8H20" fill="#0a0a0a" fillOpacity="0.5" />
                  <path
                    d="M14 2L20 8"
                    stroke="#0a0a0a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="12"
                    cy="15"
                    r="3.5"
                    stroke="#0CF2A0"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M10 15L11.2 16.5L14 13.5"
                    stroke="#0CF2A0"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className="cursor-pointer text-xl font-bold text-white"
                onClick={() => router.push("/")}
              >
                Summarist
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-bold text-white">Welcome back</h1>
            <p className="mb-8 text-gray-400">
              Sign in to your account to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border border-gray-800 bg-[#111111] text-white focus-visible:border-[#0CF2A0] focus-visible:ring-[#0CF2A0]/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm text-gray-300">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="bg-transparent text-xs text-[#0CF2A0] transition-colors hover:bg-transparent hover:text-[#0CF2A0]/80"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-gray-800 bg-[#111111] pr-12 text-white placeholder:text-gray-600 focus-visible:border-[#0CF2A0] focus-visible:ring-[#0CF2A0]/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-transparent text-gray-500 transition-colors hover:bg-transparent hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="group h-12 w-full rounded-xl bg-[#0CF2A0] font-bold text-[#0a0a0a] transition-all hover:bg-[#0CF2A0]/90 disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0a0a0a] px-4 text-gray-500">
                  or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="h-12 w-full rounded-xl border-gray-800 bg-[#111111] font-medium text-white transition-all hover:border-gray-700 hover:bg-[#1a1a1a] hover:text-[#0CF2A0]"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-[#0CF2A0] transition-colors hover:text-[#0CF2A0]/80"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {/* glow line */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative mt-2 h-0.5 w-full"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#0CF2A0]/40 to-transparent" />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom shadow */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-16 w-[60%] -translate-x-1/2 rounded-full bg-[#0CF2A0]/4 blur-3xl" />
      </div>
    </div>
  );
}
