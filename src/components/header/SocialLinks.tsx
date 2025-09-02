import Link from "next/link";
import React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

const linksData = [
  { icon: <FaGithub />, href: "https://github.com/" },
  { icon: <FaFacebook />, href: "https://www.youtube.com/@reactjsBD" },
  {
    icon: <FaYoutube />,
    href: "https://www.youtube.com/@reactjsBD",
  },
  {
    icon: <FaLinkedin />,
    href: "https://www.linkedin.com/in/noor-mohammad-ab2245193/",
  },
  { icon: <FaEnvelope />, href: "https://www.youtube.com/@reactjsBD" },
];

const SocialLinks = () => {
  return (
    <div className="text-xl pt-2 text-white/50 flex items-center gap-x-2">
      {linksData?.map((item, index) => (
        <Link
          key={index}
          href={item?.href}
          target="blank"
          className="border border-white/20 inline-flex p-2 rounded-full hover:text-sky-color hover:border-sky-color duration-300 cursor-pointer"
        >
          {item?.icon}
        </Link>
      ))}
      {/* <Link
        href="https://www.youtube.com/@reactjsBD"
        className="border border-white/20 inline-flex p-2 rounded-full hover:text-white hover:border-white duration-300 cursor-pointer"
      >
        <FaYoutube />
      </Link>
      <Link
        href="https://www.linkedin.com/in/noor-mohammad-ab2245193/"
        className="border border-white/20 inline-flex p-2 rounded-full hover:text-white hover:border-white duration-300 cursor-pointer"
      >
        <FaLinkedin />
      </Link>
      <Link
        href="https://www.youtube.com/@reactjsBD"
        className="border border-white/20 inline-flex p-2 rounded-full hover:text-white hover:border-white duration-300 cursor-pointer"
      >
        <FaFacebook />
      </Link>
      <Link
        href="https://www.youtube.com/@reactjsBD"
        className="border border-white/20 inline-flex p-2 rounded-full hover:text-white hover:border-white duration-300 cursor-pointer"
      >
        <FaEnvelope />
      </Link> */}
    </div>
  );
};

export default SocialLinks;
