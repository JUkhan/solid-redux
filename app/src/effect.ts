import { action, getState } from './store';
import { createEffect } from './signal';
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  STATE,
} from './typeHelper';

export function effectOn<T>(
  actionFn: ActionCreatorWithPayload<T> | ActionCreatorWithoutPayload,
  callback: (ac: ReturnType<typeof actionFn>, getData: () => STATE) => void
) {
  const { type } = actionFn(undefined as any);
  createEffect(() => {
    const ac = action();
    if (ac.type === type) callback(ac as any, getState);
  });
}
