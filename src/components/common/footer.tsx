import { Logo } from "../logo";
import Link from "next/link";
import { QRCode } from "../ui/kibo-ui/qr-code";
import Image from "next/image";
import { Facebook, Instagram } from "iconsax-reactjs";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import NewsLetterForm from "./newsletter-form";

export default function Footer() {
  const FooterMenu = [
    {
      title: "Quick Links",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "FAQs", href: "/faq" },
        { label: "Blogs", href: "/blog" },
        { label: "Report Content Error", href: "/" },
        { label: "Request for Custom Package", href: "/docs" },
        { label: "Social Responsibility", href: "/social" },
      ],
    },
    {
      title: "Academic",
      link: "/course/academic",
      links: [
        { label: "Grades", href: "/about" },
        { label: "Competitive Exam", href: "/careers" },
        { label: "Future Ready Courses", href: "/blog" },
      ],
    },
    {
      title: "Professionals",
      link: "/course/academic",

      links: [
        { label: "Cybersecurity", href: "/help" },
        { label: "Cloud", href: "/contact" },
        { label: "Project Management", href: "/privacy" },
      ],
    },
    {
      title: "University",
      link: "/course/academic",

      links: [{ label: "NewGen University", href: "/help" }],
    },
  ];

  const AppLinks = [
    {
      title: "Play store",
      link: "https://play.google.com/store/apps/details?id=com.selfupgrad.learners",
      icon: "/assets/google-play-badge-logo.svg",
    },
    {
      title: "Apple store",
      link: "https://apps.apple.com/in/app/selfupgrad/id6480440785",
      icon: "/assets/apple-store-logo.svg",
    },
  ];

  const policies = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms-of-use" },
    { label: "Refund Policy", href: "/refund-policy" },
  ];

  const FooterSocial = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/selfupgrad/",
      icon: Facebook,
    },
    {
      label: "Twitter",
      href: "https://twitter.com/selfupgrad",
      icon: FaXTwitter,
    },
    {
      label: "LinkedIn",
      href: "https://in.linkedin.com/company/selfupgrad",
      icon: FaLinkedin,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/self.upgrad/",
      icon: Instagram,
    },
  ];
  return (
    <footer className="dark p-2">
      <div className="text-secondary-foreground flex items-center justify-center rounded-lg bg-neutral-950 px-6 py-10 md:px-12 md:py-16">
        <div className="space-y-18">
          <div className="flex flex-col items-start justify-start gap-12 md:flex-row">
            <div className="flex flex-1/3 flex-col items-start justify-start gap-4">
              <Logo variant="full_brand_white" />
              <p className="text-sm font-extralight text-neutral-400">
                Empowering Education for a Brighter Tomorrow. Access and engage
                high-quality learning experience that empower everyone to
                succeed. With a team of dedicated educators, technologists, and
                innovators, we&apos;re committed to shaping the future of education.
              </p>
            </div>
            <div className="flex flex-2/3 flex-wrap items-start gap-8 md:justify-end">
              {FooterMenu.map((section, index) => (
                <div key={index} className="flex basis-1/5 flex-col gap-2">
                  <h3 className="font-semibold">
                    {section.link ? (
                      <Link href={section.link}>{section.title}</Link>
                    ) : (
                      section.title
                    )}
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-sm text-neutral-400 hover:text-neutral-200 hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-8">
            <div className="space-y-2">
              <h2 className="text-2xl leading-tight tracking-tight md:text-4xl">
                Subscribe for newsletter
              </h2>
              <NewsLetterForm />
            </div>

            <div className="flex items-start justify-center gap-4">
              {AppLinks.map((store, idx) => (
                <Link
                  key={store.link + idx}
                  href={store.link}
                  className="relative flex flex-col gap-1 overflow-hidden"
                >
                  <QRCode
                    data="https://www.haydenbleasel.com/"
                    className="size-24 invert"
                  />
                  <div className="relative h-12 w-24">
                    <Image
                      src={store.icon}
                      alt={`${store.title} icon`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="flex gap-4">
              {FooterSocial.map((social, idx) => (
                <Link
                  key={social.href + idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-foreground hover:text-primary"
                >
                  <social.icon size={24} />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8">
              <ul className="flex items-center justify-center gap-4">
                {policies.map((policy, idx) => (
                  <li key={policy.href + idx}>
                    <Link
                      href={policy.href}
                      className="text-sm hover:underline"
                    >
                      {policy.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <span className="text-secondary-foreground text-center text-sm font-extralight">
                &copy; Techmeir Corporation {new Date().getFullYear()} . All
                rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
