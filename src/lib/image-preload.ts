export function collectImagePreloadSources(
  activeSources: readonly string[],
  previewSources: readonly string[]
) {
  return Array.from(
    new Set([...activeSources, ...previewSources].filter((source) => source.trim().length > 0))
  );
}
