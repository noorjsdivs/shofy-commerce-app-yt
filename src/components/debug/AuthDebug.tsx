"use client";

import { useSession } from "next-auth/react";

const AuthDebug = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-xs text-gray-500">Loading session...</div>;
  }

  if (!session?.user) {
    return <div className="text-xs text-gray-500">No session found</div>;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-sm z-50">
      <h3 className="font-bold mb-2">Session Debug</h3>
      <div className="text-xs space-y-1">
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Name:</strong> {session.user.name || "null"}
        </div>
        <div>
          <strong>Email:</strong> {session.user.email || "null"}
        </div>
        <div>
          <strong>Image:</strong> {session.user.image || "null"}
        </div>
        <div>
          <strong>ID:</strong> {session.user.id || "null"}
        </div>
        {session.user.image && (
          <div className="mt-2">
            <strong>Image Preview:</strong>
            <img
              src={session.user.image}
              alt="Session user"
              className="w-8 h-8 rounded-full mt-1"
              onError={() => console.log("Session image failed to load")}
              onLoad={() => console.log("Session image loaded successfully")}
            />
          </div>
        )}
      </div>
      <div className="mt-2 text-xs opacity-70">
        Check console for image loading logs
      </div>
    </div>
  );
};

export default AuthDebug;
