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

import React, { SyntheticEvent } from "react";
import { Button, Checkbox, CheckboxProps, Header, Responsive, Segment } from "semantic-ui-react";

/**
 * Danger zone component Prop types.
 */
export interface DangerZoneProps {
    /**
     * Test id of the danger zone.
     */
    dangerZoneTestId?: string;
    /**
     * Test id of the delete button.
     */
    deleteButtonTestId?: string;
    /**
     * Title for the danger zone action.
     */
    actionTitle: string;
    /**
     * Heading for the danger zone.
     */
    header: string;
    /**
     * Sub heading for the danger zone.
     */
    subheader: string;
    /**
     * Use toggle button for the danger zone.
     */
    toggle?: DangerZoneToggleProps;
    /**
     * OnClick callback for the danger zone action.
     * @param {React.SyntheticEvent<HTMLButtonElement>} e - Click event.
     */
    onActionClick: (e: SyntheticEvent<HTMLButtonElement>) => void;
}

export interface DangerZoneToggleProps {
    checked: boolean;
    onChange: (event, data: CheckboxProps) => void;
}

/**
 * Danger zone component.
 *
 * @param {DangerZoneProps} props - Props injected to the danger zone component.
 * @return {JSX.Element}
 */
export const DangerZone: React.FunctionComponent<DangerZoneProps> = (
    props: DangerZoneProps
): JSX.Element => {

    const {
        actionTitle,
        header,
        subheader,
        onActionClick,
        toggle,
        deleteButtonTestId,
        dangerZoneTestId
    } = props;

    return (
        <Segment data-testid={ dangerZoneTestId } className="danger-zone" padded clearing>
            <Header as="h5" color="red" floated="left">
                { header }
                <Header.Subheader className="sub-header">{ subheader }</Header.Subheader>
            </Header>
            {
                toggle ?
                    <Checkbox
                        toggle
                        onChange={ toggle?.onChange }
                        checked={ toggle?.checked }
                    />
                    :
                    <Button
                        data-testid={ deleteButtonTestId }
                        fluid={ window.innerWidth <= Responsive.onlyTablet.maxWidth }
                        negative
                        className={
                            (window.innerWidth <= Responsive.onlyTablet.maxWidth)
                                ? "mb-1x mt-1x"
                                : ""
                        }
                        floated="right"
                        onClick={ onActionClick }
                    >
                        { actionTitle }
                    </Button>
            }
        </Segment>
    );
};
