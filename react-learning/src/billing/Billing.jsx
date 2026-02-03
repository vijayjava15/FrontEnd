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
  const [cartItems, setCartItems] = useState([]);

  const changePage = () => {
    navigate("/addProduct");
  };
  const { username } = useContext(UserContext);

  useEffect(() => {
    getCartItems();
    getQty();
    axios.get(URL + "/getProduct").then((res) => {
      console.log(res);

      const prodList = [];
      res.data.forEach((element) => {
        const prod = {};
        prod.productName = element.productName;
        prod.sellingPrice = element.sellingPrice;
        prod.imageUrl = element.imageUrl;

        prodList.push(prod);
      });
      setProducts(prodList);
    });
  }, []);

  const changeTotalAndQuanity = (index, sellingPrice) => {
    const prodList = [...products];
    const prodObj = prodList[index];
    addToCart(prodObj);
  };

  const minusQty = (index, sellingPrice) => {
    const prodList = [...products];
    const prodObj = prodList[index];

    addToCart(prodObj);
  };

  const addToCart = (prodObj) => {
    const cartItems = [];

    const cartItem = {};
    cartItem.productName = prodObj.productName;
    cartItem.price = prodObj.sellingPrice;
    cartItem.quantity = prodObj.qty;
    cartItems.push(cartItem);

    const cart = {};
    cart.totalAmount = totalAmount;
    cart.userName = username;
    cart.cartItems = cartItems;
    console.log(URL);
    axios.post(URL + "/cart/addProduct", cart).then((res) => {
      console.log(res);
      console.log("sucess");
      console.log(res);
      getCartItems();
      // setCartItems(res.data.data.cartItems);
      // setTotalAmount(res.data.data.totalAmount);
    });
  };

  const getCartItems = () => {
    const cart = {};
    cart.userName = username;
    axios
      .post(URL + "/cart/getProduct", cart)
      .then((res) => {
        console.log(res);
        setCartItems(res.data.data.cartItems);
        setTotalAmount(res.data.data.totalAmount);
      })
      .catch((err) => console.log(err));
  };

  const clearCart = () => {
    const cart = {};
    cart.userName = username;
    axios
      .post(URL + "/cart/clear", cart)
      .then((res) => {
        console.log(res);
        getCartItems();
      })
      .catch((err) => console.log(err));
  };

  const getQty = (productName) => {
    const item = cartItems.find((c) => c.productName === productName);
    return item ? item.quantity : 0;
  };

  const generateBill = () => {
  const cart = {
    userName: username,
  };

  axios({
    url: URL + "/order/create",
    method: "POST",
    data: cart,         
    responseType: "blob",
    headers: {
      "Content-Type": "application/json"
    }
  }).then((res) => {
  getCartItems();
    const blob = new Blob([res.data], {
      type: "application/pdf",
    });

    const pdfUrl = window.URL.createObjectURL(blob);
    window.open(pdfUrl);
  });


};

  return (
    <div className="container-fluid p-4">
      <div className="row">
        {/* Product List Section */}
        <div className="col-md-8">
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
                        value={getQty(product.productName)}
                        readOnly
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Summary Section */}
        <div className="col-md-4">
          <div
            className="card shadow-sm border-0 bg-light p-4 sticky-top"
            style={{ top: "20px", minWidth: "350px" }}
          >
            <h4 className="mb-4 fw-bold">Billing Summary</h4>

            <div className="mb-4">
              <h6 className="fw-semibold mb-3">Items</h6>
              {cartItems.length > 0 ? (
                <div
                  className="bg-white rounded p-3"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th className="border-0">Item</th>
                        <th className="border-0 text-end">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((items, idx) => (
                        <tr key={idx}>
                          <td className="border-0">{items.productName}</td>
                          <td className="border-0 text-end fw-bold">
                            {items.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center py-3 mb-0">
                  No items in cart
                </p>
              )}
            </div>

            <div className="bg-white rounded p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5 fw-semibold">Grand Total:</span>
                <span className="fw-bold text-success fs-4">{totalAmount}</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="d-grid gap-2">
              <button
                className="btn btn-success w-100 py-3 fw-bold fs-5"
                onClick={generateBill}
              >
                GENERATE BILL
              </button>
              <button
                className="btn btn-outline-primary w-100 py-3 fs-5"
                onClick={changePage}
              >
                ADD PRODUCT
              </button>
              <button
                className="btn btn-outline-danger w-100 py-3 fs-5"
                onClick={clearCart}
                style={{textAlign : "-moz-initial"}}
              >
                CLEAR CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
