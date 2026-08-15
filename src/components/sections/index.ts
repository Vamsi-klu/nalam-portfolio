/**
 * Partial barrel for the section components.
 *
 * Vestigial — nothing imports this. It re-exports only four of the eight sections, and
 * `app/page.tsx` imports every section directly instead. Import directly for new work.
 *
 * Kept rather than deleted so the omission is visibly a known state rather than looking
 * like an accidentally incomplete barrel to the next reader. Either complete it and
 * switch `page.tsx` over, or remove it — but do that as its own decision.
 */

export { Work } from "./Work";
export { Oss } from "./Oss";
export { Builds } from "./Builds";
export { Contact } from "./Contact";
