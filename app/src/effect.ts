import { action } from './store';
import { createEffect } from 'solid-js';
import { EffectHandler, ActionFn } from './typeHelper';

function debounce(func: any, timeout = 300) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      //@ts-ignore
      func.apply(this, args);
    }, timeout);
  };
}

function subscribeEffect(actions: string[], callback: EffectHandler) {
  createEffect(() => {
    const ac = action();
    if (actions.includes(ac.type)) callback(ac as any);
  });
}

export function on(...actions: ActionFn[]) {
  let _actions: string[] = actions.map((actionFn: any) => actionFn._$atype);

  return {
    debounce(milliseconds: number) {
      return {
        effect<T = any>(handlerFn: EffectHandler<T>) {
          return subscribeEffect(_actions, debounce(handlerFn, milliseconds));
        },
      };
    },
    effect<T = any>(handlerFn: EffectHandler<T>) {
      return subscribeEffect(_actions, handlerFn);
    },
  };
}
