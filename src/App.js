import React, { useState } from 'react';
import './App.css';
import LoaderSpinner from './LoaderSpinner.gif';

const App = () => {
  const [info, setInfo] = useState({ orderNo: "", courier_partner: "", service_type: "" });
  const [cred, setCred] = useState({});
  const [loader, setLoader] = useState(false); 
  const [result, setResult] = useState(false);

  const onChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setResult(false);
    try {
      const response = await fetch('http://localhost:5500/shipping_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(info),
      });
      if (response.ok) {
        console.log('SUCCESS !!!');
        setResult(true);
        const data = await response.json();
        setCred(data);
      } else {
        console.log("FAILED !!!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="container">
      <div className="sub_container">
        <h1 className="h1">Shipping Cost Calculator</h1>
      </div>
      <form className="form" onSubmit={onSubmit}>
        <div className="sub_container">
          <label htmlFor="orderNo" className="orderNo">OrderNo : </label>
          <input type="text" className="orderNo" name="orderNo" value={info.orderNo} onChange={onChange} />
        </div>
        <div className="sub_container">
          <label htmlFor="courier_partner" className="courier_partner">Courier_partner : </label>
          <select className="courier_partner" name="courier_partner" onChange={onChange} value={info.courier_partner}>
            <option value="">Select an option</option>
            <option value="Amazon">Amazon</option>
            <option value="Delhivery">Delhivery</option>
            <option value="BlueDart">BlueDart</option>
          </select>
        </div>
        <div className="sub_container">
          <label htmlFor="service_type" className="service_type">Service_type : </label>
          <select className="service_type" name="service_type" onChange={onChange} value={info.service_type}>
            <option value="">Select an option</option>
            <option value="Surface">Surface</option>
            <option value="Air">Air</option>
          </select>
        </div>
        <div className="sub_container">
          <button className="btn" onClick={onSubmit}>Submit</button>
        </div>
      </form>

      {loader ? (
        <div className="loader">
          <img src={LoaderSpinner} alt="Loading..." />
        </div>
      ) : (
        result ? (
          <div className="result">
            <h2 className="shipping">Shipping Details</h2>
            <table>
              <tr>
                <th>Courier Partner</th>
                <td>{cred.box_name}</td>
              </tr>
              <tr>
                <th>Actual Weight</th>
                <td>{cred.actual_weight} Kg</td>
              </tr>
              <tr>
                <th>Weight Slab (Lower)</th>
                <td>{cred.weight_slab} kg</td>
              </tr>
              <tr>
                <th>COD Value (INR)</th>
                <td>Rs. {cred.COD_value_INR}</td>
              </tr>
              <tr>
                <th>COD Percentage</th>
                <td>{cred.COD_perce} %</td>
              </tr>
              <tr>
                <th>Shipping Charge (Base)</th>
                <td>Rs. {cred["Shipping Charge(Base)"]}</td>
              </tr>
              <tr>
                <th>Additional Charges</th>
                <td>Rs. {cred.add_charges}</td>
              </tr>
              <tr>
                <th>Additional Charge Weight</th>
                <td>{cred.add_charge_weight}</td>
              </tr>
              <tr>
                <th>Service Type</th>
                <td>{cred.service_type}</td>
              </tr>
              <tr>
                <th>Total Cost</th>
                <td>Rs. {cred.total_cost?.toFixed(3)}</td>
              </tr>
            </table>
          </div>
        ) : (
          <div className="result">No Results Found</div>
        )
      )}
    </div>
  );
};

export default App;
