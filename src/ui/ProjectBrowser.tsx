import { useEffect, useState } from 'react';
import { Document } from '../model/Document';
import { deserializeDocument } from '../model/serialization';
import { getAllProjects, deleteProject, loadProject, type ProjectRecord } from '../db/db';
import styles from './ProjectBrowser.module.css';

interface ProjectBrowserProps {
  onOpen: (document: Document) => void;
  onNew: () => void;
  onClose: () => void;
}

export function ProjectBrowser({ onOpen, onNew, onClose }: ProjectBrowserProps) {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);

  useEffect(() => {
    getAllProjects().then(setProjects);
  }, []);

  const handleOpen = async (project: ProjectRecord) => {
    await loadProject(project.id);
    onOpen(deserializeDocument(project.document));
    onClose();
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Projects</h2>
        <button type="button" className={styles.newButton} onClick={onNew}>
          New Project
        </button>
        <ul className={styles.list}>
          {projects.length === 0 && (
            <li className={styles.empty}>
              No saved projects yet. Edits autosave locally after you start drawing.
            </li>
          )}
          {projects.map((project) => (
            <li key={project.id} className={styles.item}>
              <button type="button" className={styles.open} onClick={() => handleOpen(project)}>
                <span className={styles.name}>{project.name}</span>
                <span className={styles.date}>
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </button>
              <button
                type="button"
                className={styles.delete}
                onClick={() => handleDelete(project.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className={styles.close} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
