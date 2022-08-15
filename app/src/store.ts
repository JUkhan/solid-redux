import { AnyAction } from './typeHelper';
import { createSignal } from 'solid-js';

export const [action, dispatch] = createSignal<AnyAction>({} as any);
