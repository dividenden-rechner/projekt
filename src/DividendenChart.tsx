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

const quellensteuerSatzByLand: Record<string, number> = {
  Indien: 0.20,
  Deutschland: 0.0,
  USA: 0.15,
  Schweiz: 0.35,
  Frankreich: 0.30,
  Dänemark: 0.27,
  Kanada: 0.25,
  Italien: 0.26,
  Spanien: 0.19,
  China: 0.10,
  Hongkong: 0.0,
  Indonesien: 0.20,
  Singapur: 0.0,
  Japan: 0.15,
  Südkorea: 0.22,
  Österreich: 0.27,
  Niederlande: 0.15,
  Australien: 0.0,
  Großbritannien: 0.0,
  Finnland: 0.30,
  Schweden: 0.30,
  Norwegen: 0.25,
  Belgien: 0.30,
  Luxemburg: 0.15,
  Irland: 0.20,
  Polen: 0.19
};

const DividendenChart: React.FC = () => {
  const [beruecksichtigeAbgeltungsteuer, setBeruecksichtigeAbgeltungsteuer] = useState<boolean>(true);
  const [usQuellensteuer, setUsQuellensteuer] = useState<boolean>(true);
  const [depotwert, setDepotwert] = useState<number>(50000);
  const [rendite, setRendite] = useState<number>(3.0);
  const [wachstum, setWachstum] = useState<number>(5.0);
  const [investition, setInvestition] = useState<number>(0);
  const [zeigeTabelle, setZeigeTabelle] = useState<boolean>(false);
  const [reinvestiereNetto, setReinvestiereNetto] = useState<boolean>(false);
  const [freibetragIgnorieren, setFreibetragIgnorieren] = useState<boolean>(false);
  const [expertenmodus, setExpertenmodus] = useState<boolean>(false);
  const [herkunftsland, setHerkunftsland] = useState<string>('USA');
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
  
  const quellensteuerSatz = expertenmodus ? (quellensteuerSatzByLand[herkunftsland] ?? 0.15) : (usQuellensteuer ? 0.15 : 0);

  const daten: ChartData[] = jahre.map((jahr) => {
    const basis = aktuellerDepotwert * (rendite / 100);
    const brutto = basis * Math.pow(1 + wachstum / 100, jahr - 1);

    const quellensteuer = brutto * quellensteuerSatz;
    const nachQuellensteuer = brutto - quellensteuer;
    const gesamteSteuerLast = 0.26375;

    let steuerpflichtigerBetrag = 0;
if (!freibetragIgnorieren) {
  const steuerfreierBetrag = Math.min(nachQuellensteuer, 1000);
  steuerpflichtigerBetrag = nachQuellensteuer - steuerfreierBetrag;
} else {
  steuerpflichtigerBetrag = nachQuellensteuer;
}

    const abgeltungsteuer = (() => {
      if (!beruecksichtigeAbgeltungsteuer && !expertenmodus) return 0;
      if (expertenmodus) {
        const grenze = 1000;
        const abzugBerechnet = Math.max(0, nachQuellensteuer - grenze);
        return abzugBerechnet * gesamteSteuerLast;
      }
      return steuerpflichtigerBetrag > 0 ? steuerpflichtigerBetrag * gesamteSteuerLast : 0;
    })();

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
          src="https://i.imgur.com/uuau6tt.png"
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

      <p style={{ marginBottom: '2rem', textAlign: 'center' }}>Berechne deine Nettodividenden – inkl. Quellensteuer und Abgeltungsteuer. Wähle bei Bedarf ein Herkunftsland aus und aktiviere den Expertenmodus.</p>

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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={reinvestiereNetto} onChange={() => setReinvestiereNetto(!reinvestiereNetto)} />
          Netto-Dividenden reinvestieren
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={zeigeTabelle} onChange={() => setZeigeTabelle(!zeigeTabelle)} />
          Tabelle anzeigen
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={freibetragIgnorieren} onChange={() => setFreibetragIgnorieren(!freibetragIgnorieren)} />
          Steuerfreibetrag an/aus
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={expertenmodus} onChange={() => setExpertenmodus(!expertenmodus)} />
          Expertenmodus aktivieren
        </label>
        {!expertenmodus && (
          <>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={usQuellensteuer} onChange={() => setUsQuellensteuer(!usQuellensteuer)} />
              US-Quellensteuer berücksichtigen
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={beruecksichtigeAbgeltungsteuer} onChange={() => setBeruecksichtigeAbgeltungsteuer(!beruecksichtigeAbgeltungsteuer)} />
              Abgeltungsteuer berücksichtigen
            </label>
          </>
        )}
        {expertenmodus && (
          <label>
            Herkunftsland:<br />
            <select value={herkunftsland} onChange={e => setHerkunftsland(e.target.value)} style={{ padding: '0.5rem' }}>
              {Object.entries(quellensteuerSatzByLand).sort(([a], [b]) => a.localeCompare(b)).map(([land, satz]) => (
                <option key={land} value={land}>{`${land} (${(satz * 100).toFixed(0)} %)`}</option>
              ))}
            </select>
          </label>
        )}
      </div>
    <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={daten} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jahrNummer" />
            <YAxis />
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
            <Legend />
            <Bar dataKey="Brutto" stackId="a" fill="#8884d8" />
            <Bar dataKey="Quellensteuer" stackId="a" fill="#f59e0b" />
            <Bar dataKey="Abgeltungsteuer" stackId="a" fill="#ef4444" />
            <Bar dataKey="Netto" stackId="b" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {zeigeTabelle && (
        <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse', backgroundColor: isDarkMode ? '#1f2937' : '#fff', color: isDarkMode ? '#f9fafb' : '#111827', minWidth: '700px' }}>
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
