import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  it("renders an empty input with the expected placeholder", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText(/search by name or email/i)).toHaveValue("");
  });

  it("calls onChange with the typed value as the user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    // A controlled input needs the harness component below to actually
    // reflect typed characters back into `value`, otherwise every
    // keystroke would render against an empty string again.
    function Harness() {
      const [value, setValue] = useState("");
      return <SearchBar value={value} onChange={(v) => { setValue(v); handleChange(v); }} />;
    }

    render(<Harness />);
    await user.type(screen.getByPlaceholderText(/search by name or email/i), "lea");

    expect(handleChange).toHaveBeenLastCalledWith("lea");
  });

  it("does not render a clear button when the search is empty", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
  });

  it("renders a clear button when there is a value, and clears it on click", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<SearchBar value="leanne" onChange={handleChange} />);

    const clearButton = screen.getByLabelText(/clear search/i);
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(handleChange).toHaveBeenCalledWith("");
  });
});
