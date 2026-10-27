import { afterEach } from 'vitest';
import '../i18n/i18n.js';

// Only the jsdom test files have a document; react-modal needs #root there.
if (typeof document !== 'undefined') {
  const { cleanup } = await import('@testing-library/react');

  document.body.innerHTML = '<div id="root"></div>';
  afterEach(cleanup);
}
