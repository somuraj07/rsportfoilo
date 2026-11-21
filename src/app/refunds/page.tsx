import type { Metadata } from "next";
import { ContactBlock, LegalPage } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Refund policy",
  description: "How cancellations and refunds work for RS Digitech ERP subscriptions and custom projects.",
};

/*
 * REVIEW: these are sensible defaults, not terms you have confirmed. Replace them with
 * your actual cancellation and refund rules before launch, and keep them consistent
 * with your subscription agreements and proposals.
 */
export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund policy"
      intro="This policy explains how cancellations and refunds work. There are no hidden fees: every price is agreed in writing before you pay."
    >
      <h2>Booking a call</h2>
      <p>Calls booked through this website are free, so there is nothing to refund.</p>

      <h2>ERP subscriptions</h2>
      <ul>
        <li>You can cancel your subscription at any time. Cancelling stops the next renewal.</li>
        <li>You keep access until the end of the period you have already paid for.</li>
        <li>
          Unless your subscription agreement says otherwise, fees already paid for the current billing period are not
          refunded.
        </li>
        <li>If you were charged by mistake or charged twice, we refund the extra amount in full.</li>
      </ul>

      <h2>Custom websites and apps</h2>
      <p>
        Payments for custom work follow the schedule in your signed proposal. If a project is cancelled, payments for
        work already delivered are not refunded, and any payment for work not yet started is handled as the proposal
        sets out.
      </p>

      <h2>How to ask for a refund</h2>
      <p>
        Email us with your name, business name and the payment in question. We will reply within 7 working days. Approved
        refunds are returned to the original payment method.
      </p>

      <h2>Contact</h2>
      <ContactBlock />
    </LegalPage>
  );
}
