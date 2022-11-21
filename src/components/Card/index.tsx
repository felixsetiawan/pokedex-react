import React from "react";
import { IPokeDetailList } from "@/hooks/usePokemon";
import "./styles.css";

const Card = ({ data }: { data: IPokeDetailList }) => {
  return (
    <div className="container">
      <div>{data.id}</div>
      <div>{data.name}</div>
      <img src={data.image} />
    </div>
  );
};

export default Card;
