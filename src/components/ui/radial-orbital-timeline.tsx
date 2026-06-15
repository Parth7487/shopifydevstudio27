"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Performance Optimization: Use refs for animation to bypass React re-renders
  const rotationAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number | null>(null);

  // Dynamic responsive width
  const [containerWidth, setContainerWidth] = useState<number>(800);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isMobile = containerWidth < 640;
  const radius = isMobile ? 105 : containerWidth < 768 ? 140 : 200;

  const updatePositions = () => {
    timelineData.forEach((item, index) => {
      const nodeEl = nodeRefs.current[item.id];
      if (!nodeEl) return;
      
      const angle = ((index / timelineData.length) * 360 + rotationAngleRef.current) % 360;
      const radian = (angle * Math.PI) / 180;
      
      const x = radius * Math.cos(radian);
      const y = radius * Math.sin(radian);
      
      // Update DOM styles directly for maximum rendering performance (60fps+)
      nodeEl.style.transform = `translate(${x}px, ${y}px)`;
      
      const zIndex = Math.round(100 + 50 * Math.cos(radian));
      const opacity = Math.max(
        0.5,
        Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2))
      );
      
      nodeEl.style.zIndex = String(zIndex);
      nodeEl.style.opacity = String(opacity);
    });
  };

  // Run the direct-DOM animation loop
  useEffect(() => {
    let animId: number;
    
    const tick = () => {
      if (autoRotate) {
        rotationAngleRef.current = (rotationAngleRef.current + 0.15) % 360;
        updatePositions();
      } else if (targetAngleRef.current !== null) {
        let diff = targetAngleRef.current - rotationAngleRef.current;
        
        // Shortest path interpolation
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        
        if (Math.abs(diff) > 0.05) {
          rotationAngleRef.current = (rotationAngleRef.current + diff * 0.08) % 360;
          updatePositions();
        } else {
          rotationAngleRef.current = targetAngleRef.current;
          updatePositions();
          targetAngleRef.current = null;
        }
      }
      animId = requestAnimationFrame(tick);
    };
    
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate, radius]);

  // Initial layout calculation
  useEffect(() => {
    updatePositions();
  }, [radius]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target === containerRef.current || 
      e.target === orbitRef.current ||
      (orbitRef.current && orbitRef.current.contains(e.target as Node) && !(e.target as HTMLElement).closest(".timeline-node"))
    ) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    let target = (270 - (nodeIndex / totalNodes) * 360) % 360;
    
    // Normalize target angle
    while (target < 0) target += 360;
    targetAngleRef.current = target;
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "bg-beige text-black border-none";
      case "in-progress":
        return "bg-transparent text-beige border border-beige/40";
      case "pending":
        return "bg-transparent text-gray-500 border border-gray-700";
      default:
        return "bg-transparent text-gray-500 border border-gray-700";
    }
  };

  const getCardClassNameAndIndicator = (x: number) => {
    const base = "absolute w-60 sm:w-64 bg-charcoal/95 backdrop-blur-xl border-beige/30 shadow-2xl shadow-black/60 overflow-visible z-50 ";
    
    if (x < -60) {
      return {
        className: base + "top-[-50px] left-12",
        indicator: <div className="absolute top-12 -left-3 w-3 h-px bg-beige/40"></div>
      };
    } else if (x > 60) {
      return {
        className: base + "top-[-50px] right-12",
        indicator: <div className="absolute top-12 -right-3 w-3 h-px bg-beige/40"></div>
      };
    } else {
      return {
        className: base + "top-14 left-1/2 -translate-x-1/2",
        indicator: <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-beige/40"></div>
      };
    }
  };

  const renderCardContent = (item: TimelineItem) => {
    return (
      <>
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex justify-between items-center">
            <Badge
              className={`px-2 py-0.5 text-[9px] font-bold tracking-wider rounded-md uppercase ${getStatusStyles(
                item.status
              )}`}
            >
              {item.status === "completed"
                ? "Completed"
                : item.status === "in-progress"
                ? "In Progress"
                : "Pending"}
            </Badge>
            <span className="text-[10px] font-mono text-beige/60">
              {item.date}
            </span>
          </div>
          <CardTitle className="text-sm mt-2 font-bold text-white leading-tight">
            {item.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-300 pb-4 px-4">
          <p className="leading-relaxed">{item.content}</p>

          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="flex items-center text-gray-400">
                <Zap size={9} className="mr-1 text-beige" />
                Completion Focus
              </span>
              <span className="font-mono text-beige font-semibold">{item.energy}%</span>
            </div>
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-clay to-beige"
                style={{ width: `${item.energy}%` }}
              ></div>
            </div>
          </div>

          {item.relatedIds.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700/50">
              <div className="flex items-center mb-1.5">
                <Link size={9} className="text-beige/70 mr-1" />
                <h4 className="text-[9px] uppercase tracking-wider font-semibold text-beige/70">
                  Connected Steps
                </h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.relatedIds.map((relatedId) => {
                  const relatedItem = timelineData.find(
                    (i) => i.id === relatedId
                  );
                  return (
                    <Button
                      key={relatedId}
                      variant="outline"
                      size="sm"
                      className="flex items-center h-5 px-1.5 py-0 text-[9px] rounded-md border-beige/25 bg-transparent hover:bg-beige/10 text-gray-300 hover:text-white transition-all font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItem(relatedId);
                      }}
                    >
                      {relatedItem?.title}
                      <ArrowRight
                        size={7}
                        className="ml-1 text-beige/60"
                      />
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </>
    );
  };

  return (
    <div
      className={`w-full flex flex-col items-center bg-black/45 backdrop-blur-md border-y border-beige/10 overflow-hidden relative select-none ${
        isMobile ? "h-auto pt-6" : "h-[650px] justify-center"
      }`}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className={`relative w-full max-w-4xl flex items-center justify-center ${
        isMobile ? "h-[320px]" : "h-full"
      }`}>
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
          }}
        >
          {/* Central Sun Node with custom Warm Brand Colors */}
          <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-beige via-clay to-yellow-600 animate-pulse flex items-center justify-center z-10 shadow-lg shadow-beige/20">
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-beige/25 animate-ping opacity-60"></div>
            <div
              className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-beige/10 animate-ping opacity-35"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/80 backdrop-blur-md border border-beige/20 flex items-center justify-center">
              <Zap size={10} className="text-beige animate-pulse" />
            </div>
          </div>

          {/* Dynamic Orbit Track Line */}
          <div 
            className="absolute rounded-full border border-beige/5"
            style={{ 
              width: `${radius * 2}px`, 
              height: `${radius * 2}px`,
              transition: "width 0.5s ease, height 0.5s ease"
            }}
          ></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              zIndex: isExpanded ? 200 : position.zIndex,
            };

            const cardConfig = getCardClassNameAndIndicator(position.x);

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer flex items-center justify-center timeline-node will-change-transform"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Glowing Outer energy field */}
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(230,177,126,0.15) 0%, rgba(230,177,126,0) 70%)`,
                    width: `${item.energy * 0.4 + 35}px`,
                    height: `${item.energy * 0.4 + 35}px`,
                  }}
                ></div>

                {/* Node Button */}
                <div
                  className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                  ${
                    isExpanded
                      ? "bg-beige text-black"
                      : isRelated
                      ? "bg-beige/40 text-black"
                      : "bg-charcoal text-beige"
                  }
                  border
                  ${
                    isExpanded
                      ? "border-beige shadow-lg shadow-beige/40 scale-125"
                      : isRelated
                      ? "border-beige animate-pulse"
                      : "border-beige/30"
                  }
                  hover:border-beige hover:scale-110
                  transition-all duration-300 transform
                `}
                >
                  <Icon size={isExpanded ? 18 : 16} />
                </div>

                {/* Node Title - Wrapped and centered to prevent screen overflow */}
                <div
                  className={`
                  absolute top-10 text-center w-20 sm:w-28 -left-10 sm:-left-14
                  transition-all duration-300 select-none pointer-events-none
                `}
                >
                  <span className={`
                    text-[9px] sm:text-xs font-semibold tracking-wider block whitespace-normal leading-tight
                    ${isExpanded ? "text-beige scale-105 font-bold" : "text-gray-400"}
                  `}>
                    {item.title}
                  </span>
                </div>

                {/* Desktop/Tablet Details Card (Float relative to node) */}
                {!isMobile && isExpanded && (
                  <Card className={cardConfig.className}>
                    {cardConfig.indicator}
                    {renderCardContent(item)}
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Details Card (Stacked below the orbit view) */}
      {isMobile && activeNodeId !== null && (() => {
        const activeItem = timelineData.find(item => item.id === activeNodeId);
        if (!activeItem) return null;
        return (
          <div className="w-full px-6 pb-6 z-10">
            <Card className="w-full bg-charcoal/95 border-beige/30 shadow-xl overflow-visible">
              {renderCardContent(activeItem)}
            </Card>
          </div>
        );
      })()}
    </div>
  );
}
