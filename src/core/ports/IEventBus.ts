export type OpenApplyEventType =
  | 'JOB_ANALYZED'
  | 'COVER_LETTER_GENERATED'
  | 'APPLICATION_LOGGED'
  | 'SETTINGS_SAVED'
  | 'PII_DETECTED'
  | 'PROMPT_UPDATED'
  | 'DATA_WIPED';

export type EventCallback = (data: any) => void;

export interface IEventBus {
  subscribe(event: OpenApplyEventType, callback: EventCallback): () => void;
  publish(event: OpenApplyEventType, data: any): void;
}
