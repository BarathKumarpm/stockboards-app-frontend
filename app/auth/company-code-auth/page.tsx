// app/auth/company-code-auth/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, MailCheck, Factory } from 'lucide-react';

export default function CompanyOTPAuthPage() {
    // 1. Kinde User Retrieval
    const { user, isLoading: isKindeLoading } = useKindeAuth();
    
    const [otpCode, setOtpCode] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState('Your Company');
    const [selectedCompanyCount, setSelectedCompanyCount] = useState<number>(1);
    const router = useRouter();

    // Use the local API route we created
    const API_REQUEST_OTP_URL = '/api/auth/request-otp'; 
    // The verification API call is still dummy for demonstration
    const DUMMY_VERIFY_OTP_URL = '/api/auth/verify-otp'; 

    useEffect(() => {
        if (isKindeLoading) return;
        
        if (!user) {
            router.push('/auth/signin');
            return;
        }

        // Load company context from Stage 2
        const name = localStorage.getItem('temp_current_company_name') || 'Your Company';
        setCompanyName(name);

        const selectedIds = localStorage.getItem('temp_selected_company_ids');
        if (selectedIds) {
            try {
                const ids = JSON.parse(selectedIds);
                setSelectedCompanyCount(ids.length);
            } catch {
                setSelectedCompanyCount(1);
            }
        } else {
            setSelectedCompanyCount(1);
        }

        // Auto-request OTP on load
        if (user && !isOtpSent) {
            handleRequestOtp();
        }
    }, [isKindeLoading, user, isOtpSent, router]);


    // 1. **UPDATED** - Now calls the server-side API route
    const handleRequestOtp = async () => {
        if (isLoading || !user || !user.email) {
             setError("Authentication failed. Please sign in again.");
             return;
        }

        setError(null);
        setIsLoading(true);
        
        const companyIds = localStorage.getItem('temp_selected_company_ids');

        try {
            const response = await fetch(API_REQUEST_OTP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company_ids: companyIds }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to request OTP from server.");
            }
            
            // Success! The server confirmed the request was received and processed.
            setIsLoading(false);
            setIsOtpSent(true);
            console.log(`[CLIENT]: OTP request successful. Code sent to ${data.email}.`);
            
        } catch (err: any) {
            setIsLoading(false);
            setError(err.message || 'An unexpected error occurred during OTP request.');
        }
    };

    // 2. Simulates sending the entered OTP to the backend for verification (Unchanged)
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        
        const selectedCompanyIds = localStorage.getItem('temp_selected_company_ids');

        if (!user || !selectedCompanyIds) {
            router.push('/auth/signin');
            return;
        }

        // DUMMY LOGIC: Simulate successful OTP verification
        setTimeout(() => {
            setIsLoading(false);

            if (otpCode === '123456' && otpCode.length === 6) {
                // Success: Store the company context for the session
                localStorage.setItem('session_company_ids', selectedCompanyIds);
                
                // Clean up temporary storage
                localStorage.removeItem('temp_current_company_id');
                localStorage.removeItem('temp_current_company_name');
                localStorage.removeItem('temp_selected_company_ids');
                
                // Redirect to the main dashboard
                router.push('/dashboard'); 
            } else {
                setError('Invalid OTP. Use code "123456" for the dummy flow.');
            }
        }, 1000);
    };

    if (isKindeLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }
    
    const userEmailDisplay = user?.email || 'your email address';
    const isReadyToVerify = isOtpSent && !isLoading;

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    {selectedCompanyCount > 1 ? (
                        <div className='flex items-center justify-center gap-2'>
                            <Factory className="w-6 h-6 text-primary" />
                            <CardTitle className="text-2xl font-bold">Verify Access for {selectedCompanyCount} Companies</CardTitle>
                        </div>
                    ) : (
                        <CardTitle className="text-2xl font-bold">Verify Company Access</CardTitle>
                    )}
                    
                    <CardDescription>
                        Stage 3: Enter the 6-digit code sent to <span className="font-semibold text-primary">{userEmailDisplay}</span> for authorization.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        
                        {/* OTP Request Block (only shown before the code is sent) */}
                        {!isOtpSent && (
                            <div className='flex justify-center'>
                                <Button 
                                    type="button" 
                                    onClick={handleRequestOtp} 
                                    className='w-full'
                                    disabled={isLoading || !userEmailDisplay}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4 mr-2" />}
                                    {isLoading ? 'Sending Code...' : 'Request Verification Code'}
                                </Button>
                            </div>
                        )}
                        
                        {/* OTP Verification Form (shown after the code is sent) */}
                        {isReadyToVerify && (
                            <>
                                <div className="text-center text-sm text-green-600 bg-green-500/10 p-2 rounded-md border border-green-500/30">
                                    A verification code has been sent to {userEmailDisplay}. Check your inbox!
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="otpCode">6-Digit Code</Label>
                                    <Input
                                        id="otpCode"
                                        type="text"
                                        placeholder="Enter OTP (e.g., 123456)"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        maxLength={6}
                                        required
                                        inputMode="numeric"
                                    />
                                </div>
                                
                                {error && (
                                    <p className="text-sm text-center text-red-500 bg-red-500/10 p-2 rounded-md">
                                        {error}
                                    </p>
                                )}

                                <Button 
                                    type="submit" 
                                    className="w-full flex items-center gap-2" 
                                    disabled={isLoading || otpCode.length !== 6}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Lock className="h-4 w-4" />
                                    )}
                                    {isLoading ? 'Verifying...' : 'Verify & Access Dashboard'}
                                </Button>
                                
                                <Button 
                                    type="button" 
                                    variant="link" 
                                    onClick={handleRequestOtp} 
                                    disabled={isLoading}
                                    className='w-full'
                                >
                                    Resend Code
                                </Button>
                            </>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}