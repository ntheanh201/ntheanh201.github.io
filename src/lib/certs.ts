import type { Cert } from "../site";

function parse(d: string): Date {
  return new Date(/^\d{4}$/.test(d) ? `${d}-01-01T00:00:00Z` : `${d}T00:00:00Z`);
}

export function monthYear(d: string): string {
  if (/^\d{4}$/.test(d)) return d;
  return parse(d).toLocaleDateString("en-US", { year: "numeric", month: "short", timeZone: "UTC" });
}

export function certLabel(c: Cert): string {
  return c.short ? `${c.name} (${c.short})` : c.name;
}
