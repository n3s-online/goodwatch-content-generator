/**
 * Format a category label for display:
 * 1. Replace underscores with spaces
 * 2. Capitalize each word
 * 
 * Example: "family_dynamics" -> "Family Dynamics"
 */
export function formatCategoryLabel(category: string): string {
  return category
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

