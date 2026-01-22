import type React from "react";
import {
  Brand,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";

import {testMarks} from "app/view/dataTest";
import {useLocation} from "app/view/share/router";
import * as location from "app/view/share/location";

import {UserMenu} from "./UserMenu";

const BrandButton: React.FC<{onClick: (e: React.MouseEvent) => void}> = ({
  onClick,
}) => (
  <button
    onClick={onClick}
    aria-label="Go to dashboard"
    style={{
      display: "flex",
      alignItems: "center",
      background: "transparent",
      border: "none",
      padding: 0,
      cursor: "pointer",
    }}
  >
    <Brand
      src="/ui/static/media/favicon.svg"
      alt="logo"
      heights={{default: "40px"}}
    />
    <span style={{marginLeft: "12px", fontWeight: 600}}>高可用性集群管理</span>
  </button>
);

export const Header = () => {
  const {navigate} = useLocation();
  return (
    <Masthead {...testMarks.header.mark}>
      <MastheadMain>
        <MastheadBrand>
          <BrandButton
            onClick={e => {
              e.preventDefault();
              navigate(location.dashboard);
            }}
          />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar isFullHeight isStatic>
          <ToolbarContent>
            <ToolbarGroup align={{default: "alignRight"}}>
              <ToolbarItem>
                <UserMenu />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
};
