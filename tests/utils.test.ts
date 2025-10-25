import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("utils.cn", () => {
  it("merges class names and removes duplicates", () => {
    expect(cn("p-2", "p-2", "text-sm", { hidden: false, block: true })).toBe("p-2 text-sm block");
  });

  it("handles conditional classes", () => {
    expect(cn("px-2", { active: true, disabled: false })).toBe("px-2 active");
  });
});
