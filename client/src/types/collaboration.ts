export interface ErrorWithStatus {
  status: number;
  [key: string]: unknown;
}

export interface CollaborationEvents {
  version: number;
  steps: unknown[];
  clientIDs: string[];
}

export interface CollaborationVersion {
  version: number;
}

export function isErrorWithStatus(error: unknown): error is ErrorWithStatus {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as ErrorWithStatus).status === 'number'
  );
}
