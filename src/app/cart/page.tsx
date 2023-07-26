"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearCart, getCartItems, CartItem, removeFromCart } from "@/lib/cart";
import { useStyles } from "@/lib/utilities";

export default function Page() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);

  // this runs after render of the page has been completed
  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const checkoutHandler = () => {
    router.push("/checkout");
  };

  const clearHandler = () => {
    const response = confirm("Are you sure you want to clear your cart?");
    if (!response) return;
    clearCart();
    setItems([]);
  };

  const removeHandler = (item: CartItem) => {
    const response = confirm("Are you sure you want to remove this item from your cart?");
    if (!response) return;
    setItems(removeFromCart(item));
  };

  const style = useStyles(styles);

  if (items.length <= 0) {
    return (
      <main>
        <div className={"navigation-gutter"}></div>
        <div style={{ textAlign: "center" }}>
          <h3>No items in your cart.</h3>
          <p>Go check out our products!</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className={style(["navigation-gutter"])}></div>
      <div className={style(["container"])}>
        <div className={style(["left"])}>
          <div className={style(["items"])}>
            {items.map((item) => (
              <div key={item.clothing.id} className={style(["item"])}>
                <div className={style(["details"])}>
                  <img
                    className={style(["image"])}
                    src={`/database/clothes/${item.clothing.id}/${item.clothing.colorFile}`}
                  />
                  <div className={style(["text"])}>
                    <div className={style(["title"])}>
                      <span>{item.clothing.name}</span>
                      <span
                        className={style(["delete"])}
                        style={{ marginLeft: "0.5rem", cursor: "pointer" }}
                        onClick={() => removeHandler(item)}
                      >
                        <i className={"lni lni-trash-can"}></i>
                      </span>
                    </div>
                    <div>Product ID: {item.clothing.id}</div>
                    <div>
                      Color: {item.clothing.colorName} / Size: {item.size}
                    </div>
                    <div>Quantity: {item.quantity}</div>
                  </div>
                </div>
                <div className={style(["price"])}>{`S$${(item.clothing.price * item.quantity).toFixed(2)}`}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={style(["right"])}>
          <div className={style(["order"])}>
            <div>
              <div className={style(["title"])}>Order Summary</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>Subtotal</span>
                <span>
                  {`S$${(items.reduce((acc, item) => acc + item.clothing.price * item.quantity, 0) * 0.92).toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>Estimated Tax</span>
                <span>
                  {`S$${(items.reduce((acc, item) => acc + item.clothing.price * item.quantity, 0) * 0.08).toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>Total</span>
                <span>
                  {`S$${items.reduce((acc, item) => acc + item.clothing.price * item.quantity, 0).toFixed(2)}`}
                </span>
              </div>
            </div>
            <div className={style(["buttons"])}>
              <button className={style(["button", "primary"])} onClick={checkoutHandler}>
                Checkout
              </button>
              <button className={style(["button"])} onClick={clearHandler}>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}