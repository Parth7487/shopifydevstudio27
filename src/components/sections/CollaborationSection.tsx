import { memo, useState } from "react";
import CalendlyModal from "./CalendlyModal";
import { Star, Users, Award, TrendingUp } from "lucide-react";
import { useTestimonials } from "../../hooks/useTestimonials";

const CollaborationSection = memo(() => {
  const { testimonials } = useTestimonials();
  const collaborations = testimonials.map((t) => ({
    name: t.author,
    role: t.role,
    company: t.company,
    image: t.avatar || "",
    quote: t.quote,
    achievement: t.metric || "",
    verified: t.verified,
  }));

  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom right, var(--theme-bg), var(--theme-bg-subtle))" }}></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-beige to-clay bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl theme-text-sec max-w-3xl mx-auto">
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
              className="theme-card backdrop-blur-sm border theme-border rounded-2xl p-8 hover:border-beige/40 transition-colors duration-300"
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
                  <h3 className="text-xl font-bold theme-text mb-1">
                    {collab.name}
                  </h3>
                  <p className="text-beige text-sm mb-1">{collab.role}</p>
                  <p className="theme-text-muted text-sm mb-4">{collab.company}</p>

                  <blockquote className="theme-text-sec italic mb-4">
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
          <h3 className="text-2xl font-bold theme-text mb-4">
            Ready to Join Our Network of Success Stories?
          </h3>
          <p className="theme-text-sec mb-8 max-w-2xl mx-auto">
            Connect with industry leaders and be part of a collaborative
            ecosystem that's shaping the future of e-commerce.
          </p>
          <button
            onClick={() => {
              const url = (import.meta as any).env?.VITE_CALENDLY_URL as
                | string
                | undefined;
              if (url) {
                setCalendlyOpen(true);
              } else {
                window.location.hash = "#contact";
              }
            }}
            className="bg-gradient-to-r from-beige to-clay text-black font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300"
          >
            Start Your Project
          </button>
        </div>
      </div>
      <CalendlyModal
        open={
          calendlyOpen && Boolean((import.meta as any).env?.VITE_CALENDLY_URL)
        }
        onClose={() => setCalendlyOpen(false)}
      />
    </section>
  );
});

CollaborationSection.displayName = "CollaborationSection";

export default CollaborationSection;
