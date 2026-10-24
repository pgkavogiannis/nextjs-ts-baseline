import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library unmounts between tests on its own only when Vitest globals are on.
// They stay off so tests import from 'vitest' and tsc needs no ambient test types.
afterEach(cleanup);
