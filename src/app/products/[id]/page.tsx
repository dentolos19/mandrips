"use client";

import styles from "./page.module.scss";
import Loading from "@/app/loading";

import NotFound from "@/app/not-found";
import { getClothings } from "@/lib/data";
import { makeUseStyles } from "@/lib/utilities";
import { useSearchParams } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  const id = parseInt(params.id);
  if (isNaN(id)) return <NotFound />;
  const { data: clothings } = getClothings();
  if (!clothings) return <Loading />;
  const clothing = clothings.find((clothing) => clothing.id === id);
  if (!clothing) return <NotFound />;
  let color = clothing.colors[0];
  const colorName = searchParams.get("color");
  if (colorName) {
    const diffColor = clothing.colors.find((color) => color.name === colorName);
    if (diffColor) {
      color = diffColor;
    }
  }

  const useStyles = makeUseStyles(styles);
  return (
    <main className={useStyles(["sections"])}>
      <section>
        <div className={useStyles(["navigation-gutter"])}></div>
        <div className={useStyles(["content-product"])}>
          <div className={useStyles(["left"])}>
            <div className={useStyles(["display"])}>
              <img src={`/clothes/${color.file}`} />
            </div>
          </div>
          <div className={useStyles(["right"])}>
            <div className={useStyles(["details"])}>
              <div className={useStyles(["title"])}>{clothing.name}</div>
              <div>{clothing.price}</div>
              <div className={useStyles(["description"])}>{clothing.description}</div>
              <div className={useStyles(["setting"])}>
                <select>
                  {clothing.colors.map((color) => (
                    <option key={color.name}>{color.name}</option>
                  ))}
                </select>
              </div>
              <div className={useStyles(["setting"])}>
                <select>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              <div className={useStyles(["setting"])}>
                <input type={"number"} min={1} value={1} />
              </div>
              <div className={useStyles(["buttons"])}>
                <button className={useStyles(["button"])} type={"submit"}>
                  Add to Cart
                </button>
                <button className={useStyles(["button"])} type={"reset"}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={useStyles(["navigation-gutter"])}></div>
        <div className={useStyles(["content-reviews"])}>Reviews here.</div>
      </section>
    </main>
  );
}