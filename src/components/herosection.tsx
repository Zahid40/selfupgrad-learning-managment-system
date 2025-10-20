import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex h-[80vh] w-full flex-col items-center justify-center gap-2 p-2 md:flex-row">
      {[
        {
          title: "Academic",
          description:
            "Personalized Learning, Anytime, Anywhere. Build strong foundations and achieve top academic performance with tailored support at your pace.",
          cta: "Start Learning",
          link: "/course/academic",
          className: "bg-primary/90",
        },
        {
          title: "Professional",
          description:
            "Upskill On-Demand. Advance Your Career with Expert-Guided Learning. Unlock industry-ready skills and certifications that boost your professional journey.",
          cta: "Get Access",
          link: "/course/professional",
          className: "bg-primary/50",
        },
        {
          title: "University",
          description:
            "Access top-notch courses from industry experts and renowned instructors.Excel in Higher Education with Structured Support. From coursework to career prep — get comprehensive guidance for university-level success",
          cta: "Join Now",
          link: "/course/university",
          className: "bg-primary/20",
        },
      ].map((item, index) => (
        <div
          className={
            `relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-lg border-2 border-white/20 shadow-lg ` +
            item.className
          }
          key={index + item.title}
        >
          <div className="flex flex-col gap-2 p-4 w-full ">
          <h2>{item.title}</h2>
          <p>{item.description}</p>
            <Button variant={'secondary'} className="bg-background">{item.cta}</Button>

          </div>
          <div className={`relative flex h-full w-full flex-1 overflow-hidden`}>
            <Image
              src="/images/hero.png"
              alt="Hero"
              fill
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
