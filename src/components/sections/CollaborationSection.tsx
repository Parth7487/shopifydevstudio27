import { memo, useState } from "react";
import CalendlyModal from "./CalendlyModal";
import { Star, Users, Award, TrendingUp } from "lucide-react";

const CollaborationSection = memo(() => {
  const collaborations = [
    {
      name: "Nishkarsh Sharma",
      role: "Shopify Expert & E-commerce Strategist",
      company: "ShopifyGuru",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F3e2a9c87960747af8e9e7482187724be?format=webp&width=800",
      quote:
        "Their technical expertise and attention to detail is unmatched in the Shopify ecosystem.",
      achievement: "150+ Stores Optimized",
      verified: true,
    },
    {
      name: "David Fogarty",
      role: "E-commerce Growth Expert",
      company: "The Oodie",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fcd04eccfd8634e46bc9795fd561e4428?format=webp&width=800",
      quote:
        "Working with this team has been instrumental in scaling our operations efficiently.",
      achievement: "$100M+ Revenue Generated",
      verified: true,
    },
    {
      name: "Sarah Chen",
      role: "UX/UI Design Lead",
      company: "Figma Community",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F2db76c02fb2f4424869be58cff012b97?format=webp&width=800",
      quote:
        "Their design implementation perfectly captures our vision while maintaining performance.",
      achievement: "50K+ Design Downloads",
      verified: true,
    },
    {
      name: "Marcus Williams",
      role: "Performance Optimization Specialist",
      company: "ShopifyPlus Partner",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F12b9f370a7b141828551d29b95ea5b8e?format=webp&width=800",
      quote:
        "They consistently deliver lightning-fast stores that convert at industry-leading rates.",
      achievement: "40% Average Speed Increase",
      verified: true,
    },
  ];


  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-charcoal to-graphite"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-beige to-clay bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We collaborate with the world's top Shopify experts, designers, and
            e-commerce professionals to deliver exceptional results that drive
            real business growth.
          </p>
        </div>


        {/* Collaborations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collaborations.map((collab, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-charcoal/50 to-graphite/50 backdrop-blur-sm border border-beige/20 rounded-2xl p-8 hover:border-beige/40 transition-colors duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    src={collab.image}
                    alt={collab.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-beige/30"
                    loading="lazy"
                  />
                  {collab.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {collab.name}
                  </h3>
                  <p className="text-beige text-sm mb-1">{collab.role}</p>
                  <p className="text-gray-400 text-sm mb-4">{collab.company}</p>

                  <blockquote className="text-gray-300 italic mb-4">
                    "{collab.quote}"
                  </blockquote>

                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-beige/10 rounded-full">
                    <Award className="w-4 h-4 text-beige" />
                    <span className="text-beige text-sm font-medium">
                      {collab.achievement}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Join Our Network of Success Stories?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with industry leaders and be part of a collaborative
            ecosystem that's shaping the future of e-commerce.
          </p>
          <button onClick={() => { const url = (import.meta as any).env?.VITE_CALENDLY_URL as string | undefined; if (url) { setCalendlyOpen(true); } else { window.location.hash = "#contact"; } }} className="bg-gradient-to-r from-beige to-clay text-black font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300">
              Start Your Project
            </button>
        </div>
      </div>
      <CalendlyModal open={calendlyOpen && Boolean((import.meta as any).env?.VITE_CALENDLY_URL)} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
});

CollaborationSection.displayName = "CollaborationSection";

export default CollaborationSection;
