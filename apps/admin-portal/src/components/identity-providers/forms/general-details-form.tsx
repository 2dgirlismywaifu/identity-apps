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
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Grid } from "semantic-ui-react";
import { getIdentityProviderList } from "../../../api";
import { IdentityProviderInterface } from "../../../models";


/**
 * Proptypes for the identity provider general details form component.
 */
interface GeneralDetailsFormPopsInterface {
    /**
     * Currently editing identity provider id.
     */
    idpId?: string;
    /**
     * Identity provider description.
     */
    description?: string;
    /**
     * Is the identity provider discoverable.
     */
    isEnabled?: boolean;
    /**
     * Identity provider logo URL.
     */
    imageUrl?: string;
    /**
     * Name of the identity provider.
     */
    name: string;
    /**
     * Mark identity provider as primary.
     */
    isPrimary?: boolean;
    /**
     * On submit callback.
     */
    onSubmit: (values: any) => void;
    /**
     * Externally trigger form submission.
     */
    triggerSubmit?: boolean;
    /**
     * Optimize for the creation wizard.
     */
    enableWizardMode?: boolean;
}

/**
 * Form to edit general details of the identity provider.
 *
 * @param props GeneralDetailsFormPopsInterface.
 * @return {React.ReactElement}.
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPopsInterface> = (props): ReactElement => {

    const {
        name,
        description,
        imageUrl,
        onSubmit,
        triggerSubmit,
        enableWizardMode,
        isEnabled
    } = props;

    const [isEnable, setIsEnable] = useState<boolean>(isEnabled);
    const [isNameValid, setIsNameValid] = useState<boolean>(true);
    const [modifiedName, setModifiedName] = useState<string>(name);

    const dispatch = useDispatch();

    /**
     * Called when name field is modified.
     */
    useEffect(() => {
        if (!enableWizardMode) {
            return;
        }
        setIsNameValid(false);
        validateIdpName(modifiedName);
    }, [modifiedName]);

    /**
     * Retrieves the list of identity providers.
     */
    const validateIdpName = (idpName: string) => {
        return getIdentityProviderList(null, null, "name eq " + idpName)
            .then((response) => {
                setIsNameValid(response?.totalResults === 0);
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "An error occurred while retrieving identity providers"
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: "An error occurred while retrieving identity providers",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
                return;
            })
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfigurations = (values: Map<string, FormValue>): IdentityProviderInterface => {
        return {
            description: values.get("description").toString(),
            image: values.get("image").toString(),
            isPrimary: !!values.get("isPrimary"),
            name: values.get("name").toString()
        };
    };

    return (
        <Forms
            onSubmit={ (values): void => {
                onSubmit(updateConfigurations(values))
            } }
            submitState={ triggerSubmit }
            onChange={ (isPure, values) => {
                if (!enableWizardMode) {
                    setModifiedName(values.get("name").toString());
                }
            } }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="name"
                            label="Identity Provider Name"
                            required={ true }
                            requiredErrorMessage="Identity Provider name is required"
                            placeholder={ name }
                            type="text"
                            validation={ (value: string, validation: Validation) => {
                                if (isNameValid === false) {
                                    validation.isValid = false;
                                    validation.errorMessages.push("An identity provider already exists with this " +
                                        "name");
                                }
                            } }
                            value={ name }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="description"
                            label="Description"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Enter a description for the identity provider"
                            type="textarea"
                            value={ description }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="image"
                            label="Identity Provider Image URL"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Provide the image url for the identity provider"
                            type="text"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push("This is not a valid URL");
                                }
                            } }
                            value={ imageUrl }
                        />
                    </Grid.Column>
                </Grid.Row>

                {
                    !enableWizardMode ? (
                        <>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Field
                                        name="isEnable"
                                        required={ false }
                                        requiredErrorMessage=""
                                        type="checkbox"
                                        children={ [
                                            {
                                                label: "Enable",
                                                value: "isEnable"
                                            }
                                        ] }
                                        value={ isEnable ? ["isEnable"] : [] }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Button primary type="submit" size="small" className="form-button">
                                        Update
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </>
                    ) : null
                }
            </Grid>
        </Forms>
    );
};

GeneralDetailsForm.defaultProps = {
    enableWizardMode: false,
    triggerSubmit: false
};
