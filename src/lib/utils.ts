/**
 * Shared class-name helper.
 *
 * @see docs/DESIGN-SYSTEM.md
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Composes conditional class names and resolves conflicting Tailwind utilities.
 *
 * `clsx` flattens the conditional syntax (arrays, objects, falsy values); `twMerge`
 * then resolves collisions so the *last* utility in a conflicting group wins. Without
 * the merge step, `cn("text-slate", "text-accent")` would emit both classes and let
 * stylesheet order decide the winner, which is not what the call site intends.
 *
 * Use this anywhere class names are conditional — particularly when a component takes
 * a `className` prop that callers expect to be able to override defaults with.
 *
 * @example
 * cn("text-slate", isActive && "text-accent")
 * cn("block h-full w-full", className) // caller's className overrides the defaults
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
