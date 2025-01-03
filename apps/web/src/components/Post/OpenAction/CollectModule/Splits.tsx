import Slug from "@components/Shared/Slug";
import { APP_NAME, COLLECT_FEES_ADDRESS } from "@hey/data/constants";
import formatAddress from "@hey/helpers/formatAddress";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getStampFyiURL from "@hey/helpers/getStampFyiURL";
import {
  type Account,
  type RecipientDataOutput,
  useAccountsBulkQuery
} from "@hey/indexer";
import { Image } from "@hey/ui";
import { chains } from "@lens-network/sdk/viem";
import Link from "next/link";
import type { FC } from "react";

interface SplitsProps {
  recipients: RecipientDataOutput[];
}

const Splits: FC<SplitsProps> = ({ recipients }) => {
  const { data: recipientProfilesData, loading } = useAccountsBulkQuery({
    skip: !recipients?.length,
    variables: {
      request: { addresses: recipients?.map((r) => r.recipient) }
    }
  });

  if (recipients.length === 0) {
    return null;
  }

  const getAccountByAddress = (address: string) => {
    const accounts = recipientProfilesData?.accountsBulk;
    if (accounts) {
      return accounts.find((a) => a.address === address);
    }
  };

  return (
    <div className="space-y-2 pt-3">
      <div className="mb-2 font-bold">Fee recipients</div>
      {recipients.map((recipient) => {
        const { recipient: address, split } = recipient;
        const account = getAccountByAddress(address);

        if (address === COLLECT_FEES_ADDRESS) {
          return (
            <div key={address}>
              <div className="divider mt-3 mb-2" />
              <div className="flex items-center justify-between text-sm">
                <div className="ld-text-gray-500 flex w-full items-center space-x-2">
                  <img alt="Hey" className="size-4" src="/logo.png" />
                  <b>{APP_NAME} Fees</b>
                </div>
                <div className="font-bold">{split}%</div>
              </div>
            </div>
          );
        }

        return (
          <div
            className="flex items-center justify-between text-sm"
            key={address}
          >
            <div className="flex w-full items-center space-x-2">
              {loading ? (
                <>
                  <div className="shimmer size-5 rounded-full" />
                  <div className="shimmer h-3 w-1/4 rounded-full" />
                </>
              ) : (
                <>
                  <Image
                    alt="Avatar"
                    className="size-5 rounded-full border bg-gray-200 dark:border-gray-700"
                    src={account ? getAvatar(account) : getStampFyiURL(address)}
                  />
                  {account ? (
                    <Link href={getAccount(account as Account).link}>
                      <Slug
                        slug={getAccount(account as Account).usernameWithPrefix}
                      />
                    </Link>
                  ) : (
                    <Link
                      href={`${chains.testnet.blockExplorers?.default.url}/address/${address}`}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {formatAddress(address, 6)}
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="font-bold">{split}%</div>
          </div>
        );
      })}
    </div>
  );
};

export default Splits;
