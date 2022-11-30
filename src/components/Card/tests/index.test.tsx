import React from "react";
import renderer from "react-test-renderer";
import Card from "../";

it("render Card correctly", () => {
  const component = renderer.create(
    <Card data={{ name: "name", id: 0, image: "" }} />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
