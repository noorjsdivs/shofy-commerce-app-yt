import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import { banner } from "@/constants";
import { GoArrowRight } from "react-icons/go";

const Banner = async () => {
  return (
    <div className="bg-[#115061] py-20 text-theme-white">
      <Container className="flex items-center justify-between">
        <div className="flex flex-col gap-5">
          <p className="text-base font-semibold">{banner?.priceText}</p>
          <h2 className="text-5xl font-bold max-w-[500px]">{banner?.title}</h2>
          <p className="text-lg font-bold">
            {banner?.textOne}{" "}
            <span className="text-light-yellow mx-1">{banner?.offerPrice}</span>
            {banner?.textTwo}
          </p>
          <Button
            href={banner?.buttonLink}
            className="flex items-center gap-1 bg-theme-white text-black rounded-md w-32 px-0 justify-center text-sm font-semibold hover:bg-transparent hover:text-theme-white py-3 border border-transparent hover:border-white/40 duration-200"
          >
            Shop Now <GoArrowRight className="text-lg" />
          </Button>
        </div>
        <div>
          <img src={banner?.image.src} alt="bannerImageOne" />
        </div>
      </Container>
    </div>
  );
};

export default Banner;
