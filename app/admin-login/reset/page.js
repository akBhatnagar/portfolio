"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STEPS = { EMAIL: 0, CODE: 1, NEW_PASSWORD: 2, SUCCESS: 3 };

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("A reset code has been sent to your email.");
        setStep(STEPS.CODE);
      } else {
        setError(data.error || "Failed to send reset code");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetToken(data.resetToken);
        setMessage("");
        setStep(STEPS.NEW_PASSWORD);
      } else {
        setError(data.error || "Invalid code");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(STEPS.SUCCESS);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 transition-colors duration-500">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {step === STEPS.EMAIL && "Enter your email to receive a reset code"}
            {step === STEPS.CODE && "Enter the 6-digit code sent to your email"}
            {step === STEPS.NEW_PASSWORD && "Set your new password"}
            {step === STEPS.SUCCESS && "Your password has been updated"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm mb-5">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm mb-5">
            {message}
          </div>
        )}

        {/* Step 1: Enter email */}
        {step === STEPS.EMAIL && (
          <form onSubmit={handleRequestCode} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 transition"
                placeholder="Enter your email address"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
                loading ? "bg-primary-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* Step 2: Enter code */}
        {step === STEPS.CODE && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reset Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                autoFocus
                disabled={loading}
                maxLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 transition text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
                loading || code.length !== 6
                  ? "bg-primary-400 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {/* Step 3: New password */}
        {step === STEPS.NEW_PASSWORD && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                disabled={loading}
                minLength={8}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 transition"
                placeholder="Minimum 8 characters"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 transition"
                placeholder="Re-enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
                loading ? "bg-primary-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === STEPS.SUCCESS && (
          <div className="text-center space-y-4">
            <div className="text-5xl">✓</div>
            <p className="text-gray-700 dark:text-gray-300">
              Your password has been updated successfully.
            </p>
            <button
              onClick={() => router.push("/admin-login")}
              className="w-full py-2.5 rounded-lg text-white font-medium bg-primary-600 hover:bg-primary-700 transition"
            >
              Back to Login
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/admin-login"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
