import { call, put, takeEvery } from "redux-saga/effects";
import {
  loadTodosSuccess,
  loadTodosFailure,
  addTodoSuccess,
  addTodoFailure,
  updateTodoSuccess,
  updateTodoFailure,
  deleteTodoSuccess,
  deleteTodoFailure,
  type Todo,
} from "../store";

const API_BASE_URL = "https://dummyjson.com/todos";

// API helper functions
async function fetchTodos(): Promise<{ todos: Todo[] }> {
  await delay(2000);
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
}

async function createTodo(todo: string, userId: number): Promise<Todo> {
  await delay(2000);
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo,
      completed: false,
      userId,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to create todo");
  }
  return response.json();
}

async function updateTodoRequest(
  id: number,
  updates: { completed?: boolean; todo?: string },
): Promise<Todo> {
  await delay(2000);
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error("Failed to update todo");
  }
  return response.json();
}

async function deleteTodoRequest(id: number): Promise<Todo> {
  await delay(2000);
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
  return response.json();
}

function* loadTodosSaga() {
  try {
    const data: { todos: Todo[] } = yield call(fetchTodos);
    yield put(loadTodosSuccess({ todos: data.todos }));
  } catch (error) {
    yield put(
      loadTodosFailure({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    );
  }
}

function* addTodoSaga(action: {
  type: string;
  payload: { todo: string; userId: number };
}) {
  try {
    const newTodo: Todo = yield call(
      createTodo,
      action.payload.todo,
      action.payload.userId,
    );
    yield put(addTodoSuccess({ todo: newTodo }));
  } catch (error) {
    yield put(
      addTodoFailure({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    );
  }
}

function* updateTodoSaga(action: {
  type: string;
  payload: { id: number; completed?: boolean; todo?: string };
}) {
  try {
    const updatedTodo: Todo = yield call(updateTodoRequest, action.payload.id, {
      completed: action.payload.completed,
      todo: action.payload.todo,
    });
    yield put(updateTodoSuccess({ todo: updatedTodo }));
  } catch (error) {
    yield put(
      updateTodoFailure({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    );
  }
}

function* deleteTodoSaga(action: { type: string; payload: { id: number } }) {
  try {
    yield call(deleteTodoRequest, action.payload.id);
    yield put(deleteTodoSuccess({ id: action.payload.id }));
  } catch (error) {
    yield put(
      deleteTodoFailure({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    );
  }
}

export function* todosSaga() {
  yield takeEvery("todos/loadTodos", loadTodosSaga);
  yield takeEvery("todos/addTodo", addTodoSaga);
  yield takeEvery("todos/updateTodo", updateTodoSaga);
  yield takeEvery("todos/deleteTodo", deleteTodoSaga);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
