import type { Metadata } from "next";
import DairyPage from "@/components/DairyPage";

export const metadata: Metadata = { title: "Dairy Processing in Cameroon", description: "General information about milk collection, yogurt making, and dairy handling in Cameroon, with FAO and WHO sources." };
export default function Page() { return <DairyPage />; }
