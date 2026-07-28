"use client";

import { useCallback, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

// ────────────────────────────────────────────────────────────────
// Types from practice data
// ────────────────────────────────────────────────────────────────

interface OrderingActivity {
  id: string;
  type: "ordering";
  title: string;
  instructions: string;
  items: string[];
  answer: number[];
  feedback: string;
}

interface ClassificationItem {
  text: string;
  answer: string;
}

interface ClassificationActivity {
  id: string;
  type: "classification";
  title: string;
  instructions: string;
  items: ClassificationItem[];
  feedback?: string;
}

type DnDActivity = OrderingActivity | ClassificationActivity;

// ────────────────────────────────────────────────────────────────
// ORDERING — drag-to-reorder chips
// ────────────────────────────────────────────────────────────────

export function OrderingPractice({
  activity,
  locale,
}: {
  activity: OrderingActivity;
  locale: Locale;
}) {
  const vi = locale === "vi";
  const [order, setOrder] = useState<number[]>(
    activity.items.map((_, i) => i)
  );
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // Keyboard: swap with arrows
  function handleKeyDown(e: React.KeyboardEvent, pos: number) {
    if (e.key === "ArrowUp" && pos > 0) {
      e.preventDefault();
      move(pos, pos - 1);
    } else if (e.key === "ArrowDown" && pos < order.length - 1) {
      e.preventDefault();
      move(pos, pos + 1);
    }
  }

  function move(from: number, to: number) {
    setOrder((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    setChecked(false);
  }

  function handleDragStart(pos: number) {
    dragIndex.current = pos;
    setDragging(pos);
  }

  function handleDragOver(e: React.DragEvent, pos: number) {
    e.preventDefault();
    setOverIndex(pos);
  }

  function handleDrop(pos: number) {
    const from = dragIndex.current;
    if (from === null || from === pos) {
      setOverIndex(null);
      setDragging(null);
      return;
    }
    setOrder((prev) => {
      const next = [...prev];
      const moved = next.splice(from, 1)[0];
      next.splice(pos, 0, moved);
      return next;
    });
    setChecked(false);
    dragIndex.current = null;
    setDragging(null);
    setOverIndex(null);
  }

  function handleDragEnd() {
    dragIndex.current = null;
    setDragging(null);
    setOverIndex(null);
  }

  function check() {
    const isCorrect = order.every((item, i) => item === activity.answer[i]);
    setCorrect(isCorrect);
    setChecked(true);
  }

  function reset() {
    setOrder(activity.items.map((_, i) => i));
    setChecked(false);
    setCorrect(false);
  }

  return (
    <div className="practice-dnd-ordering">
      <p className="practice-dnd-instructions">{activity.instructions}</p>
      <ol
        className="practice-ordering-list"
        aria-label={vi ? "Danh sách bước — kéo để sắp xếp lại" : "Steps list — drag to reorder"}
      >
        {order.map((itemIndex, pos) => (
          <li
            key={activity.items[itemIndex]}
            className={`practice-dnd-chip${dragging === pos ? " is-dragging" : ""}${overIndex === pos && dragging !== pos ? " is-over" : ""}${checked ? (correct ? " chip-correct" : " chip-incorrect") : ""}`}
            draggable
            aria-grabbed={dragging === pos}
            tabIndex={0}
            aria-label={`${vi ? "Bước" : "Step"} ${pos + 1}: ${activity.items[itemIndex]}`}
            onDragStart={() => handleDragStart(pos)}
            onDragOver={(e) => handleDragOver(e, pos)}
            onDrop={() => handleDrop(pos)}
            onDragEnd={handleDragEnd}
            onKeyDown={(e) => handleKeyDown(e, pos)}
          >
            <span className="ordering-pos mono">{String(pos + 1).padStart(2, "0")}</span>
            <span className="ordering-text">{activity.items[itemIndex]}</span>
            <span className="ordering-handle" aria-hidden="true">⠿</span>
          </li>
        ))}
      </ol>
      <div className="practice-dnd-actions">
        <button
          type="button"
          className="sim-send-btn"
          onClick={check}
          disabled={checked}
        >
          {vi ? "Kiểm tra" : "Check"}
        </button>
        <button type="button" className="sim-reset-btn" onClick={reset}>
          {vi ? "Đặt lại" : "Reset"}
        </button>
      </div>
      {checked && (
        <div
          className={`practice-dnd-result${correct ? " dnd-correct" : " dnd-wrong"}`}
          role="status"
          aria-live="polite"
        >
          <span className="practice-dnd-icon">{correct ? "✓" : "✗"}</span>
          <div>
            <strong>{correct ? (vi ? "Đúng!" : "Correct!") : (vi ? "Chưa đúng." : "Not quite.")}</strong>
            {!correct && <p style={{ margin: ".25rem 0 0", fontSize: ".82rem", color: "var(--text-mid)" }}>{vi ? "Thứ tự đúng:" : "Correct order:"} {activity.answer.map((i) => activity.items[i]).join(" → ")}</p>}
            <p style={{ margin: ".35rem 0 0", fontSize: ".82rem", color: "var(--text-low)" }}>{activity.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// CLASSIFICATION — drag items into labeled bins
// ────────────────────────────────────────────────────────────────

export function ClassificationPractice({
  activity,
  locale,
}: {
  activity: ClassificationActivity;
  locale: Locale;
}) {
  const vi = locale === "vi";

  const bins = Array.from(new Set(activity.items.map((item) => item.answer)));
  const [assignments, setAssignments] = useState<Record<string, string | null>>(
    Object.fromEntries(activity.items.map((item) => [item.text, null]))
  );
  const [checked, setChecked] = useState(false);
  const dragText = useRef<string | null>(null);
  const [overBin, setOverBin] = useState<string | null>(null);

  function handleItemDragStart(text: string) {
    dragText.current = text;
  }

  function handleBinDragOver(e: React.DragEvent, bin: string) {
    e.preventDefault();
    setOverBin(bin);
  }

  function handleBinDrop(bin: string) {
    if (!dragText.current) return;
    setAssignments((prev) => ({ ...prev, [dragText.current!]: bin }));
    setChecked(false);
    dragText.current = null;
    setOverBin(null);
  }

  function handleBinDragLeave() {
    setOverBin(null);
  }

  function handleDragEnd() {
    dragText.current = null;
    setOverBin(null);
  }

  // Keyboard: cycle through bins with Enter
  function handleChipKey(e: React.KeyboardEvent, text: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const currentBin = assignments[text];
      const nextBin = bins[(bins.indexOf(currentBin ?? bins[bins.length - 1]) + 1) % bins.length];
      setAssignments((prev) => ({ ...prev, [text]: nextBin }));
      setChecked(false);
    }
  }

  const unassigned = activity.items.filter((item) => assignments[item.text] === null);

  function check() {
    setChecked(true);
  }

  function reset() {
    setAssignments(Object.fromEntries(activity.items.map((item) => [item.text, null])));
    setChecked(false);
  }

  const allCorrect = checked && activity.items.every((item) => assignments[item.text] === item.answer);

  return (
    <div className="practice-classification">
      <p className="practice-dnd-instructions">{activity.instructions}</p>

      {/* Unassigned chips */}
      {unassigned.length > 0 && (
        <div className="practice-chips-pool" aria-label={vi ? "Chưa phân loại" : "Unassigned"}>
          {unassigned.map((item) => (
            <div
              key={item.text}
              className="practice-dnd-chip"
              draggable
              tabIndex={0}
              aria-label={item.text}
              onDragStart={() => handleItemDragStart(item.text)}
              onDragEnd={handleDragEnd}
              onKeyDown={(e) => handleChipKey(e, item.text)}
              title={vi ? "Nhấn Enter để phân loại, hoặc kéo vào ô" : "Press Enter to cycle, or drag to a bin"}
            >
              {item.text}
            </div>
          ))}
        </div>
      )}

      {/* Bins */}
      <div className="practice-bins">
        {bins.map((bin) => {
          const inBin = activity.items.filter((item) => assignments[item.text] === bin);
          return (
            <div
              key={bin}
              className={`practice-dnd-zone practice-bin${overBin === bin ? " dnd-over" : ""}`}
              onDragOver={(e) => handleBinDragOver(e, bin)}
              onDrop={() => handleBinDrop(bin)}
              onDragLeave={handleBinDragLeave}
              aria-label={bin}
            >
              <div className="practice-bin-label mono">{bin}</div>
              {inBin.length > 0 ? inBin.map((item) => {
                const isCorrect = item.answer === bin;
                return (
                  <div
                    key={item.text}
                    className={`practice-dnd-chip${checked ? (isCorrect ? " chip-correct" : " chip-incorrect") : ""}`}
                    draggable
                    tabIndex={0}
                    aria-label={item.text}
                    onDragStart={() => handleItemDragStart(item.text)}
                    onDragEnd={handleDragEnd}
                    onKeyDown={(e) => handleChipKey(e, item.text)}
                  >
                    {item.text}
                    {checked && <span aria-hidden="true" style={{ marginLeft: ".4rem" }}>{isCorrect ? "✓" : "✗"}</span>}
                  </div>
                );
              }) : (
                <span className="practice-bin-empty">{vi ? "Thả vào đây" : "Drop here"}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="practice-dnd-actions">
        <button
          type="button"
          className="sim-send-btn"
          onClick={check}
          disabled={unassigned.length > 0 || checked}
        >
          {vi ? "Kiểm tra" : "Check"}
        </button>
        <button type="button" className="sim-reset-btn" onClick={reset}>
          {vi ? "Đặt lại" : "Reset"}
        </button>
      </div>

      {checked && (
        <div
          className={`practice-dnd-result${allCorrect ? " dnd-correct" : " dnd-wrong"}`}
          role="status"
          aria-live="polite"
        >
          <span className="practice-dnd-icon">{allCorrect ? "✓" : "✗"}</span>
          <strong>{allCorrect ? (vi ? "Xuất sắc!" : "Excellent!") : (vi ? "Chưa đúng hết." : "Some errors.")}</strong>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// GENERIC PRACTICE — wraps ordering vs classification
// ────────────────────────────────────────────────────────────────

export function DragDropPractice({
  activity,
  locale,
}: {
  activity: DnDActivity;
  locale: Locale;
}) {
  if (activity.type === "ordering") {
    return <OrderingPractice activity={activity as OrderingActivity} locale={locale} />;
  }
  if (activity.type === "classification") {
    return <ClassificationPractice activity={activity as ClassificationActivity} locale={locale} />;
  }
  return null;
}
