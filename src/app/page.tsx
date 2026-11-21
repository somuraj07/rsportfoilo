import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { BookCall } from "@/components/BookCall";
import { CallToAction } from "@/components/CallToAction";
import { Connect } from "@/components/Connect";
import { Process, Statement, Tenancy } from "@/components/Sections";
import { Demo, Facts, ServiceLists, WorkShowcase } from "@/components/Showcase";

export default function Home() {
  return (
    <>
      <Hero />
      <Facts />
      <ServiceLists />
      <Demo />
      <Statement />
      <Connect />
      <Products />
      <Tenancy />
      <WorkShowcase />
      <Process />
      <CallToAction />
      <BookCall />
    </>
  );
}
