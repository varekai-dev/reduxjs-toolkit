import React from 'react';
import TodoList from './components/TodoList';
import './App.css';
import InputField from './components/InputField';
import { addNewTodo, fetchTodos } from './store/todoSlice';
import { useDispatch, useSelector } from 'react-redux';

function App() {
	const [text, setText] = React.useState('');
	const { status, error } = useSelector((state) => state.todos);
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(fetchTodos());
	}, [dispatch]);

	const addTask = () => {
		dispatch(addNewTodo(text));
		setText('');
	};

	return (
		<div className="App">
			<InputField text={text} handleInput={setText} handleSubmit={addTask} />
			{status === 'loading' && <h2>Loading...</h2>}
			{error && <h2>An error occured {error}</h2>}
			<TodoList />
		</div>
	);
}

export default App;
