# solid-redux
State Management Tool for `solid.js`

## Installation

Add the solid-redux package to your project:

```
# NPM
npm i solid-redux
```

```
# YARN
yarn add solid-redux
```

[Demo App](https://stackblitz.com/edit/vitejs-vite-cwpvly?file=src%2Fmain.tsx)

## Todo state

```ts
import { createReducer, on, PayloadAction } from 'solid-redux';

export const loadData = createAction('loadData');
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
export enum Filter {
  ALL,
  COMPLETED,
  ACTIVE,
}
type AppState = { filter: Filter; todos: Todo[]; loading: boolean };

let todoId = 0;
export const {
  actions: { add, update, remove, all, completed, active },
  state: todoState,
} = createReducer({
  name: 'todos',
  initialState: { filter: Filter.ALL, todos: [], loading: true } as AppState,
  reducers: {
    init(setState) {
      add('Cool');
    },
    async add(setState, action: PayloadAction<string>) {
      setState('loading', true);
      await delay(1000);
      setState('todos', (todos) => [
        ...todos,
        { id: ++todoId, text: action.payload, completed: false },
      ]);
      setState('loading', false);
    },
    update(setState, action: PayloadAction<number>) {
      setState(
        'todos',
        (todo) => todo.id === action.payload,
        'completed',
        (completed) => !completed
      );
    },
    remove(setState, action: PayloadAction<number>) {
      setState('todos', (todos) =>
        todos.filter((todo) => todo.id !== action.payload)
      );
    },
    all(setState) {
      setState('filter', Filter.ALL);
    },
    completed(setState) {
      setState('filter', Filter.COMPLETED);
    },
    active(setState) {
      setState('filter', Filter.ACTIVE);
    },
  },
});

type Data = { loading: boolean; data: any };
on(add, update, remove)
  .debounce(1000)
  .effect((action) => {
    console.log(action);
  });

export const data = on(loadData)
  .debounce(300)
  .select<number>(async (action, data) => {
    data.loading();
    await delay(1000);
    data.success(555);
  }, 0);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


```

## Apply todoState in the solid component

```tsx
import { Component, For } from 'solid-js';
import { add, update, remove, todoState, data, loadData, Filter, all, completed, active } from './todoState';

const Todos: Component = () => {
  let input: HTMLInputElement = null!;
  const todos = createMemo(() => {
    switch (todoState.filter) {
      case Filter.ALL: return todoState.todos
      case Filter.COMPLETED: return todoState.todos.filter(a => a.completed)
      case Filter.ACTIVE: return todoState.todos.filter(a => !a.completed)
      default:
        return todoState.todos
    }
  })

  return (
    <>
      <div>
        <button onClick={() => loadData()}>{data().loading ? 'loading...' : 'Load data'}</button>
        <span>{data().data}</span>
      </div>
      <div>
        <button style={{ color: todoState.filter === Filter.ALL ? 'red' : 'black' }} onClick={[all, null]}>All</button>
        <button style={{ color: todoState.filter === Filter.COMPLETED ? 'red' : 'black' }} onClick={[completed, null]}>Completed</button>
        <button style={{ color: todoState.filter === Filter.ACTIVE ? 'red' : 'black' }} onClick={[active, null]}>Active</button>
      </div>
      <div>
        <input ref={input} />
        <button
          onClick={(e) => {
            if (!input.value.trim()) return;
            add(input.value);
            input.value = "";
          }}
        >
          {todoState.loading ? 'loading...' : 'Add'}
        </button>
      </div>
      <For each={todos()}>
        {(todo) => {
          const { id, text } = todo;
          console.log(`Creating ${text}`)
          return <div>
            <input
              type="checkbox"
              checked={todo.completed}
              onchange={[update, id]}
            />
            <span
              style={{ "text-decoration": todo.completed ? "line-through" : "none" }}
            >{text}</span>
            <span onClick={[remove, id]} style={{ color: 'red', cursor: 'pointer' }}>X</span>
          </div>
        }}
      </For>
    </>
  );
};

export default Todos;

```
