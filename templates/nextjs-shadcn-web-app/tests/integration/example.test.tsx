import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home page", () => {
  it("renders the primary button and responds to click", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(button).toBeEnabled();
  });
});
