import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

test('concurrent edits reject stale versions, preserve order and survive reload', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'cowrite-test-'));
  process.env.COWRITE_DATA_FILE = path.join(directory, 'state.json');
  try {
    const dao = await import('../src/modules/collaboration/dao.js');
    await dao.initialize();
    const attempts = await Promise.allSettled([
      dao.appendEvents(0, [{text: 'first'}], ['alice']),
      dao.appendEvents(0, [{text: 'second'}], ['bob']),
    ]);
    assert.equal(attempts.filter(result => result.status === 'fulfilled').length, 1);
    const rejected = attempts.find(result => result.status === 'rejected');
    assert.ok(rejected && rejected.status === 'rejected' && rejected.reason instanceof dao.VersionConflict);
    assert.equal(await dao.getVersion(), 1);
    assert.equal(await dao.appendEvents(1, [{text: 'rebased'}], ['bob']), 2);
    const history = await dao.getEvents(0);
    assert.deepEqual(history, {steps: [{text: 'first'}, {text: 'rebased'}], clientIDs: ['alice', 'bob']});
    const persisted = JSON.parse(await readFile(process.env.COWRITE_DATA_FILE, 'utf8'));
    assert.equal(persisted.version, 2);
    await dao.initialize();
    assert.deepEqual(await dao.getEvents(0), history);
    await assert.rejects(dao.appendEvents(0, [], []), dao.VersionConflict);
    assert.equal(await dao.appendEvents(2, [{text: 'after conflict'}], ['alice']), 3);
    // Corrupt persistence must fail visibly, never silently erase existing history.
    await writeFile(process.env.COWRITE_DATA_FILE, '{broken');
    await assert.rejects(dao.initialize());
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});
