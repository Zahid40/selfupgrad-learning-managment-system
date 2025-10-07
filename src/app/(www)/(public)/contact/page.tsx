import ContactForm from "@/components/form/contact-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ContactPage() {
  return (
    <section className="flex items-center justify-center">
      <div className="container flex flex-col items-center justify-between gap-12 px-24 py-12">
        <div className="flex w-1/2 flex-col items-center justify-center gap-2">
          <Badge>Contact us</Badge>
          <h1 className="text-center text-6xl leading-tight font-medium tracking-tight">
            Get in touch with us
          </h1>
          <p className="text-secondary-foreground text-center text-sm font-light">
            We warmly embrace your inquiries and input! Whether you&apos;re
            seeking clarification on our academic offerings or require guidance
            with enrollment, our committed team is at your service. Please
            don&apos;t hesitate to reach out through the contact form below.
            Your insights are priceless to us, and we eagerly anticipate
            connecting with you soon on your online learning journey.
          </p>
        </div>
        <div className="flex gap-8">
          <div className="bg-primary dark flex flex-2/5 flex-col rounded-xl">
            <div className="p-8">
              <p className="mb-12 text-2xl leading-tight font-medium tracking-tight text-white">
                Contact Us Directly
              </p>
              <div className="space-y-2">
                {[
                  {
                    title: "Office Address",
                    desc: "B13 , GD , Mayur Vihar phase 03 , New Delhi , Delhi - 110096",
                  },
                  {
                    title: "Email us",
                    desc: "info@selfupgrad.com",
                    link: "mailto:info@selfupgrad.com",
                  },
                  {
                    title: "Call us",
                    desc: "+911169296414",
                    link: "tel:+911169296414",
                  },
                ].map((item, idx) => (
                  <div className="" key={item.title + idx}>
                    <p className="text-xs text-white">{item.title}</p>
                    <Button variant={"link"} asChild className="p-0 text-white">
                      <Link href={item.link ?? "#"}>{item.desc}</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-full w-full">
              <Image
                src={"/images/contact-bg-image.svg"}
                alt="contact-page-bg"
                fill
                className="bg-cover"
              />
            </div>
          </div>
          <div className="flex-3/5 py-8">
            <p className="mb-12 text-2xl leading-tight font-medium tracking-tight">
              If You Want Us To Contact You
            </p>
            <ContactForm className="" />
          </div>
        </div>
      </div>
    </section>
  );
}
