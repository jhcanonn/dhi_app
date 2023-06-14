import { useCalendarContext } from '@contexts';

export const useGetResources = (
  calendarType: boolean,
  resourceType: boolean
) => {
  const {
    selectedProfessional,
    selectedProfessionals,
    selectedBox,
    selectedBoxes,
  } = useCalendarContext();

  const professionalResources = calendarType
    ? selectedProfessional
      ? [selectedProfessional]
      : []
    : selectedProfessionals;

  const boxesResources = calendarType
    ? selectedBox
      ? [selectedBox]
      : []
    : selectedBoxes;

  return resourceType ? professionalResources : boxesResources;
};
