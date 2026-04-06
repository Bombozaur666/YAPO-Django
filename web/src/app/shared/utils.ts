export function getCSSVariable(variableString: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableString)
    .trim()
}
