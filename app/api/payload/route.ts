import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get("path");

  if (!filePath) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  try {
    if (filePath.includes("..") || filePath.startsWith("/")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const fullPath = join(process.cwd(), "src", filePath);
    const content = await readFile(fullPath, "utf-8");

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: "File not found or cannot be read" },
      { status: 404 }
    );
  }
}
