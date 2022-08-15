import { action } from './store';
import { createEffect } from 'solid-js';
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from './typeHelper';

export function effectOn<T>(
  actionFn: ActionCreatorWithPayload<T> | ActionCreatorWithoutPayload,
  callback: (ac: ReturnType<typeof actionFn>) => void
) {
  const { type } = actionFn(undefined as any);
  createEffect(() => {
    const ac = action();
    if (ac.type === type) callback(ac as any);
  });
}
