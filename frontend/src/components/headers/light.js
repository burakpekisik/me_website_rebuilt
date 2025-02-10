import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line

import useAnimatedNavToggler from "../../helpers/useAnimatedNavToggler.js";

import logo from "../../images/logo.svg";
import { ReactComponent as MenuIcon } from "feather-icons/dist/icons/menu.svg";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";

const Header = tw.header`
  flex justify-between items-center
  max-w-screen-xl mx-auto
`;

export const NavLinks = tw.div`inline-block`;

export const NavLink = tw.a`
  text-lg my-2 lg:text-sm lg:mx-6 lg:my-0
  font-semibold tracking-wide transition duration-300
  pb-1 border-b-2 border-transparent hover:border-primary-500 hocus:text-primary-500
`;

export const PrimaryLink = tw(NavLink)`
  lg:mx-0
  px-8 py-3 rounded bg-primary-500 text-gray-100
  hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline
`;

export const SecondaryLink = tw(NavLink)`
  lg:mx-2
  px-8 py-3 rounded border border-primary-500
  text-primary-500
  bg-transparent 
  hocus:bg-primary-500 hocus:text-white 
  focus:shadow-outline
`;

export const LogoLink = styled(NavLink)`
  ${tw`flex items-center font-black border-b-0 text-2xl! ml-0!`};

  img {
    ${tw`w-10 mr-3`}
  }
`;

export const MobileNavLinksContainer = tw.nav`flex flex-1 items-center justify-between`;
export const NavToggle = tw.button`
  lg:hidden z-20 focus:outline-none hocus:text-primary-500 transition duration-300
`;
export const MobileNavLinks = motion(styled.div`
  ${tw`lg:hidden z-10 fixed top-0 inset-x-0 mx-4 my-6 p-8 border text-center rounded-lg text-gray-900 bg-white`}
  ${NavLinks} {
    ${tw`flex flex-col items-center`}
  }
`);

export const DesktopNavLinks = tw.nav`
  hidden lg:flex flex-1 justify-between items-center
`;

export default ({
  roundedHeaderButton = true,
  logoLink,
  className,
  collapseBreakpointClass = "lg",
}) => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const FRONTEND_PORT = process.env.FRONTEND_PORT
  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/menu_links`);
        const data = await response.json();
        const filteredLinks = data.filter(
          (link) => link.menu_group === "navbar"
        );
        setNavLinks(filteredLinks);
      } catch (error) {
        console.error("Failed to fetch menu links:", error);
      }
    };

    fetchNavLinks();
  }, []);

  const { showNavLinks, animation, toggleNavbar } = useAnimatedNavToggler();
  const collapseBreakpointCss =
    collapseBreakPointCssMap[collapseBreakpointClass];

  const defaultLogoLink = (
    <LogoLink href="/">
      <img src={logo} alt="logo" />
      Treact
    </LogoLink>
  );

  logoLink = logoLink || defaultLogoLink;

  return (
    <Header roundedHeaderButton={true} className={className || "header-light"}>
      <DesktopNavLinks css={collapseBreakpointCss.desktopNavLinks}>
        {logoLink}
        <NavLinks key={1}>
          {navLinks.map((link, index) => (
            <NavLink key={index} href={link.menu_url}>
              {link.menu_name}
            </NavLink>
          ))}
          {localStorage.getItem("token") ? ( // Check if token exists
            <>
              <SecondaryLink
                css={tw`ml-4`} // Add margin-left for spacing
                href={`/components/innerPages/UserAccountPage`}
              >
                Hesabım
              </SecondaryLink>
              <SecondaryLink
                css={tw`ml-4`} // Add margin-left for spacing between buttons
                onClick={() => {
                  localStorage.removeItem("token"); // Remove token on logout
                  window.location.reload(); // Optional: Reload the page after logout
                }}
              >
                Çıkış Yap
              </SecondaryLink>
            </>
          ) : (
            <>
              <SecondaryLink
                css={roundedHeaderButton && tw`rounded-full ml-4`} // Add spacing and optional rounded style
                href="/components/innerPages/LoginPage"
              >
                Giriş Yap
              </SecondaryLink>
              <PrimaryLink
                css={roundedHeaderButton && tw`rounded-full ml-4`} // Add margin-left for spacing
                href="/components/innerPages/SignupPage"
              >
                Kayıt Ol
              </PrimaryLink>
            </>
          )}
        </NavLinks>
      </DesktopNavLinks>

      <MobileNavLinksContainer
        css={collapseBreakpointCss.mobileNavLinksContainer}
      >
        {logoLink}
        <MobileNavLinks
          initial={{ x: "150%", display: "none" }}
          animate={animation}
          css={collapseBreakpointCss.mobileNavLinks}
        >
          <NavLinks>
            {navLinks.map((link, index) => (
              <NavLink key={index} href={link.menu_url}>
                {link.menu_name}
              </NavLink>
            ))}
          </NavLinks>
        </MobileNavLinks>
        <NavToggle
          onClick={toggleNavbar}
          className={showNavLinks ? "open" : "closed"}
        >
          {showNavLinks ? (
            <CloseIcon tw="w-6 h-6" />
          ) : (
            <MenuIcon tw="w-6 h-6" />
          )}
        </NavToggle>
      </MobileNavLinksContainer>
    </Header>
  );
};

// Collapse breakpoint styles map
const collapseBreakPointCssMap = {
  sm: {
    mobileNavLinks: tw`sm:hidden`,
    desktopNavLinks: tw`sm:flex`,
    mobileNavLinksContainer: tw`sm:hidden`,
  },
  md: {
    mobileNavLinks: tw`md:hidden`,
    desktopNavLinks: tw`md:flex`,
    mobileNavLinksContainer: tw`md:hidden`,
  },
  lg: {
    mobileNavLinks: tw`lg:hidden`,
    desktopNavLinks: tw`lg:flex`,
    mobileNavLinksContainer: tw`lg:hidden`,
  },
  xl: {
    mobileNavLinks: tw`lg:hidden`,
    desktopNavLinks: tw`lg:flex`,
    mobileNavLinksContainer: tw`lg:hidden`,
  },
};
