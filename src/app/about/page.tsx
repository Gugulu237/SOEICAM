import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = { title: "About Us", description: "Learn about SOEICAM, a food processing company founded in Cameroon by Cameroonians." };
export default function Page() { return <AboutPage />; }
