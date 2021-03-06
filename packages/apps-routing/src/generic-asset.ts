// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import GenericAsset from '@polkadot/app-generic-asset';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

export default ([
  {
    Component: GenericAsset,
    display: {
      isHidden: true,
      needsAccounts: true,
      needsApi: [
        'tx.genericAsset.transfer'
      ]
    },
    i18n: {
      defaultValue: 'Send assets'
    },
    icon: faExchangeAlt,
    name: 'send-assets',
    isAdvanced: false
  }
] as Routes);
