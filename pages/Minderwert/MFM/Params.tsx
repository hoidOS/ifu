function Params() {
  return (
    <div className="mx-10 pt-10 pb-4">
      <h1 className="pb-2">Parameter</h1>
      <table>
        <tbody>
          <tr>
            <th>VW</th>
            <td>Veräußerungswert inkl. MwSt.</td>
          </tr>
          <tr>
            <th>NP</th>
            <td>Neupreis inkl. Mwst.</td>
          </tr>
          <tr>
            <th>RK</th>
            <td>Reparaturkosten inkl. Mwst.</td>
          </tr>
          <tr>
            <th>SU</th>
            <td>Schadenumfang</td>
          </tr>
          <tr>
            <th>AK</th>
            <td>Alterskorrektur</td>
          </tr>
          <tr>
            <th>FM</th>
            <td>Faktor Marktgängigkeit</td>
          </tr>
          <tr>
            <th>FV</th>
            <td>Faktor Vorschaden</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Params;
