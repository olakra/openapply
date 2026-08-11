/** Supported system-wide application event names */
export type OpenApplyEventType =
  | 'JOB_ANALYZED'
  | 'COVER_LETTER_GENERATED'
  | 'APPLICATION_LOGGED'
  | 'SETTINGS_SAVED'
  | 'PII_DETECTED'
  | 'PROMPT_UPDATED'
  | 'DATA_WIPED';

/** Event subscriber callback function type */
export type EventCallback = (data: any) => void;

/**
 * Interface contract for event bus publish-subscribe implementation.
 */
export interface IEventBus {
  subscribe(event: OpenApplyEventType, callback: EventCallback): () => void;
  publish(event: OpenApplyEventType, data: any): void;
}
