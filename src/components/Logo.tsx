import { logo } from "@/assets";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image src={logo} alt="logo" width={112} height={40} className="w-28" />
    </Link>
  );
};

export default Logo;
