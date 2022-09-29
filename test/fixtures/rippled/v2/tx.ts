import { AccountAddress } from '../../../../src/models';
import { getOrderOrTradeId } from '../../../../src/utils';

export interface TxMocks {
  orderId: {
    [transactionType: string]: {
      [account: AccountAddress]: any;
    };
  };
  hash: {
    [txHash: string]: any;
  };
}

const offerCreate = [
  {
    id: 'rn5umFvUWKXqwrGJSRcV24wz9zZFiG7rsQ:30419151',
    result: {
      Account: 'rn5umFvUWKXqwrGJSRcV24wz9zZFiG7rsQ',
      Fee: '12',
      Flags: 0,
      LastLedgerSequence: 31319508,
      Sequence: 30419151,
      SigningPubKey: '03C8D190247CF46B9A694B73F365387B2FD60DAF464394FD7727EBBE0C0D059D3F',
      TakerGets: '100000000',
      TakerPays: { currency: 'TST', issuer: 'rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd', value: '10' },
      TransactionType: 'OfferCreate',
      TxnSignature:
        '3045022100BC8D892350C36AAECF0EB79296AECA50CFDBC745431D02348A35EA4F8EF28E370220561843E36BFE9B4BAA46ACFD532B8D4C1E104464A5321592592C10F18E0DB0FD',
      date: 716947611,
      hash: '77D8B4889A59DDAE101900317AC415A83983459BCE0FAE3FD8CD41B8122095BF',
      inLedger: 31319490,
      ledger_index: 31319490,
      meta: {
        AffectedNodes: [
          {
            CreatedNode: {
              LedgerEntryType: 'Offer',
              LedgerIndex: '0D5A1CD41A637B533D123EE3408F898875E0F8FCA743CF98599E347F55D606DC',
              NewFields: {
                Account: 'rn5umFvUWKXqwrGJSRcV24wz9zZFiG7rsQ',
                BookDirectory: '72128015EB40BE5804FEF5B56FC2388AC0254245667757FB4E038D7EA4C68000',
                Sequence: 30419151,
                TakerGets: '100000000',
                TakerPays: { currency: 'TST', issuer: 'rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd', value: '10' },
              },
            },
          },
          {
            ModifiedNode: {
              FinalFields: {
                Account: 'rn5umFvUWKXqwrGJSRcV24wz9zZFiG7rsQ',
                Balance: '999999515',
                Flags: 0,
                OwnerCount: 16,
                Sequence: 30419152,
              },
              LedgerEntryType: 'AccountRoot',
              LedgerIndex: '208DD325D60BDB14D3D0EA3485FC1671B6FE115BBE1C8710876945FA988DF9BA',
              PreviousFields: { Balance: '999999527', OwnerCount: 15, Sequence: 30419151 },
              PreviousTxnID: '5014C5C8A4985E951DEFFB2A692B56B05B10C6468D8F496A201F94EBBB1E40CF',
              PreviousTxnLgrSeq: 31319487,
            },
          },
          {
            ModifiedNode: {
              FinalFields: {
                ExchangeRate: '4e038d7ea4c68000',
                Flags: 0,
                RootIndex: '72128015EB40BE5804FEF5B56FC2388AC0254245667757FB4E038D7EA4C68000',
                TakerGetsCurrency: '0000000000000000000000000000000000000000',
                TakerGetsIssuer: '0000000000000000000000000000000000000000',
                TakerPaysCurrency: '0000000000000000000000005453540000000000',
                TakerPaysIssuer: 'F2F97C4301C80D60F86653A319AA7F302C70B83B',
              },
              LedgerEntryType: 'DirectoryNode',
              LedgerIndex: '72128015EB40BE5804FEF5B56FC2388AC0254245667757FB4E038D7EA4C68000',
            },
          },
          {
            ModifiedNode: {
              FinalFields: {
                Flags: 0,
                Owner: 'rn5umFvUWKXqwrGJSRcV24wz9zZFiG7rsQ',
                RootIndex: '7C4EB13AF583729FE599090F65C7A6011811576F4D38ADC014567F231973F663',
              },
              LedgerEntryType: 'DirectoryNode',
              LedgerIndex: '7C4EB13AF583729FE599090F65C7A6011811576F4D38ADC014567F231973F663',
            },
          },
        ],
        TransactionIndex: 0,
        TransactionResult: 'tesSUCCESS',
      },
      validated: true,
    },
    type: 'response',
  },
  {
    id: 'rfyJRyFZzX71LL5LreHpUZBZqrB18xUL4P:416442',
    result: {
      Account: 'rfyJRyFZzX71LL5LreHpUZBZqrB18xUL4P',
      Fee: '150',
      Flags: 2147483648,
      LastLedgerSequence: 31535038,
      OfferSequence: 416438,
      Sequence: 416442,
      SigningPubKey: '02CF8FF8A4CD909AF53654815438977F86B50F7EF4539EE2378EC792ECA5036B43',
      TakerGets: {
        currency: 'USD',
        issuer: 'rVnYNK9yuxBz4uP8zC8LEFokM2nqH3poc',
        value: '725.26577',
      },
      TakerPays: '1634987419',
      TransactionType: 'OfferCreate',
      TxnSignature:
        '304402200EC7E424E5474AD6BDA192FD86F7AFE3E48EEC6006F04537DA19D633D721AE5F022056357E9E78D48531877BD819327D85C2F5D8E3F2D91EE7D1F16C6AFB80AD964F',
      date: 717624020,
      hash: 'DA6D424EA1E45CD5103D8DFA391481115289B7E5ABBDCDCC7338E37221942970',
      inLedger: 31535037,
      ledger_index: 31535037,
      meta: {
        AffectedNodes: [
          {
            DeletedNode: {
              FinalFields: {
                Account: 'rfyJRyFZzX71LL5LreHpUZBZqrB18xUL4P',
                BookDirectory: '34934213EE8188F0EFF777733A1FE76AE29E9B2E32916B7F5B07FCA452C28AFD',
                BookNode: '0',
                Flags: 0,
                OwnerNode: '0',
                PreviousTxnID: '67A189CF703C1EA6102AB03F00F934B10A2D92AA4CA86674F300895E042B79D9',
                PreviousTxnLgrSeq: 31534878,
                Sequence: 416438,
                TakerGets: {
                  currency: 'USD',
                  issuer: 'rVnYNK9yuxBz4uP8zC8LEFokM2nqH3poc',
                  value: '725.26577',
                },
                TakerPays: '1630475439',
              },
              LedgerEntryType: 'Offer',
              LedgerIndex: '2EB3164385718A7FF537BE0EC04F55B1E6D85156B30CE510307A0376B9856040',
            },
          },
          {
            DeletedNode: {
              FinalFields: {
                ExchangeRate: '5b07fca452c28afd',
                Flags: 0,
                RootIndex: '34934213EE8188F0EFF777733A1FE76AE29E9B2E32916B7F5B07FCA452C28AFD',
                TakerGetsCurrency: '0000000000000000000000005553440000000000',
                TakerGetsIssuer: '054F6F784A58F9EFB0A9EB90B83464F9D1664619',
                TakerPaysCurrency: '0000000000000000000000000000000000000000',
                TakerPaysIssuer: '0000000000000000000000000000000000000000',
              },
              LedgerEntryType: 'DirectoryNode',
              LedgerIndex: '34934213EE8188F0EFF777733A1FE76AE29E9B2E32916B7F5B07FCA452C28AFD',
            },
          },
          {
            CreatedNode: {
              LedgerEntryType: 'DirectoryNode',
              LedgerIndex: '34934213EE8188F0EFF777733A1FE76AE29E9B2E32916B7F5B08024CCB9BCBA3',
              NewFields: {
                ExchangeRate: '5b08024ccb9bcba3',
                RootIndex: '34934213EE8188F0EFF777733A1FE76AE29E9B2E32916B7F5B08024CCB9BCBA3',
                TakerGetsCurrency: '0000000000000000000000005553440000000000',
                TakerGetsIssuer: '054F6F784A58F9EFB0A9EB90B83464F9D1664619',
              },
            },
          },
          {
            CreatedNode: {
              LedgerEntryType: 'Offer',
              LedgerIndex: '718202414B46578D525C14A6F769E3E92A04DC374659A8515CC2E926377D9785',
              NewFields: {
                Account: 'rfyJRyFZzX71LL5LreHpUZBZqrB18xUL4P',
                BookDirectory: '34934213EE8188F0EFF777733A1FE76AE29E9B2E32916B7F5B08024CCB9BCBA3',
                Sequence: 416442,
                TakerGets: {
                  currency: 'USD',
                  issuer: 'rVnYNK9yuxBz4uP8zC8LEFokM2nqH3poc',
                  value: '725.26577',
                },
                TakerPays: '1634987419',
              },
            },
          },
          {
            ModifiedNode: {
              FinalFields: {
                Account: 'rfyJRyFZzX71LL5LreHpUZBZqrB18xUL4P',
                Balance: '14848709054',
                Flags: 0,
                OwnerCount: 8,
                Sequence: 416443,
              },
              LedgerEntryType: 'AccountRoot',
              LedgerIndex: 'A9AB6FE8524D9F7F01763FF4A3710912AEEE329B26F9467D12ED97C26F8D2B3E',
              PreviousFields: {
                Balance: '14848709204',
                Sequence: 416442,
              },
              PreviousTxnID: 'C2E0F31C3290B4BF6444A00622A7A6C872EE1C4E5FD0FEB17F3AFFFC0C8ED0DB',
              PreviousTxnLgrSeq: 31535035,
            },
          },
          {
            ModifiedNode: {
              FinalFields: {
                Flags: 0,
                Owner: 'rfyJRyFZzX71LL5LreHpUZBZqrB18xUL4P',
                RootIndex: 'D9BB5CF1324791F57C7A6C7366766753513195F020AA7902D929D74B87A6431E',
              },
              LedgerEntryType: 'DirectoryNode',
              LedgerIndex: 'D9BB5CF1324791F57C7A6C7366766753513195F020AA7902D929D74B87A6431E',
            },
          },
        ],
        TransactionIndex: 8,
        TransactionResult: 'tesSUCCESS',
      },
      validated: true,
    },
    status: 'success',
    type: 'response',
  },
];

const txMocks: TxMocks = {
  orderId: {},
  hash: {},
};

for (const tx of offerCreate) {
  if (!txMocks.orderId.OfferCreate) txMocks.orderId.OfferCreate = {};
  txMocks.orderId.OfferCreate[getOrderOrTradeId(tx.result.Account, tx.result.Sequence)] = tx;
  txMocks.hash[tx.result.hash] = tx;
}

export default txMocks;
