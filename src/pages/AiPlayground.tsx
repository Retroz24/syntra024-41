
import React from 'react';
import { ArrowRight } from 'lucide-react';

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
      status: "coming-soon"
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
      buttonColor: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
            Featured AI Tools
          </span>
          <h1 className="text-4xl font-bold mt-6 mb-4 text-navy-900">
            Explore Our AI Suite
          </h1>
          <p className="text-gray-600 text-lg">
            Built to help you build, collaborate, and grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
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

              {tool.status === "coming-soon" ? (
                <button disabled className="w-full py-2 px-4 bg-gray-200 text-gray-600 rounded-lg font-medium">
                  Coming Soon
                </button>
              ) : (
                <button className={`w-full py-2 px-4 ${tool.buttonColor} text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center group`}>
                  {tool.buttonText}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiPlayground;
