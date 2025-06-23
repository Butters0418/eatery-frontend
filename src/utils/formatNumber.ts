export const formatNumber = (value: number | string): string => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return value.toLocaleString('en-US');
};
