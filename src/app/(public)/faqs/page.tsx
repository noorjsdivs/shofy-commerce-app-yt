"use client";

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";
import { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiHelpCircle,
  FiSearch,
} from "react-icons/fi";

// export const metadata: Metadata = {
//   title: "FAQs - Shofy",
//   description: "Frequently Asked Questions - Find answers to common questions about Shofy",
// };

const faqCategories = [
  {
    id: "orders",
    title: "Orders & Shipping",
    icon: "📦",
    faqs: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping typically takes 3-7 business days. Express shipping is available for 1-2 business days delivery. Shipping times may vary based on your location and product availability.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order status by logging into your account and visiting the 'Orders' section.",
      },
      {
        question: "What are the shipping costs?",
        answer:
          "Shipping costs vary based on your location, order size, and shipping method. Free standard shipping is available on orders over $50. Exact shipping costs will be calculated at checkout.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "You can cancel or modify your order within 1 hour of placement. After that, please contact our customer service team immediately, and we'll do our best to accommodate your request if the order hasn't shipped yet.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    icon: "↩️",
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for most items. Products must be unused, in original packaging, and in the same condition as received. Some items like personalized products may not be eligible for return.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "To start a return, log into your account, go to 'Order History', and click 'Return Item' next to the product. Follow the instructions to print a return label and drop off the package at any authorized shipping location.",
      },
      {
        question: "When will I receive my refund?",
        answer:
          "Refunds are processed within 3-5 business days after we receive your returned item. The refund will be credited to your original payment method. Credit card refunds may take an additional 1-2 billing cycles to appear.",
      },
      {
        question: "Who pays for return shipping?",
        answer:
          "For defective or incorrect items, we provide a prepaid return label. For other returns, customers are responsible for return shipping costs unless the order qualifies for free returns.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Payment",
    icon: "👤",
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Sign Up' at the top of any page, provide your email address and create a password. You can also sign up during checkout. Having an account lets you track orders, save addresses, and access exclusive deals.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely through encrypted connections.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely! We use industry-standard SSL encryption and do not store your payment information on our servers. All transactions are processed through secure, PCI-compliant payment processors.",
      },
      {
        question: "Can I save multiple addresses?",
        answer:
          "Yes! You can save multiple shipping and billing addresses in your account. This makes checkout faster and easier for future orders. You can add, edit, or delete addresses anytime in your account settings.",
      },
    ],
  },
  {
    id: "products",
    title: "Products & Inventory",
    icon: "🛍️",
    faqs: [
      {
        question: "Are your products authentic?",
        answer:
          "Yes, we only sell authentic products sourced directly from authorized distributors and manufacturers. Every product comes with a guarantee of authenticity and quality.",
      },
      {
        question: "How do I know if an item is in stock?",
        answer:
          "Stock availability is shown on each product page. If an item is out of stock, you can sign up for notifications to be alerted when it's available again. We update inventory in real-time.",
      },
      {
        question: "Do you offer product warranties?",
        answer:
          "Many of our products come with manufacturer warranties. Warranty information is listed on individual product pages. We also offer our own satisfaction guarantee on all purchases.",
      },
      {
        question: "Can I get notified when items go on sale?",
        answer:
          "Yes! You can add items to your wishlist and enable notifications for price drops. You can also subscribe to our newsletter for updates on sales and special promotions.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </Title>
          <p className="text-light-text text-lg mb-8">
            Find answers to common questions about shopping with Shofy
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              Categories
            </h2>
            <div className="space-y-2">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
                    activeCategory === category.id
                      ? "bg-theme-color text-theme-white"
                      : "bg-light-bg text-gray-700 hover:bg-theme-color/10"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            {searchTerm ? (
              /* Search Results */
              <div>
                <h2 className="text-2xl font-semibold text-theme-color mb-6">
                  Search Results for &ldquo;{searchTerm}&rdquo;
                </h2>
                {filteredCategories.length > 0 ? (
                  <div className="space-y-8">
                    {filteredCategories.map((category) => (
                      <div key={category.id}>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.title}
                        </h3>
                        <div className="space-y-4">
                          {category.faqs.map((faq, index) => {
                            const faqId = `${category.id}-${index}`;
                            const isOpen = openFAQ === faqId;

                            return (
                              <div
                                key={faqId}
                                className="bg-theme-white border border-border-color rounded-lg"
                              >
                                <button
                                  onClick={() => toggleFAQ(faqId)}
                                  className="w-full text-left p-4 flex items-center justify-between hover:bg-light-bg/50 transition-colors duration-200"
                                >
                                  <span className="font-medium text-gray-800 pr-4">
                                    {faq.question}
                                  </span>
                                  {isOpen ? (
                                    <FiChevronDown className="w-5 h-5 text-theme-color flex-shrink-0" />
                                  ) : (
                                    <FiChevronRight className="w-5 h-5 text-theme-color flex-shrink-0" />
                                  )}
                                </button>
                                {isOpen && (
                                  <div className="px-4 pb-4">
                                    <p className="text-light-text leading-relaxed">
                                      {faq.answer}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiHelpCircle className="w-16 h-16 text-light-text mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No results found
                    </h3>
                    <p className="text-light-text">
                      Try different keywords or browse categories above.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Category FAQs */
              <div>
                {(() => {
                  const category = faqCategories.find(
                    (cat) => cat.id === activeCategory
                  );
                  if (!category) return null;

                  return (
                    <>
                      <h2 className="text-2xl font-semibold text-theme-color mb-6 flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        {category.title}
                      </h2>
                      <div className="space-y-4">
                        {category.faqs.map((faq, index) => {
                          const faqId = `${category.id}-${index}`;
                          const isOpen = openFAQ === faqId;

                          return (
                            <div
                              key={faqId}
                              className="bg-theme-white border border-border-color rounded-lg"
                            >
                              <button
                                onClick={() => toggleFAQ(faqId)}
                                className="w-full text-left p-4 flex items-center justify-between hover:bg-light-bg/50 transition-colors duration-200"
                              >
                                <span className="font-medium text-gray-800 pr-4">
                                  {faq.question}
                                </span>
                                {isOpen ? (
                                  <FiChevronDown className="w-5 h-5 text-theme-color flex-shrink-0" />
                                ) : (
                                  <FiChevronRight className="w-5 h-5 text-theme-color flex-shrink-0" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="px-4 pb-4">
                                  <p className="text-light-text leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-sky-color/10 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            Still have questions?
          </h2>
          <p className="text-light-text mb-6">
            Can&apos;t find what you&apos;re looking for? Our customer support
            team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              Contact Support
            </a>
            <a
              href="mailto:support@shofy.com"
              className="inline-block bg-theme-white text-theme-color border-2 border-theme-color px-6 py-3 rounded-lg hover:bg-theme-color hover:text-theme-white transition-colors duration-200 font-medium"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
