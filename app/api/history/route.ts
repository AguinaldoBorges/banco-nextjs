// app/api/history/route.ts
import { NextResponse } from "next/server";
import { openDB } from "../../../db";

export async function GET() {
  const db = await openDB();
  const items = await db.all(`SELECT id, type, value, created_at FROM history ORDER BY created_at DESC`);
  return NextResponse.json(items);
}
