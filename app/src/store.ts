import { Streams, STATE, AnyAction } from './typeHelper';

import { createSignal } from './signal';

let state = {} as STATE;

export const [action, dispatch] = createSignal<AnyAction>({} as any);

export const streams = {} as Streams;

export function getState() {
  return state;
}

export function setGlobalSate(newState: any) {
  state = newState;
}
