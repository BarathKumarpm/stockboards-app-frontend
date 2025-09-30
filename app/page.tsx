"use client";

import Image from "next/image";
// import { FlipWords } from "../../components/ui/flip-words"; // ERROR: Cannot find module. Replacing with static text.
import Link from "next/link";
import { ArrowRight, BarChart3 as LineChart, TrendingUp, Zap, CheckCircle, Bell, Database } from "lucide-react"; // Corrected icon imports

// --- TYPE DEFINITIONS ---
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    highlight: string;
}
// --- END TYPE DEFINITIONS ---

// Custom Logo Component (Re-used from previous step)
const Logo = () => (
    <Link href="/" className="flex items-center space-x-3">
        {/* Placeholder for your actual logo image */}
        <Image 
            src="/stock-boards-logo.png" 
            alt="Stock Boards Logo" 
            width={40} 
            height={40} 
            className="w-10 h-10" 
            priority // LCP optimization for the logo
        />
        <span className="text-2xl font-bold bg-black bg-clip-text text-transparent dark:bg-white">
            Stock<span className="text-blue-600 dark:text-blue-200">Boards</span>
        </span>
    </Link>
);

// Helper component for Feature Card (Now strongly typed)
const FeatureCard = ({ icon, title, desc, highlight }: FeatureCardProps) => ( // Type added here
    <div className="group relative">
        <div className="p-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-neutral-700 group-hover:border-blue-200 dark:group-hover:border-blue-700 transform hover:-translate-y-2">
            <div className="text-4xl mb-4 text-blue-500">{icon}</div>
            <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full mb-4">
                {highlight}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{desc}</p>
        </div>
    </div>
);


export default function Home() {
    // const words = ["Smart", "Efficient", "Resourceful", "Automated"]; // Removed for FlipWords
    const imageUrl = "https://www.netsuite.com/portal/assets/img/business-articles/inventory-management/social-inventory-management.jpg";

    // Feature data now uses the correctly imported Lucide icons
    const features = [
        {
            icon: <LineChart className="w-8 h-8" />, // Corrected: Used imported LineChart
            title: "Real-Time Analytics",
            desc: "Get instant insights into your inventory levels, trends, and performance metrics with our advanced dashboard.",
            highlight: "99.9% Accuracy"
        },
        {
            icon: <Bell className="w-8 h-8" />, // Corrected: Used imported Bell
            title: "Smart Notifications",
            desc: "AI-powered alerts for low stock, overstock, and anomalies. Never miss critical inventory changes again.",
            highlight: "Instant Alerts"
        },
        {
            icon: <Database className="w-8 h-8" />, // Corrected: Used imported Database
            title: "Seamless Integration",
            desc: "Connect with 200+ platforms including Shopify, WooCommerce, QuickBooks, and major ERPs.",
            highlight: "200+ Integrations"
        },
    ];

    const steps = [
        {
            step: "01",
            title: "Connect Your Systems",
            desc: "Import data from existing tools and connect all your sales channels in just a few clicks.",
            time: "2 minutes"
        },
        {
            step: "02",
            title: "Configure Automation",
            desc: "Set up intelligent rules for restocking, alerts, and reporting that match your business needs.",
            time: "5 minutes"
        },
        {
            step: "03",
            title: "Scale & Optimize",
            desc: "Use AI-powered insights to make data-driven decisions and grow your business efficiently.",
            time: "Ongoing"
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Operations Director",
            company: "TechFlow Inc.",
            quote: "StockBoards reduced our inventory costs by 30% and eliminated stockouts completely. The AI insights are game-changing!",
            rating: 5,
        },
        {
            name: "Marcus Rodriguez",
            role: "Supply Chain Manager",
            company: "GlobalMart",
            quote: "The real-time tracking and automated alerts have transformed our operations. We've cut manual work by 60%.",
            rating: 5,
        },
        {
            name: "Emily Watson",
            role: "Founder & CEO",
            company: "EcoGoods",
            quote: "From 5 to 50 warehouses, StockBoards scaled with us seamlessly. The analytics helped us make smarter decisions.",
            rating: 5,
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "$29",
            period: "/month",
            description: "Perfect for small businesses",
            features: [
                "Up to 3 warehouses",
                "Real-time tracking",
                "Basic analytics",
                "Email support",
                "Mobile app access"
            ],
            primary: false,
            popular: false
        },
        {
            name: "Professional",
            price: "$79",
            period: "/month",
            description: "Most popular for growing teams",
            features: [
                "Up to 10 warehouses",
                "Advanced analytics",
                "AI-powered insights",
                "Priority support",
                "Custom integrations",
                "Team collaboration"
            ],
            primary: true,
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "For large-scale operations",
            features: [
                "Unlimited warehouses",
                "White-label options",
                "Dedicated account manager",
                "24/7 phone support",
                "Custom development",
                "SLA guarantee"
            ],
            primary: false,
            popular: false
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Custom Navbar */}
            <header className="container mx-auto px-6 md:px-24 py-6 border-b border-border/50 dark:border-neutral-700/50 absolute w-full z-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm">
                <nav className="flex items-center justify-between">
                    <Logo />
                    <div className="hidden md:flex items-center space-x-8 text-sm">
                        <Link href="#features" className="text-muted-foreground hover:text-blue-500 transition-colors dark:text-neutral-400 dark:hover:text-blue-400"> Product </Link>
                        <Link href="#pricing" className="text-muted-foreground hover:text-blue-500 transition-colors dark:text-neutral-400 dark:hover:text-blue-400"> Pricing </Link>
                        <Link href="#" className="text-muted-foreground hover:text-blue-500 transition-colors dark:text-neutral-400 dark:hover:text-blue-400"> Docs </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/auth/signin" className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm font-medium"> Login </Link>
                        <Link href="/dashboard" className="inline-block" prefetch={false}> 
                            <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </nav>
            </header>
            
            {/* 1. Hero Section - Primary Blue Branding */}
            <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 overflow-hidden pt-24 md:pt-0 min-h-screen flex items-center">
                
                {/* Background decoration (Blue accents) */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

                <div className="relative container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-24 py-32 pb-16 gap-16">
                    {/* Left column: Enhanced text with better typography */}
                    <div className="flex-1 flex flex-col items-start text-left gap-8 max-w-2xl">
                        
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                            <Zap className="w-4 h-4 mr-2" /> Smart Inventory Management
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-neutral-800 dark:text-neutral-100 leading-tight">
                            Build <span className="text-neutral-500">Smart</span> {/* FIX: Used static text instead of FlipWords */}
                            <br />
                            <span className="text-blue-600 dark:text-blue-500">Stock Boards</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 dark:text-neutral-400 leading-relaxed">
                            Transform your business with intelligent inventory tracking, automated alerts, and seamless integrations. 
                            <span className="text-blue-600 dark:text-blue-400 font-semibold"> Join 10,000+ businesses</span> already optimizing their stock.
                        </p>

                        {/* Enhanced CTA buttons with better hierarchy */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
                            <Link href="/auth/signin" className="inline-block" prefetch={false}>
                                <button className="group relative px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                    Login
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </Link>
                            <Link href="/signup" className="inline-block" prefetch={false}>
                                <button className="px-8 py-4 text-gray-800 dark:text-gray-200 font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                                    Sign Up
                                </button>
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 bg-gradient-to-r from-neutral-900 to-blue-400 rounded-full border-2 border-white dark:border-neutral-900"></div>
                                    ))}
                                </div>
                                <span>Trusted by 10,000+ teams</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-400">★★★★★</span>
                                <span>4.9/5 rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Right column: Enhanced image with floating cards */}
                    <div className="flex-1 relative w-full h-[500px] max-w-2xl">
                        <div className="relative w-full h-full">
                            <Image
                                src={imageUrl}
                                alt="Inventory Management Dashboard"
                                fill
                                priority // LCP optimization for the main image
                                className="object-cover rounded-2xl shadow-2xl"
                                sizes="(max-width: 768px) 100vw, 50vw" 
                            />
                            {/* Floating UI cards for better context (Blue accent) */}
                            <div className="absolute -top-6 -left-6 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-lg animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Inventory Automation</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-lg animate-float-delayed">
                                <div className="text-2xl font-bold text-blue-600">TallyPrime</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Bill Exports</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Features Section - Primary Blue Branding */}
            <section id="features" className="bg-white dark:bg-neutral-900 py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-900/10"></div>

                <div className="relative container mx-auto px-6 md:px-24">
                    {/* Section header with better spacing */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Powerful Features for Modern Businesses
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Everything you need to manage inventory efficiently, backed by AI-powered insights and real-time data.
                        </p>
                    </div>

                    {/* Enhanced feature cards with icons and better layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <FeatureCard key={i} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. How It Works Section - Primary Blue Branding */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900">
                <div className="container mx-auto px-6 md:px-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Get Started in Minutes
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Our streamlined onboarding process gets you up and running quickly.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connection lines for desktop (Blue) */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 transform -translate-y-1/2"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {steps.map((item, i) => (
                                <div key={i} className="relative">
                                    <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="relative z-10 text-center">
                                            {/* Step Icon (Blue) */}
                                            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg">
                                                {item.step}
                                            </div>
                                            <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 text-sm rounded-full mb-4">
                                                {item.time}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{item.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Testimonials Section - Primary Blue Branding */}
            <section className="py-24 bg-white dark:bg-neutral-900">
                <div className="container mx-auto px-6 md:px-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Loved by Industry Leaders
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            See why thousands of businesses trust Stock Boards
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((client, i) => (
                            <div key={i} className="relative group">
                                <div className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-neutral-700 group-hover:border-blue-200 dark:group-hover:border-blue-700">
                                    <div className="flex items-center mb-4">
                                        {[...Array(client.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-xl">★</span>
                                        ))}
                                    </div>
                                    <blockquote className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                                        &quot;{client.quote}&quot;
                                    </blockquote>
                                    <div className="flex items-center gap-4">
                                        {/* Avatar initials background (Blue accent) */}
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {client.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{client.name}</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">{client.role}</p>
                                            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">{client.company}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Pricing Section - Primary Blue Branding */}
            <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900">
                <div className="container mx-auto px-6 md:px-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                            Choose the perfect plan for your business size
                        </p>
                        {/* Billing toggle */}
                        <div className="inline-flex items-center bg-gray-200 dark:bg-neutral-700 rounded-full p-1">
                            <button className="px-4 py-2 text-sm font-medium bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-full shadow">Monthly</button>
                            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Annual (Save 20%)</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingPlans.map((plan, i) => (
                            <div key={i} className={`relative ${plan.primary ? 'md:-mt-8' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className={`p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl border-2 ${
                                    plan.primary
                                    ? "bg-blue-600 text-white border-blue-700 scale-105"
                                    : "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-600"
                                }`}>
                                    
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                        <p className={`text-sm mb-4 ${plan.primary ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {plan.description}
                                        </p>
                                        <div className="flex items-end justify-center gap-1">
                                            <span className="text-4xl font-bold">{plan.price}</span>
                                            <span className={`text-lg ${plan.primary ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {plan.period}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <li 
                                                key={idx} className="flex items-start gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                                                    plan.primary ? 'bg-white text-blue-500' :
                                                    'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                                }`}>
                                                    <span className="text-xs">✓</span>
                                                </div>
                                                <span className={plan.primary ? 'text-blue-50' : 'text-gray-700 dark:text-gray-300'}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                                        plan.primary
                                        ? "bg-white text-blue-600 hover:bg-gray-100"
                                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                                    }`}>
                                        {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-12">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">All plans include 14-day free trial • No setup fees • Cancel anytime</p>
                        <div className="flex justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                                99.9% Uptime SLA
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                                SOC 2 Compliant
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                                GDPR Ready
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Enhanced CTA Section - Primary Blue Branding */}
            <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                <div className="relative container mx-auto px-6 md:px-24 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Ready to Transform Your Inventory Management?
                        </h2>
                        <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed">
                            Join thousands of businesses already saving time and money with Stock Boards. Start your free trial today – no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
                            <button className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                                Start Free Trial
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button className="px-8 py-4 border-2 border-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300">
                                Schedule Demo
                            </button>
                        </div>
                        {/* Trust indicators */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-blue-100">
                            <div>
                                <div className="text-3xl font-bold">10,000+</div>
                                <div className="text-sm">Active Users</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">99.9%</div>
                                <div className="text-sm">Uptime</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">$2M+</div>
                                <div className="text-sm">Cost Savings</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">24/7</div>
                                <div className="text-sm">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Enhanced Footer - Primary Blue Branding */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="container mx-auto px-6 md:px-24 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand section */}
                        <div className="md:col-span-1">
                            <div className="text-white font-bold text-2xl mb-4"> 
                                Stock<span className="text-blue-500">Boards</span>
                            </div>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                The most intelligent inventory management platform for modern businesses.
                            </p>
                            <div className="flex gap-4">
                                {['twitter', 'linkedin', 'youtube'].map(social => (
                                    <a key={social} href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                                        <span className="sr-only">{social}</span>
                                        <div className="w-5 h-5 bg-current"><TrendingUp /></div> 
                                    </a>
                                ))}
                            </div>
                        </div>
                        {/* Navigation sections (Structure retained) */}
                        {[
                            { title: "Product", links: ["Features", "Integrations", "API", "Security", "Pricing"] },
                            { title: "Resources", links: ["Documentation", "Blog", "Case Studies", "Webinars", "Help Center"] },
                            { title: "Company", links: ["About", "Careers", "Contact", "Privacy", "Terms"] }
                        ].map((section, i) => (
                            <div key={i}>
                                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                                <ul className="space-y-3">
                                    {section.links.map((link, j) => (
                                        <li key={j}>
                                            <a href="#" className="hover:text-blue-400 transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {/* Bottom section */}
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} StockBoards. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Cookie Settings</a>
                        </div>
                    </div>
                </div>
            </footer>
            
            {/* Add custom CSS for animations and grid pattern */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 3s ease-in-out infinite 1.5s;
                }
                .bg-grid-pattern {
                    background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .dark .bg-grid-pattern {
                    background-image: radial-gradient(circle, #374151 1px, transparent 1px);
                }
            `}</style>
        </div>
    );
}