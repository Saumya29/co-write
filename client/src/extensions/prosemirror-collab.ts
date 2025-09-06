import { Extension } from '@tiptap/core'
import { collab } from 'prosemirror-collab'

export interface CollabOptions {
  version: number
  clientID: string
}

export const ProseMirrorCollab = Extension.create<CollabOptions>({
  name: 'prosemirrorCollab',

  addOptions() {
    return {
      version: 0,
      clientID: '',
    }
  },

  addProseMirrorPlugins() {
    const { version, clientID } = this.options
    
    return [
      collab({
        version,
        clientID,
      }),
    ]
  },
})