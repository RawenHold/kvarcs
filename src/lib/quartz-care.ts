export function moveCareStep(current: number, direction: -1 | 1, count: number) {
  if (count <= 0) return 0;

  return (current + direction + count) % count;
}
