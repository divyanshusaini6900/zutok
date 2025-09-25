import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Import icons from lucide-react (we'll need to install this)
import {
  CheckCircle,
  Users,
  BarChart3,
  Zap,
  Star,
  ArrowRight,
  Menu,
  MessageSquare,
  Database,
  Shield,
} from "lucide-react";

// Since we can't use Next.js Image component, we'll use regular img tags
// The logo will need to be placed in the public folder

const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentRef = ref.current; // Store ref value in a variable
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const startCount = 0;

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * (end - startCount) + startCount));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="animate-count-up">
      {count}
      {suffix}
    </span>
  );
};

const ParticleSystem = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const createParticle = () => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 10,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    });

    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-20), // Keep only last 20 particles
        createParticle(),
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-primary/10 animate-particle"
          style={{
            left: particle.x,
            bottom: 0,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDuration: `${4 / particle.speed}s`,
          }}
        />
      ))}
    </div>
  );
};

// Simple Card component since we're not using shadcn/ui
const Card = ({ children, className, ...props }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className, ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

// Simple Button component
const Button = ({ children, variant = "default", size = "default", className, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ""}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

// Simple Badge component
const Badge = ({ children, className, ...props }) => (
  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>
    {children}
  </div>
);

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Account for fixed header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Close mobile menu after clicking
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector("footer");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <ParticleSystem />

      {/* Dynamic cursor follower */}
      <div
        className="fixed w-4 h-4 bg-primary/20 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: `scale(${mousePosition.x > 0 ? 1 : 0})`,
        }}
      />

      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow animate-morphing"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse-slow animation-delay-1000 animate-morphing"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/2 to-transparent rounded-full animate-spin-slow"></div>
        <div className="absolute top-10 right-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-primary/20 rounded-full animate-float animation-delay-500"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-primary/40 rounded-full animate-bounce-slow animation-delay-800"></div>
      </div>

      {/* Header */}
      <header
        className={`border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 lg:h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center group">
                <img
                  src="/images/zutok-logo.png"
                  alt="Zutok Softwares"
                  width={200}
                  height={50}
                  className="h-8 sm:h-10 lg:h-12 w-auto transition-all duration-500 group-hover:scale-110 hover-glow cursor-pointer"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
                {[
                  { name: "Features", id: "features" },
                  { name: "Testimonials", id: "testimonials" },
                  { name: "Pricing", id: "pricing" },
                ].map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-foreground hover:text-primary px-2 lg:px-3 py-2 text-sm lg:text-base font-medium transition-all duration-500 hover:scale-110 relative group animate-fade-in-left cursor-pointer`}
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full"></span>
                    <span className="absolute inset-0 bg-primary/5 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollToContact}
                  className="hover:scale-110 transition-all duration-500 hover:shadow-xl bg-transparent hover-glow animate-fade-in-scale animation-delay-400 text-sm lg:text-base"
                >
                  Contact
                </Button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:scale-125 transition-all duration-300 hover-rotate"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-background/95 backdrop-blur animate-fade-in-down">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {[
                  { name: "Features", id: "features" },
                  { name: "Testimonials", id: "testimonials" },
                  { name: "Pricing", id: "pricing" },
                ].map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="text-foreground hover:text-primary hover:bg-primary/5 block px-3 py-2 text-base font-medium transition-all duration-300 w-full text-left rounded-md"
                  >
                    {item.name}
                  </button>
                ))}
                <button
                  onClick={scrollToContact}
                  className="text-foreground hover:text-primary hover:bg-primary/5 block px-3 py-2 text-base font-medium transition-all duration-300 w-full text-left rounded-md"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Better responsive spacing */}
      <section className="bg-gradient-to-br from-background via-background to-secondary/20 relative py-0 sm:py-1 lg:py-2 xl:py-3 flex items-center min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold mb-2 sm:mb-3 leading-tight text-foreground transition-all duration-1200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
            >
              <span className="inline-block animate-fade-in-up text-shimmer">We Give Life to Your Software</span>
              <span className="block animate-fade-in-up animation-delay-300">From Your Idea</span>
            </h1>
            <p
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-5 text-muted-foreground leading-relaxed max-w-3xl mx-auto transition-all duration-1200 delay-500 px-4 sm:px-0 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
            >
              Zutok Softwares provides end-to-end technology solutions - from web and mobile development to digital
              marketing, CRM systems, and business registration services. Transform your ideas into powerful digital
              solutions.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transition-all duration-1200 delay-700 px-4 sm:px-0 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl sm:text-2xl px-8 sm:px-10 py-4 sm:py-5 hover:scale-110 transition-all duration-500 hover:shadow-2xl group hover-glow relative overflow-hidden w-full sm:w-auto"
                onClick={() => window.open('https://wa.me/918393870081', '_blank')}
              >
                <span className="relative z-10">Contact Us</span>
                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-500 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-8 max-w-2xl mx-auto px-4 sm:px-0">
              {[
                { number: 10000, suffix: "+", label: "Active Users" },
                { number: 99, suffix: "%", label: "Uptime" },
                { number: 24, suffix: "/7", label: "Support" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center animate-fade-in-scale`}
                  style={{ animationDelay: `${1000 + index * 200}ms` }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="text-base sm:text-lg text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-primary/20 rounded-full animate-float hover-glow"></div>
        <div className="absolute top-1/3 right-20 w-6 h-6 bg-primary/10 rounded-full animate-float animation-delay-1000 hover-glow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-primary/15 rounded-full animate-float animation-delay-2000 hover-glow"></div>
        <div className="absolute top-1/2 right-1/4 w-5 h-5 bg-primary/25 rounded-full animate-float-reverse animation-delay-1500 hover-glow"></div>
      </section>

      {/* Features Section - Better responsive grid */}
      <section id="features" className="py-3 sm:py-4 lg:py-5 bg-background relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-5 fade-in-section">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-2 sm:mb-3 text-shimmer px-4 sm:px-0">
              Comprehensive Technology Solutions
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Everything you need to build, grow, and scale your digital presence and business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {[
              {
                icon: Users,
                title: "Website Development",
                description:
                  "Custom, responsive websites built with modern technologies. From landing pages to complex web applications.",
                delay: "0",
                color: "text-blue-600",
              },
              {
                icon: BarChart3,
                title: "Mobile App Development",
                description:
                  "Native Android & iOS applications that deliver exceptional user experiences and drive business growth.",
                delay: "100",
                color: "text-green-600",
              },
              {
                icon: Zap,
                title: "Digital Marketing",
                description:
                  "Facebook Ads, Google Ads, LinkedIn Ads, and comprehensive digital marketing strategies to boost your reach.",
                delay: "200",
                color: "text-yellow-600",
              },
              {
                icon: Database,
                title: "CRM Solutions",
                description:
                  "Custom CRM systems to manage customer relationships, streamline sales processes, and boost productivity.",
                delay: "300",
                color: "text-purple-600",
              },
              {
                icon: Shield,
                title: "Company Registration",
                description:
                  "Complete business registration services, legal compliance, and documentation to get your company started.",
                delay: "400",
                color: "text-red-600",
              },
              {
                icon: MessageSquare,
                title: "Web Hosting",
                description:
                  "Reliable, secure web hosting solutions with 99.9% uptime guarantee and 24/7 technical support.",
                delay: "500",
                color: "text-indigo-600",
              },
              {
                icon: CheckCircle,
                title: "GST Filing",
                description:
                  "Professional GST registration and filing services to ensure your business stays compliant with tax regulations.",
                delay: "600",
                color: "text-pink-600",
              },
              {
                icon: Star,
                title: "Startup Mentoring",
                description:
                  "Expert guidance and mentorship for startups, from idea validation to scaling your business successfully.",
                delay: "700",
                color: "text-orange-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`border-border hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-2 group animate-fade-in-up hover-lift relative overflow-hidden`}
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-3">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-2 group-hover:scale-125 transition-all duration-500 group-hover:bg-primary/10 hover-rotate">
                    <feature.icon
                      className={`h-6 w-6 text-primary group-hover:scale-125 transition-all duration-500 ${feature.color}`}
                    />
                  </div>
                  <CardTitle className="font-serif group-hover:text-primary transition-colors duration-500 text-xl">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="group-hover:text-foreground transition-colors duration-500 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Better responsive layout */}
      <section id="testimonials" className="py-3 sm:py-4 lg:py-5 bg-secondary/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-gradient"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-4 sm:mb-5 fade-in-section">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-2 sm:mb-3 text-shimmer px-4 sm:px-0">
              Trusted by Growing Businesses
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground px-4 sm:px-0">
              See how Zutok is transforming business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {[
              {
                name: "Sarah Mitchell",
                role: "CEO, TechStart Solutions",
                initials: "SM",
                quote:
                  "Zutok developed our entire digital ecosystem - from our website to mobile app and CRM. Their comprehensive approach saved us time and delivered exceptional results.",
                delay: "0",
              },
              {
                name: "David Lee",
                role: "Founder, Growth Co",
                initials: "DL",
                quote:
                  "From company registration to digital marketing campaigns, Zutok handled everything. Their startup mentoring was invaluable in scaling our business.",
                delay: "200",
              },
              {
                name: "Rachel Park",
                role: "Director, Innovate Labs",
                initials: "RP",
                quote:
                  "Zutok's web hosting and GST filing services are top-notch. Having all our technology and compliance needs handled by one reliable partner is a game-changer.",
                delay: "400",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className={`border-border bg-background hover:shadow-2xl transition-all duration-700 hover:scale-105 group animate-fade-in-up hover-lift relative overflow-hidden`}
                style={{ animationDelay: `${testimonial.delay}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="pt-4 relative z-10">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary animate-bounce-slow hover-rotate"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-foreground mb-3 leading-relaxed group-hover:text-primary/90 transition-colors duration-500 text-lg">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mr-3 group-hover:bg-primary/10 transition-all duration-500 hover-glow">
                      <span className="text-primary font-semibold text-sm">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{testimonial.name}</p>
                      <p className="text-base text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Better responsive cards */}
      <section id="pricing" className="py-3 sm:py-4 lg:py-5 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-5 fade-in-section">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-2 sm:mb-3 text-shimmer px-4 sm:px-0">
              CRM Solutions & Service Packages
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground px-4 sm:px-0">
              Choose the perfect plan for your business needs
            </p>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="text-center mb-4 sm:mb-5">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-2 sm:mb-3 px-4 sm:px-0">
                CRM Solutions Pricing
              </h3>
              <p className="text-lg text-muted-foreground px-4 sm:px-0">
                Powerful CRM with AI features and comprehensive automation
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 max-w-7xl mx-auto">
              {[
                {
                  title: "Monthly",
                  price: "₹1,200",
                  period: "/user/month",
                  features: [
                    "WhatsApp API Rent: ₹0",
                    "Cloud Telephony Rent: ₹0",
                    "Free VAS Inventory: 10% of order value",
                    "400 Marketing Automation Triggers",
                    "Dedicated Account Manager",
                    "24/7 Phone Support",
                  ],
                  delay: "0",
                  popular: false,
                },
                {
                  title: "Quarterly",
                  price: "₹1,000",
                  period: "/user/month",
                  features: [
                    "WhatsApp API Rent: ₹0",
                    "Cloud Telephony Rent: ₹0",
                    "Free VAS Inventory: 30% of order value",
                    "400 Marketing Automation Triggers",
                    "Dedicated Account Manager",
                    "24/7 Phone Support",
                  ],
                  delay: "100",
                  popular: false,
                },
                {
                  title: "Half-Yearly",
                  price: "₹800",
                  period: "/user/month",
                  features: [
                    "WhatsApp API Rent: ₹0",
                    "Cloud Telephony Rent: ₹0",
                    "Free VAS Inventory: 50% of order value",
                    "400 Marketing Automation Triggers",
                    "Dedicated Account Manager",
                    "24/7 Phone Support",
                  ],
                  delay: "200",
                  popular: false,
                },
                {
                  title: "Yearly",
                  price: "₹600",
                  period: "/user/month",
                  badge: "Best Value",
                  features: [
                    "WhatsApp API Rent: ₹0",
                    "Cloud Telephony Rent: ₹0",
                    "Free VAS Inventory: 100% of order value",
                    "20% Extra Users FREE",
                    "+2 Months Extra Validity",
                    "1 Free Extra WhatsApp Business API",
                    "AI Chatbot Free for 1 Year (₹29,500 value)",
                    "₹5,000 AI Chatbot Credits",
                    "Agentic AI: 3 months free + ₹5,000 credit",
                    "400 Marketing Automation Triggers",
                    "Dedicated Account Manager",
                    "24/7 Phone Support",
                  ],
                  delay: "300",
                  popular: true,
                },
              ].map((plan, index) => (
                <Card
                  key={index}
                  className={`border-border hover:shadow-2xl transition-all duration-700 hover:scale-105 animate-fade-in-up hover-lift relative ${
                    plan.popular ? "border-primary shadow-xl" : ""
                  }`}
                  style={{ animationDelay: `${plan.delay}ms` }}
                >
                  {plan.badge && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground animate-bounce-slow px-3 py-1 text-sm">
                      {plan.badge}
                    </Badge>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="font-serif text-xl">{plan.title}</CardTitle>
                    <div className="mt-3">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-lg">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start animate-fade-in-left hover-lift text-base"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0 hover-rotate" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full mt-4 hover:scale-110 transition-all duration-500 hover-glow ${
                        plan.popular
                          ? "bg-primary hover:bg-primary/90 hover:shadow-2xl"
                          : "bg-transparent hover:bg-primary/10"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      {...(plan.popular ? { onClick: () => window.open('https://wa.me/918393870081', '_blank') } : {})}
                    >
                      {plan.popular ? "Contact Us" : "Choose Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                <div className="bg-secondary/50 p-4 rounded-lg animate-fade-in-up">
                  <h4 className="font-semibold mb-1 text-lg">✅ 10-Day Free Trial</h4>
                  <p className="text-base text-muted-foreground">Fully assisted trial with no commitments</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg animate-fade-in-up animation-delay-100">
                  <h4 className="font-semibold mb-1 text-lg">✅ 30-Day Refund</h4>
                  <p className="text-base text-muted-foreground">Unconditional refund if not satisfied</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg animate-fade-in-up animation-delay-200">
                  <h4 className="font-semibold mb-1 text-lg">✅ Free Training</h4>
                  <p className="text-base text-muted-foreground">Complete online training included</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-center mb-4 sm:mb-5">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-2 sm:mb-3 px-4 sm:px-0">
                Development & Business Services
              </h3>
              <p className="text-lg text-muted-foreground px-4 sm:px-0">Complete technology and business solutions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-w-6xl mx-auto">
              {[
                {
                  title: "Website Development",
                  price: "₹15,000",
                  period: "starting from",
                  features: [
                    "Responsive Design",
                    "SEO Optimized",
                    "Content Management",
                    "Mobile Friendly",
                    "3 Months Support",
                    "Free SSL Certificate",
                  ],
                  delay: "0",
                },
                {
                  title: "Mobile App Development",
                  price: "₹50,000",
                  period: "starting from",
                  features: [
                    "Android & iOS Apps",
                    "Native Performance",
                    "App Store Deployment",
                    "Push Notifications",
                    "6 Months Support",
                    "Free Updates",
                  ],
                  delay: "100",
                },
                {
                  title: "Digital Marketing",
                  price: "₹10,000",
                  period: "/month",
                  features: [
                    "Facebook Ads Management",
                    "Google Ads Campaign",
                    "LinkedIn Advertising",
                    "Social Media Management",
                    "Analytics & Reporting",
                    "Content Creation",
                  ],
                  delay: "200",
                },
                {
                  title: "Company Registration",
                  price: "₹5,000",
                  period: "all inclusive",
                  features: [
                    "Private Limited Company",
                    "Digital Signature Certificate",
                    "Director Identification Number",
                    "Certificate of Incorporation",
                    "PAN & TAN Registration",
                    "Bank Account Opening Support",
                  ],
                  delay: "300",
                },
                {
                  title: "Web Hosting",
                  price: "₹2,000",
                  period: "/year",
                  features: [
                    "99.9% Uptime Guarantee",
                    "Free SSL Certificate",
                    "Daily Backups",
                    "24/7 Technical Support",
                    "Email Accounts Included",
                    "Control Panel Access",
                  ],
                  delay: "400",
                },
                {
                  title: "GST Filing",
                  price: "₹1,500",
                  period: "/month",
                  features: [
                    "Monthly GST Returns",
                    "GSTR-1, GSTR-3B Filing",
                    "Input Tax Credit Optimization",
                    "Compliance Management",
                    "Expert Consultation",
                    "Penalty Protection",
                  ],
                  delay: "500",
                },
              ].map((service, index) => (
                <Card
                  key={index}
                  className="border-border hover:shadow-2xl transition-all duration-700 hover:scale-105 animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${service.delay}ms` }}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="font-serif text-xl">{service.title}</CardTitle>
                    <div className="mt-3">
                      <span className="text-2xl font-bold">{service.price}</span>
                      <span className="text-muted-foreground text-lg ml-1">{service.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center animate-fade-in-left hover-lift text-lg"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <CheckCircle className="h-4 w-4 text-primary mr-2 hover-rotate" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full mt-4 bg-transparent hover:scale-110 transition-all duration-500 hover-glow"
                      variant="outline"
                    >
                      Get Quote
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 max-w-4xl mx-auto">
              <Card className="border-border hover:shadow-2xl transition-all duration-700 hover:scale-105 animate-fade-in-up hover-lift">
                <CardHeader className="pb-4">
                  <CardTitle className="font-serif text-xl">Startup Mentoring</CardTitle>
                  <div className="mt-3">
                    <span className="text-2xl font-bold">₹25,000</span>
                    <span className="text-muted-foreground text-lg ml-1">/3 months</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Business Strategy Development",
                      "Market Research & Analysis",
                      "Funding Guidance",
                      "Technology Roadmap",
                      "Weekly 1-on-1 Sessions",
                      "Investor Pitch Preparation",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center text-lg">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-4 bg-transparent hover:scale-110 transition-all duration-500"
                    variant="outline"
                  >
                    Start Mentoring
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-2xl transition-all duration-700 hover:scale-105 animate-fade-in-up hover-lift animation-delay-100">
                <CardHeader className="pb-4">
                  <CardTitle className="font-serif text-xl">24/7 Support & Maintenance</CardTitle>
                  <div className="mt-3">
                    <span className="text-2xl font-bold">₹5,000</span>
                    <span className="text-muted-foreground text-lg ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Round-the-clock Support",
                      "Priority Issue Resolution",
                      "Regular Updates & Patches",
                      "Performance Monitoring",
                      "Security Maintenance",
                      "Backup & Recovery",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center text-lg">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-4 bg-transparent hover:scale-110 transition-all duration-500"
                    variant="outline"
                  >
                    Add Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Better responsive text */}
      <section className="py-6 sm:py-8 lg:py-10 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary animate-gradient"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-2 sm:mb-3 animate-fade-in-up text-shimmer px-4 sm:px-0">
            Ready to Bring Your Ideas to Life?
          </h2>
          <p className="text-xl sm:text-2xl mb-4 sm:mb-5 text-primary-foreground/90 max-w-3xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed px-4 sm:px-0">
            From concept to completion, Zutok Softwares provides all the technology and business services you need.
            Let's transform your ideas into powerful digital solutions that drive real results.
          </p>
        </div>
      </section>

      {/* Footer - Better responsive layout */}
      <footer className="bg-secondary border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/2 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="animate-fade-in-up sm:col-span-2 lg:col-span-1">
              <img
                src="/images/zutok-logo.png"
                alt="Zutok Softwares"
                width={200}
                height={50}
                className="h-10 sm:h-12 w-auto mb-4 hover:scale-110 transition-transform duration-500 hover-glow"
              />
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                We give life to your software from your idea.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:scale-125 transition-all duration-500 hover:bg-primary/10 hover-rotate"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:scale-125 transition-all duration-500 hover:bg-primary/10 hover-rotate"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Button>
              </div>
            </div>

            {[
              {
                title: "Services",
                links: ["Website Development", "Mobile Apps", "Digital Marketing", "CRM Solutions"],
              },
              { title: "Business", links: ["Company Registration", "Web Hosting", "GST Filing", "Startup Mentoring"] },
              { title: "Support", links: ["Help Center", "Documentation", "Contact Us", "Privacy Policy"] },
            ].map((section, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle navigation or keep as placeholder
                        }}
                        className="hover:text-foreground transition-all duration-500 hover:translate-x-1 inline-block hover:scale-105 text-left w-full"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-6 sm:mt-8 pt-4 sm:pt-6 text-center text-muted-foreground animate-fade-in-up animation-delay-600 text-sm sm:text-base">
            <p>&copy; 2025 Zutok Softwares. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;