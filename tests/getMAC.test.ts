import {
  getMAC,
} from '../src/getMAC';
import {
  strings,
} from '../src/strings';

import {
  networkInterfaces,
} from 'os';
jest.mock('os');

describe('getMAC unit tests.', () => {
  const mockMACs = [
    {
      address: 'fe80::1234:2343:4543:f20c',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '00:00:00:00:00:00',
      scopeid: 9,
      internal: false,
      cidr: 'fe80::1234:2343:4543:f20c/64'
    },

    {
      address: 'fe80::1234:2343:4543:f20c',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '01:02:03:11:12:13',
      scopeid: 9,
      internal: false,
      cidr: 'fe80::1234:2343:4543:f20c/64'
    },

    {
      address: 'aaaa::bbbb:cccc:dddd:eeee',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '10:11:12:13:14:15',
      scopeid: 9,
      internal: false,
      cidr: 'fe80::1234:2343:4543:f20c/64'
    },
  ];

  beforeEach(() => {
    (networkInterfaces as any).mockClear();
    (networkInterfaces as any).mockReturnValue({
      mockMACs,
    });
  });

  it('Collects the network interfaces from the os function.', () => {
    getMAC();
    expect((networkInterfaces as any).mock.calls).toEqual([ [], ]);
  });

  it('Ignores any value with an empty (00:00:00:00:00) mac address.', () => {
    expect(getMAC()).toEqual(new Uint8Array([
      1,
      2,
      3,
      17,
      18,
      19,
    ]));
  });

  it('Throws if no address can be found.', () => {
    (networkInterfaces as any).mockReturnValue({});
    const func = () => getMAC();
    expect(func).toThrow(strings.MAC_ADDRESS_UNAVAILABLE);
  });

  it('Does not try to use non-object entries in networkInterfaces.', () => {
    (networkInterfaces as any).mockReturnValue({
      foo: [ null, 'foobar', ],
    });

    const func = () => getMAC();
    expect(func).toThrow(strings.MAC_ADDRESS_UNAVAILABLE);
  });

  it('Does not try to use malformed MAC addresses in networkInterfaces.', () => {
    (networkInterfaces as any).mockReturnValue({
      foo: [
        {
          mac: '00:11:22::33:44',
        },
      ],
    });

    const func = () => getMAC();
    expect(func).toThrow(strings.MAC_ADDRESS_UNAVAILABLE);
  });
});
