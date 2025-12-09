import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getAllTodos, addTodo, toggleTodo, deleteTodo } from './todos.js';

describe('Todo API Functions', () => {
  describe('addTodo', () => {
    test('should create a new todo with correct properties', async () => {
      const todo = await addTodo('Test todo');
      
      assert.strictEqual(todo.text, 'Test todo');
      assert.strictEqual(todo.completed, false);
      assert.ok(todo.id);
      assert.ok(todo.createdAt);
    });

    test('should add todo to the todos list', async () => {
      const todosBefore = await getAllTodos();
      const initialCount = todosBefore.length;
      
      await addTodo('New todo');
      
      const todosAfter = await getAllTodos();
      assert.ok(todosAfter.length >= initialCount);
    });
  });

  describe('toggleTodo', () => {
    test('should toggle todo completed status', async () => {
      const todo = await addTodo('Toggle test');
      const toggled = await toggleTodo(todo.id);
      
      assert.strictEqual(toggled?.completed, true);
    });
  });

  describe('getAllTodos', () => {
    test('should return an array of todos', async () => {
      const todos = await getAllTodos();
      assert.ok(Array.isArray(todos));
    });
  });

  describe('deleteTodo', () => {
    test('should delete a todo and return success', async () => {
      const todo = await addTodo('Delete test');
      const result = await deleteTodo(todo.id);
      
      assert.strictEqual(result.success, true);
    });
  });
});
