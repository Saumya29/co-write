import {useEffect, useRef} from 'react';
import {Editor} from '@tiptap/react';
import {sendableSteps, receiveTransaction, getVersion} from 'prosemirror-collab';
import {Step} from 'prosemirror-transform';
import * as api from '@/api/collaboration';
import {isErrorWithStatus} from '@/types/collaboration';

export function useCollaboration(editor: Editor | null, clientID: string) {
  const isPollingRef = useRef(false);
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!editor) return;

    const applySteps = (steps: unknown[], clientIDs: string[]) => {
      const {state, view} = editor;
      const validSteps = [];

      for (const stepData of steps) {
        try {
          validSteps.push(Step.fromJSON(state.schema, stepData));
        } catch (e) {
          console.error('Invalid step, skipping:', e);
        }
      }

      if (validSteps.length > 0) {
        const transaction = receiveTransaction(
          state,
          validSteps,
          clientIDs.slice(0, validSteps.length),
          {mapSelectionBackward: true}
        );
        view.dispatch(transaction);
      }
    };

    const sendSteps = async () => {
      const sendable = sendableSteps(editor.state);
      if (!sendable) return;

      try {
        await api.postEvents(
          sendable.version,
          sendable.steps?.map(s => s.toJSON()) || [],
          clientID
        );
      } catch (error) {
        if (isErrorWithStatus(error) && error.status === 409) {
          await pullSteps();
        } else {
          console.error('Failed to send steps:', error);
        }
      }
    };

    const debouncedSendSteps = () => {
      if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
      sendTimeoutRef.current = setTimeout(sendSteps, 300);
    };

    const pullSteps = async (fromVersion?: number) => {
      if (isPollingRef.current) return;
      isPollingRef.current = true;

      try {
        const version = fromVersion ?? getVersion(editor.state);
        const events = await api.fetchEvents(version);

        if (events.steps?.length > 0) {
          applySteps(events.steps, events.clientIDs);
        }
      } catch (error) {
        console.error('Failed to pull steps:', error);
      } finally {
        isPollingRef.current = false;
      }
    };

    const sync = async () => {
      await pullSteps();
      debouncedSendSteps();
    };

    let intervalId: NodeJS.Timeout;
    pullSteps(0).then(() => {
      intervalId = setInterval(sync, 1000);
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
    };
  }, [editor, clientID]);
}
