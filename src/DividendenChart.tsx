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
  jahrNummer: number;
}

const DividendenChart: React.FC = () => {
  const [depotwert, setDepotwert] = useState<number>(50000);
  const [rendite, setRendite] = useState<number>(3.0);
  const [wachstum, setWachstum] = useState<number>(5.0);
  const [investition, setInvestition] = useState<number>(0);
  const [zeigeTabelle, setZeigeTabelle] = useState<boolean>(false);
  const [reinvestiereNetto, setReinvestiereNetto] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.fontFamily = 'sans-serif';
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
    document.body.style.backgroundColor = isDarkMode ? '#1f2937' : '#f4f4f4';
    document.documentElement.style.backgroundColor = isDarkMode ? '#1f2937' : '#f4f4f4';
    document.body.style.color = isDarkMode ? '#f9fafb' : '#111827';
  }, [isDarkMode]);

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
    const nurBrutto = brutto;
    const ohneSteuer = brutto - quellensteuer;

    if (reinvestiereNetto) {
      aktuellerDepotwert += investition + netto;
    } else {
      aktuellerDepotwert += investition;
    }

    return {
      jahr: `Jahr ${jahr}`,
      jahrNummer: jahr,
      Brutto: parseFloat(brutto.toFixed(2)),
      Quellensteuer: -parseFloat(quellensteuer.toFixed(2)),
      Abgeltungsteuer: -parseFloat(abgeltungsteuer.toFixed(2)),
      Netto: parseFloat(netto.toFixed(2)),
      NurBrutto: parseFloat(nurBrutto.toFixed(2)),
      OhneSteuer: parseFloat(ohneSteuer.toFixed(2)),
    };
  });

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <img
          src="https://lh6.googleusercontent.com/7P-jPankkM6FkZvJm1bvZB_Zp2G_uEk8bfJXEG8lRb1JYvcl-eyO80Glg3hqztGFFL6mmjTCnl4LyeKAIjWJw6E=w16383"
          alt="Logo"
          style={{ width: '40px', height: '40px', borderRadius: '8px' }}
        />
        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>www.dividenden-rechner.de</h2>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
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

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', justifyContent: 'center', textAlign: 'center' }}>
        <label>
          Depotwert (€):<br />
          <input type="number" value={depotwert} onChange={e => setDepotwert(parseFloat(e.target.value))} style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #ccc', color: isDarkMode ? '#111827' : '#111827', backgroundColor: isDarkMode ? '#f9fafb' : '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', outline: 'none', transition: 'all 0.2s ease-in-out' }} />
        </label>
        <label>
          Dividendenrendite (%):<br />
          <input type="number" value={rendite} onChange={e => setRendite(parseFloat(e.target.value))} style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #ccc', color: isDarkMode ? '#111827' : '#111827', backgroundColor: isDarkMode ? '#f9fafb' : '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', outline: 'none', transition: 'all 0.2s ease-in-out' }} />
        </label>
        <label>
          Dividendenwachstum (%):<br />
          <input type="number" value={wachstum} onChange={e => setWachstum(parseFloat(e.target.value))} style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #ccc', color: isDarkMode ? '#111827' : '#111827', backgroundColor: isDarkMode ? '#f9fafb' : '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', outline: 'none', transition: 'all 0.2s ease-in-out' }} />
        </label>
        <label>
          Jährliche Investition (€):<br />
          <input type="number" value={investition} onChange={e => setInvestition(parseFloat(e.target.value))} style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #ccc', color: isDarkMode ? '#111827' : '#111827', backgroundColor: isDarkMode ? '#f9fafb' : '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', outline: 'none', transition: 'all 0.2s ease-in-out' }} />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={reinvestiereNetto}
            onChange={() => setReinvestiereNetto(!reinvestiereNetto)}
          />
          Netto-Dividenden automatisch reinvestieren
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={zeigeTabelle}
            onChange={() => setZeigeTabelle(!zeigeTabelle)}
          />
          Tabelle anzeigen
        </label>
      </div>

      <div style={{ width: '100%', minHeight: 450, backgroundColor: isDarkMode ? '#374151' : '#ffffff', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={daten} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barCategoryGap={10} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4b5563' : '#d1d5db'} />
            <XAxis dataKey="jahrNummer" interval={0} angle={0} textAnchor="middle" height={40} stroke={isDarkMode ? '#e5e7eb' : '#111827'} />
            <YAxis stroke={isDarkMode ? '#e5e7eb' : '#111827'} />
            <Tooltip
              formatter={(value: number, name: string) => {
                const monthly = value / 12;
                const formatted = `${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
                const monthlyAvg = ` (${monthly.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €/Monat)`;
                const yearlySuffix = ' (pro Jahr)';
                if (name === 'Brutto' || name === 'Netto') {
                  return formatted + monthlyAvg;
                } else if (name === 'Quellensteuer' || name === 'Abgeltungsteuer') {
                  return formatted + yearlySuffix;
                }
                return formatted;
              }}
              contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', borderColor: isDarkMode ? '#4b5563' : '#ccc', color: isDarkMode ? '#f9fafb' : '#111827' }}
            />
            <Legend wrapperStyle={{ color: isDarkMode ? '#e5e7eb' : '#111827' }} />
            <Bar dataKey="Brutto" stackId="a" fill="#d1d5db" barSize={35} />
            <Bar dataKey="Quellensteuer" stackId="a" fill="#f59e0b" barSize={35} />
            <Bar dataKey="Abgeltungsteuer" stackId="a" fill="#ef4444" barSize={35} />
            <Bar dataKey="Netto" stackId="b" fill="#10b981" barSize={35} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {zeigeTabelle && (
        <table style={{ width: '100%', marginTop: '2rem', overflowX: 'auto', display: 'block', borderCollapse: 'collapse', backgroundColor: isDarkMode ? '#1f2937' : '#fff', color: isDarkMode ? '#f9fafb' : '#111827' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Jahr</th>
              <th style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Brutto</th>
              <th style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Quellensteuer</th>
              <th style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Abgeltungsteuer</th>
              <th style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Netto</th>
            </tr>
          </thead>
          <tbody>
            {daten.map((d, index) => (
              <tr key={index}>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>{d.jahr}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>{d.Brutto.toLocaleString('de-DE')} €</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>{d.Quellensteuer.toLocaleString('de-DE')} €</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>{d.Abgeltungsteuer.toLocaleString('de-DE')} €</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>{d.Netto.toLocaleString('de-DE')} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DividendenChart;
