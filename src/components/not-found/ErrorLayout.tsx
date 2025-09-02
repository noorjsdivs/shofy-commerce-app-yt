import { ReactNode } from "react";
import Container from "@/components/Container";

interface ErrorLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showContainer?: boolean;
}

export default function ErrorLayout({
  children,
  title,
  description,
  showContainer = true,
}: ErrorLayoutProps) {
  const content = (
    <div className="min-h-[60vh] flex flex-col justify-center py-12">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
              {title}
            </h1>
            {description && (
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );

  return showContainer ? <Container>{content}</Container> : content;
}
