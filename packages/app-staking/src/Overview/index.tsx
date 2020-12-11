// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';

interface Props extends BareProps {
  isVisible: boolean;
}

export default function Overview ({ isVisible, className }: Props): React.ReactElement<Props> {

  return (
    <div className={`staking--Overview ${className} ${!isVisible && 'staking--hidden'}`}>

    </div>
  );
}
