import { useState, useEffect } from 'react';

import db from '../entries/db';

export default function useJournalEntry(id) {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    (async () => {
      if (!id) return;

      const doc = await db.get(id, {
        attachments: true,
      });

      setEntry(doc);
    })();
  }, id);

  return entry;
}
