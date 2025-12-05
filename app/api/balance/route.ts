// app/api/balance/route.ts
import { NextResponse } from "next/server";
import { openDB } from "../../../db";

export async function GET() {
  const db = await openDB();
  const bal = await db.get(`SELECT balance FROM wallet WHERE id = 1`);
  return NextResponse.json({ balance: bal?.balance ?? 0 });
}
