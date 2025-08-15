function SU() {
  return (
    <div>
      <p className="mb-2">
        Es ist ein Faktor zwischen 0,2 und 1,0 zu bestimmen.
      </p>
      <table>
        <tbody>
          <tr>
            <th>0,2</th>
            <td>
              Erneuerung und/oder Instandsetzung von Anbauteilen (z.B.
              Stoßfänger)
            </td>
          </tr>
          <tr>
            <th>0,4</th>
            <td>
              Erneuerung und/oder Instandsetzung von ‚geschraubten‘
              Karosserieteilen (z.B. Tür, Motorhaube, Kotflügel)
            </td>
          </tr>
          <tr>
            <th>0,6</th>
            <td>
              Geringe Instandsetzungsarbeiten von tragenden oder mittragenden
              Karosserieteilen (z.B. Seitenwand instand setzen, Heckblech
              instand setzen)
            </td>
          </tr>
          <tr>
            <th>0,8</th>
            <td>
              Erhebliche Instandsetzungsarbeiten und/oder Erneuerung von
              tragenden oder mittragenden Karosserieteilen (z.B. Kofferboden
              instand setzen, Seitenwand erneuern)
            </td>
          </tr>
          <tr>
            <th>1,0</th>
            <td>
              Erneuerung und/oder erhebliche Instandsetzung (Richtbank
              erforderlich) von tragenden Karosserieteilen (z.B. Längsträger
              instand setzen, Rohbaukarosse)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SU;
