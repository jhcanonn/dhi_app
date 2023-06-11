import { SelectedRange } from '@aldabil/react-scheduler/store/types';
import {
  DefaultRecourse,
  ProcessedEvent,
} from '@aldabil/react-scheduler/types';

export type DhiEvent = ProcessedEvent & {
  state_color?: string;
  professional_id?: number;
  box_id?: number;
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
