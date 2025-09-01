import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import {
  fadeInUpVariants,
  staggerContainerVariants,
} from "../hooks/use-scroll-reveal";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Shopify Conversion Optimization Techniques",
      excerpt:
        "Discover proven strategies to boost your store's conversion rate and maximize revenue from every visitor.",
      author: "Sarah Chen",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "Conversion",
      image: "/api/placeholder/600/400",
      featured: true,
    },
    {
      id: 2,
      title: "The Psychology Behind Color Choices in E-commerce",
      excerpt:
        "Learn how different colors can influence purchasing decisions and create emotional connections with customers.",
      author: "Michael Torres",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Design",
      image: "/api/placeholder/600/400",
    },
    {
      id: 3,
      title: "Mobile-First Design: Why It Matters More Than Ever",
      excerpt:
        "With mobile traffic dominating e-commerce, discover why mobile-first design is crucial for success.",
      author: "Emma Rodriguez",
      date: "Dec 5, 2024",
      readTime: "5 min read",
      category: "Mobile",
      image: "/api/placeholder/600/400",
    },
    {
      id: 4,
      title: "Speed Optimization: Making Your Shopify Store Lightning Fast",
      excerpt:
        "Technical strategies to improve your store's loading speed and provide better user experience.",
      author: "David Kim",
      date: "Nov 28, 2024",
      readTime: "10 min read",
      category: "Performance",
      image: "/api/placeholder/600/400",
    },
    {
      id: 5,
      title: "A/B Testing Your Way to Better Conversions",
      excerpt:
        "Data-driven approach to testing different elements and improving your store's performance.",
      author: "Lisa Zhang",
      date: "Nov 20, 2024",
      readTime: "7 min read",
      category: "Testing",
      image: "/api/placeholder/600/400",
    },
    {
      id: 6,
      title: "Trust Signals That Actually Convert Visitors",
      excerpt:
        "Build customer confidence with these proven trust-building elements for your e-commerce store.",
      author: "James Wilson",
      date: "Nov 15, 2024",
      readTime: "6 min read",
      category: "Trust",
      image: "/api/placeholder/600/400",
    },
  ];

  const categories = [
    "All",
    "Conversion",
    "Design",
    "Mobile",
    "Performance",
    "Testing",
    "Trust",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <ElegantNavigation />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeInUpVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6"
          >
            <span>Shopify Growth </span>
            <span className="text-beige">Insights</span>
          </motion.h1>
          <motion.p
            variants={fadeInUpVariants}
            className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto"
          >
            Expert insights, proven strategies, and actionable tips to help your
            Shopify store achieve better conversions and higher revenue.
          </motion.p>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  category === "All"
                    ? "bg-beige text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainerVariants}
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.h2
              variants={fadeInUpVariants}
              className="text-2xl font-bold mb-8 text-center"
            >
              Featured Article
            </motion.h2>
            <motion.div
              variants={fadeInUpVariants}
              className="bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-2xl overflow-hidden hover:border-beige/20 transition-all duration-300"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-beige text-black text-xs font-medium px-3 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-beige/10 text-beige text-xs font-medium px-2 py-1 rounded-full">
                      {blogPosts[0].category}
                    </span>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{blogPosts[0].date}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {blogPosts[0].title}
                  </h3>
                  <p className="text-gray-400 mb-6">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">
                        {blogPosts[0].author}
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400 text-sm">
                        {blogPosts[0].readTime}
                      </span>
                    </div>
                    <button className="flex items-center gap-2 text-beige hover:text-beige/80 transition-colors">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainerVariants}
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeInUpVariants}
              className="text-2xl font-bold mb-12 text-center"
            >
              Latest Articles
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={fadeInUpVariants}
                  className="bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-2xl overflow-hidden hover:border-beige/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-beige/10 text-beige text-xs font-medium px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                      <span className="text-gray-600">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 group-hover:text-beige transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">
                          {post.author}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-beige opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-charcoal/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainerVariants}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={fadeInUpVariants}
            className="bg-gradient-to-r from-beige/10 to-clay/10 border border-beige/20 rounded-2xl p-8"
          >
            <motion.h2
              variants={fadeInUpVariants}
              className="text-2xl sm:text-3xl font-bold mb-4"
            >
              Never Miss an <span className="text-beige">Update</span>
            </motion.h2>
            <motion.p
              variants={fadeInUpVariants}
              className="text-gray-400 mb-6 max-w-2xl mx-auto"
            >
              Get the latest Shopify optimization tips, case studies, and expert
              insights delivered straight to your inbox.
            </motion.p>
            <motion.div
              variants={fadeInUpVariants}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-charcoal border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-beige focus:outline-none"
              />
              <button className="px-6 py-3 bg-beige text-black font-semibold rounded-lg hover:bg-beige/90 transition-colors">
                Subscribe
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
