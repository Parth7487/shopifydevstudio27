import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "@/components/ui/image-comparison";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Zap,
  Users,
  ChevronDown,
  Grid,
  List,
  Filter,
  Layers,
  Eye,
  Download,
  Share2,
} from "lucide-react";
import {
  fadeInUpVariants,
  staggerContainerVariants,
} from "../../hooks/use-scroll-reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ImageComparisonSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const comparisons = [
    {
      id: "1",
      title: "E-commerce Store Transformation",
      description: "From cluttered mess to conversion machine",
      category: "E-commerce",
      industry: "Retail",
      beforeImage:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&sat=-100&bri=-50",
      afterImage:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      date: "2024-01-15",
      featured: true,
      metrics: [
        { icon: TrendingUp, label: "Conversion Rate", value: "+340%" },
        { icon: Zap, label: "Load Time", value: "-75%" },
        { icon: Users, label: "User Engagement", value: "+250%" },
      ],
    },
    {
      id: "2",
      title: "SaaS Platform Redesign",
      description: "From complex to intuitive user experience",
      category: "SaaS",
      industry: "Technology",
      beforeImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&sat=-100&bri=-50",
      afterImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      date: "2024-01-10",
      featured: false,
      metrics: [
        { icon: Users, label: "User Retention", value: "+180%" },
        { icon: TrendingUp, label: "Feature Adoption", value: "+220%" },
        { icon: Zap, label: "Task Completion", value: "+95%" },
      ],
    },
    {
      id: "3",
      title: "Mobile App Interface",
      description: "From outdated to cutting-edge design",
      category: "Mobile App",
      industry: "Technology",
      beforeImage:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&sat=-100&bri=-50",
      afterImage:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
      date: "2024-01-05",
      featured: true,
      metrics: [
        { icon: Users, label: "App Store Rating", value: "+45%" },
        { icon: TrendingUp, label: "Daily Active Users", value: "+160%" },
        { icon: Zap, label: "Session Duration", value: "+120%" },
      ],
    },
    {
      id: "4",
      title: "Fashion Brand Homepage",
      description: "Luxury aesthetic with conversion focus",
      category: "Fashion",
      industry: "Fashion",
      beforeImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&sat=-100&bri=-50",
      afterImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      date: "2023-12-20",
      featured: false,
      metrics: [
        { icon: TrendingUp, label: "Sales", value: "+420%" },
        { icon: Users, label: "Brand Perception", value: "+85%" },
        { icon: Zap, label: "Page Speed", value: "+90%" },
      ],
    },
    {
      id: "5",
      title: "Restaurant Website Redesign",
      description: "From basic to sophisticated dining experience",
      category: "Restaurant",
      industry: "Food & Beverage",
      beforeImage:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop&sat=-100&bri=-50",
      afterImage:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop",
      date: "2023-12-15",
      featured: false,
      metrics: [
        { icon: TrendingUp, label: "Reservations", value: "+280%" },
        { icon: Users, label: "Online Orders", value: "+195%" },
        { icon: Zap, label: "Mobile Performance", value: "+150%" },
      ],
    },
    {
      id: "6",
      title: "Healthcare Platform UI",
      description: "Patient-centered design transformation",
      category: "Healthcare",
      industry: "Healthcare",
      beforeImage:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&sat=-100&bri=-50",
      afterImage:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      date: "2023-12-10",
      featured: true,
      metrics: [
        { icon: Users, label: "Patient Satisfaction", value: "+210%" },
        { icon: TrendingUp, label: "Appointment Bookings", value: "+165%" },
        { icon: Zap, label: "System Efficiency", value: "+140%" },
      ],
    },
  ];

  const categories = [
    "All",
    "E-commerce",
    "SaaS",
    "Mobile App",
    "Fashion",
    "Restaurant",
    "Healthcare",
  ];

  const filteredComparisons = comparisons
    .filter(
      (comparison) =>
        selectedCategory === "All" || comparison.category === selectedCategory,
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "featured")
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });

  return (
    <section className="py-24 px-8 bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-charcoal/10 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,177,126,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainerVariants}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUpVariants}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            See the <span className="text-beige">Transformation</span>
          </motion.h2>
          <motion.p
            variants={fadeInUpVariants}
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8"
          >
            Drag the slider to reveal the dramatic before and after results of
            our work. These aren't just redesigns – they're complete digital
            transformations.
          </motion.p>

          {/* Enhanced Controls with Animated Dropdowns */}
          <motion.div
            variants={fadeInUpVariants}
            className="flex flex-wrap items-center justify-center gap-4 mb-8"
          >
            {/* Category Dropdown */}
            <div className="relative group">
              <Button
                variant="outline"
                className="bg-charcoal/50 border-beige/20 text-beige hover:bg-beige/10 flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Category: {selectedCategory}</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </Button>

              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 0, y: -10, scale: 0.95 }}
                whileHover={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute top-full left-0 mt-2 w-48 bg-charcoal border border-beige/20 rounded-lg shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <div className="p-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors duration-200 flex items-center justify-between ${
                        selectedCategory === category
                          ? "bg-beige text-black"
                          : "text-white hover:bg-beige/10"
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{category}</span>
                      {selectedCategory === category && (
                        <Eye className="w-4 h-4" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <Button
                variant="outline"
                className="bg-charcoal/50 border-beige/20 text-beige hover:bg-beige/10 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span>
                  Sort:{" "}
                  {sortBy === "newest"
                    ? "Newest"
                    : sortBy === "oldest"
                      ? "Oldest"
                      : "Featured"}
                </span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </Button>

              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 0, y: -10, scale: 0.95 }}
                whileHover={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute top-full left-0 mt-2 w-40 bg-charcoal border border-beige/20 rounded-lg shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <div className="p-2">
                  {[
                    { value: "newest", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                    { value: "featured", label: "Featured First" },
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors duration-200 ${
                        sortBy === option.value
                          ? "bg-beige text-black"
                          : "text-white hover:bg-beige/10"
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-beige/20 rounded-lg overflow-hidden">
              <Button
                onClick={() => setViewMode("grid")}
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className={`${viewMode === "grid" ? "bg-beige text-black" : "text-beige hover:bg-beige/10"} border-none`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className={`${viewMode === "list" ? "bg-beige text-black" : "text-beige hover:bg-beige/10"} border-none`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-400">
              Showing {filteredComparisons.length} transformation
              {filteredComparisons.length !== 1 ? "s" : ""}
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Image Comparisons Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${sortBy}-${viewMode}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`grid gap-8 ${
              viewMode === "grid"
                ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {filteredComparisons.map((comparison, index) => (
              <motion.div
                key={comparison.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Featured Badge */}
                {comparison.featured && (
                  <Badge className="absolute top-4 left-4 z-10 bg-beige text-black">
                    Featured
                  </Badge>
                )}

                {/* Action Dropdown */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="relative group/dropdown">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-black/80 backdrop-blur-sm border border-beige/20 text-beige hover:bg-beige/10"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>

                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 0, y: -10, scale: 0.95 }}
                      whileHover={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute top-full right-0 mt-2 w-40 bg-charcoal border border-beige/20 rounded-lg shadow-xl opacity-0 group-hover/dropdown:opacity-100 transition-all duration-300"
                    >
                      <div className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-left text-white hover:bg-beige/10 justify-start"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-left text-white hover:bg-beige/10 justify-start"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-left text-white hover:bg-beige/10 justify-start"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Image Comparison */}
                <div className="relative mb-6">
                  <ImageComparison
                    className={`w-full ${viewMode === "grid" ? "h-80" : "h-96"} rounded-2xl overflow-hidden border border-gray-800 group-hover:border-beige/30 transition-colors duration-300`}
                  >
                    <ImageComparisonImage
                      src={comparison.beforeImage}
                      alt={`${comparison.title} - Before`}
                      side="before"
                    />
                    <ImageComparisonImage
                      src={comparison.afterImage}
                      alt={`${comparison.title} - After`}
                      side="after"
                    />
                    <ImageComparisonSlider />
                  </ImageComparison>

                  {/* Labels */}
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium text-white">
                    Before
                  </div>
                  <div className="absolute bottom-4 right-4 bg-beige/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium text-black">
                    After
                  </div>

                  {/* Instruction */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-gray-300 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Drag to reveal</span>
                    <ArrowRight className="w-3 h-3" />
                  </motion.div>
                </div>

                {/* Content */}
                <div
                  className={`space-y-4 ${viewMode === "list" ? "flex flex-col lg:flex-row lg:items-start lg:gap-8" : ""}`}
                >
                  <div className={`${viewMode === "list" ? "lg:flex-1" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-beige transition-colors duration-300">
                        {comparison.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {comparison.category}
                      </Badge>
                    </div>

                    <p className="text-gray-400 mb-4">
                      {comparison.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <span className="bg-charcoal/30 px-2 py-1 rounded">
                        {comparison.industry}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(comparison.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div
                    className={`grid ${viewMode === "list" ? "grid-cols-3 lg:w-80" : "grid-cols-3"} gap-4`}
                  >
                    {comparison.metrics.map((metric, metricIndex) => {
                      const IconComponent = metric.icon;
                      return (
                        <motion.div
                          key={metricIndex}
                          className="text-center p-3 bg-charcoal/30 rounded-lg border border-gray-800 hover:border-beige/30 transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          <IconComponent className="w-5 h-5 text-beige mx-auto mb-2" />
                          <div className="text-xs text-gray-400 mb-1">
                            {metric.label}
                          </div>
                          <div className="text-lg font-bold text-beige">
                            {metric.value}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredComparisons.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">
              No transformations found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters to see more results.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("All");
                setSortBy("newest");
              }}
              className="elegant-button"
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
