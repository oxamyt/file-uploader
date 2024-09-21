function parseDurationToMilliseconds(duration) {
  const units = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
  };

  const match = duration.match(/^(\d+)([dhm])$/);
  if (!match) throw new Error("Invalid duration format");

  const [, value, unit] = match;
  return parseInt(value, 10) * units[unit];
}

module.exports = parseDurationToMilliseconds;
