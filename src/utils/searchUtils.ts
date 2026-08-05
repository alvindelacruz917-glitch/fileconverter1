import { ConverterTool } from '../types/converter';

export function filterAndSortTools(tools: ConverterTool[], query: string): ConverterTool[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  // Filter tools that match name, description, category, accepted types, or target extension
  const matched = tools.filter((tool) => {
    const nameMatch = tool.name.toLowerCase().includes(trimmed);
    const descMatch = tool.description.toLowerCase().includes(trimmed);
    const catMatch = tool.category.toLowerCase().includes(trimmed);
    const extMatch =
      tool.targetExtension.toLowerCase().includes(trimmed) ||
      tool.acceptedTypes.some((ext) => ext.toLowerCase().includes(trimmed));

    return nameMatch || descMatch || catMatch || extMatch;
  });

  // Rank / Sort matched tools:
  // 1. Exact Name starts with query (First Letter / Prefix Match) -> TOP PRIORITY
  // 2. Target Extension or Accepted Types starts with query -> SECOND
  // 3. Category starts with query -> THIRD
  // 4. Name contains query -> FOURTH
  // 5. Description contains query
  return matched.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    const aStartsWith = aName.startsWith(trimmed);
    const bStartsWith = bName.startsWith(trimmed);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    const aTargetExtStart = a.targetExtension.toLowerCase().startsWith(trimmed);
    const bTargetExtStart = b.targetExtension.toLowerCase().startsWith(trimmed);

    if (aTargetExtStart && !bTargetExtStart) return -1;
    if (!aTargetExtStart && bTargetExtStart) return 1;

    const aCatStart = a.category.toLowerCase().startsWith(trimmed);
    const bCatStart = b.category.toLowerCase().startsWith(trimmed);

    if (aCatStart && !bCatStart) return -1;
    if (!aCatStart && bCatStart) return 1;

    return aName.localeCompare(bName);
  });
}
