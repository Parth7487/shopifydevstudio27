import { motion } from "framer-motion";

const DesignPlayground = () => {
  // Optimized floating elements - fewer elements for faster initial render
  const floatingElements = [
    {
      left: "38.5105%",
      top: "75.4046%",
      opacity: 0.128467,
      size: "8px",
      rotation: 22.0383,
    },
    {
      left: "84.3028%",
      top: "4.91819%",
      opacity: 0.724053,
      size: "12px",
      rotation: 66.0399,
    },
    {
      left: "88.688%",
      top: "40.9173%",
      opacity: 0.474498,
      size: "10px",
      rotation: 75.8884,
    },
    {
      left: "16.6556%",
      top: "2.3638%",
      opacity: 0.12975,
      size: "6px",
      rotation: 22.2243,
    },
    {
      left: "8.74881%",
      top: "84.8744%",
      opacity: 0.614129,
      size: "14px",
      rotation: 56.9744,
    },
    {
      left: "38.8267%",
      top: "37.7258%",
      opacity: 0.368635,
      size: "16px",
      rotation: 59.7224,
    },
    {
      left: "86.4664%",
      top: "34.5927%",
      opacity: 0.844311,
      size: "18px",
      rotation: 75.2488,
    },
    {
      left: "75.7388%",
      top: "6.20535%",
      opacity: 0.308915,
      size: "8px",
      rotation: 29.9017,
    },
    {
      left: "96.4265%",
      top: "7.96108%",
      opacity: 0.740259,
      size: "15px",
      rotation: 67.2909,
    },
    {
      left: "34.4352%",
      top: "27.1708%",
      opacity: 0.938832,
      size: "22px",
      rotation: 81.9776,
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute bg-beige/20 rounded-full"
          style={{
            left: element.left,
            top: element.top,
            width: element.size,
            height: element.size,
            transform: `rotate(${element.rotation}deg)`,
            filter: "blur(0.8px)",
            boxShadow: `0 0 ${parseInt(element.size) * 2}px rgba(230, 177, 126, ${element.opacity * 0.3})`,
            willChange: "transform, opacity", // Optimize for GPU acceleration
          }}
          animate={{
            y: [0, -15 - index * 1.5, 0],
            x: [0, 6 + Math.sin(index) * 3, 0],
            opacity: [
              Math.max(element.opacity * 0.6, 0.1),
              Math.max(element.opacity * 1.2, 0.3),
              Math.max(element.opacity * 0.6, 0.1),
            ],
            scale: [1, 1.2 + index * 0.05, 1],
          }}
          transition={{
            duration: 4 + index * 0.2,
            repeat: Infinity,
            ease: "linear", // Simpler easing for better performance
            delay: index * 0.1,
          }}
        />
      ))}

      {/* Additional background glow effects - simplified */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-beige/3 via-transparent to-transparent"
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          willChange: "opacity",
        }}
      />
    </div>
  );
};

export default DesignPlayground;
