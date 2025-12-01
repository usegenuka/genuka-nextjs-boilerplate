import { destroySession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
