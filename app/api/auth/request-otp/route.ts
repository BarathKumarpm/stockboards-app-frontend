// app/api/auth/request-otp/route.ts
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

// We'll need a utility function for OTP and a library for email
// import { generateSecureOtp } from '@/lib/otp-utils'; 
// import { sendEmail } from '@/lib/email-service'; 

export async function POST(req: Request) {
    const { isAuthenticated, getUser } = getKindeServerSession();
    
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized: User not authenticated." }, { status: 401 });
    }

    const user = await getUser();
    const body = await req.json();
    const { company_ids } = body; 

    if (!user || !user.email) {
        return NextResponse.json({ error: "Authenticated user email not found." }, { status: 400 });
    }

    const userEmail = user.email;

    // --- CRITICAL: REAL OTP GENERATION & EMAIL LOGIC GOES HERE ---
    try {
        // 1. GENERATE A SECURE OTP
        // const otpCode = generateSecureOtp(); // e.g., '574109'
        const otpCode = '123456'; // <--- REPLACE THIS WITH REAL GENERATION

        // 2. STORE THE OTP (with expiration)
        // await db.otpTokens.create({ data: { 
        //     email: userEmail, 
        //     code: otpCode, 
        //     expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        // }});

        // 3. SEND THE EMAIL
        // const emailSuccess = await sendEmail({ 
        //     to: userEmail,
        //     subject: 'Your Company Access Verification Code',
        //     text: `Your 6-digit verification code is: ${otpCode}`,
        // });
        
        // if (!emailSuccess) {
        //    throw new Error("Failed to dispatch email via service provider.");
        // }

        console.log(`[SERVER OTP]: Generated and attempting to send code to: ${userEmail}`);

        return NextResponse.json({ 
            message: "OTP request successful. Code sent to registered email.",
            email: userEmail
        }, { status: 200 });
    } catch (error) {
        console.error("OTP Error:", error);
        return NextResponse.json({ 
            error: "Could not process OTP request due to a server or email service error." 
        }, { status: 500 });
    }
}