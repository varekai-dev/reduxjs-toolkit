import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, { rejectWithValue }) => {
	try {
		const response = await axios('https://jsonplaceholder.typicode.com/todos?_limit=10');
		return response.data;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id, { rejectWithValue, dispatch }) => {
	try {
		await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
		dispatch(removeTodo({ id }));
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

export const toggleStatus = createAsyncThunk('todos/toogleStatus', async (id, { rejectWithValue, dispatch, getState }) => {
	const todo = getState().todos.todos.find((todo) => todo.id === id);

	try {
		await axios.patch(`https://jsonplaceholder.typicode.com/todos/${id}`, { completed: !todo.completed });
		dispatch(toggleTodoComplete({ id }));
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

export const addNewTodo = createAsyncThunk('todos/addNewTodo', async (text, { rejectWithValue, dispatch }) => {
	const newTodo = {
		userId: 1,
		title: text,
		completed: false
	};
	try {
		const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
			newTodo
		});

		const data = response.data;
		dispatch(addTodo(data.newTodo));
	} catch (error) {
		rejectWithValue(error.message);
	}
});

const setError = (state, action) => {
	state.status = 'rejected';
	state.error = action.payload;
};

const todoSlice = createSlice({
	name: 'todos',
	initialState: {
		todos: [],
		status: null,
		error: null
	},
	reducers: {
		addTodo(state, action) {
			state.todos.push(action.payload);
		},
		removeTodo(state, action) {
			state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
		},
		toggleTodoComplete(state, action) {
			const toggledTodo = state.todos.find((todo) => todo.id === action.payload.id);
			toggledTodo.completed = !toggledTodo.completed;
		}
	},
	extraReducers: {
		[fetchTodos.pending]: (state) => {
			state.status = 'loading';
			state.error = null;
		},
		[fetchTodos.fulfilled]: (state, action) => {
			state.status = 'resolved';
			state.todos = action.payload;
		},
		[fetchTodos.rejected]: setError,
		[deleteTodo.rejected]: setError,
		[toggleStatus.rejected]: setError,
		[addNewTodo.rejected]: setError
	}
});

const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions;

export default todoSlice.reducer;
