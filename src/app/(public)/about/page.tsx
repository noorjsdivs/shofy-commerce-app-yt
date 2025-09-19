import Container from "@/components/Container";
import Title from "@/components/Title";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Shofy",
  description:
    "Learn more about Shofy - Your trusted multipurpose eCommerce platform",
};

export default function AboutPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            About Shofy
          </Title>
          <p className="text-light-text text-lg">
            Your trusted multipurpose eCommerce platform for quality products
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:gap-12">
          {/* Our Story */}
          <section className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              Our Story
            </h2>
            <p className="text-light-text leading-relaxed mb-4">
              Founded in 2024, Shofy has emerged as a leading multipurpose
              eCommerce platform dedicated to providing customers with
              high-quality products and exceptional shopping experiences. We
              believe that online shopping should be simple, secure, and
              enjoyable for everyone.
            </p>
            <p className="text-light-text leading-relaxed">
              Our journey began with a simple mission: to bridge the gap between
              quality products and customers worldwide. Today, we serve
              thousands of satisfied customers with a diverse range of products
              across multiple categories.
            </p>
          </section>

          {/* Our Mission */}
          <section className="bg-theme-white border border-border-color rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              Our Mission
            </h2>
            <p className="text-light-text leading-relaxed">
              To provide customers with access to high-quality products at
              competitive prices while delivering outstanding customer service.
              We strive to create a seamless shopping experience that exceeds
              expectations and builds lasting relationships with our customers.
            </p>
          </section>

          {/* What Sets Us Apart */}
          <section className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              What Sets Us Apart
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Quality Assurance
                  </h3>
                  <p className="text-light-text text-sm">
                    Every product is carefully selected and tested to ensure the
                    highest quality standards.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Fast Shipping
                  </h3>
                  <p className="text-light-text text-sm">
                    Quick and reliable delivery to get your products to you as
                    soon as possible.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Customer Support
                  </h3>
                  <p className="text-light-text text-sm">
                    24/7 customer service to assist you with any questions or
                    concerns.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Secure Shopping
                  </h3>
                  <p className="text-light-text text-sm">
                    Advanced security measures to protect your personal and
                    payment information.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Team */}
          <section className="bg-theme-white border border-border-color rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              Our Team
            </h2>
            <p className="text-light-text leading-relaxed mb-4">
              Behind Shofy is a passionate team of designers, developers, and
              customer service professionals who work tirelessly to improve your
              shopping experience. We are committed to innovation, quality, and
              customer satisfaction.
            </p>
            <p className="text-light-text leading-relaxed">
              Our diverse team brings together expertise from various fields
              including e-commerce, technology, logistics, and customer
              relations to create a comprehensive shopping platform that meets
              all your needs.
            </p>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-sky-color/10 rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              Ready to Shop?
            </h2>
            <p className="text-light-text mb-6">
              Explore our wide range of products and experience the Shofy
              difference today.
            </p>
            <Link
              href="/products"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              Browse Products
            </Link>
          </section>
        </div>
      </div>
    </Container>
  );
}
