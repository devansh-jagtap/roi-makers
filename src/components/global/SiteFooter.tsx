import React from "react";
import {
  IconBrandFacebook,
  IconBrandX,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons-react";

const SiteFooter = () => (
  <footer className="w-full flex items-center justify-center py-8 sm:py-12 bg-background">
    <div className="w-full max-w-[95vw] sm:max-w-[90vw] bg-black text-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-20 min-h-[30rem] sm:min-h-[35rem] lg:min-h-[40rem] flex flex-col gap-6 sm:gap-8 items-center justify-center border border-[#222] shadow-2xl">
      {/* Newsletter Signup */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
        <div className="flex-1 flex flex-col gap-3 sm:gap-4 items-start">
          <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center lg:text-left w-full">Stay updated with ROI™ Blog's</div>
          <form className="w-full flex flex-col sm:flex-row gap-3 sm:gap-2">
            <input type="email" placeholder="Your Email Address" className="flex-1 rounded-full px-4 sm:px-6 py-3 sm:py-4 bg-[#222] text-white placeholder:text-gray-400 focus:outline-none text-sm sm:text-base" />
            <button type="submit" className="rounded-full bg-white text-black px-6 sm:px-8 py-3 sm:py-4 font-bold text-lg sm:text-xl flex items-center justify-center whitespace-nowrap">
              Subscribe →
            </button>
          </form>
          {/* Social Icons */}
          <div className="flex gap-3 mt-2 justify-center lg:justify-start w-full">
            {[
              {
                label: "Facebook",
                href: "https://www.facebook.com/roimakersin",
                Icon: IconBrandFacebook,
              },
              {
                label: "X",
                href: "http://x.com/roimakers",
                Icon: IconBrandX,
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/roimakers/",
                Icon: IconBrandLinkedin,
              },
              {
                label: "YouTube",
                href: "https://www.youtube.com",
                Icon: IconBrandYoutube,
              },
              {
                label: "Instagram",
                href: "https://www.instagram.com/roimakers/",
                Icon: IconBrandInstagram,
              },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="bg-[#222] rounded-full p-3 sm:p-4 text-sm sm:text-base transition-colors hover:bg-[#FFAA17] flex items-center justify-center"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" stroke={1.5} />
              </a>
            ))}
          </div>
        </div>
        {/* Footer Links */}
        <div className="flex-1 flex flex-col sm:flex-row justify-center gap-8 sm:gap-12 lg:gap-16 mt-4 lg:mt-0">
          <div className="flex flex-col gap-2 sm:gap-3 sm:border-r border-white sm:pr-6 lg:pr-8 text-center sm:text-left">
            <span className="hover:text-[#FFAA17] cursor-pointer transition-colors text-sm sm:text-base">Services</span>
            <span className="hover:text-[#FFAA17] cursor-pointer transition-colors text-sm sm:text-base">Work</span>
            <span className="hover:text-[#FFAA17] cursor-pointer transition-colors text-sm sm:text-base">About</span>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3 sm:border-r border-white sm:pr-6 lg:pr-8 text-center sm:text-left">
            <span className="hover:text-[#FFAA17] cursor-pointer transition-colors text-sm sm:text-base">Contact</span>
            <span className="hover:text-[#FFAA17] cursor-pointer transition-colors text-sm sm:text-base">Blog</span>
            <span className="hover:text-[#FFAA17] cursor-pointer transition-colors text-sm sm:text-base">Careers</span>
          </div>
           <div className="flex flex-col gap-2 sm:gap-3  sm:pr-6 lg:pr-8 text-center sm:text-left">
            <span className="hover:text-[#FFAA17] cursor-pointer transition-colors text-sm sm:text-base">Privacy Policy</span>
            <span className="hover:text-[#FFAA17] cursor-pointer transition-colors text-sm sm:text-base">Terms &amp; conditions</span>
            <span className="hover:text-[#FFAA17] cursor-pointer transition-colors text-sm sm:text-base">Company Number : 9009500202</span>
          </div>
        </div>
      </div>
      {/* Large Logo */}
      <div className="w-full text-center mt-6 sm:mt-8">
        <span className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] xl:text-[6vw] font-extrabold tracking-tight leading-none">ROI Makers<span className="align-super text-xl ml-1">™</span></span>
      </div>
      {/* Legal & Credits */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm mt-4 sm:mt-6 gap-3 sm:gap-2 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
          <span>&copy; {new Date().getFullYear()} ROI Makers<span className="align-super text-s ml-1">™</span> All rights reserved</span>
          {/* <span className="hidden sm:inline">&nbsp;&bull;&nbsp;</span>
          <span>Company Number : 9009500202</span> */}
          <span className="hidden sm:inline">&nbsp;&bull;&nbsp;</span>
          <span>Mail : info@imakers.in</span>
          {/* <div className="flex flex-wrap justify-center sm:justify-start gap-1 mt-1 sm:mt-0">
            <span className="hidden sm:inline">&nbsp;&bull;&nbsp;</span>
            <a href="/privacy-policy" className="underline hover:text-[#FFAA17] transition-colors">Privacy Policy</a>
            <span>&nbsp;&bull;&nbsp;</span>
            <a href="/terms-conditions" className="underline hover:text-[#FF9933] transition-colors">Terms &amp; conditions</a>
          </div> */}
        </div>
        <div className="text-center sm:text-right">
          <span className="text-white font-medium">Website MadeByROI<span className="align-super text-xs ml-1">™</span></span>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
