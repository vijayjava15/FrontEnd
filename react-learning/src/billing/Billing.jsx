import React, { useContext, useEffect, useState } from "react";
import "./billing.css";
import assets from "../../src/assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../Constant";
import { UserContext } from "../UserProvider";
const Billing = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const changePage = () => {
    navigate("/addProduct");
  };
  const { username } = useContext(UserContext);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios.get(URL + "/getProduct").then((res) => {
      console.log(res);

      const prodList = [];
      res.data.forEach((element) => {
        const prod = {};
        prod.productName = element.productName;
        prod.sellingPrice = element.sellingPrice;
        prod.imageUrl = element.imageUrl;
        prod.total = element.sellingPrice;
        prod.qty = 0;
        prodList.push(prod);
      });
      setProducts(prodList);
    });
  }, [refresh]);

  const changeTotalAndQuanity = (index, sellingPrice) => {
    const prodList = [...products];
    const prodObj = prodList[index];
    prodObj.qty = prodObj.qty + 1;
    if (prodObj.qty >= 0) {
      prodObj.total = sellingPrice * prodObj.qty;
      prodList[index] = prodObj;
      console.log(prodList);
      setProducts(prodList);
      changeTotal();
      addToCart();
      setRefresh(true);
      getCartItems();
    }
  };

  const minusQty = (index, sellingPrice) => {
    const prodList = [...products];
    const prodObj = prodList[index];
    prodObj.qty = prodObj.qty - 1;
    if (prodObj.qty >= 0) {
      prodObj.total = sellingPrice * prodObj.qty;
      prodList[index] = prodObj;
      console.log(prodList);
      setProducts(prodList);
      changeTotal();
      addToCart();
      setRefresh(true);
      getCartItems();
    }
  };

  const changeQTy = (value, index) => {
    console.log(value);
    if (value >= 0) {
      const updated = [...products];

      updated[index] = {
        ...updated[index],
        qty: value,
        total: value * updated[index].sellingPrice,
      };

      setProducts(updated);
      changeTotal();
      //addToCart();
    }
  };

  const changeTotal = () => {
    let total = 0;

    products.forEach((p) => {
      total += p.total;
    });

    setTotalAmount(total);
  };

  const addToCart = () => {
    const cartItems = [];
    products.map((product) => {
      const cartItem = {};
      cartItem.productName = product.productName;
      cartItem.price = product.sellingPrice;
      cartItem.quantity = product.qty;
      cartItems.push(cartItem);
    });
    const cart = {};
    cart.totalAmount = totalAmount;
    cart.userName = username;
    cart.cartItems = cartItems;
    console.log(URL);
    axios.post(URL + "/cart/addProduct", cart).then((res) => {
      console.log(res);
      console.log("sucess");
    });
  };

  const getCartItems = () => {
    const cart = {};
    cart.userName = username;
    axios.post(URL + "/cart/getProduct", cart).then((res) => {
      console.log(res);
    }).catch(err => console.log(err));
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        {/* Product List Section */}
        <div className="col-md-9">
          <div className="row">
            {products.map((product, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body text-center">
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="img-fluid rounded-circle mb-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                    <h6 className="card-title">{product.productName}</h6>
                    <div className="d-flex justify-content-center align-items-center gap-2 my-3">
                      <button
                        className="btn btn-sm btn-outline-secondary px-3"
                        onClick={(e) => minusQty(index, product.sellingPrice)}
                      >
                        -
                      </button>
                      <input
                        className="form-control form-control-sm text-center"
                        style={{ width: "60px" }}
                        type="number"
                        value={product.qty}
                        onChange={(e) => changeQTy(e.target.value, index)}
                        disabled
                      />
                      <button
                        className="btn btn-sm btn-outline-secondary px-3"
                        onClick={(e) =>
                          changeTotalAndQuanity(index, product.sellingPrice)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="text-muted small mb-2">
                      Price: {product.sellingPrice}
                    </div>
                    <div className="fw-bold text-primary">
                      Total: {product.total}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Summary Section */}
        <div className="col-md-3">
          <div
            className="card shadow-sm border-0 bg-light p-3 sticky-top"
            style={{ top: "20px" }}
          >
            <h5 className="mb-4">Billing Summary</h5>
            <div className="d-flex justify-content-between mb-4">
              <ul>
                Items
                {}
              </ul>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span>Grand Total:</span>
              <span className="fw-bold text-success fs-4">{totalAmount}</span>
            </div>
            <hr />
            <button className="btn btn-success w-100 mb-2 py-2 fw-bold">
              GENERATE BILL
            </button>
            <button
              className="btn btn-outline-primary w-100 py-2"
              onClick={changePage}
            >
              ADD PRODUCT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
