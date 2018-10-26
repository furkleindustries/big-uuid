import {
  UUID,
} from '../../src/UUID/UUID';
import { UUIDVersions } from '../../src/Enums/UUIDVersions';

describe('UUID integration tests.', () => {
  it('UUID with version nil returns all zeroes.', () => {
    const uuid = new UUID({ version: UUIDVersions.Nil, }).toString();
    expect(uuid).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('Parses a nil UUID string into a UUID object.', () => {
    const uuidStr = new UUID({ version: UUIDVersions.Nil, }).toString();
    const uuid = UUID.parse(uuidStr);
    expect(uuid).toMatchObject({
      /* TODO: figure out this weird bug where it only accepts an array-like
       * object. */
      clockSequence: { 0: 0, 1: 0, },
      nodeIdentifier: new Uint8Array([ 0, 0, 0, 0, 0, 0, ]),
      timestamp: new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, ]),
      version: UUIDVersions.Nil,
    });
  });
});
