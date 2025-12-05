"use client";
import { useEffect, useState } from "react";

type HistoryItem = {
  id: number;
  type: "deposit" | "withdraw";
  value: number;
  created_at: string;
  formatted?: string;
};

export default function Page() {
  const [value, setValue] = useState<number | "">("");
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [formattedHistory, setFormattedHistory] = useState<HistoryItem[]>([]);

  async function fetchBalance() {
    const r = await fetch("/api/balance");
    const data = await r.json();
    setBalance(data.balance ?? 0);
  }

  async function fetchHistory() {
    const r = await fetch("/api/history");
    const data = await r.json();
    setHistory(data);
  }

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, []);

  // formata datas somente no client (corrige hydration)
  useEffect(() => {
    const f = history.map((h) => ({
      ...h,
      formatted: new Date(h.created_at).toLocaleString(),
    }));
    setFormattedHistory(f);
  }, [history]);

  async function deposit() {
    if (!value || value <= 0) return alert("Informe um valor válido.");

    await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    setValue("");
    fetchBalance();
    fetchHistory();
  }

  async function withdraw() {
    if (!value || value <= 0) return alert("Informe um valor válido.");

    const r = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    if (!r.ok) {
      const err = await r.json();
      return alert(err.error);
    }

    setValue("");
    fetchBalance();
    fetchHistory();
  }

  function translate(type: "deposit" | "withdraw") {
    return type === "deposit" ? "Depósito" : "Saque";
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* HEADER */}
        <header className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Banco Next.js</h1>
            <p className="text-sm text-gray-500">Seu novo banco digital</p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">Saldo Atual</div>
            <div className="text-2xl font-semibold text-green-600">
              R$ {balance.toFixed(2)}
            </div>
          </div>
        </header>

        {/* AÇÕES */}
        <section className="bg-white rounded-2xl shadow p-6 flex gap-4 items-center">
          <input
            type="number"
            placeholder="Valor"
            value={value}
            onChange={(e) =>
              setValue(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="flex-1 border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={deposit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl"
          >
            Depositar
          </button>

          <button
            onClick={withdraw}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl"
          >
            Sacar
          </button>
        </section>

        {/* HISTÓRICO */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Histórico</h2>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {formattedHistory.length === 0 && (
              <p className="text-gray-500 text-sm">Nenhuma transação registrada</p>
            )}

            {formattedHistory.map((h) => (
              <div
                key={h.id}
                className={`p-3 rounded-xl border flex justify-between items-center ${
                  h.type === "deposit"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div>
                  <div className="font-medium">{translate(h.type)}</div>
                  <div className="text-xs text-gray-600">{h.formatted}</div>
                </div>

                <div className="font-semibold">
                  R$ {Number(h.value).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
