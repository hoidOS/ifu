import SU from './MFM/SU'
import { useState } from 'react'

function ValueCalc() {

  const [toggle, setToggle] = useState(false)

  const handleTest = () => {
    return (
      <SU />
    )
  }

  const toggleIn = () => {
    setToggle(!toggle)
  }



  return (
    <div className="p-2 lg:p-10">
      <div className="flex justify-center text-white p-8 mb-4 bg-[#34495e] text-center rounded-xl">
        <h1>Merkantiler Minderwert</h1>
      </div>

      <div className="grid lg:grid-cols-2 max-w-[80%] justify-items-center gap-5 m-auto">
        <div className="grid p-6 w-[100%] bg-white border-2 border-solid rounded-xl border-[#ccc] shadow-xl">
          <h1>Ergebnisse</h1>
          <hr />
          <p>BVSK</p>
          <input onClick={toggleIn} onBlur={toggleIn} type="text" />
          <input type="text" />
          <select className="max-w-[40%]" name="" id="">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="fiat">Fiat</option>
            <option value="audi">Audi</option>
          </select>

          <p>MFM</p>
          <select name="" id="">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="fiat">Fiat</option>
            <option value="audi">Audi</option>
          </select>

          <select name="" id="">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="fiat">Fiat</option>
            <option value="audi">Audi</option>
          </select>

          <select name="" id="">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="fiat">Fiat</option>
            <option value="audi">Audi</option>
          </select>

        </div>
        <div className="p-6 w-[100%] bg-white border-2 border-solid rounded-xl border-[#ccc] shadow-xl">
          <h1>Info</h1>
          <hr />
          <p>BVSK</p>
          <p>MFM</p>
        </div>
      <div className="grid p-6 w-[100%] m-0 col-span-2 bg-white border-2 border-solid rounded-xl border-[#ccc] shadow-xl">
          <p>{toggle ? handleTest() : <p>nill</p>}</p>
      </div>
      </div>
    </div>
  );
}

export default ValueCalc;
