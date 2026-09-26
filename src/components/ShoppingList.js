import React, { useState } from "react";
import { groupItems, shoppingListText } from "../utils/shopping";

function ShoppingList({ items, checked, onToggle, note }) {
  const [status, setStatus] = useState("");
  const done = new Set(checked);
  const boughtCount = items.filter((i) => done.has(i)).length;
  const text = shoppingListText(items, checked);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Couldn't copy automatically. Select the list and copy it manually.");
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: "Shopping list", text });
    } catch {
      // Share sheet dismissed; nothing to do.
    }
  };

  return (
    <section className="shopping-list">
      <h2>Your Shopping List</h2>
      <p className="shopping-progress">
        {boughtCount} of {items.length} items bought
      </p>
      {note && <p className="shopping-note">{note}</p>}

      <div className="shopping-groups">
        {groupItems(items).map(({ category, items: list }) => (
          <div key={category} className="shopping-group">
            <h3>{category}</h3>
            <ul>
              {list.map((item) => (
                <li key={item}>
                  <label className={done.has(item) ? "bought" : ""}>
                    <input
                      type="checkbox"
                      checked={done.has(item)}
                      onChange={() => onToggle(item)}
                    />
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="shopping-actions">
        <button className="btn" onClick={copy}>Copy list</button>
        <a
          className="btn btn-whatsapp"
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Send on WhatsApp
        </a>
        {typeof navigator !== "undefined" && navigator.share && (
          <button className="btn btn-outline" onClick={share}>Share…</button>
        )}
      </div>
      {status && <p className="shopping-status">{status}</p>}
    </section>
  );
}

export default ShoppingList;
