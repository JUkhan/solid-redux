import { AnyAction } from './typeHelper';
import { createSignal, Accessor, Setter } from 'solid-js';

const dispatcher = createSignal<AnyAction>({ type: '$$INIT' });

//@ts-ignores
export const action: Accessor<AnyAction> = dispatcher[0];

//@ts-ignores
export const dispatch: Setter<AnyAction> = dispatcher[1];
