// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useState } from 'react';
import { BareProps } from "@polkadot/react-components/types";
import {
  InputAddress,
  Table,
  AddressSmall,
  TxButton, StakingExtrinsic, Modal, LabelHelp
} from "@polkadot/react-components";
import { useTranslation } from "@polkadot/app-staking/translate";
import { useApi, useCall } from "@polkadot/react-hooks";
import type { DeriveStakingElected, DeriveStakingWaiting, DeriveStakingQuery } from '@polkadot/api-derive/types';
import FormatBalance from '@polkadot/app-generic-asset/FormatBalance';
import { poolRegistry } from "@polkadot/app-staking/Overview/Address/poolRegistry";
import assetsRegistry, { SPENDING_ASSET_NAME, STAKING_ASSET_NAME } from "@polkadot/app-generic-asset/assetsRegistry";
import BN from "bn.js";
import { StakingLedger } from "@cennznet/types";
import { bool, Option } from '@polkadot/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import styled from 'styled-components';
import {colors} from '../../../../styled-theming';

interface Props extends BareProps {
  stashAddress: string;
  controllerAddress: string;
  onClose: () => void;
}

export function _renderRows(validatorInfo: DeriveStakingQuery[], isElected: boolean, chain: string | undefined, _validatorSelected: (element: any) => void, status?: string) {
  return <>
    {validatorInfo.map(({accountId, stakingLedger, exposure, validatorPrefs}): React.ReactNode => (
      <tr key={accountId.toString()}>
        <td className='address'>
          <AddressSmall value={accountId.toString()}/>
        </td>
        <td className='address'>
          {chain && poolRegistry[chain] && poolRegistry[chain][accountId.toString()] ? poolRegistry[chain][accountId.toString()] : 'Unknown'}
        </td>
        <td>
          {validatorPrefs["commission"].toHuman()}
        </td>
        <td>
          {stakingLedger.active?.toBn()?.gten(0) && (
            <FormatBalance value={isElected ? exposure.total: stakingLedger.active} symbol={STAKING_ASSET_NAME}/>)}
        </td>
        {status && <td>{status}</td>}
        <td>
          <input
            className='checkbox'
            type={'checkbox'}
            value={accountId.toString()}
            onClick={_validatorSelected}
          />
        </td>
      </tr>
    ))}
  </>;
}

function ManageStake ({ className, controllerAddress, stashAddress, onClose }: Props): React.ReactElement<Props> {
    const { api } = useApi();
    const defaultSection = Object.keys(api.tx)[0];
    const defaultMethod = Object.keys(api.tx[defaultSection])[0];
    const apiDefaultTx = api.tx[defaultSection][defaultMethod];
    const apiDefaultTxSudo = (api.tx.staking && api.tx.staking.setController) || apiDefaultTx;
    const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo);
    const waitingInfo = useCall<DeriveStakingWaiting>(api.derive.staking.waitingInfo);
    const [method, setMethod] = useState<SubmittableExtrinsic | null>();
    const isFinalSession = useCall<bool>(api.query.staking.isCurrentSessionFinal) || false;
    const chainInfo = useCall<string>(api.rpc.system.chain, []);
    // the address which should sign the transaction.
    // it can change between stash or controller.
    const [signingAddress, setSigningAddress] = useState<string>(controllerAddress);
    const [assetBalance, setAssetBalance] = useState<BN>(new BN(0));
    const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic | null>(null);
    const [accountIdVec, setAccountIdVec] = useState<string[]>([]);
    const chain: string | undefined = chainInfo ? chainInfo.toString() : undefined;
    const [isValid, setIsValid] = useState<boolean>(false);
    const [showValidatorList, setShowValidatorList] = useState<boolean>(false);
    const controllerCpayBalance = useCall<'Balance'>(api.query.genericAsset.freeBalance as any, [assetsRegistry.getSpendingAssetId(), controllerAddress]);

    useEffect((): void => {
        if (stashAddress) {
            api.query.staking.ledger(controllerAddress).then(
                (ledger: Option<StakingLedger>) => {
                  if (ledger.isSome) {
                    setAssetBalance((ledger.unwrap().total).toBn());
                  }
                }
            );
        }
    }, [stashAddress]);

    useEffect((): void => {
      if (method) {
        const methodName = api.findCall(method.callIndex).method;
        if (methodName === 'nominate' && accountIdVec.length === 0 || stashAddress === null) {
          setIsValid(false)
        } else {
          setIsValid(true)
        }
      } else {
        setIsValid(false);
      }
    }, [method, accountIdVec]);

    useEffect((): void => {
      if (method) {
        const methodName = api.findCall(method.callIndex).method;
        setShowValidatorList(methodName === 'nominate');
        // quick hack, these methods should be signed by the stash
        if (methodName === 'setController' || methodName === 'bondExtra') {
          setSigningAddress(stashAddress);
        } else {
          setSigningAddress(controllerAddress);
        }
      }
    }, [method]);

    // create an extrinsic if we have correct values
    useEffect((): void => {
        if (isValid && method) {
          const fn = api.findCall(method.callIndex);
          const methodName = fn.method;
          if (methodName === 'nominate') {
            setExtrinsic(api.tx.staking.nominate(accountIdVec));
          } else {
            setExtrinsic(api.tx[fn.section][fn.method](...method.args));
          }
        }
    }, [isValid, stashAddress, method, accountIdVec]);

    const _validatorSelected = (element: any): void => {
        const accountSelected: string = element.currentTarget.value;
        const accounts: string[] = accountIdVec;
        if (element.target.checked && accountSelected) {
            accounts.push(accountSelected);
        } else if (!element.target.checked && accounts.includes(accountSelected)) {
            const index = accounts.indexOf(accountSelected);
            if (index > -1) {
                accounts.splice(index, 1);
            }
        }
        setAccountIdVec(accounts);
        if (accounts.length !== 0 && stashAddress !== null) {
          setIsValid(true);
          setExtrinsic(api.tx.staking.nominate(accounts));
        } else {
          setIsValid(false);
        }
    }

    const { t } = useTranslation();
    const stake = <span className='label'>{t('stake')}</span>;

  return (
        <Modal
          className={className}
          style={{marginTop: "8rem", minWidth: "50%", maxWidth: "700px"}}
          header={
            <span>
              {t('Manage stake')}
              <LabelHelp help={
                'Staking preferences are stored onchain and require sending transactions to approve changes.\
                Some transactions are authorized by a delegated controller account which may not be the same as the stash.'
              }
              />
            </span>
          }
        >
          <Modal.Content>
            <div className='nominator--Selection'>
              <InputAddress
                label={t('Stash')}
                help={'The account with staked CENNZ'}
                defaultValue={stashAddress}
                labelExtra={<FormatBalance label={stake} value={assetBalance} symbol={STAKING_ASSET_NAME}/>}
                type='account'
                isDisabled={true}
              />
              <InputAddress
                label={t('Controller')}
                help={'The account which controls perferences for the stash'}
                defaultValue={controllerAddress}
                labelExtra={<FormatBalance value={controllerCpayBalance} symbol={SPENDING_ASSET_NAME}/>}
                type='account'
                isDisabled={true}
              />
              <StakingExtrinsic
                defaultValue={apiDefaultTxSudo}
                label={t('Action')}
                onChange={setMethod}
              />
              {isFinalSession.valueOf() && <span style={{ color: 'red', marginLeft: '1em', marginTop: '2em' }}>⚠️ nominations and active stake amounts cannot be changed in the last session of an era</span>}
              <div className='validator-info' style={{ display: showValidatorList ? 'block' : 'none' }}>
                <div className='label'>
                  Select validators to nominate
                </div>
                <Table>
                  <Table.Body>
                    <tr>
                      <th>{t('Validator')}</th>
                      <th>{t('Pool')}</th>
                      <th>{t('Commission')}</th>
                      <th>{t('Total Staked')}</th>
                      <th></th>
                    </tr>
                    {electedInfo ? _renderRows(electedInfo.info, true, chain, _validatorSelected) : undefined}
                    {waitingInfo ? _renderRows(waitingInfo.info, false, chain, _validatorSelected) : undefined}
                  </Table.Body>
                </Table>
              </div>
            </div>
          </Modal.Content>
          <Modal.Actions onCancel={onClose}>
            <TxButton
              accountId={signingAddress}
              extrinsic={extrinsic}
              icon='sign-in'
              isDisabled={!isValid || isFinalSession.valueOf()}
              onStart={onClose}
              isPrimary
              label={t('Submit Transaction')}
            />
          </Modal.Actions>
        </Modal>
    );
}

export default styled(ManageStake)`
  .header {
    font-size: 22px;
    margin-top: 3rem;
    margin-left: 1.2rem;
  }

  .nominator--Selection {
    border-radius: 8px;
    padding-right: 2em;
  }

  .menuActive {
    .label {
      margin-left: 1rem;
      font-size: 22px;
      font-weight: 100;
    }
  }
  .submitTx {
    margin-top: 5%;
    margin-left: 35%;
  }

  .validator-info {
    margin-top: 3rem;
    padding-left: 2rem;
    th {
      text-align: left;
      font-size: 15px;
      background: ${colors.primary}
    }
    .label {
      font-size: 18px;
      font-weight: 100;
    }
    .checkbox {
      width:  20px;
      height: 20px;
      border: 2px solid #555;
      cursor: pointer;
    }
  }
`;
