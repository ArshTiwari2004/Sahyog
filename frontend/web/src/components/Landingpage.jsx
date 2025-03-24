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
  BarChart,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Shield,
} from "lucide-react"

const teamMembers = [
  {
    name: "Arsh Tiwari",
    image: "/arsh1.jpeg?height=200&width=200",
    bio: "AI/ML & Full Stack Developer",
    socials: {
      twitter: "https://twitter.com/alexjohnson",
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
    }
  },
  {
    name: "Priyanshi Bothra",
    image: "/priyanshi.png?height=200&width=200",
    bio: "AI/ML & Frontend Developer",
    socials: {
      twitter: "https://twitter.com/sarahchen",
      github: "https://github.com/sarahchen",
      linkedin: "https://linkedin.com/in/sarahchen",
    }
  },
  {
    name: "Nibedan Pati",
    image: "/nibedan1.jpeg?height=200&width=200",
    bio: "Full Stack Developer",
    socials: {
      twitter: "https://twitter.com/miguelrodriguez",
      github: "https://github.com/miguelrodriguez",
      linkedin: "https://linkedin.com/in/miguelrodriguez",
    }
  },
  {
    name: "Kanishq Verma",
    image: "/placeholder.svg?height=200&width=200",
   // bio: "Expert in logistics and resource allocation during crisis situations.",
    socials: {
      twitter: "https://twitter.com/priyasharma",
      github: "https://github.com/priyasharma",
      linkedin: "https://linkedin.com/in/priyasharma",
    }
  },
]

const features = [
  {
    icon: <Brain className="h-10 w-10 text-blue-400" />,
    title: "AI Disaster Prediction",
    description: "Advanced AI models predict disasters using real-time and historical data.",
  },
  {
    icon: <Smartphone className="h-10 w-10 text-green-400" />,
    title: "Incident Reporting",
    description: "Mobile app for citizens to report disasters with multimedia support.",
  },
  {
    icon: <FileAnalytics className="h-10 w-10 text-purple-400" />,
    title: "Multimodal Analysis",
    description: "Gemini APIs analyze images, videos, and texts to detect disaster severity.",
  },
  {
    icon: <Boxes className="h-10 w-10 text-yellow-400" />,
    title: "Resource Management",
    description: "Real-time tracking using RFID sensors and blockchain logging.",
  },
  {
    icon: <Users className="h-10 w-10 text-red-400" />,
    title: "Task Allocation",
    description: "AI-based decision-making to assign responders efficiently.",
  },
  {
    icon: <Bell className="h-10 w-10 text-indigo-400" />,
    title: "Multichannel Notifications",
    description: "Alerts through SMS, calls, and push notifications using Twilio and Firebase.",
  },
  {
    icon: <BarChart className="h-10 w-10 text-teal-400" />,
    title: "Post-Disaster Analysis",
    description: "AI-powered reports and actionable insights for better preparedness.",
  },
]

// Sparkle component for background effect
const Sparkles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-500/20"
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

// Animated section component
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
      {
        threshold: 0.1,
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [delay])

  return (
    <div ref={sectionRef} className={`fade-up ${className}`}>
      {children}
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white relative overflow-hidden">
      <Sparkles />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <AlertTriangle className="h-8 w-8 text-blue-500 mr-2 animate-pulse" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Sahyog
          </span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="hover:text-blue-400 transition-colors hover:scale-105 transform duration-200">
            Features
          </a>
          <a href="#mission" className="hover:text-blue-400 transition-colors hover:scale-105 transform duration-200">
            Mission
          </a>
          <a href="#team" className="hover:text-blue-400 transition-colors hover:scale-105 transform duration-200">
            Team
          </a>
          <a href="#contact" className="hover:text-blue-400 transition-colors hover:scale-105 transform duration-200">
            Contact
          </a>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:translate-y-[-2px]">
          Login
        </button>
      </nav>

      {/* Hero Section - Redesigned to match reference */}
        <section className="relative z-10 container mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-screen">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/20"
            style={{
              width: `${Math.random() * 6 + 1}px`,
              height: `${Math.random() * 6 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `twinkle ${Math.random() * 8 + 5}s infinite ${Math.random() * 5}s`,
            }}
          />
            ))}
          </div>
          
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 animate-slide-up animation-delay-300">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 animate-slide-up animation-delay-600 animate-gradient">
              Sahyog
            </span>
          </div>
            </h1>
            <div className="overflow-hidden mb-8">
          <p className="text-gray-300 text-xl max-w-2xl mx-auto animate-slide-up animation-delay-900">
            Sahyog bridges the gap for underprivileged communities, providing AI-powered disaster response
            and resource optimization to help them overcome challenges. Join us in shaping the future.
          </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-in-delay animation-delay-1200">
          <button className="bg-blue-500 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-lg hover:shadow-blue-500/30">
            Go to Dashboard
          </button>
            </div>
          </AnimatedSection>
        </section>

        {/* Mission & Vision Section */}
      <section id="mission" className="relative z-10 bg-gray-900/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission & Vision</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto animate-width"></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <AnimatedSection className="order-2 md:order-1">
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-500 transform hover:translate-y-[-5px] hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="flex items-center mb-4">
                    <AlertCircle className="h-8 w-8 text-blue-500 mr-3 animate-pulse" />
                    <h3 className="text-2xl font-bold">Mission</h3>
                  </div>
                  <p className="text-gray-300">
                    To empower communities and authorities with an AI-driven, transparent, and efficient disaster
                    response platform that ensures timely intervention, optimized resource management, and real-time
                    coordination, ultimately minimizing the human and economic impact of disasters.
                  </p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-teal-500/50 transition-all duration-500 transform hover:translate-y-[-5px] hover:shadow-lg hover:shadow-teal-500/10">
                  <div className="flex items-center mb-4">
                    <Shield className="h-8 w-8 text-teal-500 mr-3 animate-pulse" />
                    <h3 className="text-2xl font-bold">Vision</h3>
                  </div>
                  <p className="text-gray-300">
                    To build a future where technology and humanity collaborate seamlessly to create resilient
                    communities, capable of anticipating, managing, and recovering from disasters swiftly and
                    effectively.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="order-1 md:order-2" delay={300}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-teal-500/30 rounded-2xl blur-lg animate-pulse"></div>
                <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gray-900/80">
                  <img
                    src="disaster.png?height=500&width=600"
                    alt="Disaster Response Team"
                    className="w-full h-auto rounded-2xl transform transition-all duration-1000 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-blue-500/20">
                      <h4 className="text-xl font-bold text-blue-400 mb-2">Empowering Communities</h4>
                      <p className="text-gray-300 text-sm">
                        Our technology bridges the gap between disaster response teams and affected communities.
                      </p>
                    </div>
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
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with practical disaster management tools to create a
              comprehensive solution for crisis response.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mt-6 animate-width"></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-500 transform hover:translate-y-[-5px] hover:shadow-lg hover:shadow-blue-500/10 group"
              >
                <div className="bg-gray-900/80 rounded-lg p-3 inline-block mb-4 group-hover:bg-blue-900/50 transition-colors duration-500">
                  <div className="transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Updated to remove roles and add social links */}
      <section id="team" className="relative z-10 bg-gray-900/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Meet the experts behind Sahyog who are dedicated to revolutionizing disaster management through technology
              and innovation.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mt-6 animate-width"></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden group transition-all duration-500 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-64 object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                </div>
                <div className="p-6 transform transition-transform duration-500 group-hover:translate-y-[-5px]">
                  <h3 className="text-xl font-bold mb-3">{member.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                  <div className="flex space-x-4 mt-4">
                    <a 
                      href={member.socials.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-125"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a 
                      href={member.socials.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:scale-125"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a 
                      href={member.socials.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 transform hover:scale-125"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
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
          <AnimatedSection className="bg-gradient-to-r from-blue-900/50 to-teal-900/50 backdrop-blur-sm rounded-2xl p-10 border border-blue-800/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/20 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-blue-500/10"
                  style={{
                    width: `${Math.random() * 300 + 50}px`,
                    height: `${Math.random() * 300 + 50}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.1,
                    animation: `float ${Math.random() * 10 + 10}s infinite ${Math.random() * 5}s ease-in-out`,
                  }}
                />
              ))}
            </div>
            <div className="text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                Ready to Transform Crisis Management?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in-delay">
                Join Sahyog today and be part of the revolution in disaster response and management.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-lg hover:shadow-blue-500/30 animate-bounce-in">
                Go to Dashboard
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <AnimatedSection>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-blue-500 mr-2 animate-pulse" />
                <span className="text-xl font-bold">Sahyog</span>
              </div>
              <p className="text-gray-400 mb-4">Cloud-Driven Crisis Management, Smarter & Faster</p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#mission"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Mission
                  </a>
                </li>
                <li>
                  <a
                    href="#team"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Team
                  </a>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Documentation
                  </a>
                </li>
               
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400 group">
                  <Mail className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors duration-300" />
                  <span className="group-hover:text-blue-400 transition-colors duration-300">contact@sahyog.com</span>
                </li>
                <li className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  123 Tech Park, Innovation Street
                </li>
                <li className="text-gray-400 hover:text-blue-400 transition-colors duration-300">New Delhi, India</li>
              </ul>
            </AnimatedSection>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Sahyog. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Add some global styles for animations */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(20px) translateX(10px); }
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
        
        .animate-bounce-right {
          animation: bounceRight 2s infinite;
        }
        
        @keyframes bounceRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        
        .animate-bounce-in {
          animation: bounceIn 1s;
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s forwards;
        }
        
        .animate-fade-in-delay {
          opacity: 0;
          animation: fadeIn 1s 0.3s forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        
        .animate-slide-up {
          animation: slideUp 0.8s forwards;
          transform: translateY(100%);
          opacity: 0;
        }
        
        @keyframes slideUp {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
        
        .animation-delay-1200 {
          animation-delay: 1.2s;
        }
      `}</style>
    </div>
  )
}

export default App