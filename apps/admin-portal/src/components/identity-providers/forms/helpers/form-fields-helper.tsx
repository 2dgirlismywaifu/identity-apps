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

import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../../models";
import React, { ReactElement } from "react";
import { Field } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";

export const getConfidentialField = (eachProp: CommonPluggableComponentPropertyInterface,
                                     propertyMetadata: CommonPluggableComponentMetaPropertyInterface): ReactElement => {
    return (
        <Field
            showPassword="Show Secret"
            hidePassword="Hide Secret"
            label={ propertyMetadata?.displayName }
            name={ propertyMetadata?.key }
            key={ propertyMetadata?.key }
            placeholder={ propertyMetadata?.description }
            required={ propertyMetadata?.isMandatory }
            requiredErrorMessage={ "This is required" }
            type="password"
        />
    );
};

export const getCheckboxField = (eachProp: CommonPluggableComponentPropertyInterface,
                                 propertyMetadata: CommonPluggableComponentMetaPropertyInterface):
    ReactElement => {
    return (
        <Field
            name={ propertyMetadata?.key }
            key={ propertyMetadata?.key }
            label={ propertyMetadata?.displayName }
            type="checkbox"
            required={ propertyMetadata?.isMandatory }
            value={ eachProp?.value ? [eachProp?.key] : [] }
            requiredErrorMessage="This is required"
            children={
                [
                    {
                        label: propertyMetadata?.description,
                        value: eachProp?.key
                    }
                ]
            }
        />
    );
};

export const getTextField = (eachProp: CommonPluggableComponentPropertyInterface,
                             propertyMetadata: CommonPluggableComponentMetaPropertyInterface): ReactElement => {
    return (
        <Field
            name={ propertyMetadata?.key }
            label={ propertyMetadata?.displayName }
            required={ propertyMetadata?.isMandatory }
            requiredErrorMessage="This is required"
            placeholder={ propertyMetadata?.description }
            type="text"
            value={ eachProp?.value }
            key={ propertyMetadata?.key }
        />
    );
};

export const getURLField = (eachProp: CommonPluggableComponentPropertyInterface,
                            propertyMetadata: CommonPluggableComponentMetaPropertyInterface): ReactElement => {
    return (
        <Field
            name={ propertyMetadata?.key }
            label={ propertyMetadata?.displayName }
            required={ propertyMetadata?.isMandatory }
            requiredErrorMessage="This is required"
            placeholder={ propertyMetadata?.description }
            validation={ (value, validation) => {
                if (!FormValidation.url(value)) {
                    validation.isValid = false;
                    validation.errorMessages.push("This is not a valid URL");
                }
            } }
            type="text"
            value={ eachProp?.value }
            key={ propertyMetadata?.key }
        />
    );
};

export const getQueryParamsField = (eachProp: CommonPluggableComponentPropertyInterface,
                            propertyMetadata: CommonPluggableComponentMetaPropertyInterface): ReactElement => {
    return (
        <Field
            name={ propertyMetadata?.key }
            label={ propertyMetadata?.displayName }
            required={ propertyMetadata?.isMandatory }
            requiredErrorMessage="This is required"
            validation={ (value, validation) => {
                if (!FormValidation.url("https://www.sample.com?" + value)) {
                    validation.isValid = false;
                    validation.errorMessages.push("These are not valid query parameters");
                }
            } }
            type="queryParams"
            value={ eachProp?.value }
            key={ propertyMetadata?.key }
        />
    );
};

/**
 * Each field type.
 */
export enum FieldType {
    CHECKBOX = "CheckBox",
    TEXT = "Text",
    CONFIDENTIAL = "Confidential",
    URL = "URL",
    QUERY_PARAMS = "QueryParameters",
}

/**
 * commonly used constants.
 */
export enum CommonConstants {
    BOOLEAN = "BOOLEAN",
    FIELD_COMPONENT_KEYWORD_URL = "URL",
    FIELD_COMPONENT_KEYWORD_QUERY_PARAMETER = "QUERYPARAM"
}

/**
 * Get interpreted field type for given property metada.
 *
 * @param propertyMetadata Property metadata of type {@link CommonPluggableComponentMetaPropertyInterface}.
 */
export const getFieldType = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): FieldType => {

    if (propertyMetadata?.type?.toUpperCase() === CommonConstants.BOOLEAN) {
        return FieldType.CHECKBOX;
    } else if (propertyMetadata?.isConfidential) {
        return FieldType.CONFIDENTIAL;
    } else if (propertyMetadata?.key.toUpperCase().includes(CommonConstants.FIELD_COMPONENT_KEYWORD_URL)) {
        // todo Need proper backend support to identity URL fields.
        return FieldType.URL;
    } else if (propertyMetadata?.key.toUpperCase().includes(
        CommonConstants.FIELD_COMPONENT_KEYWORD_QUERY_PARAMETER)) {
        // todo Need proper backend support to identity Query parameter fields.
        return FieldType.QUERY_PARAMS;
    }
    return FieldType.TEXT;
};

/**
 * Get corresponding {@link Field} component for the provided property.
 *
 * @param property Property of type {@link CommonPluggableComponentPropertyInterface}.
 * @param propertyMetadata Property metadata of type {@link CommonPluggableComponentMetaPropertyInterface}.
 */
export const getPropertyField = (property: CommonPluggableComponentPropertyInterface,
                                 propertyMetadata: CommonPluggableComponentMetaPropertyInterface):
    ReactElement => {

    switch (getFieldType(propertyMetadata)) {
        // TODO Identify URLs, and generate a Field which supports URL validation.
        case FieldType.CHECKBOX : {
            return getCheckboxField(property, propertyMetadata);
        }
        case FieldType.CONFIDENTIAL : {
            return getConfidentialField(property, propertyMetadata);
        }
        case FieldType.URL : {
            return getURLField(property, propertyMetadata);
        }
        case FieldType.QUERY_PARAMS : {
            return getQueryParamsField(property, propertyMetadata);
        }
        default: {
            return getTextField(property, propertyMetadata);
        }
    }
};
