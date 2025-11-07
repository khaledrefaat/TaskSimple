import { users, projects, todos } from '@/db/schema';
import { cache } from 'react';
import { db } from '@/db';
import { eq, and } from 'drizzle-orm';

export const getUserByEmail = cache(async (email: string) => {
  try {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
});

export const getAll = cache(async (userId: string) => {
  try {
    const [projectsData, todosData] = await Promise.all([
      db.select().from(projects).where(eq(projects.userId, userId)),
      db.select().from(todos).where(eq(todos.userId, userId)),
    ]);
    return {
      projects: projectsData,
      todos: todosData,
    };
  } catch (error) {
    console.error('Error getting all data:', error);
    return {
      projects: [],
      todos: [],
    };
  }
});

export async function updateProject(
  projectId: string,
  userId: string,
  data: { name?: string; color?: string }
) {
  try {
    const [updated] = await db
      .update(projects)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning();
    return updated || null;
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
}

export async function updateTodo(
  todoId: string,
  userId: string,
  data: {
    title?: string;
    isCompleted?: boolean;
    order?: number;
    projectId?: string;
  }
) {
  try {
    const [updated] = await db
      .update(todos)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();
    return updated || null;
  } catch (error) {
    console.error('Error updating todo:', error);
    return null;
  }
}

export async function deleteProject(projectId: string, userId: string) {
  try {
    const [deleted] = await db
      .delete(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning();
    return deleted || null;
  } catch (error) {
    console.error('Error deleting project:', error);
    return null;
  }
}

export async function deleteTodo(todoId: string, userId: string) {
  try {
    const [deleted] = await db
      .delete(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();
    return deleted || null;
  } catch (error) {
    console.error('Error deleting todo:', error);
    return null;
  }
}
