// app/api/withdraw/route.ts
import { NextResponse } from "next/server";
import { openDB } from "../../../db";

export async function POST(request: Request) {
  const body = await request.json();
  const value = Number(body.value ?? 0);
  if (!value || value <= 0) return NextResponse.json({ error: "Valor inválido" }, { status: 400 });

  const db = await openDB();
  const wallet = await db.get(`SELECT balance FROM wallet WHERE id = 1`);
  if (wallet.balance < value) {
    return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 });
  }

  await db.run(`UPDATE wallet SET balance = balance - ? WHERE id = 1`, value);
  await db.run(`INSERT INTO history (type, value) VALUES ('withdraw', ?)`, value);

  const bal = await db.get(`SELECT balance FROM wallet WHERE id = 1`);
  return NextResponse.json({ balance: bal.balance });
}
