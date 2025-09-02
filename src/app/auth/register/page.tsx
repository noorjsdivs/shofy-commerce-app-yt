import RegisterForm from "@/components/auth/RegisterForm";
import Logo from "@/components/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Shofy",
  description: "Create your Shofy account",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-5 border p-5 rounded-md shadow-md">
          <Logo />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join Shofy today and start shopping!
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-4 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
