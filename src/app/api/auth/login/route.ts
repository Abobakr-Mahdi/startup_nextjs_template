import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES, COOKIE_SETTINGS } from "@/constants";
import { LoginCredentials, User } from "@/features/auth/types/auth";
import { encrypt, isCryptoSupported } from "@/lib/crypto";
import { uuid } from "@/lib/utils";
import { faker } from "@faker-js/faker";

/**
 * Handle POST requests to /api/auth/login
 * This route uses Faker.js to generate fake user data instead of calling a real API
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();

    const credentials = body as LoginCredentials;

    // Check if credentials match expected values (optional validation)
    // You can customize this validation or remove it entirely
    const isValidCredentials = credentials.identifier && credentials.password;

    if (!isValidCredentials) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
          response: null,
        },
        { status: 401 }
      );
    }

    // Generate fake user data using Faker.js
    const userData: User = {
      id: uuid(),
      name: faker.person.fullName(),
      email: credentials.identifier || faker.internet.email(),
      role: faker.helpers.arrayElement(["admin", "user"]),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    };

    // Generate a fake access token
    const accessToken = faker.string.alphanumeric(64);

    // Create response object
    const responseObj = {
      success: true,
      message: "Login successful",
      response: { user: userData },
    };

    // Create a response with cookies
    const newResponse = NextResponse.json(responseObj);

    // Encrypt user data before storing in cookie
    let userDataStr = JSON.stringify(userData);
    let accessTokenStr = JSON.stringify(accessToken);
    if (isCryptoSupported()) {
      userDataStr = await encrypt(userDataStr);
      accessTokenStr = await encrypt(accessTokenStr);
    }

    // Set cookies (auth token and user data)
    newResponse.cookies.set({
      name: COOKIE_NAMES.AUTH_TOKEN,
      value: accessTokenStr,
      httpOnly: COOKIE_SETTINGS.HTTP_ONLY,
      path: COOKIE_SETTINGS.PATH,
      secure: COOKIE_SETTINGS.SECURE,
      sameSite: COOKIE_SETTINGS.SAME_SITE,
      maxAge: COOKIE_SETTINGS.AUTH_MAX_AGE,
    });

    newResponse.cookies.set({
      name: COOKIE_NAMES.USER_DATA,
      value: userDataStr,
      httpOnly: COOKIE_SETTINGS.HTTP_ONLY, // Accessible by JS
      path: COOKIE_SETTINGS.PATH,
      secure: COOKIE_SETTINGS.SECURE,
      sameSite: COOKIE_SETTINGS.SAME_SITE,
      maxAge: COOKIE_SETTINGS.AUTH_MAX_AGE,
    });

    // Simulate a small delay to make it feel like a real API call (optional)
    await new Promise((resolve) => setTimeout(resolve, 300));

    return newResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during login",
      },
      { status: 500 }
    );
  }
}
