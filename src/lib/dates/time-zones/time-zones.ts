export const timezones = Intl.supportedValuesOf('timeZone').map((tz) => {
  return {
    value: tz,
    label: tz.replace('_', ' ')
  };
});

export const timezoneCodes = Intl.supportedValuesOf('timeZone');
