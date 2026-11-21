import type { Metadata } from "next";
import Link from "next/link";
import { ContactBlock, LegalPage } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms for using the RS Digitech website and how projects and ERP subscriptions are agreed.",
};

/* REVIEW with your legal adviser before launch, especially governing law and liability. */
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      intro="These terms cover your use of this website. By using it, you agree to them. Work we do for you and ERP subscriptions are governed by a separate written agreement."
    >
      <h2>About this website</h2>
      <p>
        This website describes the websites, apps and ERP products RS Digitech builds and offers. Its content is general
        information, not a binding offer. Features, availability and prices are confirmed only in a written proposal or
        agreement.
      </p>

      <h2>Projects and subscriptions</h2>
      <p>
        Custom websites and apps are agreed through a written proposal that sets out scope, timeline, price and payment
        terms. Our ERP products are provided on a subscription under a subscription agreement. If anything in these terms
        conflicts with a signed proposal or agreement, the signed document applies.
      </p>

      <h2>Booking a call</h2>
      <p>
        Booking a call is free and does not commit you to anything. Please give accurate contact details so we can reach
        you. If you need to change or cancel, reply to your confirmation email.
      </p>

      <h2>The chat assistant</h2>
      <p>
        The chat assistant answers from information about our services and may make mistakes. Its answers are not
        professional advice and do not create an agreement. Please confirm anything important with our team.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not try to break, overload or gain unauthorised access to the website or its services.</li>
        <li>Do not use the forms or chat to send spam, unlawful content or someone else&apos;s personal data without permission.</li>
        <li>Do not copy the website&apos;s content or design for commercial use without our permission.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The RS Digitech name, logo, text and design of this website belong to RS Digitech. Screenshots of client work
        remain subject to their owners&apos; rights. Fonts are used under their open
        licences.
      </p>

      <h2>Links to other services</h2>
      <p>
        Links such as WhatsApp open services run by other companies, whose own terms and privacy policies apply.
      </p>

      <h2>Liability</h2>
      <p>
        We work to keep this website accurate and available, but we provide it as it is, without guarantees. To the
        extent the law allows, we are not liable for indirect or consequential loss arising from your use of the website.
        Nothing in these terms limits liability that cannot be limited by law.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle personal data is explained in our <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>

      <h2>Changes</h2>
      <p>We may update these terms. The date at the top of this page shows when they last changed.</p>

      <h2>Contact</h2>
      <ContactBlock />
    </LegalPage>
  );
}
