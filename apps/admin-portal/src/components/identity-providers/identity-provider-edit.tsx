/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { ResourceTab } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement
} from "react";
import {
    AdvanceSettings,
    AuthenticatorSettings,
    GeneralSettings,
    OutboundProvisioningSettings
} from "./settings";
import { AttributeSettings } from "./settings";
import {
    IdentityProviderAdvanceInterface,
    IdentityProviderInterface
} from "../../models";
import { JITProvisioningSettings } from "./settings/jit-provisioning-settings";

/**
 * Proptypes for the idp edit component.
 */
interface EditIdentityProviderPropsInterface {
    /**
     * Editing idp.
     */
    identityProvider: IdentityProviderInterface;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Callback to be triggered after deleting the idp.
     */
    onDelete: () => void;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 * Identity Provider edit component.
 *
 * @param {EditIdentityProviderPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const EditIdentityProvider: FunctionComponent<EditIdentityProviderPropsInterface> = (
    props: EditIdentityProviderPropsInterface
): ReactElement => {

    const {
        identityProvider,
        isLoading,
        onDelete,
        onUpdate
    } = props;

    const idpAdvanceConfig: IdentityProviderAdvanceInterface = {
        alias: identityProvider.alias,
        certificate: identityProvider.certificate,
        homeRealmIdentifier: identityProvider.homeRealmIdentifier,
        isFederationHub: identityProvider.isFederationHub
    };

    const GeneralIdentityProviderSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <GeneralSettings
                idpId={ identityProvider.id }
                description={ identityProvider.description }
                isEnabled={ identityProvider.isEnabled }
                imageUrl={ identityProvider.image }
                name={ identityProvider.name }
                isLoading={ isLoading }
                onDelete={ onDelete }
                onUpdate={ onUpdate }
            />
        </ResourceTab.Pane>
    );

    const AttributeSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <AttributeSettings
                idpId={ identityProvider.id }
                initialClaims={ identityProvider.claims }
                initialRoleMappings={ identityProvider.roles.mappings }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
            />
        </ResourceTab.Pane>
    );

    const AuthenticatorSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <AuthenticatorSettings
                idpId={ identityProvider.id }
                idpName={ identityProvider.name }
                federatedAuthenticators={ identityProvider.federatedAuthenticators }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
            />
        </ResourceTab.Pane>
    );

    const OutboundProvisioningSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <OutboundProvisioningSettings
                idpId={ identityProvider.id }
                outboundConnectors={ identityProvider.provisioning?.outboundConnectors }
                idpRoles={ identityProvider.roles }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
            />
        </ResourceTab.Pane>
    );

    const JITProvisioningSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <JITProvisioningSettings
                idpId={ identityProvider.id }
                jitProvisioningConfigurations={ identityProvider.provisioning?.jit }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
            />
        </ResourceTab.Pane>
    );

    const AdvancedSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <AdvanceSettings
                idpId={ identityProvider.id }
                advancedConfigurations={ idpAdvanceConfig }
                onUpdate={ onUpdate }
            />
        </ResourceTab.Pane>
    );

    const getPanes = () => {
        const panes = [];

        panes.push({
            menuItem: "General",
            render: GeneralIdentityProviderSettingsTabPane
        });

        panes.push({
            menuItem: "Attributes",
            render: AttributeSettingsTabPane
        });

        panes.push({
            menuItem: "Authentication",
            render: AuthenticatorSettingsTabPane
        });

        // todo Once multiple connector support added, this check needs to be removed and edit view should allow
        //  adding connectors.
        if (identityProvider?.provisioning?.outboundConnectors?.defaultConnectorId) {
            panes.push({
                menuItem: "Outbound Provisioning",
                render: OutboundProvisioningSettingsTabPane
            });
        }

        panes.push({
            menuItem: "Just-in-time Provisioning",
            render: JITProvisioningSettingsTabPane
        });

        panes.push({
            menuItem: "Advance",
            render: AdvancedSettingsTabPane
        });

        return panes;
    };

    return (
        identityProvider && (
            <ResourceTab
                panes={ getPanes() }
            />
        )
    );
};
