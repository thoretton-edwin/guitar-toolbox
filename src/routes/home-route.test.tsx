import { render, screen } from "@testing-library/react";
import { HomeRoute } from "./home-route";

describe("HomeRoute", () => {
  it("shows the application title and hello world message", () => {
    render(<HomeRoute />);

    expect(screen.getByRole("heading", { name: "guitar-toolbox" })).toBeInTheDocument();
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });
});
