const tradesResponses: Record<string, any> = {};

tradesResponses.fetchTrades = [
  {
    id: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n:86944759',
    order: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n:86944754',
    datetime: '2022-10-22T00:09:50.000Z',
    timestamp: 1666397390000,
    symbol: 'XRP/USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    type: 'limit',
    side: 'buy',
    amount: '200000',
    price: '0.45857',
    takerOrMaker: 'taker',
    cost: '91714',
    info: {
      transaction: {
        Account: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
        Fee: '20',
        Flags: 0,
        LastLedgerSequence: 75221158,
        OfferSequence: 86944754,
        Sequence: 86944759,
        SigningPubKey: '03C71E57783E0651DFF647132172980B1F598334255F01DD447184B5D66501E67A',
        TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '91734' },
        TakerPays: '200000000000',
        TransactionType: 'OfferCreate',
        TxnSignature:
          '3044022002458C60151AAA8615BEE60AB48CB4DA0D48B727745CE8023D95B7F209F23C37022070E2A7626699D734CD465C815D11C53B1A41691E38E6C113855736A0D468B553',
        hash: '9FF19C48162FDEFBC86326CD638871CD678371BF126AA184B139AF971F261B74',
        metaData: {
          AffectedNodes: [
            {
              ModifiedNode: {
                FinalFields: {
                  Flags: 0,
                  IndexNext: '0',
                  IndexPrevious: '0',
                  Owner: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
                  RootIndex: '12F72282F74D437C2E76C4E57710E63779A1825D5A2090FF894FB9A22AF40AAE',
                },
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: '12F72282F74D437C2E76C4E57710E63779A1825D5A2090FF894FB9A22AF40AAE',
              },
            },
            {
              DeletedNode: {
                FinalFields: {
                  Account: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
                  BookDirectory: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07BF53F510DEF2',
                  BookNode: '0',
                  Flags: 0,
                  OwnerNode: '0',
                  PreviousTxnID: '7A44B7A010EF875C0A733FA6A50424D7AB3CB2ECD2B075458DC38885BC382815',
                  PreviousTxnLgrSeq: 75221154,
                  Sequence: 86944754,
                  TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '91714' },
                  TakerPays: '200000000000',
                },
                LedgerEntryType: 'Offer',
                LedgerIndex: 'D41F3DAB30C6C508B521FB157BDAB1B5E046B8EE2EC7AFAC39ABDC736516529B',
              },
            },
            {
              CreatedNode: {
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07BEE542BE76CE',
                NewFields: {
                  ExchangeRate: '5b07bee542be76ce',
                  RootIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07BEE542BE76CE',
                  TakerGetsCurrency: '0000000000000000000000005553440000000000',
                  TakerGetsIssuer: '2ADB0B3959D60A6E6991F729E1918B7163925230',
                },
              },
            },
            {
              DeletedNode: {
                FinalFields: {
                  ExchangeRate: '5b07bf53f510def2',
                  Flags: 0,
                  RootIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07BF53F510DEF2',
                  TakerGetsCurrency: '0000000000000000000000005553440000000000',
                  TakerGetsIssuer: '2ADB0B3959D60A6E6991F729E1918B7163925230',
                  TakerPaysCurrency: '0000000000000000000000000000000000000000',
                  TakerPaysIssuer: '0000000000000000000000000000000000000000',
                },
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07BF53F510DEF2',
              },
            },
            {
              CreatedNode: {
                LedgerEntryType: 'Offer',
                LedgerIndex: 'F6A4B34D53480A4C571D12C3B296364CA184073559252589680FBB40F69481A7',
                NewFields: {
                  Account: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
                  BookDirectory: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07BEE542BE76CE',
                  Sequence: 86944759,
                  TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '91734' },
                  TakerPays: '200000000000',
                },
              },
            },
            {
              ModifiedNode: {
                FinalFields: {
                  Account: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
                  Balance: '49176856668',
                  Flags: 0,
                  OwnerCount: 9,
                  Sequence: 86944760,
                },
                LedgerEntryType: 'AccountRoot',
                LedgerIndex: 'F709D77D5D72E0C96CB029FCE21F3AF34E70ED0D8DB121B2CF961E64E582EEF2',
                PreviousFields: { Balance: '49176856688', Sequence: 86944759 },
                PreviousTxnID: '976BC1276B055C8E7DD430D7D80C6F0485A52D2A84106614D2A04D04AC0ECF9D',
                PreviousTxnLgrSeq: 75221156,
              },
            },
          ],
          TransactionIndex: 30,
          TransactionResult: 'tesSUCCESS',
        },
      },
    },
    fee: { currency: 'USD', cost: '183.428', rate: '0.002', percentage: true },
  },
  {
    id: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG:86171108',
    order: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG:86171105',
    datetime: '2022-10-22T00:09:51.000Z',
    timestamp: 1666397391000,
    symbol: 'XRP/USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    type: 'limit',
    side: 'buy',
    amount: '1000',
    price: '0.456536715',
    takerOrMaker: 'taker',
    cost: '456.536715',
    info: {
      transaction: {
        Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
        Fee: '20',
        Flags: 2147483648,
        LastLedgerSequence: 75221159,
        OfferSequence: 86171105,
        Sequence: 86171108,
        SigningPubKey: '02AC7FB83A5AC706F0613B3D93F1C361D84F6415D4E539E1A8BC66F2198F8CACE4',
        TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '456.536715' },
        TakerPays: '1000000000',
        TransactionType: 'OfferCreate',
        TxnSignature:
          '3045022100A819F0DD980CB8801C539E2F06112DC0EA9A8EC409660CCECEED25F25564F7960220391CAC784D167DCF75C47AAF87FAA5C0EA279D969065237229CB53416EE87A7F',
        hash: '1942AE914BA4922B8B02CB4BCF949B38A48A55E863C7AEBDB6094214DF2AC7B6',
        metaData: {
          AffectedNodes: [
            {
              ModifiedNode: {
                FinalFields: {
                  Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  Balance: '60756340',
                  Flags: 0,
                  OwnerCount: 5,
                  Sequence: 86171109,
                },
                LedgerEntryType: 'AccountRoot',
                LedgerIndex: '07400FD4578F4DEFDEF1A5C3EB6F6F149ACADECE9963ACB8B71168F4DB7FE212',
                PreviousFields: { Balance: '60756360', Sequence: 86171108 },
                PreviousTxnID: '2305296F12556B8FC156BEFA7D8E8F0107BC2D891115899584E2696F156EFB50',
                PreviousTxnLgrSeq: 75221155,
              },
            },
            {
              DeletedNode: {
                FinalFields: {
                  Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  BookDirectory: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07C8294059F660',
                  BookNode: '0',
                  Flags: 0,
                  OwnerNode: '0',
                  PreviousTxnID: 'CD96227EA6B6E8D4703977BD9D3F9E67FC841F64775DCBA692BD540972C48E6A',
                  PreviousTxnLgrSeq: 75221155,
                  Sequence: 86171105,
                  TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '456.536715' },
                  TakerPays: '1000000000',
                },
                LedgerEntryType: 'Offer',
                LedgerIndex: '11512A8AAB531936F5E8B6FAAA0F33DCBE76CB1B05835DCEEA107CD88D0E340A',
              },
            },
            {
              CreatedNode: {
                LedgerEntryType: 'Offer',
                LedgerIndex: '508C5B9C3DAA239E4E5B4BA14D9F7AA479AC44310DC25C144EBDAB1ACF9780EF',
                NewFields: {
                  Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  BookDirectory: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07C8294059F660',
                  Sequence: 86171108,
                  TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '456.536715' },
                  TakerPays: '1000000000',
                },
              },
            },
            {
              ModifiedNode: {
                FinalFields: {
                  Flags: 0,
                  IndexNext: '0',
                  IndexPrevious: '0',
                  Owner: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  RootIndex: '5F3DA35DF75B05413178A5945C63B06B9489F2EFACF65CF3053638B65B5B8777',
                },
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: '5F3DA35DF75B05413178A5945C63B06B9489F2EFACF65CF3053638B65B5B8777',
              },
            },
            {
              ModifiedNode: {
                FinalFields: {
                  ExchangeRate: '5b07c8294059f660',
                  Flags: 0,
                  RootIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07C8294059F660',
                  TakerGetsCurrency: '0000000000000000000000005553440000000000',
                  TakerGetsIssuer: '2ADB0B3959D60A6E6991F729E1918B7163925230',
                  TakerPaysCurrency: '0000000000000000000000000000000000000000',
                  TakerPaysIssuer: '0000000000000000000000000000000000000000',
                },
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07C8294059F660',
              },
            },
          ],
          TransactionIndex: 29,
          TransactionResult: 'tesSUCCESS',
        },
      },
    },
    fee: { currency: 'USD', cost: '0.91307343', rate: '0.002', percentage: true },
  },
  {
    id: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG:86171109',
    order: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG:86171106',
    datetime: '2022-10-22T00:09:51.000Z',
    timestamp: 1666397391000,
    symbol: 'XRP/USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    type: 'limit',
    side: 'buy',
    amount: '31000',
    price: '0.45607696',
    takerOrMaker: 'taker',
    cost: '14138.38576',
    info: {
      transaction: {
        Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
        Fee: '20',
        Flags: 2147483648,
        LastLedgerSequence: 75221159,
        OfferSequence: 86171106,
        Sequence: 86171109,
        SigningPubKey: '02AC7FB83A5AC706F0613B3D93F1C361D84F6415D4E539E1A8BC66F2198F8CACE4',
        TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '14138.38576' },
        TakerPays: '31000000000',
        TransactionType: 'OfferCreate',
        TxnSignature:
          '30450221008B015664032AFB9E86D968270BDDEBFCF96C1B82C67A4A7CE29846E18CF81FC8022053DE4CEC98B2C73F4A5DAC60D93787B2A8DEBBB1C86E0B32FE288DD4A25E0F91',
        hash: '9B00A5E5A98970CDA2A7AD598180FF56C929EF2AA7390B35D870FCF93BAA728B',
        metaData: {
          AffectedNodes: [
            {
              CreatedNode: {
                LedgerEntryType: 'Offer',
                LedgerIndex: '00B385C551E2B3A58CC9EABBE572A6224CA7D4307307DCB634ACD3BAF34397DA',
                NewFields: {
                  Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  BookDirectory: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07CA2B5B8357EA',
                  Sequence: 86171109,
                  TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '14138.38576' },
                  TakerPays: '31000000000',
                },
              },
            },
            {
              ModifiedNode: {
                FinalFields: {
                  Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  Balance: '60756320',
                  Flags: 0,
                  OwnerCount: 5,
                  Sequence: 86171110,
                },
                LedgerEntryType: 'AccountRoot',
                LedgerIndex: '07400FD4578F4DEFDEF1A5C3EB6F6F149ACADECE9963ACB8B71168F4DB7FE212',
                PreviousFields: { Balance: '60756340', Sequence: 86171109 },
                PreviousTxnID: '1942AE914BA4922B8B02CB4BCF949B38A48A55E863C7AEBDB6094214DF2AC7B6',
                PreviousTxnLgrSeq: 75221157,
              },
            },
            {
              ModifiedNode: {
                FinalFields: {
                  Flags: 0,
                  IndexNext: '0',
                  IndexPrevious: '0',
                  Owner: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  RootIndex: '5F3DA35DF75B05413178A5945C63B06B9489F2EFACF65CF3053638B65B5B8777',
                },
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: '5F3DA35DF75B05413178A5945C63B06B9489F2EFACF65CF3053638B65B5B8777',
              },
            },
            {
              DeletedNode: {
                FinalFields: {
                  Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  BookDirectory: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07CA2B5B8357EA',
                  BookNode: '0',
                  Flags: 0,
                  OwnerNode: '0',
                  PreviousTxnID: 'CDCE323D5F3D1D2776EE09A874EC4104F3517339525AD1CC6768DEE0764E4CBE',
                  PreviousTxnLgrSeq: 75221155,
                  Sequence: 86171106,
                  TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '14138.38576' },
                  TakerPays: '31000000000',
                },
                LedgerEntryType: 'Offer',
                LedgerIndex: '6E1364F91F136069C9D3454DD9EBB884B338420176D65562CBD19EE71E06BDFD',
              },
            },
            {
              ModifiedNode: {
                FinalFields: {
                  ExchangeRate: '5b07ca2b5b8357ea',
                  Flags: 0,
                  RootIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07CA2B5B8357EA',
                  TakerGetsCurrency: '0000000000000000000000005553440000000000',
                  TakerGetsIssuer: '2ADB0B3959D60A6E6991F729E1918B7163925230',
                  TakerPaysCurrency: '0000000000000000000000000000000000000000',
                  TakerPaysIssuer: '0000000000000000000000000000000000000000',
                },
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07CA2B5B8357EA',
              },
            },
          ],
          TransactionIndex: 30,
          TransactionResult: 'tesSUCCESS',
        },
      },
    },
    fee: { currency: 'USD', cost: '28.27677152', rate: '0.002', percentage: true },
  },
  {
    id: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG:86171110',
    order: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG:86171107',
    datetime: '2022-10-22T00:09:51.000Z',
    timestamp: 1666397391000,
    symbol: 'XRP/USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    type: 'limit',
    side: 'buy',
    amount: '49623.974771',
    price: '0.455617205002363',
    takerOrMaker: 'taker',
    cost: '22609.5366862708',
    info: {
      transaction: {
        Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
        Fee: '20',
        Flags: 2147483648,
        LastLedgerSequence: 75221159,
        OfferSequence: 86171107,
        Sequence: 86171110,
        SigningPubKey: '02AC7FB83A5AC706F0613B3D93F1C361D84F6415D4E539E1A8BC66F2198F8CACE4',
        TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '22609.53668627081' },
        TakerPays: '49623974771',
        TransactionType: 'OfferCreate',
        TxnSignature:
          '30440220787E6AF9691788CDAF6BE5D617ED58EDABF117390A51ED165ABA5AAD9424A99902207EFD5A7AC4B9E39513A3C204808B3F2F0DA23E6C23A0F37C67398AD2C05A4D5D',
        hash: '9285F67BFA05204DE2C3418C0DCB83AE822A9061917866C11B9C913D8F6F1ED7',
        metaData: {
          AffectedNodes: [
            {
              ModifiedNode: {
                FinalFields: {
                  Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  Balance: '60756300',
                  Flags: 0,
                  OwnerCount: 5,
                  Sequence: 86171111,
                },
                LedgerEntryType: 'AccountRoot',
                LedgerIndex: '07400FD4578F4DEFDEF1A5C3EB6F6F149ACADECE9963ACB8B71168F4DB7FE212',
                PreviousFields: { Balance: '60756320', Sequence: 86171110 },
                PreviousTxnID: '9B00A5E5A98970CDA2A7AD598180FF56C929EF2AA7390B35D870FCF93BAA728B',
                PreviousTxnLgrSeq: 75221157,
              },
            },
            {
              ModifiedNode: {
                FinalFields: {
                  Flags: 0,
                  IndexNext: '0',
                  IndexPrevious: '0',
                  Owner: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  RootIndex: '5F3DA35DF75B05413178A5945C63B06B9489F2EFACF65CF3053638B65B5B8777',
                },
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: '5F3DA35DF75B05413178A5945C63B06B9489F2EFACF65CF3053638B65B5B8777',
              },
            },
            {
              DeletedNode: {
                FinalFields: {
                  Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  BookDirectory: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07CC2E80496FFD',
                  BookNode: '0',
                  Flags: 0,
                  OwnerNode: '0',
                  PreviousTxnID: '2305296F12556B8FC156BEFA7D8E8F0107BC2D891115899584E2696F156EFB50',
                  PreviousTxnLgrSeq: 75221155,
                  Sequence: 86171107,
                  TakerGets: {
                    currency: 'USD',
                    issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
                    value: '22609.53668627081',
                  },
                  TakerPays: '49623974771',
                },
                LedgerEntryType: 'Offer',
                LedgerIndex: '790C9FB7C27CF9A3CA96C42E2290418BE28FD13EDA2E142BF4ACE3B55CBC6B80',
              },
            },
            {
              CreatedNode: {
                LedgerEntryType: 'Offer',
                LedgerIndex: 'EACBE266D3F763AA2D07ED65F20AA23FC385950B02F37C3A8BB0A82C384DC7A9',
                NewFields: {
                  Account: 'rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG',
                  BookDirectory: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07CC2E80496FFD',
                  Sequence: 86171110,
                  TakerGets: {
                    currency: 'USD',
                    issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
                    value: '22609.53668627081',
                  },
                  TakerPays: '49623974771',
                },
              },
            },
            {
              ModifiedNode: {
                FinalFields: {
                  ExchangeRate: '5b07cc2e80496ffd',
                  Flags: 0,
                  RootIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07CC2E80496FFD',
                  TakerGetsCurrency: '0000000000000000000000005553440000000000',
                  TakerGetsIssuer: '2ADB0B3959D60A6E6991F729E1918B7163925230',
                  TakerPaysCurrency: '0000000000000000000000000000000000000000',
                  TakerPaysIssuer: '0000000000000000000000000000000000000000',
                },
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07CC2E80496FFD',
              },
            },
          ],
          TransactionIndex: 31,
          TransactionResult: 'tesSUCCESS',
        },
      },
    },
    fee: { currency: 'USD', cost: '45.2190733725416', rate: '0.002', percentage: true },
  },
  {
    id: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n:86944764',
    order: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n:86944759',
    datetime: '2022-10-22T00:10:00.000Z',
    timestamp: 1666397400000,
    symbol: 'XRP/USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    type: 'limit',
    side: 'buy',
    amount: '200000',
    price: '0.45867',
    takerOrMaker: 'taker',
    cost: '91734',
    info: {
      transaction: {
        Account: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
        Fee: '20',
        Flags: 0,
        LastLedgerSequence: 75221160,
        OfferSequence: 86944759,
        Sequence: 86944764,
        SigningPubKey: '03C71E57783E0651DFF647132172980B1F598334255F01DD447184B5D66501E67A',
        TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '91734' },
        TakerPays: '200000000000',
        TransactionType: 'OfferCreate',
        TxnSignature:
          '3045022100A66C4E1B02DAEFE1C1D446AB686F8A9CFF2F88E288FE6FA84D0552C755F7062E022065BD85FDD66E10AFC2698B65DF1309686A0F8E1A048FB051D0F5C65166972A78',
        hash: 'F08D1DFED0D8BB3EF935D3AE471D775F9B8991437BE5852AAEF346653C972ACF',
        metaData: {
          AffectedNodes: [
            {
              ModifiedNode: {
                FinalFields: {
                  Flags: 0,
                  IndexNext: '0',
                  IndexPrevious: '0',
                  Owner: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
                  RootIndex: '12F72282F74D437C2E76C4E57710E63779A1825D5A2090FF894FB9A22AF40AAE',
                },
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: '12F72282F74D437C2E76C4E57710E63779A1825D5A2090FF894FB9A22AF40AAE',
              },
            },
            {
              CreatedNode: {
                LedgerEntryType: 'Offer',
                LedgerIndex: 'EB499DE2A0C71389A4926020AF61F6405245D1F20AB1E87780DB69A8B7E28F96',
                NewFields: {
                  Account: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
                  BookDirectory: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07BEE542BE76CE',
                  Sequence: 86944764,
                  TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '91734' },
                  TakerPays: '200000000000',
                },
              },
            },
            {
              ModifiedNode: {
                FinalFields: {
                  ExchangeRate: '5b07bee542be76ce',
                  Flags: 0,
                  RootIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07BEE542BE76CE',
                  TakerGetsCurrency: '0000000000000000000000005553440000000000',
                  TakerGetsIssuer: '2ADB0B3959D60A6E6991F729E1918B7163925230',
                  TakerPaysCurrency: '0000000000000000000000000000000000000000',
                  TakerPaysIssuer: '0000000000000000000000000000000000000000',
                },
                LedgerEntryType: 'DirectoryNode',
                LedgerIndex: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07BEE542BE76CE',
              },
            },
            {
              DeletedNode: {
                FinalFields: {
                  Account: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
                  BookDirectory: 'F0B9A528CE25FE77C51C38040A7FEC016C2C841E74C1418D5B07BEE542BE76CE',
                  BookNode: '0',
                  Flags: 0,
                  OwnerNode: '0',
                  PreviousTxnID: '9FF19C48162FDEFBC86326CD638871CD678371BF126AA184B139AF971F261B74',
                  PreviousTxnLgrSeq: 75221156,
                  Sequence: 86944759,
                  TakerGets: { currency: 'USD', issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', value: '91734' },
                  TakerPays: '200000000000',
                },
                LedgerEntryType: 'Offer',
                LedgerIndex: 'F6A4B34D53480A4C571D12C3B296364CA184073559252589680FBB40F69481A7',
              },
            },
            {
              ModifiedNode: {
                FinalFields: {
                  Account: 'r3Vh9ZmQxd3C5CPEB8q7VbRuMPxwuC634n',
                  Balance: '49176856568',
                  Flags: 0,
                  OwnerCount: 9,
                  Sequence: 86944765,
                },
                LedgerEntryType: 'AccountRoot',
                LedgerIndex: 'F709D77D5D72E0C96CB029FCE21F3AF34E70ED0D8DB121B2CF961E64E582EEF2',
                PreviousFields: { Balance: '49176856588', Sequence: 86944764 },
                PreviousTxnID: '4CEF63EF549314D4D4BB93D44649206761721C46FAB8B0AD1DE672E4EF4755F5',
                PreviousTxnLgrSeq: 75221158,
              },
            },
          ],
          TransactionIndex: 29,
          TransactionResult: 'tesSUCCESS',
        },
      },
    },
    fee: { currency: 'USD', cost: '183.468', rate: '0.002', percentage: true },
  },
];

export default tradesResponses;
