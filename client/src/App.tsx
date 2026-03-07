import './App.css';
import {useState} from 'react';
import {SimpleEditor} from '@/components/tiptap-templates/simple/simple-editor';
import {ThemeToggle} from '@/components/tiptap-templates/simple/theme-toggle';

export default function App() {
  const [wordCount, setWordCount] = useState(0);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <span className="header-dot" aria-hidden="true" />
            <h1 className="app-title">co-write</h1>
          </div>
          <div className="header-actions">
            <span className="word-count" aria-live="polite">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="editor-container">
        <SimpleEditor onWordCountChange={setWordCount} />
      </main>
    </div>
  );
}
