import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const email = formData.get("email") as string;

    if (!file || !email) {
      return NextResponse.json(
        { error: "Image file and email are required" },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `profile-images/${email}-${timestamp}`;

    // Create storage reference
    const storageRef = ref(storage, fileName);

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload file
    await uploadBytes(storageRef, buffer, {
      contentType: file.type,
    });

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return NextResponse.json({
      success: true,
      imageUrl: downloadURL,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
