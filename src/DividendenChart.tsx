import React, { useState } from 'react';
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
} from 'recharts';

interface ChartData {
  jahr: string;
  Brutto: number;
  Quellensteuer: number;
  Abgeltungsteuer: number;
  Netto: number;
}

const DividendenChart: React.FC = () => {
  const [depotwert, setDepotwert] = useState<number>(50000);
  const [rendite, setRendite] = useState<number>(3.0);
  const [wachstum, setWachstum] = useState<number>(5.0);
  const [investition, setInvestition] = useState<number>(0);

  const jahre = Array.from({ length: 10 }, (_, i) => i + 1);

  let aktuellerDepotwert = depotwert;
  const daten: ChartData[] = jahre.map((jahr) => {
    const basis = aktuellerDepotwert * (rendite / 100);
    const brutto = basis * Math.pow(1 + wachstum / 100, jahr - 1);
    const quellensteuer = brutto * 0.15;
    const abgeltungsteuer = (brutto - quellensteuer) * 0.26375;
    const netto = brutto - quellensteuer - abgeltungsteuer;

    aktuellerDepotwert += investition;

    return {
      jahr: `Jahr ${jahr}`,
      Brutto: parseFloat(brutto.toFixed(2)),
      Quellensteuer: -parseFloat(quellensteuer.toFixed(2)),
      Abgeltungsteuer: -parseFloat(abgeltungsteuer.toFixed(2)),
      Netto: parseFloat(netto.toFixed(2)),
    };
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <h2>Dividendenrechner</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label>Depotwert (€)</label>
          <input
            type="number"
            value={depotwert}
            onChange={(e) => setDepotwert(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label>Dividendenrendite (%)</label>
          <input
            type="number"
            value={rendite}
            onChange={(e) => setRendite(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label>Wachstum p.a. (%)</label>
          <input
            type="number"
            value={wachstum}
            onChange={(e) => setWachstum(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label>Jährliche Investition (€)</label>
          <input
            type="number"
            value={investition}
            onChange={(e) => setInvestition(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={daten}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barCategoryGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jahr" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} €`} />
            <Legend />
            <Bar dataKey="Brutto" stackId="a" fill="#d1d5db">
              <LabelList dataKey="Brutto" position="top" formatter={(val: number) => `${val} €`} />
            </Bar>
            <Bar dataKey="Quellensteuer" stackId="a" fill="#f59e0b" />
            <Bar dataKey="Abgeltungsteuer" stackId="a" fill="#ef4444" />
            <Bar dataKey="Netto" stackId="b" fill="#10b981">
              <LabelList dataKey="Netto" position="insideTop" formatter={(val: number) => `${val} €`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DividendenChart;
