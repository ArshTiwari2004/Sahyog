"use client"

import { useEffect, useRef } from "react"
import {
  AlertTriangle,
  AlertCircle,
  Brain,
  Smartphone,
  FileScanIcon as FileAnalytics,
  Boxes,
  Users,
  Bell,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Star,
  Shield,
  Satellite,
  Waves,
  Zap,
  Rocket,
  Map,
  AlertOctagon,
  Activity,
  ShieldCheck
} from "lucide-react"

const teamMembers = [
  {
    name: "Arsh Tiwari",
    image: "/arsh1.jpeg?height=200&width=200",
    bio: "AI/ML & Full Stack Developer",
    socials: {
      twitter: "https://twitter.com/alexjohnson",
      github: "https://github.com/ArshTiwari2004",
      linkedin: "https://www.linkedin.com/in/arsh-tiwari-072609284/",
    }
  },
  {
    name: "Priyanshi Bothra",
    image: "/priyanshi.png?height=200&width=200",
    bio: "AI/ML & Frontend Developer",
    socials: {
      twitter: "https://twitter.com/sarahchen",
      github: "https://github.com/priyanshi0609",
      linkedin: "https://www.linkedin.com/in/priyanshi-bothra-339568219/",
    }
  },
  {
    name: "Nibedan Pati",
    image: "/nibedan1.jpeg?height=200&width=200",
    bio: "AI&Ml & Full Stack Developer",
    socials: {
      twitter: "https://twitter.com/miguelrodriguez",
      github: "https://github.com/Heisenberg300604",
      linkedin: "https://www.linkedin.com/in/nibedan-pati-2139b3277/",
    }
  },
  {
    name: "Kanishk Verma",
    image: "/kanishk.jpg?height=200&width=200",
    bio: "Frontend Developer",
    socials: {
      twitter: "https://twitter.com/priyasharma",
      github: "https://github.com/priyasharma",
      linkedin: "https://www.linkedin.com/in/kanishkverma7",
    }
  },
]

const features = [
  {
    icon: <Brain className="h-10 w-10 text-blue-400" />,
    title: "AI Disaster Prediction",
    description: "Advanced AI models predict disasters using real-time satellite and sensor data with 92% accuracy.",
  },
  {
    icon: <Smartphone className="h-10 w-10 text-green-400" />,
    title: "Citizen Reporting",
    description: "Mobile app for citizens to report incidents with photos/videos and automatic severity detection.",
  },
  {
    icon: <Map className="h-10 w-10 text-purple-400" />,
    title: "Live Disaster Mapping",
    description: "Real-time GIS visualization of active incidents and resource deployment.",
  },
  {
    icon: <Boxes className="h-10 w-10 text-yellow-400" />,
    title: "RFID Resource Tracking",
    description: "Blockchain-backed inventory management for medical kits, food, and shelters.",
  },
  {
    icon: <Activity className="h-10 w-10 text-red-400" />,
    title: "Response Team Dispatch",
    description: "AI-optimized routing for emergency teams based on live traffic and road conditions.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-indigo-400" />,
    title: "Multichannel Alerts",
    description: "Automated SMS, app notifications, and sirens for affected communities.",
  },
]

const Sparkles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/50"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.3,
            animation: `twinkle ${Math.random() * 5 + 5}s infinite ${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  )
}

const AnimatedSection = ({ children, className, delay = 0 }) => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-in")
          }, delay)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [delay])

  return (
    <div ref={sectionRef} className={`fade-up ${className}`}>
      {children}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white relative overflow-hidden">
      <Sparkles />

      {/* Enhanced Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <AlertTriangle className="h-8 w-8 text-blue-500 mr-2 animate-pulse" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Sahyog
          </span>
        </div>
        <div className="hidden md:flex space-x-8 items-center">
          <a href="#features" className="hover:text-blue-400 transition-colors hover:scale-105 transform duration-200">
            Features
          </a>
          <a href="#mission" className="hover:text-blue-400 transition-colors hover:scale-105 transform duration-200">
            Mission
          </a>
          <a href="#team" className="hover:text-blue-400 transition-colors hover:scale-105 transform duration-200">
            Team
          </a>
          <a href="#how-it-works" className="hover:text-blue-400 transition-colors hover:scale-105 transform duration-200">
            How It Works
          </a>
          <a 
            href="https://github.com/ArshTiwari2004/Sahyog" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
        <a 
          href="/dashboard" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1"
        >
          Dashboard
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-screen">
        <AnimatedSection className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 animate-gradient">
              Transforming Disaster Response
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            AI-powered platform that reduces emergency response times by 40% through predictive analytics and real-time coordination
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <Shield className="h-5 w-5" />
              Government Dashboard
            </a>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2 animate-pulse">
              <AlertOctagon className="h-5 w-5" />
              Emergency Report
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            Citizen app available on iOS and Android
          </p>
        </AnimatedSection>
      </section>

      {/* Mission Section */}
      <section id="mission" className="relative z-10 bg-gray-900/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto animate-width"></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <AnimatedSection>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-8 w-8 text-blue-500 mr-3" />
                  <h3 className="text-2xl font-bold">Bridging the Response Gap</h3>
                </div>
                <p className="text-gray-300">
                  In India, disasters claim thousands of lives annually due to delayed response and poor coordination. 
                  Sahyog integrates AI prediction with real-time resource tracking to cut response times by 30-40%, 
                  potentially saving millions in high-risk areas.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gray-900/80 h-full">
                <img
                  src="/disaster.png"
                  alt="Disaster Response Team"
                  className="w-full h-auto rounded-2xl transform transition-all duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-blue-500/20">
                    <h4 className="text-xl font-bold text-blue-400 mb-2">Real-time Coordination</h4>
                    <p className="text-gray-300 text-sm">
                      Connecting citizens, responders, and government agencies on one platform
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto animate-width"></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 group"
              >
                <div className="bg-gray-900/80 rounded-lg p-3 inline-block mb-4 group-hover:bg-blue-900/50 transition-colors duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Sahyog Works</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto animate-width"></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Satellite className="h-10 w-10 text-blue-400" />,
                title: "Data Collection",
                description: "Satellites, drones, and IoT sensors feed real-time data"
              },
              {
                icon: <Brain className="h-10 w-10 text-purple-400" />,
                title: "AI Analysis",
                description: "Predictive models assess risks and damage levels"
              },
              {
                icon: <Zap className="h-10 w-10 text-yellow-400" />,
                title: "Alert Generation",
                description: "Automated alerts to authorities and citizens"
              },
              {
                icon: <Rocket className="h-10 w-10 text-red-400" />,
                title: "Response Dispatch",
                description: "Optimized resource allocation and routing"
              }
            ].map((step, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="text-center"
              >
                <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 h-full">
                  <div className="bg-gray-900/80 rounded-full p-4 inline-block mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="relative z-10 py-20 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto animate-width"></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden group transition-all duration-500 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                  <div className="flex space-x-4">
                    {member.socials.github && (
                      <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <AnimatedSection className="bg-gradient-to-r from-blue-900/50 to-teal-900/50 backdrop-blur-sm rounded-2xl p-10 border border-blue-800/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Disaster Response?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join governments and communities using Sahyog to save lives and resources
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Government Login
              </a>
              <button className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                Request Demo
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-xl font-bold">Sahyog</span>
              </div>
              <p className="text-gray-400 mb-4">AI-powered disaster management platform</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#mission" className="text-gray-400 hover:text-blue-400 transition-colors">Mission</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">API Reference</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-400">contact@sahyog.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Sahyog. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientAnimation 3s ease infinite;
        }
        
        .animate-width {
          animation: widthGrow 1.5s ease-out forwards;
        }
        
        @keyframes widthGrow {
          from { width: 0; }
          to { width: 80px; }
        }
        
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .fade-up.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}