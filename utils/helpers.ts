/* Los campos que se mapean son del Evento */
export const calendarFieldsMapper = (resource: string) => {
  return {
    idField: `${resource}_id`,
    textField: 'title',
  };
};

export const getResourceData = <T>(
  resources: T[],
  resourceField: string,
  resourceId: number
) => {
  return resources.find((r) => r[resourceField as keyof T] === resourceId);
};

export function daysToMilliseconds(days: number) {
  // 👇️        hour  min  sec  ms
  return days * 24 * 60 * 60 * 1000;
}
