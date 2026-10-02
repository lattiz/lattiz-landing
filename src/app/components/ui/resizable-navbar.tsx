"use client";

import React, { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/app/components/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: ReadonlyArray<{ name: string; link: string }>;
  className?: string;
  onItemClick?: () => void;
  onNavItemClick?: (link: string) => void;
  isVisible?: boolean;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
  openLabel: string;
  closeLabel: string;
}

interface NavbarLogoProps {
  logo: string;
  brand: string;
  a11yLabel: string;
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-20 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ visible?: boolean }>, { visible })
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => (
  <motion.div
    animate={{
      backdropFilter: visible ? "blur(10px)" : "none",
      boxShadow: visible
        ? "0 0 24px rgba(34,42,53,0.06),0 1px 1px rgba(0,0,0,0.05),0 0 0 1px rgba(34,42,53,0.04),0 0 4px rgba(34,42,53,0.08),0 16px 68px rgba(47,48,55,0.05),0 1px 0 rgba(255,255,255,0.1) inset"
        : "none",
      width: visible ? "40%" : "100%",
      y: visible ? 20 : 0,
    }}
    transition={{ type: "spring", stiffness: 200, damping: 50 }}
    style={{ minWidth: "800px" }}
    className={cn("relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full px-4 py-2 lg:flex", visible ? "bg-black/50" : "bg-transparent", className)}
  >
    {children}
  </motion.div>
);

export const NavItems = ({ items, className, onItemClick, onNavItemClick, isVisible }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    onNavItemClick?.(link);
    onItemClick?.();
  };


  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-end last:mr-8 space-x-2 text-sm font-medium duration-200 lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <button
          key={`link-${idx}`}
          type="button"
          onMouseEnter={() => setHovered(idx)}
          onClick={(e) => handleClick(e, item.link)}
          className={`relative px-4 py-2 bg-transparent border-none cursor-pointer" hover:text-white transition-colors`}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-white/10"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </button>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => (
  <motion.div
    animate={{
      backdropFilter: visible ? "blur(10px)" : "none",
      boxShadow: visible
        ? "0 0 24px rgba(34,42,53,0.06),0 1px 1px rgba(0,0,0,0.05),0 0 0 1px rgba(34,42,53,0.04),0 0 4px rgba(34,42,53,0.08),0 16px 68px rgba(47,48,55,0.05),0 1px 0 rgba(255,255,255,0.1) inset"
        : "none",
      width: visible ? "90%" : "100%",
      paddingRight: visible ? "12px" : "0px",
      paddingLeft: visible ? "12px" : "0px",
      borderRadius: visible ? "4px" : "2rem",
      y: visible ? 20 : 0,
    }}
    transition={{ type: "spring", stiffness: 200, damping: 50 }}
    className={cn(
      "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-primary/50 px-0 py-2 lg:hidden",
      className,
    )}
  >
    {children}
  </motion.div>
);

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => (
  <div className={cn("flex w-full flex-row items-center justify-between px-6", className)}>
    {children}
  </div>
);

export const MobileNavMenu = ({ children, className, isOpen, onClose: _onClose }: MobileNavMenuProps) => (
  <div>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "absolute inset-x-0 top-16 z-999 flex w-full flex-col items-start justify-start gap-4 rounded-lg px-4 py-8 shadow-xl bg-primary/50  text-foreground lg:hidden",
          className,
        )}
      >
        {children}
      </motion.div>
    )}
  </div>
);

export const MobileNavToggle = ({
  isOpen,
  onClick,
  openLabel,
  closeLabel,
}: MobileNavToggleProps) =>
  isOpen ? (
    <button
      type="button"
      aria-label={closeLabel}
      onClick={onClick}
      className="text-white cursor-pointer"
    >
      <X className="size-6" color="white" />
    </button>
  ) : (
    <button
      type="button"
      aria-label={openLabel}
      onClick={onClick}
      className="text-white cursor-pointer"
    >
      <Menu className="size-6" color="white" />
    </button>
  );

export const NavbarLogo = ({ logo, brand, a11yLabel }: NavbarLogoProps) => (
  <a
    href="#"
    aria-label={a11yLabel}
    className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
  >
    <img src={logo} alt="" aria-hidden="true" width={30} height={30} />
    <span className="font-medium text-[#FFF]">{brand}</span>
  </a>
);

