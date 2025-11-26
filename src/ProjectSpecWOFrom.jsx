'use client';
import React, { useState } from "react";

// 1. This represents your PSS form initial state (adapt keys as needed)
const initialForm = {
  docNo: "PSS-001",
  date: new Date().toISOString().substring(0, 10),
  customerName: "",
  workOrderDate: new Date().toISOString().substring(0, 10),
  projectName: "",
  projectStartDate: "",
  projectNumber: "",
  projectEndDate: "",
  patternMaterial: "",
  deliverables: "",
  process: "",
  // add more fields for a realistic form as needed
};

// 2. Work Order/BOM logic generator (can expand for real logic)
function generateWorkOrder(form) {
  const woNo = "WO-" + Date.now();
  const routingSteps =
    form.deliverables === "Master Pattern"
      ? [
          "Pattern Prep", "Tooling/Mold", "Layup", "Cure", "Trim", "QC", "Ship"
        ]
      : [
          "Tooling/Mold", "Layup", "Infusion", "Cure", "Trim", "QC", "Ship"
        ];

  const bom = [
    { name: "Resin", qty: 60, units: "kg" },
    { name: "Glass Fiber", qty: 50, units: "kg" },
    { name: form.patternMaterial, qty: 1, units: "block" },
    // add more using your form/process mappings
  ];
  return {
    WO: woNo,
    project: form.projectName,
    customer: form.customerName,
    start: form.projectStartDate,
    end: form.projectEndDate,
    routing: routingSteps,
    BOM: bom,
    specSheet: form,
    status: "Scheduled",
  };
}

export default function ProjectSpecWOForm() {
  const [formData, setFormData] = useState(initialForm);
  const [workOrder, setWorkOrder] = useState(null);

  // 3. Update form on change (simple handler)
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // 4. On submit, generate WO/BOM, save to localStorage, and preview
  function handleSubmit(e) {
    e.preventDefault();
    // Add validation as needed!
    const newWO = generateWorkOrder(formData);
    setWorkOrder(newWO);

    // Save result (could send to backend instead)
    const allWOs = JSON.parse(localStorage.getItem("workorders") || "[]");
    localStorage.setItem("workorders", JSON.stringify([newWO, ...allWOs]));
    alert(`Work Order ${newWO.WO} created!`);
  }

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Project Specification Sheet
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Main form fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input name="docNo" value={formData.docNo} readOnly placeholder="Doc No" />
          <input name="date" value={formData.date} readOnly placeholder="Date" />
          <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Customer Name" />
          <input name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Project Name" />
          <input name="projectNumber" value={formData.projectNumber} onChange={handleChange} placeholder="Project Number" />
          <input name="workOrderDate" type="date" value={formData.workOrderDate} onChange={handleChange} placeholder="WO Date" />
          <input name="projectStartDate" type="date" value={formData.projectStartDate} onChange={handleChange} placeholder="Start Date" />
          <input name="projectEndDate" type="date" value={formData.projectEndDate} onChange={handleChange} placeholder="Delivery Date" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
          <select name="patternMaterial" value={formData.patternMaterial} onChange={handleChange}>
            <option value="">-- Pattern Material --</option>
            <option value="PU Block">PU Block</option>
            <option value="PS Foam with Tooling Paste">PS Foam with Tooling Paste</option>
            <option value="MDF">MDF</option>
            {/* Add more as needed */}
          </select>
          <select name="deliverables" value={formData.deliverables} onChange={handleChange}>
            <option value="">-- Project Deliverables --</option>
            <option value="Master Pattern">Master Pattern</option>
            <option value="Direct Mould">Direct Mould</option>
            <option value="Both">Both</option>
          </select>
          <select name="process" value={formData.process} onChange={handleChange}>
            <option value="">-- Part Production Process --</option>
            <option value="Hand Layup">Hand Layup</option>
            <option value="Infusion">Infusion</option>
            <option value="RTM">RTM</option>
            {/* More... */}
          </select>
        {/* Add more fields as you wish */}
        </div>
        <button type="submit" style={{
          marginTop: 20,
          padding: "12px 24px",
          fontWeight: "bold",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 18
        }}>Submit</button>
      </form>

      {/* Preview Work Order / BOM */}
      {workOrder && (
        <div style={{ marginTop: 32, padding: 24, background: "#f6f8fa", borderRadius: 8 }}>
          <h2 style={{ fontSize: 22, color: "#0a4065" }}>Work Order Created!</h2>
          <div>WO Number: <b>{workOrder.WO}</b></div>
          <div>Project: <b>{workOrder.project}</b></div>
          <div>Customer: <b>{workOrder.customer}</b></div>
          <div>Start: <b>{workOrder.start}</b>  End: <b>{workOrder.end}</b></div>
          <div style={{ marginTop: 14, fontWeight: "bold" }}>Routing Steps:</div>
          <ol>{workOrder.routing.map((step, i) => <li key={i}>{step}</li>)}</ol>
          <div style={{ marginTop: 14, fontWeight: "bold" }}>Bill of Materials:</div>
          <table border={1} cellPadding={6} style={{marginTop:4, borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"#e7ecf1"}}><th>Material</th><th>Qty</th><th>Units</th></tr>
            </thead>
            <tbody>
              {workOrder.BOM.map((item,i) => (
                <tr key={i}><td>{item.name}</td><td>{item.qty}</td><td>{item.units}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
