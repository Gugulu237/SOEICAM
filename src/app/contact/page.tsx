import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

export const metadata: Metadata = { title: "Contact", description: "Contact SOEICAM in Yaoundé about Yola products, distribution, and partnerships." };
export default function Page() { return <ContactPage />; }
