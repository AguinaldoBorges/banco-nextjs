// app/api/statement/route.ts
import { NextResponse } from "next/server";
import { openDB } from "../../../db";
import PDFDocument from "pdfkit";


export async function GET() {
  const db = await openDB();
  const wallet = await db.get(`SELECT balance FROM wallet WHERE id = 1`);
  const history = await db.all(`SELECT type, value, created_at FROM history ORDER BY created_at DESC`);

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const title = "Extrato Bancário";

  // header
  doc.fontSize(18).text(title, { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Saldo atual: R$ ${Number(wallet?.balance ?? 0).toFixed(2)}`);
  doc.moveDown();

  doc.fontSize(14).text("Histórico de Transações:");
  doc.moveDown(0.5);

  // table-like lines
  history.forEach((h: any) => {
    const date = new Date(h.created_at).toLocaleString();
    const line = `${date} — ${h.type.toUpperCase()} — R$ ${Number(h.value).toFixed(2)}`;
    doc.fontSize(11).text(line);
  });

  doc.end();

  // aguarda fim
  await new Promise((resolve) => doc.on("end", resolve));

  const pdfBuffer = Buffer.concat(chunks);
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="extrato.pdf"',
    },
  });
}
