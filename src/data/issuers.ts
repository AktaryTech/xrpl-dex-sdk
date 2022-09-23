import { Issuers, XrplNetwork } from '../models';

export interface IssuersData {
  [network: string]: Issuers;
}

const issuers: IssuersData = {
  [XrplNetwork.Testnet]: {
    AktaryTech: {
      name: 'AktaryTech',
      trusted: true,
      website: 'https://aktarytech.com',
      addresses: ['rMZoAqwRn3BLbmFYL3exNVNVKrceYcNy6B'],
      currencies: ['AKT+rMZoAqwRn3BLbmFYL3exNVNVKrceYcNy6B'],
    },
  },
  [XrplNetwork.Mainnet || XrplNetwork.MainnetFullHistory1 || XrplNetwork.MainnetFullHistory2]: {
    Sologenic: {
      name: 'Sologenic',
      trusted: true,
      website: 'https://sologenic.com',
      addresses: ['rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz'],
      currencies: ['534F4C4F00000000000000000000000000000000+rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz'],
    },
    Coreum: {
      name: 'Coreum',
      trusted: true,
      website: 'https://coreum.com',
      addresses: ['rcoreNywaoz2ZCQ8Lg2EbSLnGuRBmun6D'],
      currencies: ['434F524500000000000000000000000000000000+rcoreNywaoz2ZCQ8Lg2EbSLnGuRBmun6D'],
    },
    Multichain: {
      name: 'Multichain',
      trusted: true,
      website: 'https://multichain.org',
      addresses: ['rDsvn6aJG4YMQdHnuJtP9NLrFp18JYTJUf', 'rDsvn6aJG4YMQdHnuJtP9NLrFp18JYTJUf'],
      currencies: [
        '5553445400000000000000000000000000000000+rDsvn6aJG4YMQdHnuJtP9NLrFp18JYTJUf',
        '5553444300000000000000000000000000000000+rDsvn6aJG4YMQdHnuJtP9NLrFp18JYTJUf',
      ],
    },
    GateHub: {
      name: 'GateHub',
      trusted: true,
      website: 'https://gatehub.net',
      addresses: [
        'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
        'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
        'r3ttJ41YnMrKiLqGUXJpQE8urqyMGjC8vE',
        'rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL',
        'rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h',
        'rDAN8tzydyNfnNf2bfUQY6iR96UbpvNsze',
        'rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds',
        'rcXY84C4g14iFp6taFXjjQGVeHqSCh9RX',
        'rckzVpTnKpP4TJ1puQe827bV3X4oYtdTP',
        'rctArjqVvTHihekzDeecKo6mkTYTUSBNc',
      ],
      currencies: [
        'USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
        'EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
        'QAU+r3ttJ41YnMrKiLqGUXJpQE8urqyMGjC8vE',
        'BTC+rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL',
        'ETH+rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h',
        'ETC+rDAN8tzydyNfnNf2bfUQY6iR96UbpvNsze',
        'BCH+rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds',
        'DSH+rcXY84C4g14iFp6taFXjjQGVeHqSCh9RX',
        'REP+rckzVpTnKpP4TJ1puQe827bV3X4oYtdTP',
        'SGB+rctArjqVvTHihekzDeecKo6mkTYTUSBNc',
      ],
    },
    Bitstamp: {
      name: 'Bitstamp',
      trusted: true,
      website: 'https://bitstamp.net',
      addresses: [
        'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      ],
      currencies: [
        'USD+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'EUR+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'JPY+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'GBP+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'CHF+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'AUD+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        'BTC+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      ],
    },
    CasinoCoin: {
      name: 'CasinoCoin',
      trusted: true,
      website: 'https://casinocoin.org',
      addresses: ['rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr'],
      currencies: ['CSC+rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr'],
    },
    Kudos: {
      name: 'Kudos',
      trusted: true,
      website: 'https://bitstamp.net',
      addresses: ['rXTKdHWuppSjkbiKoEv53bfxHAn1MxmTb'],
      currencies: ['XTK+rXTKdHWuppSjkbiKoEv53bfxHAn1MxmTb'],
    },
    Allvor: {
      name: 'Allvor',
      trusted: true,
      website: 'https://bitstamp.net',
      addresses: ['raEQc5krJ2rUXyi6fgmUAf63oAXmF7p6jp'],
      currencies: ['ALV+raEQc5krJ2rUXyi6fgmUAf63oAXmF7p6jp'],
    },
  },
};

export default issuers;
