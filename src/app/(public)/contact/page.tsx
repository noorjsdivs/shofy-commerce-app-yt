import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";
import { BsEnvelopeAt, BsTelephone } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Contact Us - Shofy",
  description:
    "Get in touch with Shofy - We're here to help with any questions or concerns",
};

export default function ContactPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            Contact Us
          </Title>
          <p className="text-light-text text-lg">
            We&apos;d love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              Get in Touch
            </h2>
            <p className="text-light-text mb-8">
              Have questions about our products or services? Need help with an
              order? Our friendly customer service team is here to assist you.
            </p>

            {/* Contact Cards */}
            <div className="space-y-6">
              <div className="bg-light-bg rounded-lg p-6 flex items-start gap-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiMapPin className="w-6 h-6 text-theme-color" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                  <p className="text-light-text">
                    123 Business Street
                    <br />
                    Commerce City, CC 12345
                    <br />
                    United States
                  </p>
                </div>
              </div>

              <div className="bg-light-bg rounded-lg p-6 flex items-start gap-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiPhone className="w-6 h-6 text-theme-color" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                  <p className="text-light-text">+1 (555) 123-4567</p>
                  <p className="text-light-text text-sm">
                    Monday - Friday, 9AM - 6PM
                  </p>
                </div>
              </div>

              <div className="bg-light-bg rounded-lg p-6 flex items-start gap-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiMail className="w-6 h-6 text-theme-color" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                  <p className="text-light-text">support@shofy.com</p>
                  <p className="text-light-text">sales@shofy.com</p>
                </div>
              </div>

              <div className="bg-light-bg rounded-lg p-6 flex items-start gap-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiClock className="w-6 h-6 text-theme-color" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Business Hours
                  </h3>
                  <div className="text-light-text text-sm">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-theme-white border border-border-color rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              Send us a Message
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="orders">Order Related</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="partnerships">Business Partnerships</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors resize-vertical"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-theme-color text-theme-white py-3 px-6 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center bg-sky-color/10 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            Need Immediate Help?
          </h2>
          <p className="text-light-text mb-6">
            For urgent matters, you can reach us directly through our customer
            support hotline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15551234567"
              className="inline-flex items-center gap-2 bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              <FiPhone className="w-4 h-4" />
              Call Us Now
            </a>
            <a
              href="mailto:support@shofy.com"
              className="inline-flex items-center gap-2 bg-theme-white text-theme-color border-2 border-theme-color px-6 py-3 rounded-lg hover:bg-theme-color hover:text-theme-white transition-colors duration-200 font-medium"
            >
              <FiMail className="w-4 h-4" />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
