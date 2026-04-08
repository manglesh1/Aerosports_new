import React from 'react'
import '../../styles/contactus.css'
import ContactForm from '@/components/smallComponents/ContactForm';
import { generateMetadataLib } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug,
    category: "",
    page: "contact-us",
  });
  return metadata;
}

const page = ({ params }) => {
  return (
    <div>
      <h1 className='aero_contact-mainheading'>Contact Us</h1>
       <ContactForm/>
    </div>
  );
}

export default page