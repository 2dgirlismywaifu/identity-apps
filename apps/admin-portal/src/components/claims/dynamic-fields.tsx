/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { Field, FormValue, Forms, Validation, useTrigger } from "@wso2is/forms";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Button, Divider, Label, List, Popup } from "semantic-ui-react";

/**
 * Type of key-value object
 */
export interface KeyValue {
    key: string;
    value: string;
}

/**
 * Type of key object passed to a dropdown
 */
interface KeyData {
    id: string;
    value: string;
}

/**
 * Prop types of `DynamicField` component
 */
interface DynamicFieldPropsInterface {
    /**
     * An array of  key-value pairs
     */
    data: KeyValue[];
    /**
     * The type of the key
     */
    keyType: "text" | "dropdown";
    /**
     * An array of Key data to be passed into a dropdown
     */
    keyData?: KeyData[];
    /**
     * Triggers submit
     */
    submit: boolean;
    /**
     * The name of the key
     */
    keyName: string;
    /**
     * The name of the value
     */
    valueName: string;
    /**
     * Error message to be shown when the key is empty
     */
    keyRequiredMessage: string;
    /**
     * Error message to be shown when the value is empty
     */
    valueRequiredErrorMessage: string;
    /**
     * Sets if the key value pair is required or not
     */
    requiredField: boolean;
    /**
     * Error message to be shown when the same key is chosen twice
     */
    duplicateKeyErrorMsg?: string;
    /**
     * A listener that is called when a key-value pair is added
     */
    listen?: (data: KeyValue[]) => void;
    /**
     * Called to initiate an update
     */
    update: (data: KeyValue[]) => void;
}

/**
 * This displays a key-value pair of fields that can be dynamically added or removed
 * @param {DynamicFieldPropsInterface} props
 * @return {ReactElement}
 */
export const DynamicField = (props: DynamicFieldPropsInterface): ReactElement => {

    const {
        data,
        keyType,
        keyData,
        submit,
        update,
        keyName,
        valueName,
        keyRequiredMessage,
        valueRequiredErrorMessage,
        listen,
        requiredField,
        duplicateKeyErrorMsg
    } = props;

    const [fields, setFields] = useState<Map<number, KeyValue>>();
    const [editIndex, setEditIndex] = useState<number>(null);
    const [editValue, setEditValue] = useState("");
    const [editKey, setEditKey] = useState("");
    const [updateMapIndex, setUpdateMapIndex] = useState<number>(null);

    const initRender = useRef(true);

    const [add, setAdd] = useTrigger();
    const [reset, setReset] = useTrigger();
    const [updateTrigger, setUpdateTrigger] = useTrigger();

    /**
     * Resets edit states when when editIndex becomes null
     */
    useEffect(() => {
        if (editIndex === null) {
            setEditKey("");
            setEditValue("");
        }
    }, [editIndex]);

    /**
     * Pushes the existing pairs to the state
     */
    useEffect(() => {
        const tempFields = new Map<number, KeyValue>();
        data?.forEach((field, index) => {
            tempFields.set(index, field);
        });
        setFields(tempFields);
    }, []);

    /**
     * Prevent submit from being triggered during initial render
     */
    useEffect(() => {
        if (initRender.current) {
            initRender.current = false;
        } else if (fields) {
            update(Array.from(fields.values()));
        }
    }, [submit]);

    /**
     * Triggers an update when the index of the pair to be updated is set
     */
    useEffect(() => {
        if (updateMapIndex !== null) {
            setUpdateTrigger();
        }
    }, [updateMapIndex]);

    return (
        <>
            {
                keyData?.length !== fields?.size
                    ? (
                        <>
                            <Forms
                                onSubmit={ (values: Map<string, FormValue>) => {
                                    const tempFields = new Map<number, KeyValue>(fields);
                                    const newIndex: number = tempFields.size > 0
                                        ? Array.from(tempFields.keys())[tempFields.size - 1] + 1
                                        : 0;
                                    tempFields.set(newIndex, {
                                        key: values.get("key").toString(),
                                        value: values.get("value").toString()
                                    });
                                    setFields(tempFields);
                                    if (listen) {
                                        listen(Array.from(tempFields.values()));
                                    }
                                    setReset();
                                } }
                                submitState={ add }
                                resetState={ reset }
                            >
                                <List className="dynamic-field">
                                    <List.Item>
                                        {keyType === "dropdown"
                                            ? (
                                                <Field
                                                    type={ keyType }
                                                    placeholder={ `Enter a ${keyName}` }
                                                    required={ requiredField }
                                                    requiredErrorMessage={ keyRequiredMessage }
                                                    name="key"
                                                    fluid
                                                    children={
                                                        keyType === "dropdown"
                                                            ? (
                                                                keyData?.map((key: KeyData) => {
                                                                    return {
                                                                        key: key.id,
                                                                        text: key.value,
                                                                        value: key.value
                                                                    }
                                                                })
                                                            )
                                                            : []
                                                    }
                                                    displayErrorOn="submit"
                                                    validation={
                                                        (
                                                            value: string,
                                                            validation: Validation
                                                        ) => {
                                                            let isSameUserStore = false;
                                                            for (const mapping of fields) {
                                                                if (mapping[1].key === value) {
                                                                    isSameUserStore = true;
                                                                    break;
                                                                }
                                                            }
                                                            if (isSameUserStore) {
                                                                validation.isValid = false;
                                                                validation.errorMessages.push(
                                                                    duplicateKeyErrorMsg
                                                                )
                                                            }
                                                        }
                                                    }
                                                />
                                            )
                                            : (
                                                < Field
                                                    type={ keyType }
                                                    placeholder={ `Enter a ${keyName}` }
                                                    required={ requiredField }
                                                    requiredErrorMessage={ keyRequiredMessage }
                                                    name="key"
                                                />
                                            )
                                        }
                                    </List.Item>
                                    <List.Item>
                                        <Field
                                            type="text"
                                            placeholder={ `Enter a ${valueName}` }
                                            required={ requiredField }
                                            requiredErrorMessage={ valueRequiredErrorMessage }
                                            name="value"
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <Popup
                                            trigger={ (
                                                <Button
                                                    type="button"
                                                    className="list-icon"
                                                    size="small"
                                                    icon="add"
                                                    onClick={ () => {
                                                        setAdd();
                                                    } }
                                                />
                                            ) }
                                            position="top center"
                                            content="Add"
                                            inverted
                                        />
                                    </List.Item>
                                </List>
                            </Forms>
                            <Divider hidden />
                        </>
                    )
                    : null
            }

            {
                fields
                    ? (
                        <Forms
                            onSubmit={ (values: Map<string, FormValue>) => {
                                const tempFields = new Map(fields);
                                tempFields.set(updateMapIndex, {
                                    key: values.get("editKey").toString(),
                                    value: values.get("editValue").toString()
                                });

                                setFields(tempFields);
                                setEditIndex(null);
                                setUpdateMapIndex(null);
                            }
                            }
                            submitState={ updateTrigger }
                        >

                            {
                                Array.from(fields).map(([mapIndex, field], index: number) => {
                                    return (
                                        <List className="dynamic-field" key={ index }>
                                            <List.Item>
                                                {editIndex === index
                                                    ? (
                                                        keyType === "dropdown"
                                                            ? (
                                                                <Field
                                                                    type={ keyType }
                                                                    placeholder={ `Enter a ${keyName}` }
                                                                    required={ requiredField }
                                                                    requiredErrorMessage={
                                                                        keyRequiredMessage
                                                                    }
                                                                    name={ "editKey" }
                                                                    children={
                                                                        keyType === "dropdown"
                                                                            ? (
                                                                                keyData?.map(
                                                                                    (key: KeyData) => {
                                                                                        return {
                                                                                            key: key.id,
                                                                                            text: key.value,
                                                                                            value: key.value
                                                                                        }
                                                                                    })
                                                                            )
                                                                            : []
                                                                    }
                                                                    value={ editKey }
                                                                    displayErrorOn="blur"
                                                                    validation={
                                                                        (
                                                                            value: string,
                                                                            validation: Validation
                                                                        ) => {
                                                                            let isSameUserStore = false;
                                                                            for (const mapping of fields) {
                                                                                if (
                                                                                    mapping[1].key === value
                                                                                    && mapping[1] !== field
                                                                                ) {
                                                                                    isSameUserStore = true;
                                                                                    break;
                                                                                }
                                                                            }
                                                                            if (isSameUserStore) {
                                                                                validation.isValid = false;
                                                                                validation
                                                                                    .errorMessages
                                                                                    .push(
                                                                                        duplicateKeyErrorMsg
                                                                                    )
                                                                            }
                                                                        }
                                                                    }
                                                                />
                                                            )
                                                            : (
                                                                <Field
                                                                    type={ keyType }
                                                                    placeholder={ `Enter a ${keyName}` }
                                                                    required={ requiredField }
                                                                    requiredErrorMessage={
                                                                        valueRequiredErrorMessage
                                                                    }
                                                                    name={ "editKey" }
                                                                    value={ editKey }
                                                                />
                                                            )
                                                    )
                                                    : (
                                                        <Label
                                                            size="large"
                                                            className="properties-label"
                                                        >
                                                            {field.key}
                                                        </Label>
                                                    )
                                                }
                                            </List.Item>
                                            <List.Item>
                                                {editIndex === index
                                                    ? (
                                                        <Field
                                                            name={ "editValue" }
                                                            required={ true }
                                                            requiredErrorMessage=""
                                                            type="text"
                                                            value={ editValue }
                                                            placeholder={ `Enter a ${valueName}` }
                                                        />
                                                    )
                                                    : (
                                                        <Label
                                                            size="large"
                                                            className="properties-label">
                                                            {field.value}
                                                        </Label>
                                                    )
                                                }
                                            </List.Item>
                                            <List.Item>
                                                {editIndex === index
                                                    ? (
                                                        <Popup
                                                            trigger={ (
                                                                <Button
                                                                    type="button"
                                                                    className="list-icon"
                                                                    size="small"
                                                                    icon="checkmark"
                                                                    onClick={ () => {
                                                                        setUpdateMapIndex(mapIndex);
                                                                    } }
                                                                />
                                                            ) }
                                                            position="top center"
                                                            content="Update"
                                                            inverted
                                                        />
                                                    )
                                                    : (
                                                        <Popup
                                                            trigger={ (
                                                                <Button
                                                                    type="button"
                                                                    className="list-icon"
                                                                    size="small"
                                                                    icon="pencil"
                                                                    onClick={ () => {
                                                                        setEditIndex(index);
                                                                        setEditKey(field.key);
                                                                        setEditValue(field.value);
                                                                    } }
                                                                />
                                                            ) }
                                                            position="top center"
                                                            content="Edit"
                                                            inverted
                                                        />
                                                    )
                                                }
                                                {editIndex === index
                                                    ? (
                                                        <Popup
                                                            trigger={ (
                                                                <Button
                                                                    type="button"
                                                                    className="list-icon"
                                                                    size="small"
                                                                    icon="close"
                                                                    onClick={ () => {
                                                                        setEditIndex(null);
                                                                    } }
                                                                />
                                                            ) }
                                                            position="top center"
                                                            content="Cancel"
                                                            inverted
                                                        />
                                                    )
                                                    : null
                                                }
                                                <Popup
                                                    trigger={ (
                                                        <Button
                                                            type="button"
                                                            className="list-icon"
                                                            size="small"
                                                            icon="trash"
                                                            onClick={ () => {
                                                                setEditIndex(null);
                                                                const tempFields = new Map(fields);
                                                                tempFields.delete(mapIndex);
                                                                setFields(tempFields);
                                                            } }
                                                        />
                                                    ) }
                                                    position="top center"
                                                    content="Delete"
                                                    inverted
                                                />
                                            </List.Item>
                                        </List>

                                    )
                                })

                            }
                        </Forms>
                    )
                    : null
            }
        </>
    )
};

// Set default props
DynamicField.defaultProps = {
    duplicateKeyErrorMsg: "This is key is already selected. Please choose another key.",
    requiredField: false
};
