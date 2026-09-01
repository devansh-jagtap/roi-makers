"use client";
import { useState ,useEffect } from "react";
import { MobileNavMenu, StaggeredMenuItem, StaggeredMenuSocialItem } from "@/components/global/MobileNavMenu";
import { useTheme } from "@/app/providers/ThemeProvider";

const menuItems: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "Home", link: "/" },
  { label: "Projects", ariaLabel: "Projects", link: "/projects" },
  { label: "Services", ariaLabel: "Services", link: "/services" },
  { label: "About", ariaLabel: "About", link: "/about" },
  { label: "Careers", ariaLabel: "Careers", link: "/careers" },
  { label: "Blog", ariaLabel: "Blog", link: "/blog" },
  { label: "Team", ariaLabel: "Team", link: "/team" },
  { label: "Contact", ariaLabel: "Contact", link: "/contact" },
];

const socialItems: StaggeredMenuSocialItem[] = [
  { label: "Instagram", link: "https://www.instagram.com/roimakers/" },
  { label: "Twitter", link: "http://x.com/roimakers" },
  { label: "LinkedIn", link: "https://www.linkedin.com/company/roimakers/" },
];

export default function SiteHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a layout placeholder to avoid SSR hydration mismatches
  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  // useTheme lives in the inner component so it is only called once the
  // provider is mounted and actually rendering its context.
  return <SiteHeaderMenu />;
}

function SiteHeaderMenu() {
  const { theme } = useTheme();
  const logoUrl = theme === 'dark' ? '/roi-w-logo.webp' : '/roi-logo.webp';

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 9999,
        isolation: 'isolate',
        pointerEvents: 'none',
      }}
    >
      <MobileNavMenu
        position="right"
        colors={['#FFAA17', '#E69815', '#CC8713', '#B36619']}
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        logoUrl={logoUrl}
        menuButtonColor="currentColor"
        openMenuButtonColor="currentColor"
        accentColor="#FFAA17"
        isFixed={false}
        changeMenuColorOnOpen={false}
      />
    </div>
  );
}
