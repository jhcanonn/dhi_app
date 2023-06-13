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
