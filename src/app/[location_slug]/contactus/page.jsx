import { permanentRedirect } from "next/navigation";

export default function Page({ params }) {
  permanentRedirect(`/${params.location_slug}/about-us/contact-us`);
}
