import type { Metadata } from "next";
import Link from "next/link";
import { ContactBlock, LegalPage } from "@/components/Legal";
import { DataRequestForm } from "@/components/DataRequestForm";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What personal data RS Digitech collects on this website, why, who it is shared with, and how to access or delete it.",
};

/*
 * REVIEW with your legal adviser before launch. This describes what the website
 * actually does today. If you add analytics, payments or a new form, update it.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="This policy explains what personal data RS Digitech collects through this website, why we collect it, who we share it with and the choices you have. We collect as little as we can."
    >
      <h2>What we collect</h2>
      <h3>When you book a call</h3>
      <p>
        The Book a call form asks for your name, email address and phone or WhatsApp number. Your business or school name
        and a note about your project are optional. We also record the product you are interested in, the day and time you
        pick, and that you gave consent.
      </p>
      <h3>When you use the chat assistant</h3>
      <p>
        The messages you type are used only to write a reply. We do not save chat conversations. If the AI service is
        switched on, your messages are sent to Anthropic, the company that provides the AI model, to generate the reply.
        Please do not type sensitive personal information into the chat.
      </p>
      <h3>When you send a data request</h3>
      <p>We collect your email address, the type of request and any details you add, so we can act on it.</p>
      <h3>What we do not collect</h3>
      <p>
        This website does not use analytics, advertising or tracking cookies, and it does not take payments. We do not
        buy personal data or collect it from other sources.
      </p>

      <h2>Why we use it</h2>
      <ul>
        <li>To arrange the call you booked and send you a confirmation.</li>
        <li>To contact you by email or WhatsApp about your enquiry.</li>
        <li>To respond to privacy requests and keep a record that we did.</li>
      </ul>
      <p>
        We process this data with your consent, which you give when you submit a form. You can withdraw consent at any
        time, and we will stop contacting you.
      </p>

      <h2>Who we share it with</h2>
      <p>We do not sell or rent personal data. We share it only with the services that make this website work:</p>
      <ul>
        <li>Google (Gmail), to send booking confirmations and receive your details.</li>
        <li>Meta (WhatsApp), when you message us on WhatsApp or when we receive a booking alert.</li>
        <li>Anthropic, to generate chat assistant replies, if the assistant is switched on.</li>
        <li>Our website hosting provider, which stores and serves the site.</li>
      </ul>
      <p>These providers may process data outside India under their own privacy and security terms.</p>

      <h2>How long we keep it</h2>
      <p>
        We keep booking details for as long as we need them to handle your enquiry and any project that follows, or for
        as long as the law requires. You can ask us to delete them sooner at any time.
      </p>

      <h2>Your rights</h2>
      <p>You can ask us to:</p>
      <ul>
        <li>tell you what personal data we hold about you,</li>
        <li>correct data that is wrong or incomplete,</li>
        <li>delete your data,</li>
        <li>stop contacting you or withdraw your consent.</li>
      </ul>
      <p>
        Use the form below or email us. We aim to reply within 30 days. If you are not satisfied with our answer, you can
        raise a complaint with the relevant data protection authority.
      </p>

      <h2 id="data-request">Request access or deletion</h2>
      <DataRequestForm />

      <h2>Children</h2>
      <p>
        This website is meant for adults acting for a business, school or organisation. You must be 18 or older to book
        a call, and we do not knowingly collect data from children through this website.
      </p>
      <p>
        When a school uses our School ERP or a coaching centre uses our Coaching ERP, the school or centre decides what
        student information is stored in its own space. It is responsible for getting consent from parents or guardians,
        and we process that information only on its behalf and under our agreement with it.
      </p>

      <h2>Security</h2>
      <p>
        We use reputable providers and limit access to your data to people who need it. No method of sending or storing
        data online is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>Cookies</h2>
      <p>
        See our <Link href="/cookies">cookie policy</Link>. In short, we use no tracking cookies.
      </p>

      <h2>Changes</h2>
      <p>If we change this policy, we will update the date at the top of this page.</p>

      <h2>Contact and grievances</h2>
      <p>For any privacy question or complaint, contact us:</p>
      <ContactBlock />
    </LegalPage>
  );
}
