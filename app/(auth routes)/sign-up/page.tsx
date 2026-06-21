"use client";

import css from "./SignUpPage.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/lib/api/clientApi";
import type { RegisterUser } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";
import { ApiError } from "@/lib/api/api";

export default function SignUp() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (FormData: FormData) => {
    try {
      setIsSubmitting(true);
      setError("");
      const data = Object.fromEntries(FormData) as RegisterUser;
      const user = await register(data);
      if (user) {
        setUser(user);
        router.push("/profile");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </div>
  );
}