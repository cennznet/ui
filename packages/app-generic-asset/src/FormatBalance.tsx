// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';
import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { Compact } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import { useTranslation } from '@polkadot/react-query/translate';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  value?: Compact<any> | BN | string | null | 'all';
  symbol: string;
  withSi?: boolean;
}

// Format GA balances for CENNZnet with Asset Symbol
function formatGenericAssetBalance (value: Compact<any> | BN | string, symbol: string): React.ReactNode {
  const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');

  return <>{prefix}.<span className='balance-postfix'>{`0000${postfix || ''}`.slice(-4)}</span> {symbol}</>;
}

function FormatBalance ({ children, className, label, value, withSi, symbol }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={`ui--FormatBalance ${className}`}>
      {label || ''}{
        value
          ? value === 'all'
            ? t('all available')
            : withSi
              ? value
              : formatGenericAssetBalance(value, symbol)
          : '-'
      }{children}
    </div>
  );
}

export default styled(FormatBalance)`
  display: inline-block;
  vertical-align: baseline;

  * {
    vertical-align: baseline !important;
  }

  > label,
  > .label {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: baseline;
  }

  > .balance-postfix {
    font-weight: 100;
    opacity: 0.75;
    vertical-align: baseline;
  }
`;
