"use client";
import { CiDeliveryTruck } from "react-icons/ci";
import { useState } from "react";
import Container from "../Container";
import ShippingModal from "../ShippingModal";
import LanguageDropdown from "./LanguageDropdown";
import CurrencyDropdown from "./CurrencyDropdown";
import SettingsDropdown from "./SettingsDropdown";

const TopHeader = ({
  freeShippingThreshold,
}: {
  freeShippingThreshold: string;
}) => {
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

  const openShippingModal = () => {
    setIsShippingModalOpen(true);
  };

  const closeShippingModal = () => {
    setIsShippingModalOpen(false);
  };

  return (
    <div className="bg-[#010f1c] text-gray-200 w-full">
      <Container className="flex items-center justify-between">
        <p
          className="w-full md:w-auto text-sm flex items-center justify-center md:justify-normal font-medium py-1 cursor-pointer hover:text-orange-300 transition-colors duration-200"
          onClick={openShippingModal}
        >
          <CiDeliveryTruck className="text-[#ffb342] text-2xl mr-1" /> FREE
          Express Shipping On Orders ${freeShippingThreshold}+
        </p>
        <div className="hidden md:inline-flex items-center text-sm text-white gap-1">
          <LanguageDropdown />
          <CurrencyDropdown />
          <SettingsDropdown />
        </div>
      </Container>

      {/* Shipping Modal */}
      <ShippingModal
        isOpen={isShippingModalOpen}
        onClose={closeShippingModal}
        freeShippingThreshold={freeShippingThreshold}
      />
    </div>
  );
};

export default TopHeader;
