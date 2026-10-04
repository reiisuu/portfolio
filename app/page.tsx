"use client";

import { useState } from "react";
import { Hero } from "@/components/hero/Hero";
import { HotNav } from "@/components/layout/HotNav";
import { SectionContainer } from "@/components/layout/SectionContainer";
import type { NavItem } from "@/lib/types";

const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About Me" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "education", label: "Education" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("about");

  const handleChange = (id: string) => {
    setActiveTab(id);
  };

  return (
    <main>
      <Hero />
      <HotNav items={NAV_ITEMS} activeTab={activeTab} onChange={handleChange} />
      <SectionContainer activeTab={activeTab} />
    </main>
  );
}
