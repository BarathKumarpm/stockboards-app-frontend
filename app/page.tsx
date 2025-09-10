"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Zap,
  CheckCircle,
  Bell,
  Database,
  LineChart,
  Star,
  Users,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="container mx-auto px-4 py-6 border-b border-border/50">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/stock-boards-logo.png" alt="Stock Boards Logo" width={40} height={40} className="w-10 h-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Stock Boards
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Product
            </Link>
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Login
            </Button>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 shadow-lg">Get a Free Demo</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <div className="inline-flex items-center px-4 py-2 bg-primary/30 border border-primary/50 rounded-full text-white text-sm font-medium mb-6">
                  <Zap className="w-4 h-4 mr-2" />
                  Smart Inventory Platform
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
                  We help you grow your business
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    {" "}
                    faster
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
                  Smart inventory platform to track, automate, and optimize your stock. Transform your business with
                  intelligent tracking and seamless integrations.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-xl">
                    See How It Works
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 border-2 hover:bg-muted/50 bg-transparent"
                    >
                      Get a Free Demo
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    14-day free trial
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    No setup fees
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-96 rounded-2xl border-2 border-border/30 shadow-2xl relative overflow-hidden">
                  <Image
                    src="/analytics-dashboard.png"
                    alt="Stock Boards Analytics Dashboard"
                    fill
                    className="object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 z-10 rounded-2xl"></div>
                  <Image
                    src="/stock-boards-logo.png"
                    alt="Stock Boards Logo"
                    width={96}
                    height={96}
                    className="w-24 h-24 drop-shadow-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent to-secondary rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full opacity-30 animate-pulse delay-1000"></div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features for Modern Businesses</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to streamline operations and accelerate growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <Card className="p-6 border-0 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Track Inventory in Real-Time</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Monitor stock levels, movements, and trends with live updates and intelligent forecasting.
              </p>
            </Card>

            <Card className="p-6 border-0 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Automated Low-Stock Alerts</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Never run out of stock with smart notifications and automated reorder suggestions.
              </p>
            </Card>

            <Card className="p-6 border-0 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Seamless Tally Integration</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sync seamlessly with Tally Prime for unified accounting and inventory management.
              </p>
            </Card>

            <Card className="p-6 border-0 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Smart Analytics</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get actionable insights with advanced reporting and predictive analytics.
              </p>
            </Card>
          </div>
        </section>

        <section className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Measure, Track, and Improve</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Transform raw data into actionable insights. Our advanced analytics help you understand stock patterns,
                predict demand, and optimize your inventory for maximum efficiency.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Real-time inventory tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Predictive demand forecasting</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Automated reporting dashboards</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-card to-muted/30 border-0 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Stock Movement</h3>
                  <Badge variant="secondary">Live</Badge>
                </div>
                <div className="h-48 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-end justify-center gap-2 p-4">
                  <div className="w-8 bg-primary/60 rounded-t" style={{ height: "60%" }}></div>
                  <div className="w-8 bg-primary/80 rounded-t" style={{ height: "80%" }}></div>
                  <div className="w-8 bg-primary rounded-t" style={{ height: "100%" }}></div>
                  <div className="w-8 bg-secondary/60 rounded-t" style={{ height: "40%" }}></div>
                  <div className="w-8 bg-secondary/80 rounded-t" style={{ height: "70%" }}></div>
                  <div className="w-8 bg-secondary rounded-t" style={{ height: "90%" }}></div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div className="order-2 lg:order-1">
              <Card className="p-8 bg-gradient-to-br from-card to-muted/30 border-0 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email Parsing</h4>
                      <p className="text-sm text-muted-foreground">Automatically extract order data</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-secondary/10 rounded-lg">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Database className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Tally Sync</h4>
                      <p className="text-sm text-muted-foreground">Real-time data synchronization</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-lg">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <LineChart className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium">Quick Data Entry</h4>
                      <p className="text-sm text-muted-foreground">Streamlined input workflows</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Simplify workflows, reduce errors, and save time
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Automate repetitive tasks and eliminate manual data entry. Our intelligent automation handles routine
                operations so you can focus on strategic business growth.
              </p>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                Learn More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Trusted by Growing Businesses</h2>
            <p className="text-xl text-muted-foreground">See what our customers say about Stock Boards</p>
          </div>

          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-card to-muted/30 border-0 shadow-xl">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-2xl font-medium text-foreground mb-6 text-balance">
                "With this platform, we easily manage our stock and automate reporting. It's essential for our growth.
                The integration with Tally Prime saved us countless hours every week."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Sarah Johnson</p>
                  <p className="text-muted-foreground">Operations Manager, TechCorp</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="py-20">
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground mb-8">Powering the growth of 100+ businesses</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {["TechCorp", "InnovateLab", "GrowthCo", "ScaleUp"].map((company, i) => (
                <div key={i} className="flex items-center justify-center p-6 bg-muted/30 rounded-lg">
                  <span className="text-lg font-semibold text-muted-foreground">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <Card className="bg-gradient-to-r from-primary to-secondary p-12 text-center border-0 shadow-2xl">
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">
              Grow your business smarter with Stock Boards
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join 1200+ happy customers today. Start your free trial and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-10 py-6 bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <p className="text-primary-foreground/95 mt-4 text-sm font-medium">
              No credit card required • 14-day free trial
            </p>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/stock-boards-logo.png"
                  alt="Stock Boards Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Stock Boards
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                Empowering businesses with intelligent inventory management solutions.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="w-9 h-9 p-0">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-9 h-9 p-0">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-9 h-9 p-0">
                  <Instagram className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Stock Boards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
