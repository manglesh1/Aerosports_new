// app/components/ContactForm.js
"use client"; // This component is client-side

import { useState } from "react";
import "../../styles/contactus.css"; // Assuming you create a CSS file named ContactForm.css

function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
    selectedEvent: "",
  });

  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const response = await fetch(`${API_URL}/email`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(formData),
     });

     if (response.ok) {
       setSuccessMessage(
         "Success! Contact form has been successfully submitted."
       );
       setFormData({
         fullName: "",
         email: "",
         phone: "",
         date: "",
         time: "",
         message: "",
         selectedEvent: "",
       });
     } else {
       console.error("Failed to send email");
     }
   } catch (error) {
     console.error("Error:", error);
   }
 };

  return (
    <div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="number"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date (yyyy-mm-dd)</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option value="">--Select a Time--</option>
            {generateTimeOptions()}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="selectedEvent">Select Event</label>
          <select
            id="selectedEvent"
            name="selectedEvent"
            value={formData.selectedEvent}
            onChange={handleChange}
            required
          >
            <option value="">--Select an Event--</option>
            <option value="BirthDay">BirthDay Party</option>
            <option value="Group Booking">Group Booking</option>
            <option value="Admission">Admission</option>
            <option value="Camp">Camp</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Enter Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Send
        </button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

function generateTimeOptions() {
  const times = [];
  let currentHour = 10;
  let currentMinute = 0;

  while (currentHour < 21 || (currentHour === 21 && currentMinute === 0)) {
    const hourString = currentHour < 10 ? `0${currentHour}` : `${currentHour}`;
    const minuteString = currentMinute === 0 ? "00" : `${currentMinute}`;
    const timeString = `${hourString}:${minuteString}`;

    const displayTime = new Date(
      `1970-01-01T${timeString}:00`
    ).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    times.push(
      <option key={timeString} value={timeString}>
        {displayTime}
      </option>
    );

    currentMinute += 30;
    if (currentMinute >= 60) {
      currentMinute = 0;
      currentHour += 1;
    }
  }

  return times;
}

export default ContactForm;