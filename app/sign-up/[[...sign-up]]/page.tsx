"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
  ];

  const allPasswordChecksMet = passwordChecks.every((check) => check.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
      toast.success("Verification code sent to your email!");
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      const errorMessage = err.errors?.[0]?.message || "Failed to sign up";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        toast.success("Account created successfully! Redirecting...");
        router.push("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        toast.error("Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      toast.error("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      toast.error(err.errors?.[0]?.message || "Failed to sign up with Google");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <div className="relative hidden items-center justify-center overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-linear-to-br from-[#0CF2A0]/15 via-[#0a0a0a] to-[#0a0a0a]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-12 text-center"
        >
          <div className="mb-8 flex items-center justify-center space-x-2">
            <div className="flex items-center justify-center">
              <Logo size={40} />
            </div>
            <span className="text-3xl font-bold text-white">Summarist</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white">
            Start your <span className="text-[#0CF2A0]">AI-powered</span>{" "}
            journey
          </h2>
          <p className="mx-auto max-w-md text-lg text-gray-400">
            Join thousands of users who save hours every week with intelligent
            document analysis.
          </p>

          <div className="mx-auto mt-10 max-w-sm space-y-4 text-left">
            {[
              "Unlimited PDF summaries",
              "AI-powered chat with documents",
              "Export & share insights",
            ].map((feature) => (
              <div key={feature} className="flex items-center space-x-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0CF2A0]/20">
                  <Check className="h-3 w-3 text-[#0CF2A0]" />
                </div>
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href={"/"}>
            <div className="mb-4 flex items-center space-x-2 lg:hidden">
              <div className="flex cursor-pointer items-center justify-center">
                <Logo size={30} />
              </div>
              <span className="cursor-pointer text-xl font-bold text-white">
                Summarist
              </span>
            </div>
          </Link>

          {!pendingVerification ? (
            <>
              <h1 className="mb-2 text-3xl font-bold text-white">
                Create your account
              </h1>
              <p className="mb-8 text-gray-400">
                Get started for free — no credit card required
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm text-gray-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl border-gray-800 bg-[#111111] text-white placeholder:text-gray-600 focus-visible:border-[#0CF2A0] focus-visible:ring-[#0CF2A0]/50"
                    required
                  />
                </div>

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
                    className="h-12 rounded-xl border-gray-800 bg-[#111111] text-white placeholder:text-gray-600 focus-visible:border-[#0CF2A0] focus-visible:ring-[#0CF2A0]/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-gray-300">
                    Password
                  </Label>
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
                      className="absolute top-1/2 right-4 -translate-y-1/2 bg-transparent text-gray-500 transition-colors hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex flex-wrap items-center gap-3 pt-2"
                    >
                      {passwordChecks.map((check) => (
                        <div
                          key={check.label}
                          className="flex items-center space-x-1.5"
                        >
                          <div
                            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-colors ${
                              check.met ? "bg-[#0CF2A0]/20" : "bg-gray-800"
                            }`}
                          >
                            {check.met && (
                              <Check className="h-2.5 w-2.5 text-[#0CF2A0]" />
                            )}
                          </div>
                          <span
                            className={`text-xs transition-colors ${
                              check.met ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {check.label}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !allPasswordChecksMet}
                  className="group h-12 w-full rounded-xl bg-[#0CF2A0] font-bold text-[#0a0a0a] transition-all hover:bg-[#0CF2A0]/90 disabled:opacity-50"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>

              <div className="relative my-4">
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
                onClick={handleGoogleSignUp}
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
                Sign up with Google
              </Button>

              <div className="mt-3 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="font-medium text-[#0CF2A0] transition-colors hover:text-[#0CF2A0]/80"
                  >
                    Sign In
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
            </>
          ) : (
            <>
              <h1 className="mb-2 text-3xl font-bold text-white">
                Verify your email
              </h1>
              <p className="mb-8 text-gray-400">
                We sent a verification code to {email}
              </p>

              <form onSubmit={handleVerification} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm text-gray-300">
                    Verification code
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="h-12 rounded-xl border-gray-800 bg-[#111111] text-white placeholder:text-gray-600 focus-visible:border-[#0CF2A0] focus-visible:ring-[#0CF2A0]/50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group h-12 w-full rounded-xl bg-[#0CF2A0] font-bold text-[#0a0a0a] transition-all hover:bg-[#0CF2A0]/90 disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <p className="text-center text-sm text-gray-400">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      signUp?.prepareEmailAddressVerification({
                        strategy: "email_code",
                      })
                    }
                    className="bg-transparent font-medium text-[#0CF2A0] hover:text-[#0CF2A0]/80"
                  >
                    Resend
                  </button>
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>

      {/* Bottom shadow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-16 w-[60%] -translate-x-1/2 rounded-full bg-[#0CF2A0]/4 blur-3xl" />
    </div>
  );
}
