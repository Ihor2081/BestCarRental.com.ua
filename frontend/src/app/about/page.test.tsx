import { render, screen } from "@testing-library/react";

import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the main sections and hero content", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { name: "About DriveAway" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Our Story" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "DriveAway by the Numbers" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Our Core Values" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Why Choose DriveAway?" }),
    ).toBeInTheDocument();
    expect(screen.getByAltText("DriveAway Team")).toBeInTheDocument();
  });

  it("renders the stats, values, and reasons to choose DriveAway", () => {
    render(<AboutPage />);

    ["5,000+", "50+", "100K+", "4.8★"].forEach((stat) => {
      expect(screen.getByText(stat)).toBeInTheDocument();
    });

    [
      "Customer First",
      "Trust & Transparency",
      "Excellence",
      "Innovation",
      "Sustainability",
      "Community",
      "Premium Fleet",
      "Convenient Locations",
      "Flexible Policies",
      "24/7 Support",
    ].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
