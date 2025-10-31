"use client";

import { useEffect, useMemo, useState } from "react";

const CATEGORIES = ["all", "food", "transport", "bill", "other"];

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("food");
  const [amount, setAmount] = useState("");

  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // โหลดจาก localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("expense-items");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  // เซฟกลับเข้า localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("expense-items", JSON.stringify(items));
  }, [items]);

  // เพิ่มรายการใหม่
  const addItem = () => {
    if (!title || !amount) return;
    const newItem = {
      id: crypto.randomUUID(),
      title,
      date,
      type,
      category,
      amount: Number(amount),
    };
    setItems((prev) => [newItem, ...prev]);
    setTitle("");
    setAmount("");
  };

  // 🗑️ ลบรายการ
  const deleteItem = (id: string) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
  };

  // ฟิลเตอร์
  const filtered = useMemo(() => {
    return items.filter((it) => {
      let ok = true;
      if (filterFrom && it.date < filterFrom) ok = false;
      if (filterTo && it.date > filterTo) ok = false;
      if (filterCat !== "all" && it.category !== filterCat) ok = false;
      if (filterType !== "all" && it.type !== filterType) ok = false;
      return ok;
    });
  }, [items, filterFrom, filterTo, filterCat, filterType]);

  const income = filtered
    .filter((i) => i.type === "income")
    .reduce((s, i) => s + i.amount, 0);
  const expense = filtered
    .filter((i) => i.type === "expense")
    .reduce((s, i) => s + i.amount, 0);
  const balance = income - expense;

  return (
  <main className="max-w-5xl mx-auto p-8 text-[var(--foreground)] bg-[var(--background)]">
    <h1 className="text-3xl font-bold mb-6">Expense Dashboard</h1>

    {/* Filter */}
    <div className="flex flex-wrap gap-4 mb-8 items-center">
      <div className="flex flex-col">
        <label className="text-sm">จาก:</label>
        <input
          type="date"
          value={filterFrom}
          onChange={(e) => setFilterFrom(e.target.value)}
          className="rounded-md border border-gray-600 bg-[var(--card-bg)] px-3 py-2 min-w-[180px]"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm">ถึง:</label>
        <input
          type="date"
          value={filterTo}
          onChange={(e) => setFilterTo(e.target.value)}
          className="rounded-md border border-gray-600 bg-[var(--card-bg)] px-3 py-2 min-w-[180px]"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm">หมวด:</label>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-md border border-gray-600 bg-[var(--card-bg)] px-3 py-2 min-w-[150px]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm">ประเภท:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-md border border-gray-600 bg-[var(--card-bg)] px-3 py-2 min-w-[150px]"
        >
          <option value="all">ทั้งหมด</option>
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
      </div>

      <button
        onClick={() => {
          setFilterFrom("");
          setFilterTo("");
          setFilterCat("all");
          setFilterType("all");
        }}
        className="rounded-md bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-500 self-end"
      >
        clear
      </button>
    </div>

    {/* Table */}
    <table className="w-full text-left border-collapse mb-6">
      <thead>
        <tr className="border-b border-gray-700 text-lg">
          <th className="p-3">วันที่</th>
          <th className="p-3">รายการ</th>
          <th className="p-3">ประเภท</th>
          <th className="p-3">หมวด</th>
          <th className="p-3 text-right">จำนวน</th>
          <th className="p-3 text-center">ลบ</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((it) => (
          <tr key={it.id} className="border-b border-gray-800 text-base">
            <td className="p-3">{it.date}</td>
            <td className="p-3">{it.title}</td>
            <td className="p-3">{it.type}</td>
            <td className="p-3">{it.category}</td>
            <td className="p-3 text-right">{it.amount}</td>
            <td className="p-3 text-center">
              <button
                onClick={() => deleteItem(it.id)}
                className="rounded-md bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-500"
              >
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Summary */}
    <div className="flex gap-6 text-lg mb-8">
      <div>รายรับ: {income}</div>
      <div>รายจ่าย: {expense}</div>
      <div>คงเหลือ: {balance}</div>
    </div>

    {/* Form */}
    <h2 className="text-xl font-semibold mb-3">เพิ่มรายการ</h2>
    <div className="flex flex-wrap gap-4">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="rounded-md border border-gray-600 bg-[var(--card-bg)] px-3 py-2 min-w-[180px]"
      />
      <input
        placeholder="ชื่อรายการ"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-md border border-gray-600 bg-[var(--card-bg)] px-3 py-2 min-w-[200px]"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as any)}
        className="rounded-md border border-gray-600 bg-[var(--card-bg)] px-3 py-2 min-w-[130px]"
      >
        <option value="income">รายรับ</option>
        <option value="expense">รายจ่าย</option>
      </select>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-md border border-gray-600 bg-[var(--card-bg)] px-3 py-2 min-w-[150px]"
      >
        <option value="food">อาหาร</option>
        <option value="transport">เดินทาง</option>
        <option value="bill">บิล</option>
        <option value="other">อื่นๆ</option>
      </select>
      <input
        type="number"
        placeholder="จำนวนเงิน"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="rounded-md border border-gray-600 bg-[var(--card-bg)] px-3 py-2 min-w-[150px]"
      />
      <button
        onClick={addItem}
        className="rounded-md bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-500"
      >
        บันทึก
      </button>
    </div>
  </main>
);

}
