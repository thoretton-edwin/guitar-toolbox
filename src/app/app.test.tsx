import { render, screen } from "@testing-library/react";
import { App } from "./app";

describe("App", () => {
  it("renders the home route", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "guitar-toolbox" })).toBeInTheDocument();
  });
});
