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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { createApplication, getApplicationTemplateData } from "../../../api";
import { ApplicationWizardStepIcons } from "../../../configs";
import { history } from "../../../helpers";
import {
    ApplicationTemplateInterface,
    ApplicationTemplateListItemInterface,
    emptyApplication,
    MainApplicationInterface,
    SupportedAuthProtocolTypes
} from "../../../models";
import { GeneralSettingsWizardForm } from "./general-settings-wizard-form";
import { ApplicationConstants } from "../../../constants";
import { OauthProtocolSettingsWizardForm } from "./oauth-protocol-settings-wizard-form";
import { WizardSummary } from "./wizard-summary";
import { SAMLProtocolSettingsWizardForm } from "./saml-protocol-settings-wizard-form";
import { WSTrustProtocolSettingsWizardForm } from "./ws-trust-protocol-settings-wizard-form";
import { PassiveStsProtocolSettingsWizardForm } from "./passive-sts-protocol-settings-wizard-form";
import { ApplicationManagementUtils } from "../../../utils";

/**
 * Proptypes for the application creation wizard component.
 */
interface ApplicationCreateWizardPropsInterface {
    currentStep?: number;
    title: string;
    closeWizard: () => void;
    template: ApplicationTemplateListItemInterface;
    subTitle?: string;
}

/**
 * Interface for the wizard state.
 */
interface WizardStateInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/**
 * Interface for the wizard steps.
 */
interface WizardStepInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    title: string;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 * @enum {string}
 */
enum WizardStepsFormTypes {
    PROTOCOL_SELECTION = "protocolSelection",
    GENERAL_SETTINGS = "generalSettings",
    PROTOCOL_SETTINGS = "protocolSettings",
    SUMMARY = "summary"
}

const STEPS: WizardStepInterface[] = [
    {
        icon: ApplicationWizardStepIcons.general,
        title: "General Settings"
    },
    {
        icon: ApplicationWizardStepIcons.protocolConfig,
        title: "Protocol Configuration"
    },
    {
        icon: ApplicationWizardStepIcons.summary,
        title: "Summary"
    }
];

const customAppCreationSteps: WizardStepInterface[] = [
    {
        icon: ApplicationWizardStepIcons.general,
        title: "General Settings"
    }
];

/**
 * Application creation wizard component.
 *
 * @param {ApplicationCreateWizardPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ApplicationCreateWizard: FunctionComponent<ApplicationCreateWizardPropsInterface> = (
    props: ApplicationCreateWizardPropsInterface
): ReactElement => {

    const {
        closeWizard,
        currentStep,
        title,
        subTitle,
        template
    } = props;

    const [wizardSteps, setWizardSteps] = useState<WizardStepInterface[]>(undefined);
    const [wizardState, setWizardState] = useState<WizardStateInterface>(undefined);
    const [partiallyCompletedStep, setPartiallyCompletedStep] = useState<number>(undefined);
    const [currentWizardStep, setCurrentWizardStep] = useState<number>(currentStep);
    const [templateSettings, setTemplateSettings] = useState<MainApplicationInterface>(undefined);

    const dispatch = useDispatch();

    const [submitGeneralSettings, setSubmitGeneralSettings] = useTrigger();
    const [submitOAuth, setSubmitOauth] = useTrigger();
    const [finishSubmit, setFinishSubmit] = useTrigger();
    const [triggerProtocolSelectionSubmit, setTriggerProtocolSelectionSubmit] = useState<boolean>(false);

    /**
     *  Retrieve Application template data.
     *
     */
    const loadApplicationTemplateData = (id: string): void => {

        getApplicationTemplateData(id)
            .then((response) => {
                setTemplateSettings((response as ApplicationTemplateInterface).application);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Template data Fetch Error"
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: "An error occurred while retrieving application template data",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
            })
    };

    /**
     * Creates a new application.
     *
     * @param {MainApplicationInterface} application - The application to be created.
     */
    const createNewApplication = (application: MainApplicationInterface): void => {
        createApplication(application)
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully created the application",
                    level: AlertLevels.SUCCESS,
                    message: "Creation successful"
                }));

                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!_.isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdAppID = location.substring(location.lastIndexOf("/") + 1);

                    history.push(ApplicationConstants.PATHS.get("APPLICATION_EDIT").replace(":id",
                        createdAppID));

                    return;
                }

                // Fallback to applications page, if the location header is not present.
                history.push(ApplicationConstants.PATHS.get("APPLICATIONS"));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Create Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while creating the application",
                    level: AlertLevels.ERROR,
                    message: "Creation Error"
                }));
            });
    };

    /**
     * Navigates to the next wizard step.
     */
    const navigateToNext = (): void => {
        const step = currentWizardStep;

        switch (step) {
            case 0:
                setSubmitGeneralSettings();
                break;
            case 1:
                setSubmitOauth();
                break;
            case 2:
                setFinishSubmit();
                break;
            default:
                break;
        }
    };

    /**
     * Navigates to the previous wizard step.
     */
    const navigateToPrevious = (): void => {
        setPartiallyCompletedStep(currentWizardStep);
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param {WizardStepsFormTypes} formType - Type of the form.
     */
    const handleWizardFormSubmit = (values: any, formType: WizardStepsFormTypes): void => {
        setCurrentWizardStep(currentWizardStep + 1);
        setWizardState(_.merge(wizardState, { [formType]: values }));
    };

    /**
     * Generates a summary of the wizard.
     */
    const generateWizardSummary = (): MainApplicationInterface => {
        if (!wizardState) {
            return;
        }

        let summary: any = {};

        for (const [key, value] of Object.entries(wizardState)) {
            if (key === WizardStepsFormTypes.PROTOCOL_SELECTION) {
                continue;
            }

            summary = {
                ...summary,
                ...value
            };
        }

        return _.merge(_.cloneDeep(templateSettings), summary);
    };

    /**
     * Handles the final wizard submission.
     *
     * @param application - Application data.
     */
    const handleWizardFormFinish = (application: any): void => {
        if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] === SupportedAuthProtocolTypes.OIDC) {
            delete application.inboundProtocolConfiguration.saml;
        } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] === SupportedAuthProtocolTypes.SAML) {
            delete application.inboundProtocolConfiguration.oidc;
        }

        createNewApplication(ApplicationManagementUtils.prefixTemplateNameToDescription(application, template));
    };

    /**
     * Called when modal close event is triggered.
     */
    const handleWizardClose = (): void => {
        closeWizard();
    };

    /**
     * The following function creates a custom application.
     *
     * @param values
     */
    const handleCustomAppWizardFinish = (values: any): void => {
        
        let customApplication: MainApplicationInterface = emptyApplication();

        for (const [key, value] of Object.entries(values)) {
            customApplication = {
                ...customApplication,
                [ key ]: value
            }
        }

        createNewApplication(ApplicationManagementUtils.prefixTemplateNameToDescription(customApplication, template));
    };

    /**
     * Resolves the step content.
     *
     * @return {React.ReactElement} Step content.
     */
    const resolveStepContent = (): ReactElement => {
        switch (currentWizardStep) {
            case 0:
                if (template.id === "custom-application") {
                    return (
                        <GeneralSettingsWizardForm
                            triggerSubmit={ submitGeneralSettings }
                            initialValues={ wizardState && wizardState[WizardStepsFormTypes.GENERAL_SETTINGS] }
                            onSubmit={ (values): void => {
                                handleCustomAppWizardFinish(values)
                            } }
                            templateValues={ templateSettings }
                        />
                    );
                } else {
                    return (
                        <GeneralSettingsWizardForm
                            triggerSubmit={ submitGeneralSettings }
                            initialValues={ wizardState && wizardState[WizardStepsFormTypes.GENERAL_SETTINGS] }
                            onSubmit={ (values): void => handleWizardFormSubmit(values,
                                WizardStepsFormTypes.GENERAL_SETTINGS) }
                            templateValues={ templateSettings }
                        />
                    );
                }
            case 1:
                if (wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION]) {

                    if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] === SupportedAuthProtocolTypes.OIDC) {
                        return (
                            <OauthProtocolSettingsWizardForm
                                triggerSubmit={ submitOAuth }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                templateValues={ templateSettings }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                                // TODO remove if not needed
                                showCallbackURL={ true }
                            />
                        )
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.SAML) {
                        return (
                            <SAMLProtocolSettingsWizardForm
                                triggerSubmit={ submitOAuth }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                templateValues={ templateSettings }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                            />
                        )
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.WS_TRUST) {
                        return (
                            <WSTrustProtocolSettingsWizardForm
                                triggerSubmit={ submitOAuth }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                templateValues={ templateSettings }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                            />
                        )
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.WS_FEDERATION) {
                        return (
                            <PassiveStsProtocolSettingsWizardForm
                                triggerSubmit={ submitOAuth }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                templateValues={ templateSettings }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                            />
                        )
                    }
                }

                return null;
            case 2:
                return (
                    <WizardSummary
                        triggerSubmit={ finishSubmit }
                        summary={ generateWizardSummary() }
                        onSubmit={ handleWizardFormFinish }
                    />
                )
        }
    };

    /**
     * Load template data and initialize the wizard.
     */
    useEffect(() => {

        if(template.id !== "custom-application") {
            setWizardState(_.merge(wizardState,
                {
                    [WizardStepsFormTypes.PROTOCOL_SELECTION]: template.authenticationProtocol
                }));

            loadApplicationTemplateData(template.id);
            setWizardSteps(STEPS);
        } else {
            setWizardSteps(customAppCreationSteps);
        }
    }, [template]);

    /**
     * Sets the current wizard step to the previous on every `partiallyCompletedStep`
     * value change , and resets the partially completed step value.
     */
    useEffect(() => {
        if (partiallyCompletedStep === undefined) {
            return;
        }

        setCurrentWizardStep(currentWizardStep - 1);
        setPartiallyCompletedStep(undefined);
    }, [partiallyCompletedStep]);

    /**
     * Called when protocol selection form trigger value is changed.
     */
    useEffect(() => {
        if (triggerProtocolSelectionSubmit) {
            setTriggerProtocolSelectionSubmit(!triggerProtocolSelectionSubmit);
        }
    }, [triggerProtocolSelectionSubmit]);

    return (
        wizardSteps
            ? (
                <Modal
                    open={ true }
                    className="wizard application-create-wizard"
                    dimmer="blurring"
                    onClose={ handleWizardClose }
                    closeOnDimmerClick
                    closeOnEscape
                >
                    <Modal.Header className="wizard-header">
                        { title }
                        { subTitle && <Heading as="h6">{ subTitle }</Heading> }
                    </Modal.Header>
                    <Modal.Content className="steps-container">
                        <Steps.Group header="Fill the basic information about your application."
                                     current={ currentWizardStep }>
                            { wizardSteps.map((step, index) => (
                                <Steps.Step
                                    key={ index }
                                    icon={ step.icon }
                                    title={ step.title }
                                />
                            )) }
                        </Steps.Group>
                    </Modal.Content>
                    <Modal.Content className="content-container" scrolling>{ resolveStepContent() }</Modal.Content>
                    <Modal.Actions>
                        <Grid>
                            <Grid.Row column={ 1 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <LinkButton floated="left" onClick={ handleWizardClose }>Cancel</LinkButton>
                                </Grid.Column>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    { currentWizardStep < wizardSteps.length - 1 && (
                                        <PrimaryButton floated="right" onClick={ navigateToNext }>
                                            Next <Icon name="arrow right"/>
                                        </PrimaryButton>
                                    ) }
                                    { currentWizardStep === wizardSteps.length - 1 && (
                                        <PrimaryButton floated="right" onClick={ navigateToNext }>Finish</PrimaryButton>
                                    ) }
                                    { currentWizardStep > 0 && (
                                        <LinkButton floated="right" onClick={ navigateToPrevious }>
                                            <Icon name="arrow left"/> Previous
                                        </LinkButton>
                                    ) }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Actions>
                </Modal>
            )
            : null
    );
};

/**
 * Default props for the application creation wizard.
 */
ApplicationCreateWizard.defaultProps = {
    currentStep: 0
};
