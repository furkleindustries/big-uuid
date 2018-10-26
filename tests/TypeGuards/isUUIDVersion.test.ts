import {
  isUUIDVersion,
} from '../../src/TypeGuards/isUUIDVersion';
import {
  UUIDVersions,
} from '../../src/Enums/UUIDVersions';

describe('isUUIDVersion tests.', () => {
  it('Returns true if the argument is a member of UUIDVersions.', () => {
    let failed = false;
    (Object as any).values(UUIDVersions).forEach((version: UUIDVersions) => {
      if (!isUUIDVersion(version)) {
        failed = true;
      }
    });

    expect(failed).toBe(false);
  });
});
