import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";
import {
  FiPackage,
  FiShoppingCart,
  FiTruck,
  FiUsers,
  FiHelpCircle,
  FiMessageSquare,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Business Inquiry - Shofy",
  description:
    "Partner with Shofy - Explore wholesale, bulk orders, and business opportunities",
};

export default function InquiryPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            Business Inquiry
          </Title>
          <p className="text-light-text text-lg">
            Explore partnership opportunities and business solutions with Shofy
          </p>
        </div>

        {/* Business Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Wholesale Orders
            </h3>
            <p className="text-light-text">
              Special pricing for bulk purchases and wholesale orders. Perfect
              for retailers and resellers.
            </p>
          </div>

          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              B2B Partnerships
            </h3>
            <p className="text-light-text">
              Join our partner network and grow your business with our
              comprehensive support system.
            </p>
          </div>

          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTruck className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Custom Solutions
            </h3>
            <p className="text-light-text">
              Tailored logistics and supply chain solutions for your specific
              business needs.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Inquiry Types */}
          <div>
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              Types of Inquiries
            </h2>

            <div className="space-y-4">
              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiShoppingCart className="w-5 h-5 text-theme-color" />
                  Bulk & Wholesale Orders
                </h3>
                <p className="text-light-text text-sm mb-3">
                  Looking to place large quantity orders? Get special wholesale
                  pricing and dedicated support.
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>• Minimum order quantities: 50+ units</li>
                  <li>• Volume discounts available</li>
                  <li>• Dedicated account manager</li>
                  <li>• Flexible payment terms</li>
                </ul>
              </div>

              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-theme-color" />
                  Partnership Opportunities
                </h3>
                <p className="text-light-text text-sm mb-3">
                  Interested in becoming a Shofy partner? Join our network of
                  trusted business partners.
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>• Reseller partnerships</li>
                  <li>• Affiliate programs</li>
                  <li>• Brand collaborations</li>
                  <li>• Distribution partnerships</li>
                </ul>
              </div>

              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiHelpCircle className="w-5 h-5 text-theme-color" />
                  Custom Solutions
                </h3>
                <p className="text-light-text text-sm mb-3">
                  Need something specific? We offer customized solutions for
                  unique business requirements.
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>• Private labeling</li>
                  <li>• Custom packaging</li>
                  <li>• Special logistics arrangements</li>
                  <li>• Enterprise integrations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-6 flex items-center gap-2">
              <FiMessageSquare className="w-6 h-6" />
              Submit Your Inquiry
            </h2>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactPerson"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Business Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="business@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="inquiryType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Inquiry Type *
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  required
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select inquiry type</option>
                  <option value="wholesale">Wholesale Orders</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="custom">Custom Solutions</option>
                  <option value="reseller">Reseller Program</option>
                  <option value="distribution">Distribution Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="estimatedVolume"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Estimated Monthly Volume
                </label>
                <select
                  id="estimatedVolume"
                  name="estimatedVolume"
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select volume range</option>
                  <option value="50-100">50-100 units</option>
                  <option value="100-500">100-500 units</option>
                  <option value="500-1000">500-1000 units</option>
                  <option value="1000+">1000+ units</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Inquiry Details *
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors resize-vertical"
                  placeholder="Please provide details about your business inquiry, specific requirements, timeline, and any other relevant information..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-theme-color text-theme-white py-3 px-6 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center bg-sky-color/10 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            Need to Discuss Your Requirements?
          </h2>
          <p className="text-light-text mb-6">
            Our business development team is ready to help you find the perfect
            solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:business@shofy.com"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              Email Business Team
            </a>
            <a
              href="tel:+15551234567"
              className="inline-block bg-theme-white text-theme-color border-2 border-theme-color px-6 py-3 rounded-lg hover:bg-theme-color hover:text-theme-white transition-colors duration-200 font-medium"
            >
              Schedule a Call
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
