import {nanoid} from 'nanoid';

export function generateClientID(): string {
  return nanoid(8);
}
