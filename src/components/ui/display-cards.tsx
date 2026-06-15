"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

export function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-beige" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Verified",
  iconClassName,
  titleClassName,
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[19rem] sm:w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-beige/10 bg-charcoal/90 backdrop-blur-md px-5 py-4 transition-all duration-700 hover:border-beige/30 hover:bg-charcoal/95 [&>*]:flex [&>*]:items-center [&>*]:gap-2 shadow-lg shadow-black/40",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn("relative inline-block rounded-full bg-beige/10 p-1.5 text-beige", iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-base font-bold text-white tracking-wide", titleClassName)}>{title}</p>
      </div>
      <p className="text-gray-300 text-sm sm:text-base leading-snug">{description}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-[10px] uppercase font-mono tracking-wider text-beige/60">{date}</p>
      </div>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-12 translate-y-8 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-24 translate-y-16 hover:translate-y-8",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700 py-12">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
