import { NextResponse } from "next/server";
import { COOKIE_NAMES } from "@/constants";

/**
 * Handle POST requests to /api/auth/logout
 * This route clears the auth cookies without calling an external API
 */
export async function POST() {
  try {
    // Create a response object
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    // Clear all auth-related cookies
    response.cookies.delete(COOKIE_NAMES.AUTH_TOKEN);
    response.cookies.delete(COOKIE_NAMES.USER_DATA);
    response.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);

    // Simulate a small delay to make it feel like a real API call (optional)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during logout",
      },
      { status: 500 }
    );
  }
}
