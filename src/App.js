import React from 'react';
import TodoList from './components/TodoList';
import './App.css';
import InputField from './components/InputField';
import { addTodo } from './store/todoSlice';
import { useDispatch } from 'react-redux';

function App() {
	const [text, setText] = React.useState('');
	const dispatch = useDispatch();

	const addTask = () => {
		dispatch(addTodo({ text }));
		setText('');
	};

	return (
		<div className="App">
			<InputField text={text} handleInput={setText} handleSubmit={addTask} />
			<TodoList />
		</div>
	);
}

export default App;
