"use client";

import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { CartItem, addToCart } from "@/lib/cart";
import { getClothings, getColoredClothing, getReviews } from "@/lib/database";
import { generateStyler, randomSet } from "@/lib/utilities";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Page({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  const [color, setColor] = useState<string>();
  const [size, setSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!color) return;
    document.querySelector(`#${color}`)?.scrollIntoView();
  }, [color]);

  useEffect(() => {
    const colorName = searchParams.get("color");
    if (colorName) {
      setColor(colorName);
    }
  }, [searchParams]);

  const id = parseInt(params.id);
  if (isNaN(id)) return <NotFound />;

  const { data: clothings } = getClothings();
  const { data: reviews } = getReviews();

  if (!clothings || !reviews) return <Loading />;
  const clothing = clothings.find((clothing) => clothing.id === id);
  if (!clothing) return <NotFound />;

  const reviewSet = randomSet(reviews, 4);

  const colorChangedHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    setColor(event.target.value);
  };

  const sizeChangedHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    setSize(event.target.value);
  };

  const quantityChangedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value));
  };

  const addHandler = () => {
    addToCart({
      clothing: getColoredClothing(
        clothing,
        clothing.colors.find((item) => item.name === color) ??
          clothing.colors[0]
      ),
      size: size,
      quantity: quantity,
    } as CartItem);
    alert("Your item has been added to cart!");
  };

  const style = generateStyler(styles);
  return (
    <main className={style(["sections"])}>
      <section>
        <div className={style(["navigation-gutter"])}></div>
        <div className={style(["content", "product"])}>
          <div className={style(["left"])}>
            <div className={style(["display"])}>
              {clothing.colors.map((color) => (
                <div
                  key={color.name}
                  id={color.name}
                  className={style(["slide"])}
                >
                  <img src={`/database/clothes/${id}/${color.file}`} />
                </div>
              ))}
            </div>
          </div>
          <div className={style(["right"])}>
            <div className={style(["details"])}>
              <div className={style(["title"])}>{clothing.name}</div>
              <div>{`S$${clothing.price.toFixed(2)}`}</div>
              <div className={style(["description"])}>
                {clothing.description}
              </div>
              <div className={style(["setting"])}>
                <select
                  className={style(["select"])}
                  value={color}
                  onChange={colorChangedHandler}
                >
                  {clothing.colors.map((color) => (
                    <option key={color.name}>{color.name}</option>
                  ))}
                </select>
              </div>
              <div className={style(["setting"])}>
                <select
                  className={style(["select"])}
                  value={size}
                  onChange={sizeChangedHandler}
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              <div className={style(["setting"])}>
                <input
                  className={style(["input"])}
                  style={{ textAlign: "center" }}
                  type={"number"}
                  min={1}
                  value={quantity}
                  onChange={quantityChangedHandler}
                />
              </div>
              <button
                className={style(["button", "primary"])}
                type={"submit"}
                onClick={addHandler}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={style(["navigation-gutter"])}></div>
        <div className={style(["content", "reviews"])}>
          {reviewSet &&
            reviewSet.map((review, index) => (
              <div key={index} className={style(["review"])}>
                <div className={style(["image"])}>
                  <img
                    src={`/database/avatars/${review.avatar ?? "default.jpeg"}`}
                  />
                </div>
                <div>
                  <div className={style(["name"])}>{review.name}</div>
                  <div className={style(["stars"])}>
                    {"★".repeat(review.rating)}
                  </div>
                  <div className={style(["text"])}>{review.review}</div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}