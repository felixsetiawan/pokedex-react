import React from "react";
import { IPokeDetailList } from "@/hooks/usePokemon";
import "./styles.css";

const Card = ({ data }: { data: IPokeDetailList }) => {
  return (
    <div className="container">
      <div>{data.id}</div>
      <div>{data.name}</div>
      <img
        src={data.image}
        width="200"
        height="200"
        alt={data.name}
        loading="lazy"
      />
    </div>
  );
};

export default Card;
