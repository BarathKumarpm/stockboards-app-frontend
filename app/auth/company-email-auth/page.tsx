// app/auth/company-email-auth/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertTriangle, Factory, ArrowRight, Check, Plus, MailCheck } from 'lucide-react';
import { Button } from "@/components/ui/button"; 
import { Checkbox } from "@/components/ui/checkbox"; 
import { Label } from "@/components/ui/label"; 
import { Input } from "@/components/ui/input"; // NEW IMPORT

// Define the type for the company options
type CompanyOption = {
    id: number;
    name: string;
}

// Define the scenarios, adding 'new_user'
type Scenario = 'loading' | 'error' | 'single' | 'multiple' | 'new_user';

export default function CompanyEmailAuthPage() {
    const [statusMessage, setStatusMessage] = useState('Verifying user status...');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scenario, setScenario] = useState<Scenario>('loading');
    const [companyOptions, setCompanyOptions] = useState<CompanyOption[] | null>(null);
    const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
    // NEW STATE for new company registration
    const [newCompanyName, setNewCompanyName] = useState(''); 
    const router = useRouter();

    // DUMMY DATA (Only used for 'multiple' scenario)
    const DUMMY_COMPANIES: CompanyOption[] = [
        { id: 101, name: "StockBoards West Coast" },
        { id: 102, name: "StockBoards East Division" },
        { id: 103, name: "StockBoards Central HQ" },
    ];
    
    // --- Core Logic: The action that moves to the next step ---
    const proceedToCodeAuth = useCallback((companyName: string, companyId: number, multiCompanyIds?: number[]) => {
        // Store the context for the next page
        localStorage.setItem('temp_current_company_name', companyName);
        
        // Use the multiCompanyIds if available, otherwise use the single ID
        const idsToStore = multiCompanyIds 
            ? JSON.stringify(multiCompanyIds) 
            : JSON.stringify([companyId]);
            
        localStorage.setItem('temp_selected_company_ids', idsToStore);
        
        // Simulate immediate success for single/new user flows without selection delay
        if (scenario === 'single' || scenario === 'new_user') {
            router.push('/auth/company-code-auth');
        }
        
    }, [router, scenario]);


    // --- New Company Registration Handler ---
    const handleNewCompanyRegistration = () => {
        setError(null);
        if (!newCompanyName.trim()) {
            setError("Company name cannot be empty.");
            return;
        }

        setIsLoading(true);
        setStatusMessage(`Registering new company: ${newCompanyName.trim()}...`);
        
        // 🛑 DUMMY NEXT STEP: Simulate API call to register company and get a temporary ID 🛑
        setTimeout(() => {
            setIsLoading(false);
            
            // Assuming successful registration returns a new temporary ID (e.g., 999)
            const newCompanyId = 999; 
            
            // Proceed as a single company login with the newly created company
            proceedToCodeAuth(newCompanyName.trim(), newCompanyId);

        }, 1500);
    };


    // --- Checkbox Handler (Unchanged) ---
    const handleCheckboxChange = (companyId: number, isChecked: boolean) => {
        // ... (existing implementation is fine)
        setSelectedCompanies(prev => {
            if (isChecked) {
                return [...prev, companyId];
            } else {
                return prev.filter(id => id !== companyId);
            }
        });
    };

    // --- Final Login Button Action (Multiple Scenario) (Unchanged logic, minor text change) ---
    const handleMultiCompanyLogin = () => {
        if (selectedCompanies.length === 0) {
            setError("Please select at least one company to proceed.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setStatusMessage(`Preparing login for ${selectedCompanies.length} selected company(s)...`);
        
        setTimeout(() => {
            setIsLoading(false);
            
            // Get the name of the first selected company for display on the next screen
            const firstCompanyName = companyOptions?.find(c => c.id === selectedCompanies[0])?.name || "Multiple Companies";
            
            // Proceed to Code Auth
            proceedToCodeAuth(firstCompanyName, selectedCompanies[0], selectedCompanies);
            
            router.push('/auth/company-code-auth'); // Manual redirect here since proceedToCodeAuth is modified
        }, 1000);
    };

    // --- 1. Simulation Setup (Modified to include 'new_user' scenario) ---
    useEffect(() => {
        // Check for Kinde session/token (currently using localStorage for dummy)
        const token = localStorage.getItem('access_token');
        if (!token) {
            // For a real app, this should check the Kinde session via a server component/middleware
            // For now, let's assume the user is authenticated from /auth/signin
            // We'll proceed without this dummy check for now since Kinde handles the auth.
        }

        // 🛑 SCENARIO SWITCH: Change this string value manually for testing 🛑
        // Options: 'multiple', 'error', 'new_user' (for first-time login)
        const TEST_SCENARIO: string = 'new_user'; // <--- TESTING THE NEW USER FLOW
        // -------------------------------------------------------------

        setTimeout(() => {
            setIsLoading(false);
            setScenario(TEST_SCENARIO as Scenario);

            if (TEST_SCENARIO === 'new_user') { 
                setStatusMessage(`Welcome! Register your first company profile to get started.`);
            } else if (TEST_SCENARIO === 'multiple') {
                setStatusMessage('Multiple companies linked to your account. Select the ones you wish to access now.');
                setCompanyOptions(DUMMY_COMPANIES);
                setSelectedCompanies(DUMMY_COMPANIES.map(c => c.id));
            } else if (TEST_SCENARIO === 'error') {
                setError('Company authentication failed: Domain not recognized.');
            }
            
        }, 1500); 

    }, [router]);

    // --- RENDER LOGIC ---
    
    // State 1: Loading (Unchanged)
    if (isLoading && scenario === 'loading') {
        return (
             <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle>Company Access Verification</CardTitle>
                        <CardDescription>Stage 2: Linking your user account to your company profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center p-6">
                        <div className="flex flex-col items-center space-y-3">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-lg text-muted-foreground">{statusMessage}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    // State 2: New User / First Time Login (NEW RENDER BLOCK)
    if (scenario === 'new_user') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle>Register Your Company</CardTitle>
                        <CardDescription>{statusMessage}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="new-company-name" className="text-base">Company Name</Label>
                            <Input
                                id="new-company-name"
                                type="text"
                                placeholder="e.g. Acme Global Logistics"
                                value={newCompanyName}
                                onChange={(e) => setNewCompanyName(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-center text-red-500 bg-red-500/10 p-2 rounded-md">
                                {error}
                            </p>
                        )}
                        <Button 
                            className="w-full h-12 flex items-center gap-2"
                            onClick={handleNewCompanyRegistration}
                            disabled={isLoading || !newCompanyName.trim()}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-5 w-5" />
                            )}
                            {isLoading ? 'Registering...' : 'Register Company & Proceed'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // State 3: Multiple companies detected (user selection required) (Unchanged)
    if (scenario === 'multiple' && companyOptions && companyOptions.length > 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle>Select Companies to Access</CardTitle>
                        <CardDescription>{statusMessage}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Company Selection Ticking Block (Unchanged) */}
                        <div className="space-y-3">
                            {companyOptions.map((company) => (
                                <div 
                                    key={company.id} 
                                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => handleCheckboxChange(company.id, !selectedCompanies.includes(company.id))}
                                >
                                    <Checkbox 
                                        id={`company-${company.id}`}
                                        checked={selectedCompanies.includes(company.id)}
                                        onCheckedChange={(checked) => handleCheckboxChange(company.id, checked === true)}
                                        className="h-5 w-5"
                                    />
                                    <Label htmlFor={`company-${company.id}`} className="text-base font-medium flex items-center gap-3 cursor-pointer">
                                        <Factory className="h-5 w-5 text-primary" />
                                        {company.name}
                                    </Label>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <p className="text-sm text-center text-red-500 bg-red-500/10 p-2 rounded-md">
                                {error}
                            </p>
                        )}
                        
                        <Button 
                            className="w-full h-12 flex items-center gap-2"
                            onClick={handleMultiCompanyLogin}
                            disabled={isLoading || selectedCompanies.length === 0}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="h-5 w-5" />
                            )}
                            {isLoading ? 'Processing...' : `Proceed to Login (${selectedCompanies.length} selected)`}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    // State 4: Error (Unchanged)
    if (scenario === 'error' && error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle>Authorization Failed</CardTitle>
                        <CardDescription>Stage 2: Linking your user account to your company profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center p-6">
                        <div className="flex flex-col items-center space-y-3 text-red-500">
                            <AlertTriangle className="h-10 w-10" />
                            <p className="font-medium text-lg">Error:</p>
                            <p className="text-sm text-muted-foreground">{error}</p>
                            <Button variant="link" onClick={() => router.push('/auth/signin')}>Go back to Sign In</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    // Fallback
    return null;
}