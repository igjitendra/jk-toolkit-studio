// ============================================================
// JK Toolkit Studio — IndexedDB Storage
// Offline project persistence, customer records
// ============================================================

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Project, CustomerRecord } from '@/types';

const DB_NAME = 'jk-toolkit-studio';
const DB_VERSION = 1;

interface JKDatabase extends DBSchema {
  projects: { key: string; value: Project; indexes: { 'by-updated': number } };
  customers: { key: string; value: CustomerRecord; indexes: { 'by-name': string } };
  cache: { key: string; value: { key: string; data: string; timestamp: number } };
}

let dbPromise: Promise<IDBPDatabase<JKDatabase>> | null = null;

function getDB(): Promise<IDBPDatabase<JKDatabase>> {
  if (!dbPromise) {
    dbPromise = openDB<JKDatabase>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
        projectStore.createIndex('by-updated', 'updatedAt');
        const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
        customerStore.createIndex('by-name', 'name');
        db.createObjectStore('cache', { keyPath: 'key' });
      },
    });
  }
  return dbPromise;
}

// ---- Projects ----
export async function saveProject(project: Project): Promise<void> {
  const db = await getDB();
  await db.put('projects', { ...project, updatedAt: Date.now() });
}

export async function getProject(id: string): Promise<Project | undefined> {
  const db = await getDB();
  return db.get('projects', id);
}

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDB();
  return db.getAllFromIndex('projects', 'by-updated');
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('projects', id);
}

// ---- Customers ----
export async function saveCustomer(customer: CustomerRecord): Promise<void> {
  const db = await getDB();
  await db.put('customers', customer);
}

export async function getAllCustomers(): Promise<CustomerRecord[]> {
  const db = await getDB();
  return db.getAll('customers');
}

export async function deleteCustomer(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('customers', id);
}

// ---- Photo cache ----
export async function cachePhoto(key: string, dataUrl: string): Promise<void> {
  const db = await getDB();
  await db.put('cache', { key, data: dataUrl, timestamp: Date.now() });
}

export async function getCachedPhoto(key: string): Promise<string | null> {
  const db = await getDB();
  const entry = await db.get('cache', key);
  return entry?.data ?? null;
}
