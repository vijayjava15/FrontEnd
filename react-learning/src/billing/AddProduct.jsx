import axios from "axios";
import React, { useState } from "react";
import { URL } from "../Constant";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [prodObj, setProdObj] = useState({
    productName: "",
    purchasePrice: "",
    sellingPrice: "",
    imageUrl: "",
  });

  const navigate = useNavigate()
  const setValueToMenu = (field, value) => {
    setProdObj((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createProduct = () => {

    axios.post(URL+'/addProduct', prodObj)
    .then(res => {
        console.log(res)
        alert("product saved sucessFully")
        navigate('/billing')
    })

  };

  return (
    <div>
      <div className="prod-container">
        <p>Add Product</p>

        <div className="prodFormContainer">
          <form action="submit" method="post" className="menuForm">
            <input
              type="text"
              placeholder="Product Name"
              required
              name="productName"
              value={prodObj.productName}
              className="form-input"
              onChange={(e) => setValueToMenu("productName", e.target.value)}
            />
            <input
              type="number"
              placeholder="purchase Price"
              required
              name="purchasePrice"
              value={prodObj.purchasePrice}
              className="form-input"
              onChange={(e) => setValueToMenu("purchasePrice", e.target.value)}
            />
            <input
              type="text"
              placeholder="sellingPrice"
              required
              name="sellingPrice"
              value={prodObj.sellingPrice}
              className="form-input"
              onChange={(e) => setValueToMenu("sellingPrice", e.target.value)}
            />

            <input
              type="text"
              placeholder="Product icon Url"
              required
              name="imageUrl"
              value={prodObj.imageUrl}
              className="form-input"
              onChange={(e) => setValueToMenu("imageUrl", e.target.value)}
            />
          </form>
          <div className="menuSubmit">
            <button onClick={(e) => createProduct()}> Save </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
