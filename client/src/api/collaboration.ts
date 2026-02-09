import {ApiClient} from '@/lib/api-client';
import type {CollaborationVersion, CollaborationEvents} from '@/types/collaboration';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const apiClient = new ApiClient(API_BASE);

export async function fetchVersion() {
  return apiClient.get<CollaborationVersion>('/version');
}

export async function fetchEvents(fromVersion: number) {
  return apiClient.get<CollaborationEvents>(`/events?version=${fromVersion}`);
}

export async function postEvents(version: number, steps: unknown[], clientID: string) {
  return apiClient.post('/events', {version, steps, clientID});
}
