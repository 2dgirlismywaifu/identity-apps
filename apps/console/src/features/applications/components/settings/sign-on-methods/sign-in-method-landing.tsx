/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Code, GenericIcon, Heading, InfoCard, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Responsive, Segment } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../../../core";
import { getAuthenticatorIcons, getSignInMethodIllustrations } from "../../../configs";
import { LoginFlowTypes } from "../../../models";

/**
 * Proptypes for the sign in methods landing component.
 */
interface SignInMethodLandingPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to set the selected login flow option.
     */
    onLoginFlowSelect: (type: LoginFlowTypes) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Landing component for Application Sign-in method configurations.
 *
 * @param {SignInMethodLandingPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SignInMethodLanding: FunctionComponent<SignInMethodLandingPropsInterface> = (
    props: SignInMethodLandingPropsInterface
): ReactElement => {

    const {
        isLoading,
        onLoginFlowSelect,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    return (
        <Segment
            basic
            loading={ isLoading }
            data-testid={ testId }
            className="sign-in-method-landing"
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column
                        computer={ 8 }
                        tablet={ 16 }
                        mobile={ 16 }
                        className="default-config-column"
                        textAlign="center"
                    >
                        <div className="pr-5 pl-5">
                            <GenericIcon
                                transparent
                                icon={ getSignInMethodIllustrations().basicAuth }
                                size="small"
                            />
                            <Divider hidden />
                            
                            <div className="default-config-description">
                                <Heading as="h4">
                                    {/*{
                                        t("console:develop.features.applications.edit.sections.signOnMethod." +
                                            "sections.landing.defaultConfig.heading")
                                    }*/}
                                    This application is configured with <Code>Username & Password</Code> Login
                                </Heading>
                                <div className="default-config-description-content">
                                    <Text subHeading muted>
                                        {
                                            t("console:develop.features.applications.edit.sections.signOnMethod." +
                                                "sections.landing.defaultConfig.description.1")
                                        }
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </Grid.Column>
                    <Grid.Column
                        computer={ 8 }
                        tablet={ 16 }
                        mobile={ 16 }
                        className="flow-options-column"
                    >
                        <div className="pr-5 pl-5">
                            <Heading
                                as="h2"
                                textAlign={ window.innerWidth <= Responsive.onlyTablet.maxWidth ? "center" : "left" }
                            >
                                {
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "landing.flowBuilder.heading")
                                }
                            </Heading>
                            <Divider hidden />
                            <InfoCard
                                fluid
                                data-testid="google-login-flow-card"
                                imageSize="mini"
                                image={ getAuthenticatorIcons().google }
                                header={
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "landing.flowBuilder.types.google.heading")
                                }
                                description={
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "landing.flowBuilder.types.google.description")
                                }
                                onClick={ () => onLoginFlowSelect(LoginFlowTypes.GOOGLE_LOGIN) }
                            />
                            <InfoCard
                                fluid
                                data-testid="totp-mfa-flow-card"
                                image={ getAuthenticatorIcons().totp }
                                imageSize="mini"
                                header={
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "landing.flowBuilder.types.totp.heading")
                                }
                                description={
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "landing.flowBuilder.types.totp.description")
                                }
                                onClick={ () => onLoginFlowSelect(LoginFlowTypes.SECOND_FACTOR_TOTP) }
                            />
                            
                            <Divider className="mt-4 mb-4" horizontal>Or</Divider>

                            <InfoCard
                                fluid
                                data-testid="basic-configuration-flow-card"
                                image={ getAuthenticatorIcons().basic }
                                imageSize="mini"
                                header={
                                    t("console:develop.features.applications.edit.sections.signOnMethod." +
                                        "sections.landing.flowBuilder.types.defaultConfig.heading")
                                }
                                description={
                                    t("console:develop.features.applications.edit.sections.signOnMethod." +
                                        "sections.landing.flowBuilder.types.defaultConfig.description")
                                }
                                onClick={ () => onLoginFlowSelect(LoginFlowTypes.DEFAULT) }
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

/**
 * Default props for the Application Sign-in method landing component.
 */
SignInMethodLanding.defaultProps = {
    "data-testid": "sign-in-method-landing"
};
