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
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1>Expense Dashboard</h1>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div>
          จาก:{" "}
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
          />
        </div>
        <div>
          ถึง:{" "}
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
          />
        </div>
        <div>
          หมวด:{" "}
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          ประเภท:{" "}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
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
        >
          clear
        </button>
      </div>

      {/* ตาราง */}
      <table style={{ width: "100%", marginTop: 16 }}>
        <thead>
          <tr>
            <th>วันที่</th>
            <th>รายการ</th>
            <th>ประเภท</th>
            <th>หมวด</th>
            <th style={{ textAlign: "right" }}>จำนวน</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((it) => (
            <tr key={it.id}>
              <td>{it.date}</td>
              <td>{it.title}</td>
              <td>{it.type}</td>
              <td>{it.category}</td>
              <td style={{ textAlign: "right" }}>{it.amount}</td>
              <td>
                <button
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                  onClick={() => deleteItem(it.id)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* สรุปยอด */}
      <div style={{ display: "flex", gap: 16, margin: "16px 0" }}>
        <div>รายรับ: {income}</div>
        <div>รายจ่าย: {expense}</div>
        <div>คงเหลือ: {balance}</div>
      </div>

      {/* Form เพิ่มรายการ */}
      <h2 style={{ marginTop: 32 }}>เพิ่มรายการ</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input
          placeholder="ชื่อรายการ"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
        />
        <button onClick={addItem}>บันทึก</button>
      </div>
    </main>
  );
}
