import Container from "../Container";
import { LiaUser } from "react-icons/lia";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { auth } from "../../../auth";
import MobileNavigation from "./MobileNavigation";
import HeaderIcons from "./HeaderIcons";
import Logo from "../Logo";
import UserProfileDropdown from "./UserProfileDropdown";

const MiddleHeader = async () => {
  const session = await auth();

  return (
    <div className="border-b border-b-gray-400">
      <Container className="py-5 flex items-center gap-4 md:gap-6 lg:gap-20 justify-between ">
        <Logo />
        <SearchInput />
        <div className="hidden md:inline-flex items-center gap-3">
          {/* User */}
          {session?.user ? (
            <UserProfileDropdown user={session.user} />
          ) : (
            <div
              // href={"/auth/signin"}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="border-2 border-gray-700 p-1.5 rounded-full text-xl">
                <LiaUser />
              </div>
              <div>
                <Link href={"/auth/signin"}>
                  <p className="text-xs hover:text-sky-color ease-in-out duration-300 cursor-pointer">
                    Hello, Guests
                  </p>
                </Link>

                <div className="text-sm">
                  <Link
                    href={"/auth/signin"}
                    className="hover:text-sky-color ease-in-out duration-300 cursor-pointer"
                  >
                    Login{" "}
                  </Link>
                  /{" "}
                  <Link
                    href={"/auth/register"}
                    className="hover:text-sky-color ease-in-out duration-300 cursor-pointer"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          )}
          {/* Cart & Favorite Icons */}
          <HeaderIcons />
        </div>
        <MobileNavigation />
      </Container>
    </div>
  );
};

export default MiddleHeader;
