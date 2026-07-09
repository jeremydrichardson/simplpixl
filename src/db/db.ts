import Dexie, { type Table } from 'dexie';
import type { SerializedDocument } from '../model/serialization';

export interface ProjectRecord {
  id: string;
  name: string;
  updatedAt: number;
  document: SerializedDocument;
}

export interface RecentRecord {
  projectId: string;
  lastOpenedAt: number;
}

export class SimplPixlDB extends Dexie {
  projects!: Table<ProjectRecord>;
  recents!: Table<RecentRecord>;

  constructor() {
    super('SimplPixlDB');
    this.version(1).stores({
      projects: 'id, name, updatedAt',
      recents: 'projectId, lastOpenedAt',
    });
  }
}

export const db = new SimplPixlDB();

db.on('ready', () => {
  console.log('Database ready');
});

db.on('blocked', () => {
  console.error('Database blocked - another tab may be using an older version');
});

db.on('versionchange', () => {
  console.warn('Database version changed in another tab');
});

export async function saveProject(record: ProjectRecord): Promise<void> {
  console.log('Saving project to database:', record.id, record.name);
  await db.projects.put(record);
  await db.recents.put({ projectId: record.id, lastOpenedAt: Date.now() });
  console.log('Project saved successfully');
}

export async function getRecentProjects(limit = 10): Promise<ProjectRecord[]> {
  const recents = await db.recents.orderBy('lastOpenedAt').reverse().limit(limit).toArray();
  const projects: ProjectRecord[] = [];
  for (const recent of recents) {
    const project = await db.projects.get(recent.projectId);
    if (project) projects.push(project);
  }
  return projects;
}

export async function getAllProjects(): Promise<ProjectRecord[]> {
  console.log('Fetching all projects from database');
  const projects = await db.projects.orderBy('updatedAt').reverse().toArray();
  console.log('Found projects:', projects.length);
  return projects;
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id);
  await db.recents.delete(id);
}

export async function loadProject(id: string): Promise<ProjectRecord | undefined> {
  const project = await db.projects.get(id);
  if (project) {
    await db.recents.put({ projectId: id, lastOpenedAt: Date.now() });
  }
  return project;
}
