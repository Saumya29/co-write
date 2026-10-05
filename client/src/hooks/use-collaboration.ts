import {useEffect, useState} from 'react';
import {Editor} from '@tiptap/react';
import {sendableSteps, receiveTransaction, getVersion} from 'prosemirror-collab';
import {Step} from 'prosemirror-transform';
import * as api from '@/api/collaboration';
import {isErrorWithStatus} from '@/types/collaboration';

type SyncStatus = 'Connecting…' | 'Synced' | 'Saving…' | 'Offline — edits remain in this tab';

export function useCollaboration(editor: Editor | null, clientID: string) {
  const [status, setStatus] = useState<SyncStatus>('Connecting…');

  useEffect(() => {
    if (!editor) return;
    let disposed = false;
    let syncing = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const active = () => !disposed && !editor.isDestroyed;

    const pullSteps = async () => {
      const events = await api.fetchEvents(getVersion(editor.state));
      if (!active()) return;
      if (events.steps.length !== events.clientIDs.length) throw new Error('Invalid step history');
      // Never skip an invalid step: doing so would corrupt version/client alignment.
      const steps = events.steps.map(step => Step.fromJSON(editor.schema, step));
      if (steps.length) editor.view.dispatch(receiveTransaction(editor.state, steps, events.clientIDs, {mapSelectionBackward: true}));
    };

    const sync = async () => {
      if (!active() || syncing) return;
      syncing = true;
      try {
        await pullSteps();
        if (!active()) return;
        const pending = sendableSteps(editor.state);
        if (pending) {
          setStatus('Saving…');
          try {
            await api.postEvents(pending.version, pending.steps.map(step => step.toJSON()), clientID);
          } catch (error) {
            if (!isErrorWithStatus(error) || error.status !== 409) throw error;
            // A concurrent writer won. Pull and rebase; retry on the next sync.
          }
          if (active()) await pullSteps();
        }
        if (active()) setStatus(sendableSteps(editor.state) ? 'Saving…' : 'Synced');
      } catch (error) {
        if (active()) setStatus('Offline — edits remain in this tab');
        console.error('Collaboration sync failed:', error);
      } finally {
        syncing = false;
      }
    };

    const onUpdate = () => {
      setStatus('Saving…');
      clearTimeout(timeout);
      timeout = setTimeout(sync, 300);
    };
    editor.on('update', onUpdate);
    void sync();
    const interval = setInterval(sync, 1000);
    return () => {
      disposed = true;
      clearInterval(interval);
      clearTimeout(timeout);
      editor.off('update', onUpdate);
    };
  }, [editor, clientID]);
  return status;
}
