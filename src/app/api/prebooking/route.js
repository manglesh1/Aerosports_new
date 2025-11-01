import { NextResponse } from 'next/server';
import { sendSelfEmail, sendEmailWithOAuth } from '../../lib/emailService';

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      fullName,
      email,
      phone,
      preferredDate,
      groupSize,
      interests,
      specialRequests,
      location,
      submittedAt
    } = data;

    // Validate required fields
    if (!fullName || !email || !phone || !interests || interests.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format the email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #f00c74 0%, #caff1a 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .badge {
              background: rgba(255, 255, 255, 0.2);
              display: inline-block;
              padding: 5px 15px;
              border-radius: 20px;
              font-size: 12px;
              margin-top: 10px;
              font-weight: bold;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e0e0e0;
              border-top: none;
            }
            .info-section {
              margin-bottom: 25px;
            }
            .info-label {
              font-weight: bold;
              color: #f00c74;
              display: block;
              margin-bottom: 5px;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 1px;
            }
            .info-value {
              font-size: 16px;
              color: #333;
              padding: 10px;
              background: #f9f9f9;
              border-left: 3px solid #f00c74;
              margin-bottom: 10px;
            }
            .interests-list {
              list-style: none;
              padding: 0;
            }
            .interests-list li {
              padding: 8px 12px;
              background: #f9f9f9;
              margin-bottom: 5px;
              border-left: 3px solid #caff1a;
            }
            .interests-list li:before {
              content: "✓ ";
              color: #caff1a;
              font-weight: bold;
              margin-right: 8px;
            }
            .footer {
              background: #2c3e50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 10px 10px;
              font-size: 14px;
            }
            .timestamp {
              font-size: 12px;
              color: #777;
              text-align: right;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 New Pre-Booking!</h1>
            <div class="badge">AEROSPORTS SCARBOROUGH</div>
          </div>

          <div class="content">
            <div class="info-section">
              <span class="info-label">Full Name</span>
              <div class="info-value">${fullName}</div>
            </div>

            <div class="info-section">
              <span class="info-label">Email Address</span>
              <div class="info-value">
                <a href="mailto:${email}" style="color: #f00c74; text-decoration: none;">${email}</a>
              </div>
            </div>

            <div class="info-section">
              <span class="info-label">Phone Number</span>
              <div class="info-value">
                <a href="tel:${phone}" style="color: #f00c74; text-decoration: none;">${phone}</a>
              </div>
            </div>

            ${preferredDate ? `
              <div class="info-section">
                <span class="info-label">Preferred Visit Date</span>
                <div class="info-value">${new Date(preferredDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</div>
              </div>
            ` : ''}

            ${groupSize ? `
              <div class="info-section">
                <span class="info-label">Group Size</span>
                <div class="info-value">${groupSize}</div>
              </div>
            ` : ''}

            <div class="info-section">
              <span class="info-label">Interested In</span>
              <ul class="interests-list">
                ${interests.map(interest => `<li>${interest}</li>`).join('')}
              </ul>
            </div>

            ${specialRequests ? `
              <div class="info-section">
                <span class="info-label">Special Requests / Questions</span>
                <div class="info-value">${specialRequests.replace(/\n/g, '<br>')}</div>
              </div>
            ` : ''}

            <div class="timestamp">
              Submitted on ${new Date(submittedAt).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div class="footer">
            <p><strong>Aerosports ${location}</strong></p>
            <p>Pre-Booking Notification System</p>
          </div>
        </body>
      </html>
    `;

    const emailText = `
New Pre-Booking for Aerosports ${location}

Full Name: ${fullName}
Email: ${email}
Phone: ${phone}
${preferredDate ? `Preferred Date: ${preferredDate}` : ''}
${groupSize ? `Group Size: ${groupSize}` : ''}

Interests:
${interests.map(i => `- ${i}`).join('\n')}

${specialRequests ? `Special Requests:\n${specialRequests}` : ''}

Submitted: ${new Date(submittedAt).toLocaleString()}
    `;

    // Send email to events.scb@aerosportsparks.ca using OAuth
    try {
      await sendSelfEmail({
        location: 'scb',
        subject: `🎯 New Pre-Booking: ${fullName} - Aerosports Scarborough`,
        html: emailHtml,
        text: emailText,
        replyTo: email
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      );
    }

    // Optional: Send confirmation email to the customer
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #f00c74 0%, #caff1a 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
            }
            .content {
              background: #ffffff;
              padding: 40px 30px;
              border: 1px solid #e0e0e0;
              border-top: none;
            }
            .highlight-box {
              background: #f9f9f9;
              border-left: 4px solid #f00c74;
              padding: 20px;
              margin: 20px 0;
            }
            .benefits {
              list-style: none;
              padding: 0;
            }
            .benefits li {
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .benefits li:before {
              content: "✓ ";
              color: #caff1a;
              font-weight: bold;
              font-size: 18px;
              margin-right: 10px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #f00c74 0%, #caff1a 100%);
              color: white;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 30px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              background: #2c3e50;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 0 0 10px 10px;
            }
            .contact-info {
              margin-top: 20px;
            }
            .contact-info a {
              color: #caff1a;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Thank You for Pre-Booking! 🎉</h1>
          </div>

          <div class="content">
            <p>Hi ${fullName},</p>

            <p>Thank you for your interest in <strong>Aerosports Scarborough</strong>! We're thrilled to have you join us as we prepare for our grand opening.</p>

            <div class="highlight-box">
              <h3 style="margin-top: 0; color: #f00c74;">What's Next?</h3>
              <p>Our team will review your pre-booking and reach out to you soon with:</p>
              <ul class="benefits">
                <li>Exclusive early bird pricing and launch promotions</li>
                <li>Priority booking for our opening week</li>
                <li>First access to our exclusive Indoor Go-Kart Racing track</li>
                <li>Updates on our official opening date</li>
                <li>Special membership rates for early supporters</li>
              </ul>
            </div>

            <p><strong>Your Pre-Booking Details:</strong></p>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
              ${preferredDate ? `Preferred Date: ${new Date(preferredDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}<br>` : ''}
              ${groupSize ? `Group Size: ${groupSize}<br>` : ''}
              Interested In: ${interests.join(', ')}
            </p>

            <p>In the meantime, follow us on social media to stay updated with exclusive sneak peeks, behind-the-scenes content, and special announcements!</p>

            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 18px; color: #f00c74; font-weight: bold;">Get Ready for the Ultimate Entertainment Experience!</p>
            </div>

            <p>If you have any questions, feel free to reach out to us anytime.</p>

            <p>See you soon at Aerosports Scarborough!</p>

            <p style="margin-top: 30px;">
              <strong>The Aerosports Team</strong>
            </p>
          </div>

          <div class="footer">
            <h3 style="margin-top: 0;">Contact Us</h3>
            <div class="contact-info">
              <p>
                📞 <a href="tel:+12894545555">(289) 454-5555</a><br>
                📧 <a href="mailto:events.scb@aerosportsparks.ca">events.scb@aerosportsparks.ca</a>
              </p>
              <p style="margin-top: 20px;">
                <a href="https://www.facebook.com/aerosportsparks" style="color: white; margin: 0 10px;">Facebook</a> |
                <a href="https://www.instagram.com/aerosportsparks" style="color: white; margin: 0 10px;">Instagram</a> |
                <a href="https://www.tiktok.com/@aerosportsparks" style="color: white; margin: 0 10px;">TikTok</a>
              </p>
            </div>
            <p style="font-size: 12px; margin-top: 20px; opacity: 0.8;">
              &copy; 2024 Aerosports Parks. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    const confirmationText = `
Thank You for Pre-Booking, ${fullName}!

Thank you for your interest in Aerosports Scarborough! We're thrilled to have you join us as we prepare for our grand opening.

What's Next?
Our team will review your pre-booking and reach out to you soon with:
- Exclusive early bird pricing and launch promotions
- Priority booking for our opening week
- First access to our exclusive Indoor Go-Kart Racing track
- Updates on our official opening date
- Special membership rates for early supporters

Your Pre-Booking Details:
${preferredDate ? `Preferred Date: ${new Date(preferredDate).toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}` : ''}
${groupSize ? `Group Size: ${groupSize}` : ''}
Interested In: ${interests.join(', ')}

If you have any questions, feel free to reach out to us anytime.

See you soon at Aerosports Scarborough!

The Aerosports Team

Contact Us:
Phone: (123) 456-7890
Email: events.scb@aerosportsparks.ca
    `;

    // Send confirmation email to customer
    await sendEmailWithOAuth({
      location: 'scb',
      to: email,
      subject: 'Thank You for Pre-Booking at Aerosports Scarborough! 🎉',
      html: confirmationHtml,
      text: confirmationText,
      replyTo: 'events.scb@aerosportsparks.ca'
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Pre-booking received successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing pre-booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
