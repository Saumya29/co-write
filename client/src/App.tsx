import './App.css'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'


export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Cadmus Editor</h1>
          <div className="header-actions">
            <span className="document-status">Saved</span>
          </div>
        </div>
      </header>
      <main className="editor-container">
        <SimpleEditor />
      </main>
    </div>
  )
}