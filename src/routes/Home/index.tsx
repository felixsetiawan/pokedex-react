import React, { useEffect, useState } from "react";

import usePokemon from "@/hooks/usePokemon";
import useScrollYPosition from "@/hooks/useScrollYPosition";
import Card from "@/components/Card";

import "./styles.css";

const Home = () => {
  const [isBottom, setIsBottom] = useState(false);
  const { data } = usePokemon(isBottom);

  const { toCheckBottom } = useScrollYPosition();

  useEffect(() => {
    const { winHeight, scrollY, docHeight } = toCheckBottom;
    setIsBottom(winHeight + scrollY >= docHeight - 20);
  }, [toCheckBottom]);

  return (
    <div className="container">
      {data.length > 0 &&
        data.map((detail, index) => {
          return <Card key={index} data={detail} />;
        })}
    </div>
  );
};

export default Home;
