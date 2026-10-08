"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { X, Menu, Home } from "lucide-react"
import Image from "next/image";
import { link } from "fs";

const navItemVariants: Variants = {
  hidden: {
    opacity: 0,
    transform: "translate3d(0, -20px, 0)",
  },
  visible: (index: number) => ({
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
    transition: {
      delay: 0.2 + index * 0.1,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const navbarVariants: Variants = {
  hidden: {
    transform: "translate3d(-50%, -100px, 0)",
  },
  visible: {
    transform: "translate3d(-50%, 0, 0)",
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Section links point at the home page so they also work from /templates.
// #contact is the footer, present on every page.
const links = [
  {
    link: "Inicio",
    href: "/"
  },
  {
    link: "Plantillas",
    href: "/templates"
  },
  {
    link: "Precios",
    href: "/#pricing"
  },
  {
    link: "Preguntas frecuentes",
    href: "/#faq"
  },
  {
    link: "contacto",
    href: "#contact"
  },
]

export const Navbar: React.FC = () => {
  // Estado para el ancho de la ventana
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);

  };
  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const renderLogo = () => {
    return (
      <a href="#Inicio" className="w-fit" key="logo-image">
        <Image
          src={"/lattiz_logo_white.svg"}
          alt="logo"
          width={500}
          height={500}
          className="w-[25px] md:w-[35px] object-contain"
        />
      </a>
    );
  }


  return (
    <>
      <motion.div
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
        className="w-[85%] md:w-[60%] fixed flex h-12 px-6 pr-[0.1] rounded-full justify-between items-center overflow-hidden left-1/2 top-8 z-50 md:h-15 md:max-w-6xl xl:max-w-7xl bg-black/75 backdrop-blur-xs"
      >
        <motion.div
          initial={{ opacity: 0, transform: "translate3d(-20px, 0, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ willChange: "transform, opacity" }}
          className="flex flex-row gap-2 items-center"
        >
          {renderLogo()}
          <span className="text-[#FFF] font-semibold text-[12px] md:text-[16px] pt-1">
            Lattiz
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center flex-1 justify-center w-full mx-auto">
          <ul className="flex space-x-5 ">
            {links.map((link, index) => (
              <motion.li
                key={index}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                style={{ willChange: "transform, opacity" }}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={link.href}
                    className="text-sm lg:text-md text-[#FFF] first:capitalize hover:bg-[#FFF]/20 transition-colors duration-300 px-3 py-2 rounded-full"
                  >
                    {link.link}
                  </a>
                </motion.div>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Desktop Button */}
        <motion.div
          className="hidden xl:block mr-[6px]"
          initial={{ opacity: 0, transform: "translate3d(20px, 0, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ willChange: "transform, opacity" }}
        >
          <a href="https://dashboard.lattiz.app/" target="_blank" rel="noopener noreferrer" className="flex w-fit items-center justify-start">
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-full bg-[#FFF] px-6 py-3.5 text-sm font-medium text-black shadow-sm transition-transform duration-200 hover:scale-[1.02] sm:w-[220px] hover:cursor-pointer"
            >
              <span>Acceso clientes</span> <Home className="ml-2 h-5 w-5" />
            </button>
          </a>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="xl:hidden text-black py-2 px-4 md:mr-[12px] bg-[#FFF] rounded-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={handleMenuToggle}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          style={{ willChange: "transform" }}
        >
          <motion.div
            className="w-[30px] h-[30px] flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.65 }}
            animate={{ rotate: menuOpen ? 180 : 0, scale: menuOpen ? 1.2 : 1 }}
            transition={{ duration: 0.4 }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </motion.button>
      </motion.div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 xl:hidden" onClick={closeMenu}></div>
      )}

      {/* Mobile Menu */}
      <motion.section
        initial={{ opacity: 0, transform: "translate3d(-50%, -20px, 0)" }}
        animate={
          menuOpen
            ? {
              opacity: 1,
              transform: "translate3d(-50%, 0, 0)",
            }
            : {
              opacity: 0,
              transform: "translate3d(-50%, -20px, 0)",
            }
        }
        transition={{ duration: 0.3 }}
        style={{ willChange: "transform, opacity" }}
        className={`fixed top-0 left-1/2 bg-black/75 backdrop-blur-xs w-[85%] md:w-[60%] rounded-4xl z-50 py-1 xl:hidden ${menuOpen ? "top-24" : "-translate-y-full"
          }`}
      >
        <ul className={`space-y-6 py-6 px-6 text-dp`}>
          {links.map((link, index) => (
            <motion.li
              key={index}
              variants={navItemVariants}
              initial="hidden"
              animate={menuOpen ? "visible" : "hidden"}
              custom={index}
              style={{ willChange: "transform, opacity" }}
              className="flex space-x-5 items-center justify-center"
            >
              <a
                href={link.href}
                className="first-letter:capitalize text-[#FFF] text-[14px] transition"
                onClick={() => setMenuOpen(false)}
              >
                {link.link}
              </a>
            </motion.li>
          ))}
          <motion.li
            className="flex justify-center mx-auto items-center max-w-75 bg-[#FFF] transition-colors duration-300 text-black text-lg px-6 py-3 rounded-full cursor-pointer"
            variants={navItemVariants}
            initial="hidden"
            animate={menuOpen ? "visible" : "hidden"}
            custom={links.length}
            style={{ willChange: "transform, opacity" }}
          >
            <a href="https://dashboard.lattiz.app" className="flex flex-row gap-2">
              Acceso clientes <Home className="ml-2 h-5 w-5" />
            </a>
          </motion.li>
        </ul>
      </motion.section>
    </>
  );
}
