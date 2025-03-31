function solution(container) {
  const cols = container.children;
  let minVal = Infinity;
  let maxVal = -Infinity;

  for (let col of cols) {
    const value = +col.getAttribute("data-value");
    if (value < minVal) minVal = value;
    if (value > maxVal) maxVal = value;
  }

  if (minVal === maxVal) return 0;

  const size = maxVal - minVal + 1;
  const buckets = new Array(size).fill(false);

  for (let col of cols) {
    const value = +col.getAttribute("data-value");
    buckets[value - minVal] = true;
  }

  let maxGap = 0;
  let prevValue = minVal;

  for (let i = 1; i < size; i++) {
    if (buckets[i]) {
      maxGap = Math.max(maxGap, minVal + i - prevValue);
      prevValue = minVal + i;
    }
  }

  return maxGap;
}
