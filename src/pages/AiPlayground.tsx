
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const AiPlayground = () => {
  const aiTools = [
    {
      title: "AI Roadmap Tracker for Teams",
      description: "Create and assign roadmap steps to team members.",
      features: [
        "AI gives weekly reports, motivation messages",
        "Stack: React, Firebase, GPT-4",
        "Optional: Slack/Discord bot integration"
      ],
      buttonText: "Start Planning",
      buttonColor: "bg-purple-500"
    },
    {
      title: "ProjectPond",
      description: "Enter a startup/dev idea → AI generates a 7-day build plan.",
      features: [
        "Daily check-ins and resource curation",
        "Stack: React, GPT-4",
        "Optional: Collab with other builders per topic"
      ],
      buttonText: "Explore Tool",
      buttonColor: "bg-emerald-500"
    },
    {
      title: "AdSense Eligibility Checker",
      description: "Analyze website requirements for AdSense approval.",
      features: [
        "Get detailed reports on compliance status",
        "Stack: React, Analysis Engine",
        "Actionable recommendations to meet Google requirements"
      ],
      buttonText: "Check Eligibility",
      buttonColor: "bg-blue-500"
    },
    {
      title: "CodeHub",
      description: "Join study rooms by language or tech stack.",
      features: [
        "🔧 Auto-match based on interests",
        "💡 Real-time chat & mini AI helper",
        "🧠 Stack: React, Node.js, Firebase, OpenAI API",
        "🌀 Optional: Group voice feature"
      ],
      buttonText: "Join Room",
      buttonColor: "bg-orange-500"
    },
    {
      title: "AI Code Reviewer",
      description: "Get instant code reviews and suggestions.",
      features: [
        "Real-time code analysis",
        "Stack: React, OpenAI API",
        "Multiple language support",
        "Integration with GitHub"
      ],
      buttonText: "Review Code",
      buttonColor: "bg-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="relative pt-20 pb-12 overflow-hidden">
          <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-pulse-gradient opacity-20 blur-3xl rounded-full"></div>
          <div className="text-center mb-12">
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium inline-block mb-4 animate-fade-in">
              AI Tools Suite
            </span>
            <h1 className="text-4xl font-bold mt-6 mb-4 text-gray-900 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Supercharge Your Workflow
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Explore powerful and easy-to-use AI tools designed to enhance your development experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 hover:opacity-10 rounded-xl transition-opacity duration-300" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {tool.title}
                </h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-2 px-4 ${tool.buttonColor} text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group`}
                >
                  {tool.buttonText}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AiPlayground;
