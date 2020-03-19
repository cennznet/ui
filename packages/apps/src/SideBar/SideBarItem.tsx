import { Menu } from '@polkadot/react-components';
import { NavLink } from 'react-router-dom';

import styled from 'styled-components';
import { colors } from '../../../../styled-theming';

const SideBarItem = styled(Menu.Item).attrs({
  className: 'apps--SideBar-Item'
})`
  align-self: flex-end;
  flex-grow: 0;
  padding: 0 !important;
  position: relative;

  .text {
    padding-left: 0.5rem;
  }

  .ui--Badge {
    margin: 0;
    position: absolute;
    right: 0.5rem;
    top: 0.55rem;
    z-index: 1;
  }

  .collapsed & {
    margin: 0 0 0 2rem;
    max-width: 2.9rem;

    .text {
      display: none;
    }
  }
`;

const SideBarItemLink = styled.a.attrs({
  className: 'apps--SideBar-Item-NavLink'
})`
  color: #f5f5f5;
  display: block;
  padding: 0.75em 0.75em;
  white-space: nowrap;

  &:hover {
    background: #5f5f5f;
    border-radius: 0.28571429rem 0 0 0.28571429rem;
    color: #eee;
    margin-right: 0.25rem;
  }
`;

const SideBarItemNavLink = styled(NavLink).attrs({
  className: 'apps--SideBar-Item-NavLink',
  activeClassName: 'apps--SideBar-Item-NavLink-active'
})`
  color: #f5f5f5;
  display: block;
  padding: 0.75em 0.75em;
  white-space: nowrap;
  border-radius: 1.6rem;

  .expanded & {
    width: 12rem;
  }

  &:hover {
    background: #5f5f5f;
    color: #eee;
  }

  &.apps--SideBar-Item-NavLink-active {
    background: #fafafa;
    color: #3f3f3f;

    &:hover {
      background: #fafafa;
      color: #3f3f3f;
    }
  }
`;

export {
  SideBarItem,
  SideBarItemNavLink,
  SideBarItemLink
};