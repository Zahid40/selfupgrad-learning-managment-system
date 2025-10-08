"use client";
import { useUser } from "@/components/provider/user-provider";
import React from "react";

export default function Onboarding() {
  const { user } = useUser();
  return (
    <section className="h-screen w-full">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.first_name}!</h1>
      </div>
      <h1>Onboarding</h1>
      <p>Welcome to the onboarding page!</p>
      <p>This is where you can set up your account and preferences.</p>
      <p>Follow the steps to get started.</p>
      <ul>
        <li>Step 1: Fill out your profile</li>
        <li>Step 2: Set your preferences</li>
        <li>Step 3: Complete the tutorial</li>
      </ul>
      <p>If you have any questions, feel free to reach out to support.</p>
    </section>
  );
}
