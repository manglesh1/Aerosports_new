import { redirect } from "next/navigation";

export default function LegacyCampsPage({ params }) {
  redirect(`/${params.location_slug}/programs/camps`);
}
