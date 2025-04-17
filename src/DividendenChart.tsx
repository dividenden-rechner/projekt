import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
  const [zeigeTabelle, setZeigeTabelle] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#f4f4f4';
    document.body.style.color = '#111827';
    document.body.style.fontFamily = 'sans-serif';
  }, []);

  const jahre = Array.from({ length: 10 }, (_, i) => i + 1);
  let aktuellerDepotwert = depotwert;
  let verbleibenderFreibetrag = 1000;

  const daten: ChartData[] = jahre.map((jahr) => {
    const basis = aktuellerDepotwert * (rendite / 100);
    const brutto = basis * Math.pow(1 + wachstum / 100, jahr - 1);

    const quellensteuer = brutto * 0.15;
    const nachQuellensteuer = brutto - quellensteuer;
    const gesamteSteuerLast = 0.26375;
    const reststeuerSatz = Math.max(0, gesamteSteuerLast - 0.15);

    const steuerfreierBetrag = Math.min(nachQuellensteuer, verbleibenderFreibetrag);
    const steuerpflichtigerBetrag = nachQuellensteuer - steuerfreierBetrag;
    const abgeltungsteuer = steuerpflichtigerBetrag * reststeuerSatz;

    verbleibenderFreibetrag -= steuerfreierBetrag;
    if (verbleibenderFreibetrag < 0) verbleibenderFreibetrag = 0;

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <img src="https://lh6.googleusercontent.com/7P-jPankkM6FkZvJm1bvZB_Zp2G_uEk8bfJXEG8lRb1JYvcl-eyO80Glg3hqztGFFL6mmjTCnl4LyeKAIjWJw6E=w16383" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>www.dividenden-rechner.de</h2>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[{
          label: 'Depotwert (€)', value: depotwert, set: setDepotwert
        }, {
          label: 'Dividendenrendite (%)', value: rendite, set: setRendite
        }, {
          label: 'Wachstum p.a. (%)', value: wachstum, set: setWachstum
        }, {
          label: 'Jährliche Investition (€)', value: investition, set: setInvestition
        }].map(({ label, value, set }, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>{label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => set(parseFloat(e.target.value) || 0)}
              style={{ padding: '0.6rem 0.8rem', border: '1px solid #ccc', borderRadius: '0.375rem', fontSize: '1rem', color: '#111827' }}
            />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button
          onClick={() => setZeigeTabelle(!zeigeTabelle)}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {zeigeTabelle ? '📊 Diagramm anzeigen' : '📋 Tabelle anzeigen'}
        </button>
      </div>

      {zeigeTabelle ? (
        <div style={{ background: '#ffffff', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#111827' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Jahr</th>
                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Netto</th>
              </tr>
            </thead>
            <tbody>
              {daten.map((d) => (
                <tr key={d.jahr}>
                  <td style={{ padding: '0.5rem' }}>{d.jahr}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{d.Netto.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ width: '100%', minHeight: 450, backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={daten} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barCategoryGap={10} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jahr" interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
              <Legend />
              <Bar dataKey="Brutto" stackId="a" fill="#d1d5db" barSize={35} />
              <Bar dataKey="Quellensteuer" stackId="a" fill="#f59e0b" barSize={35} />
              <Bar dataKey="Abgeltungsteuer" stackId="a" fill="#ef4444" barSize={35} />
              <Bar dataKey="Netto" stackId="b" fill="#10b981" barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DividendenChart;
