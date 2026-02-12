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
    status
}: {
    renterEmail: string;
    renterName: string;
    listingTitle: string;
    status: 'CONFIRMED' | 'CANCELLED';
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
