"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { Textarea } from "@/components/ui/textarea";
import { FaFacebook, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [handedOff, setHandedOff] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHandedOff(false);
  };

  /*
   * This site is static by design -- no API routes, no backend -- so there is
   * nowhere to POST to. Handing the composed message to the visitor's mail
   * client is the only thing that actually delivers it.
   *
   * The previous version called preventDefault() and stopped there, so the
   * button looked like it worked while silently discarding every message.
   * A form that lies about sending is worse than no form at all.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = `Portfolio enquiry from ${formData.name}`;
    const body = `${formData.message}\n\n--\n${formData.name}\n${formData.email}`;
    const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setHandedOff(true);
  };

  return (
    <Section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border bg-muted/30"
    >
      <Reveal>
        <SectionHeading
          id="contact-heading"
          index="08"
          eyebrow="Contact"
          title="Get In Touch"
          lead="Have a question or want to work together? Send a message and I will get back to you."
          className="mb-10"
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                This opens the message in your own email app, so you keep a copy
                of what you sent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-32"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Open in Email App
                </Button>
                <p aria-live="polite" className="text-sm text-muted-foreground">
                  {handedOff ? (
                    <>
                      Your email app should have opened. If nothing happened,
                      write to{" "}
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-brand underline underline-offset-4"
                      >
                        {siteConfig.email}
                      </a>{" "}
                      directly.
                    </>
                  ) : (
                    <>
                      Prefer to write directly?{" "}
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-brand underline underline-offset-4"
                      >
                        {siteConfig.email}
                      </a>
                    </>
                  )}
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-muted-foreground hover:text-brand"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">
                      {siteConfig.location.city}, {siteConfig.location.country}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Social</p>
                    <div className="flex space-x-4 mt-2">
                      <a
                        href={siteConfig.socials.facebook}
                        aria-label="Facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-brand"
                      >
                        <FaFacebook size={24} />
                      </a>
                      <a
                        href={siteConfig.socials.x}
                        aria-label="X"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-brand"
                      >
                        <FaXTwitter size={24} />
                      </a>
                      <a
                        href={siteConfig.socials.github}
                        aria-label="GitHub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-brand"
                      >
                        <FaGithub size={24} />
                      </a>
                      <a
                        href={siteConfig.socials.linkedin}
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-brand"
                      >
                        <FaLinkedinIn size={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
