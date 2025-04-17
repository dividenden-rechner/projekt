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
  NurBrutto: number;
  OhneSteuer: number;
}

const DividendenChart: React.FC = () => {
  const [depotwert, setDepotwert] = useState<number>(50000);
  const [rendite, setRendite] = useState<number>(3.0);
  const [wachstum, setWachstum] = useState<number>(5.0);
  const [investition, setInvestition] = useState<number>(0);
  const [zeigeTabelle, setZeigeTabelle] = useState<boolean>(false);
  const [reinvestiereNetto, setReinvestiereNetto] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#f4f4f4'; document.documentElement.style.backgroundColor = '#f4f4f4';
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
    const gesamteSteuerLast = brutto >= 1000 ? 0.26375 : 0;
    const reststeuerSatz = Math.max(0, gesamteSteuerLast - 0.15);

    const steuerfreierBetrag = Math.min(nachQuellensteuer, verbleibenderFreibetrag);
    const steuerpflichtigerBetrag = nachQuellensteuer - steuerfreierBetrag;
    const abgeltungsteuer = steuerpflichtigerBetrag * reststeuerSatz;

    verbleibenderFreibetrag -= steuerfreierBetrag;
    if (verbleibenderFreibetrag < 0) verbleibenderFreibetrag = 0;

    const netto = brutto - quellensteuer - abgeltungsteuer;
    const nurBrutto = brutto; // rein brutto
    const ohneSteuer = brutto - quellensteuer; // ohne Abgeltungsteuer

    if (reinvestiereNetto) {
      aktuellerDepotwert += investition + netto;
    } else {
      aktuellerDepotwert += investition;
    }

    return {
      jahr: `Jahr ${jahr}`,
      Brutto: parseFloat(brutto.toFixed(2)),
      Quellensteuer: -parseFloat(quellensteuer.toFixed(2)),
      Abgeltungsteuer: -parseFloat(abgeltungsteuer.toFixed(2)),
      Netto: parseFloat(netto.toFixed(2)),
      NurBrutto: parseFloat(nurBrutto.toFixed(2)),
      OhneSteuer: parseFloat(ohneSteuer.toFixed(2)),
    };
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <img src="https://lh6.googleusercontent.com/7P-jPankkM6FkZvJm1bvZB_Zp2G_uEk8bfJXEG8lRb1JYvcl-eyO80Glg3hqztGFFL6mmjTCnl4LyeKAIjWJw6E=w16383" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>www.dividenden-rechner.de</h2>
      <button
          onClick={() => {
            const html = document.documentElement;
            const isDark = html.dataset.theme === 'dark';
            html.dataset.theme = isDark ? 'light' : 'dark';
            document.body.style.backgroundColor = isDark ? '#f4f4f4' : '#1f2937';
            document.body.style.color = isDark ? '#111827' : '#f9fafb';
            document.documentElement.style.backgroundColor = isDark ? '#f4f4f4' : '#1f2937';
          }}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            fontSize: '1.4rem',
            cursor: 'pointer',
            color: 'inherit'
          }}
          aria-label="Toggle Dark Mode"
        >
          🌓
        </button>
</header>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={reinvestiereNetto}
            onChange={() => setReinvestiereNetto(!reinvestiereNetto)}
          />
          Netto-Dividenden automatisch reinvestieren
        </label>
      </div>

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
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', background: document.documentElement.dataset.theme === 'dark' ? '#374151' : '#ffffff', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>{label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => {
              const value = e.target.value;
              const parsed = parseFloat(value);
              if (value === '') {
                set(0);
              } else if (!isNaN(parsed) && parsed >= 0) {
                set(parsed);
              }
            }}
              style={{ padding: '0.6rem 0.8rem', border: '1px solid #ccc', borderRadius: '0.375rem', fontSize: '1rem', color: document.documentElement.dataset.theme === 'dark' ? '#f9fafb' : '#111827', backgroundColor: document.documentElement.dataset.theme === 'dark' ? '#1f2937' : '#ffffff', outline: 'none' }}
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
        <div style={{ background: document.documentElement.dataset.theme === 'dark' ? '#374151' : '#ffffff', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: document.documentElement.dataset.theme === 'dark' ? '#f9fafb' : '#111827' }}>
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
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{d.Netto.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ width: '100%', minHeight: 450, backgroundColor: document.documentElement.dataset.theme === 'dark' ? '#374151' : '#ffffff', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={daten} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barCategoryGap={10} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={document.documentElement.dataset.theme === 'dark' ? '#4b5563' : '#d1d5db'} />
              <XAxis dataKey="jahr" interval={0} angle={-15} textAnchor="end" height={60} stroke={document.documentElement.dataset.theme === 'dark' ? '#e5e7eb' : '#111827'} />
              <YAxis stroke={document.documentElement.dataset.theme === 'dark' ? '#e5e7eb' : '#111827'} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`} contentStyle={{ backgroundColor: document.documentElement.dataset.theme === 'dark' ? '#1f2937' : '#ffffff', borderColor: document.documentElement.dataset.theme === 'dark' ? '#4b5563' : '#ccc', color: document.documentElement.dataset.theme === 'dark' ? '#f9fafb' : '#111827' }} />
              <Legend wrapperStyle={{ color: document.documentElement.dataset.theme === 'dark' ? '#e5e7eb' : '#111827' }} />
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
