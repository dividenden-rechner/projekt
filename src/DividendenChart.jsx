import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from "recharts";

const DividendenChart = () => {
  const [depotwert, setDepotwert] = useState(50000);
  const [rendite, setRendite] = useState(3.0);
  const [wachstum, setWachstum] = useState(5.0);
  const [investition, setInvestition] = useState(0);

  const jahre = Array.from({ length: 10 }, (_, i) => i + 1);

  let aktuellerDepotwert = depotwert;
  const daten = jahre.map((jahr) => {
    const basis = aktuellerDepotwert * (rendite / 100);
    const brutto = basis * Math.pow(1 + wachstum / 100, jahr - 1);
    const quellensteuer = brutto * 0.15;
    const abgeltungsteuer = (brutto - quellensteuer) * 0.26375;
    const netto = brutto - quellensteuer - abgeltungsteuer;

    aktuellerDepotwert += investition; // Jährlich investieren

    return {
      jahr: `Jahr ${jahr}`,
      Brutto: parseFloat(brutto.toFixed(2)),
      Quellensteuer: -parseFloat(quellensteuer.toFixed(2)),
      Abgeltungsteuer: -parseFloat(abgeltungsteuer.toFixed(2)),
      Netto: parseFloat(netto.toFixed(2)),
    };
  });

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Depotwert (€)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={depotwert}
            onChange={(e) => setDepotwert(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dividendenrendite (%)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={rendite}
            onChange={(e) => setRendite(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Wachstum p.a. (%)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={wachstum}
            onChange={(e) => setWachstum(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Jährliche Investition (€)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={investition}
            onChange={(e) => setInvestition(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={daten}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barCategoryGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jahr" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
            <Legend />
            <defs>
              <filter id="shadow" height="130%">
                <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="#999" />
              </filter>
            </defs>
            <Bar dataKey="Brutto" stackId="a" fill="#d1d5db" radius={[8, 8, 0, 0]} filter="url(#shadow)">
              <LabelList dataKey="Brutto" position="top" formatter={(val) => `${val} €`} />
            </Bar>
            <Bar dataKey="Quellensteuer" stackId="a" fill="#f59e0b" radius={[8, 8, 0, 0]} filter="url(#shadow)" />
            <Bar dataKey="Abgeltungsteuer" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} filter="url(#shadow)" />
            <Bar dataKey="Netto" stackId="b" fill="#10b981" radius={[8, 8, 0, 0]} filter="url(#shadow)">
              <LabelList dataKey="Netto" position="insideTop" formatter={(val) => `${val} €`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DividendenChart;
