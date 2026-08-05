import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home page", () => {
  it("renders the project status", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1, name: "项目已启动" })).toBeInTheDocument();
    expect(screen.getByText("从 src/app/page.tsx 开始构建你的应用。")).toBeInTheDocument();
  });
});
