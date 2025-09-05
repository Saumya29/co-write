import './App.css'
import { useState } from 'react'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'


export default function App() {
  const [wordCount, setWordCount] = useState(0)
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Cadmus Editor</h1>
          <div className="header-actions">
            <span className="word-count">{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          </div>
        </div>
      </header>
      <main className="editor-container">
        <SimpleEditor onWordCountChange={setWordCount} />
      </main>
    </div>
  )
}