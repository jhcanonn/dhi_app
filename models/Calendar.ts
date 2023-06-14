import { SelectedRange } from '@aldabil/react-scheduler/store/types';
import { FieldValues, PathValue, UseFormReturn } from 'react-hook-form';
import {
  DefaultRecourse,
  ProcessedEvent,
} from '@aldabil/react-scheduler/types';
import { type } from 'os';

export type DhiEvent = ProcessedEvent & {
  professional_id?: number;
  box_id?: number;
  professional?: Professional;
  box?: Box;
  service?: Service;
  client_id?: number;
  state?: EventState;
  pay?: Pay;
  data_sheet?: string;
  identification?: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  last_name_2?: string;
  phone?: string;
  phone_2?: string;
  dialling?: Country;
  dialling_2?: Country;
  email?: string;
  sent_email?: boolean;
};

export type EventState = {
  state_id: number;
  name: string;
  color: string;
};

export type Pay = {
  pay_id: number;
  name: string;
};

export type CommonData = DefaultRecourse & {
  name: string;
};

export type Professional = CommonData & {
  professional_id: number;
  mobile: string;
};

export type Box = CommonData & { box_id: number };

export type Service = CommonData & { service_id: number; box_id: number };

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

export type FieldCommonProps<T> = {
  handleForm: UseFormReturn<T extends FieldValues ? any : any, any, undefined>;
  name: string;
  required?: boolean;
  validate?: (
    value: PathValue<T extends FieldValues ? any : any, any>
  ) => boolean;
};

export type Country = {
  name: string;
  code: string;
  dialling: string;
};
