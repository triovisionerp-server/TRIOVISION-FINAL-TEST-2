import React, { useState, useEffect } from "react";
import { analyzeProcessMaterials } from "../../lib/materialCheck";
import { db } from "../../lib/firebase"; // Update path if needed
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

function ManualPriceEntry({ material, onSave }) {
  const [price, setPrice] = useState("");
  return (
    <div>
      <span>{material.name}: </span>
      <input type="number" placeholder="Enter price" value={price}
          onChange={e => setPrice(e.target.value)} />
      <button onClick={() => onSave(material.name, price)}>Save Price</button>
    </div>
  );
}

export default function StoreMaterialAnalysis() {
  const [inventoryMap, setInventoryMap] = useState({});
  const [processSteps, setProcessSteps] = useState([
    "STEEL BASE MAKING",
    "STOCK CUTTING",
    // ...fill with process steps for the job being analyzed!
  ]);
  const [found, setFound] = useState([]);
  const [missing, setMissing] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchInventory() {
      const inv = {};
      const snap = await getDocs(collection(db, "inventory"));
      snap.forEach(docu => {
        const item = docu.data();
        inv[item.name] = { ...item, id: docu.id };
      });
      setInventoryMap(inv);
    }
    fetchInventory();
  }, []);

  useEffect(() => {
    // Re-run check if steps/inventory change
    const res = analyzeProcessMaterials(processSteps, inventoryMap);
    setFound(res.found);
    setMissing(res.missing);
  }, [processSteps, inventoryMap]);

  async function saveMaterialPrice(name, price) {
    // Find the doc ID for material
    const material = inventoryMap[name];
    if (!material || !material.id) return setMessage("Material not found!");
    await updateDoc(doc(db, "inventory", material.id), { price: Number(price) });
    setMessage(`Price saved for ${name}`);
    // Re-fetch inventory with updated price!
    const snap = await getDocs(collection(db, "inventory"));
    const inv = {};
    snap.forEach(docu => {
      const item = docu.data();
      inv[item.name] = { ...item, id: docu.id };
    });
    setInventoryMap(inv);
  }

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Material Analysis</h2>
      <h3>Available Materials</h3>
      <ul>
        {found.map((item, idx) => (
          <li key={idx}>
            {item.name} — Qty: {item.qty}
            {item.price
              ? ` — Price: ${item.price}`
              : <ManualPriceEntry material={item} onSave={saveMaterialPrice} />}
          </li>
        ))}
      </ul>
      <h3>Missing Materials</h3>
      <ul>
        {missing.map((item, idx) => (
          <li key={idx}>{item.name}</li>
        ))}
      </ul>
      {message && <div style={{ color: "green", marginTop: 16 }}>{message}</div>}
    </div>
  );
}
