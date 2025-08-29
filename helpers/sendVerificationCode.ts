import VerificationEmail from "@/emails/verficationEmail";
import { resend } from "@/lib/resend";


export interface ApiResponse {
  success: boolean;
  message: string;
}


export async function sendVerficationEmail(
    email: string,
    username: string,
    verfiyCode: string,
): Promise<ApiResponse> {

    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Zählen Form Builder| Verification Code',
            react: VerificationEmail({username, otp: verfiyCode}),
        });


        return { success: true, message: "verfication email send successfully" }

    } catch (error) {
        console.error("Error Sending verfication email", error);
        return { success: false, message: "Failed to send verfication email" }
    }

}