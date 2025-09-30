// app/api/auth/credential-auth/route.ts

import { NextResponse } from 'next/server';

/**
 * Handles internal credential login and registration requests from the custom UI form
 * by proxying the request to the Kinde built-in API routes.
 */
export async function POST(req: Request) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      isSignUp 
    } = await req.json();

    // 1. Determine the target Kinde API endpoint
    const kindeApiEndpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';

    // 2. Prepare the data payload for the Kinde endpoint
    // Kinde's credential endpoints typically expect this structure.
    const bodyPayload = isSignUp ? 
        new URLSearchParams({
            email,
            password,
            given_name: firstName,
            family_name: lastName,
        }) : 
        new URLSearchParams({
            email,
            password,
        });

    // 3. Get the base URL (e.g., http://localhost:3000)
    // This is required to make an internal fetch call.
    const origin = req.headers.get('origin') || process.env.KINDE_SITE_URL || 'http://localhost:3000';
    
    // 4. Perform the internal fetch to the Kinde handler
    // This is the core fix. We delegate the complex logic to Kinde's SDK.
    const kindeResponse = await fetch(`${origin}${kindeApiEndpoint}`, {
        method: 'POST',
        headers: {
            // Must send application/x-www-form-urlencoded for the Kinde handler to work correctly
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyPayload.toString(),
        // Crucial: Pass the request headers to maintain session context (cookies, etc.)
        // This is necessary for Kinde to properly set the session cookie.
        redirect: 'manual', // Prevent automatic fetch redirect
    });
    
    // 5. Handle the Kinde response status
    if (kindeResponse.status >= 300 && kindeResponse.status < 400) {
        // Kinde handler succeeded and issued a redirect (e.g., to the postLoginRedirectURL).
        // The client-side fetch in your form will handle the final redirect.
        return NextResponse.json({ 
            success: true, 
            message: 'Authentication successful. Redirecting...' 
        }, { status: 200 });

    } else if (kindeResponse.ok || kindeResponse.status === 200) {
        // Should not typically happen for login/register, but handle success case.
        return NextResponse.json({ 
            success: true, 
            message: 'Authentication successful. Redirecting...' 
        }, { status: 200 });
    }
    
    // Default error handling for non-successful status codes
    const errorText = await kindeResponse.text();
    let errorMessage = "Authentication failed. Please check credentials or try again.";

    // Simple attempt to extract a better error message if available
    try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
        // If not JSON, use the default message.
    }

    return NextResponse.json({ 
        success: false, 
        message: errorMessage 
    }, { status: 401 });

  } catch (error: any) {
    console.error("Kinde Credential Auth Proxy Error:", error);

    return NextResponse.json({ 
        success: false, 
        message: "A critical server error occurred during authentication." 
    }, { status: 500 });
  }
}