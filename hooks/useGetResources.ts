import { useCalendarContext } from '@contexts'

export const useGetResources = (
  calendarType: boolean,
  resourceType: boolean,
) => {
  const {
    calendarScheduler,
    selectedProfessional,
    selectedProfessionals,
    selectedBox,
    selectedBoxes,
  } = useCalendarContext()

  const professionalResources = calendarType
    ? selectedProfessional
      ? [selectedProfessional]
      : []
    : selectedProfessionals

  const boxesResources = calendarType
    ? selectedBox
      ? [selectedBox]
      : []
    : selectedBoxes

  const resources = resourceType ? professionalResources : boxesResources
  calendarScheduler?.current?.scheduler?.handleState(resources, 'resources')

  return resources
}
