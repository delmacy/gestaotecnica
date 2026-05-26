import { NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "unknown_error";
  }

  const cause =
    error.cause instanceof Error
      ? ` cause: ${error.cause.message}`
      : "";

  return `${error.message}${cause}`;
}

export async function GET() {
  try {
    const db = getDb();
    await db.select({ value: count() }).from(users);

    return NextResponse.json({
      ok: true,
      service: "postgres",
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "postgres",
        error:
          process.env.NODE_ENV === "development"
            ? getErrorMessage(error)
            : "database_unavailable",
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
