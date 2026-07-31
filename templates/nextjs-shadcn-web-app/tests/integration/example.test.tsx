import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home page", () => {
  it("renders the template status", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1, name: "模板已启动" })).toBeInTheDocument();
    expect(screen.getByText("从 src/app/page.tsx 开始构建你的应用。")).toBeInTheDocument();
  });
});
