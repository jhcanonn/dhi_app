import { SelectedRange } from '@aldabil/react-scheduler/store/types';
import { FieldValues, PathValue, UseFormReturn } from 'react-hook-form';
import {
  DefaultRecourse,
  ProcessedEvent,
} from '@aldabil/react-scheduler/types';

export type DhiEvent = ProcessedEvent & {
  professional_id?: number;
  box_id?: number;
  state_color?: string;
  identification?: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  last_name_2?: string;
};

export type CommonData = DefaultRecourse & {
  name: string;
};

export type Professional = CommonData & {
  professional_id: number;
  mobile: string;
};

export type Box = CommonData & { box_id: number };

export type DhiResource = Box & Professional;

export enum ResourceType {
  BOX = 'box',
  PROFESSIONAL = 'professional',
}

export enum CalendarType {
  INDIVIDUAL = 'individual',
  MULTIPLE = 'multiple',
}

export enum ResourceMode {
  DEFAULT = 'default',
  TABS = 'tabs',
}

export type EditFn = (
  status: boolean,
  event?: ProcessedEvent | SelectedRange | undefined
) => void;

export type FieldProps<T> = {
  handleForm: UseFormReturn<T extends FieldValues ? any : any, any, undefined>;
  name: string;
  label: string;
  icon?: string;
  required?: boolean;
  validate?: (
    value: PathValue<T extends FieldValues ? any : any, any>
  ) => boolean;
};
