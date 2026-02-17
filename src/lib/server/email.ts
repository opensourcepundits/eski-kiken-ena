import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);
const FROM_EMAIL = 'onboarding@resend.dev'; // Use this for testing until a domain is verified

export async function sendLoanRequestEmail({
    ownerEmail,
    ownerName,
    renterName,
    listingTitle,
    bookingDetails
}: {
    ownerEmail: string;
    ownerName: string;
    renterName: string;
    listingTitle: string;
    bookingDetails: {
        startDate: Date;
        endDate: Date;
        totalPrice: string;
        renterMessage?: string;
    };
}) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: ownerEmail,
            subject: `New Loan Request: ${listingTitle}`,
            html: `
        <h2>Hello ${ownerName},</h2>
        <p><strong>${renterName}</strong> has requested to rent your item: <strong>${listingTitle}</strong>.</p>
        
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Dates:</strong> ${bookingDetails.startDate.toLocaleDateString()} - ${bookingDetails.endDate.toLocaleDateString()}</li>
          <li><strong>Total Earnings:</strong> Rs ${bookingDetails.totalPrice}</li>
        </ul>

        ${bookingDetails.renterMessage ? `<h3>Message from Renter:</h3><p style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-style: italic;">"${bookingDetails.renterMessage}"</p>` : ''}

        <p>Please login to your dashboard to Approve or Decline this request.</p>
        
        <p>Best regards,<br>The Eke Team</p>
      `
        });
        console.log(`Loan request email sent to ${ownerEmail}`);
    } catch (error) {
        console.error('Failed to send loan request email:', error);
    }
}

export async function sendLoanStatusChangedEmail({
    renterEmail,
    renterName,
    listingTitle,
    status,
    ownerMessage,
    pickupTime,
    returnTime
}: {
    renterEmail: string;
    renterName: string;
    listingTitle: string;
    status: 'CONFIRMED' | 'CANCELLED';
    ownerMessage?: string;
    pickupTime?: string;
    returnTime?: string;
}) {
    try {
        const subject =
            status === 'CONFIRMED'
                ? `Booking Confirmed: ${listingTitle}`
                : `Booking Declined/Cancelled: ${listingTitle}`;

        const message =
            status === 'CONFIRMED'
                ? `<p>Great news! Your request to rent <strong>${listingTitle}</strong> has been <strong>CONFIRMED</strong> by the owner.</p>`
                : `<p>We're sorry, but your request for <strong>${listingTitle}</strong> has been <strong>DECLINED</strong> or CANCELLED by the owner.</p>`;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: renterEmail,
            subject: subject,
            html: `
        <h2>Hello ${renterName},</h2>
        ${message}
        ${ownerMessage ? `<h3>Message from Owner:</h3><p style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-style: italic;">"${ownerMessage}"</p>` : ''}
        ${status === 'CONFIRMED' && (pickupTime || returnTime) ? `
          <h3>Logistics:</h3>
          <ul>
            ${pickupTime ? `<li><strong>Pickup Time:</strong> ${pickupTime}</li>` : ''}
            ${returnTime ? `<li><strong>Delivery/Return Time:</strong> ${returnTime}</li>` : ''}
          </ul>
        ` : ''}
        <p>Please check your dashboard for more details.</p>
        <p>Best regards,<br>The Eke Team</p>
      `
        });
        console.log(`Loan status update email sent to ${renterEmail}`);
    } catch (error) {
        console.error('Failed to send loan status email:', error);
    }
}

export async function sendLoanCancelledByRenterEmail({
    ownerEmail,
    ownerName,
    renterName,
    listingTitle
}: {
    ownerEmail: string;
    ownerName: string;
    renterName: string;
    listingTitle: string;
}) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: ownerEmail,
            subject: `Booking Cancelled: ${listingTitle}`,
            html: `
        <h2>Hello ${ownerName},</h2>
        <p><strong>${renterName}</strong> has cancelled their booking request for <strong>${listingTitle}</strong>.</p>
        <p>No further action is required from you.</p>
        <p>Best regards,<br>The Eke Team</p>
      `
        });
        console.log(`Loan cancellation email sent to ${ownerEmail}`);
    } catch (error) {
        console.error('Failed to send loan cancellation email:', error);
    }
}

export async function sendBookingExpiredEmail({
    renterEmail,
    renterName,
    listingTitle,
    bookingUrl
}: {
    renterEmail: string;
    renterName: string;
    listingTitle: string;
    bookingUrl: string;
}) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: renterEmail,
            subject: `Request Expired: ${listingTitle}`,
            html: `
        <h2>Hello \${renterName},</h2>
        <p>Your request to rent <strong>\${listingTitle}</strong> has <strong>EXPIRED</strong> because it was not confirmed within 24 hours.</p>
        <p>Don't worry! You can try requesting it again or look for other similar items.</p>
        <p><a href="\${bookingUrl}">View Listing</a></p>
        <p>Best regards,<br>The Eke Team</p>
      `
        });
        console.log(`Booking expired email sent to \${renterEmail}`);
    } catch (error) {
        console.error('Failed to send booking expired email:', error);
    }
}

export async function sendAmendmentRequestedEmail({
    toEmail,
    toName,
    listingTitle,
    requestedBy,
    changes,
    message,
    bookingUrl
}: {
    toEmail: string;
    toName: string;
    listingTitle: string;
    requestedBy: string;
    changes: string[];
    message: string;
    bookingUrl: string;
}) {
    try {
        const changesList = changes.map(c => `<li>${c}</li>`).join('');
        await resend.emails.send({
            from: FROM_EMAIL,
            to: toEmail,
            subject: `Action Required: Changes Requested for ${listingTitle}`,
            html: `
        <h2>Hello ${toName},</h2>
        <p><strong>${requestedBy}</strong> has requested changes to the booking for <strong>${listingTitle}</strong>.</p>
        
        <h3>Requested Changes:</h3>
        <ul>${changesList}</ul>
        
        ${message ? `<h3>Message:</h3><p style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-style: italic;">"${message}"</p>` : ''}
        
        <p>Please log in to your dashboard to review and update the booking details.</p>
        <p><a href="${bookingUrl}">Go to Dashboard</a></p>
        <p>Best regards,<br>The Eke Team</p>
      `
        });
        console.log(`Amendment request email sent to ${toEmail}`);
    } catch (error) {
        console.error('Failed to send amendment email:', error);
    }
}

export async function sendBookingUpdatedByRenterEmail({
    ownerEmail,
    ownerName,
    renterName,
    listingTitle,
    updatedFields
}: {
    ownerEmail: string;
    ownerName: string;
    renterName: string;
    listingTitle: string;
    updatedFields: string[];
}) {
    try {
        const updatesList = updatedFields.map(f => `<li>${f}</li>`).join('');
        await resend.emails.send({
            from: FROM_EMAIL,
            to: ownerEmail,
            subject: `Action Required: Details Updated for ${listingTitle}`,
            html: `
        <h2>Hello \${ownerName},</h2>
        <p><strong>\${renterName}</strong> has updated the booking details for <strong>\${listingTitle}</strong>.</p>
        
        <h3>Updated Fields:</h3>
        <ul>\${updatesList}</ul>
        
        <p>Please log in to your dashboard to review and approve the updated request.</p>
        <p>Best regards,<br>The Eke Team</p>
      `
        });
        console.log(`Booking updated email sent to \${ownerEmail}`);
    } catch (error) {
        console.error('Failed to send booking updated email:', error);
    }
}
