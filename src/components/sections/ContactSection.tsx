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
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Github, LinkedinIcon, X } from "lucide-react";
import { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section className="py-20  mx-auto  bg-muted/30" id="contact">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">Get In Touch</h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Have a question or want to work together? Feel free to reach out!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                Fill out the form below and I&lsquo;ll get back to you as soon
                as possible.
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
                  Send Message
                </Button>
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
                      href="mailto:hello@example.com"
                      className="text-muted-foreground hover:text-brand"
                    >
                      mehediimun@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">Dhaka,Bangladesh</p>
                  </div>
                  <div>
                    <p className="font-medium">Social</p>
                    <div className="flex space-x-4 mt-2">
                      <a
                        href="https://www.facebook.com/mehediimun"
                        target="_blank"
                        className="text-muted-foreground hover:text-brand"
                      >
                        <Facebook />
                      </a>
                      <a
                        href="https://x.com/mehediimun"
                        target="_blank"
                        className="text-muted-foreground hover:text-brand"
                      >
                        <X></X>
                      </a>
                      <a
                        href="https://github.com/mehedi-imun"
                        target="_blank"
                        className="text-muted-foreground hover:text-brand"
                      >
                        <Github />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/mehedi-imun/"
                        target="_blank"
                        className="text-muted-foreground hover:text-brand"
                      >
                        <LinkedinIcon />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
