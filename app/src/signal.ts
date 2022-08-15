import { Read, Write, EffectFn, WriteParam } from './typeHelper';

const stack: EffectFn[] = [];

function getCurrentEffect() {
  return stack[stack.length - 1];
}

export function createEffect(fn: EffectFn) {
  function effect() {
    stack.push(effect);
    try {
      fn();
    } finally {
      stack.pop();
    }
  }
  effect();
}

export function createSignal<T>(value: T): [Read<T>, Write<T>] {
  const list = new Set<EffectFn>();
  function read() {
    const ef = getCurrentEffect();
    if (ef) list.add(ef);
    return value;
  }
  function write(newValue: WriteParam<T>) {
    //@ts-ignores
    value = typeof newValue === 'function' ? newValue(value) : newValue;
    for (let ef of list) {
      ef();
    }
  }

  return [read, write];
}
