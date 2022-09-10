import { createEffect, createSignal, Accessor } from 'solid-js';
import {
  EffectHandler,
  ActionFn,
  SelectHandler,
  SelectState,
} from './typeHelper';
import { action } from './store';

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

function subscribeEffectForSelection(
  actions: string[],
  callback: (action: any) => void
) {
  createEffect(() => {
    const ac = action();
    if (actions.includes(ac.type)) {
      callback(ac);
    }
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
        select<T = any>(
          handlerFn: SelectHandler<T>,
          init: T
        ): Accessor<SelectState<T>> {
          const [data, setData] = createSignal({
            loading: false,
            data: init,
            msg: null,
          } as SelectState<T>);
          const dataFn = syncData<T>(setData);
          subscribeEffectForSelection(
            _actions,
            debounce((action: any) => handlerFn(action, dataFn), milliseconds)
          );
          return data;
        },
      };
    },
    effect<T = any>(handlerFn: EffectHandler<T>) {
      return subscribeEffect(_actions, handlerFn);
    },
    select<T = any>(
      handlerFn: SelectHandler<T>,
      init: T
    ): Accessor<SelectState<T>> {
      const [data, setData] = createSignal({
        loading: false,
        data: init,
        msg: null,
      } as SelectState<T>);
      const dataFn = syncData<T>(setData);
      subscribeEffectForSelection(_actions, (action: any) =>
        handlerFn(action, dataFn)
      );
      return data;
    },
  };
}
function syncData<T>(state: any) {
  return {
    loading() {
      state((s: any) => ({ ...s, loading: true }));
    },
    success(data: T) {
      state(() => ({ msg: null, data, loading: false }));
    },
    error(msg: any) {
      state((s: any) => ({ ...s, msg }));
    },
  };
}
