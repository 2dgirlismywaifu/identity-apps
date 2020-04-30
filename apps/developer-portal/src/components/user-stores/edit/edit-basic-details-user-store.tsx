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

import { Field, FormValue, Forms, useTrigger } from "@wso2is/forms";
import { PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { updateUserStore } from "../../../api";
import { AlertLevels, UserStore } from "../../../models";
import { addAlert } from "../../../store/actions";

/**
 * Prop types of `EditBasicDetailsUserStore` component
 */
interface EditBasicDetailsUserStorePropsInterface {
    /**
     * Userstore to be edited
     */
    userStore: UserStore;
    /**
     * Initiates an update
     */
    update: () => void;
    /**
     * userstore id
     */
    id: string;
}

/**
 * This renders the edit basic details pane
 * @param {EditBasicDetailsUserStorePropsInterface} props
 * @return {ReactElement}
 */
export const EditBasicDetailsUserStore = (
    props: EditBasicDetailsUserStorePropsInterface
): ReactElement => {

    const { userStore, update, id } = props;

    const [submit, setSubmit] = useTrigger();

    const dispatch = useDispatch();

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const data = { ...userStore };
                            data.description = values.get("description").toString();
                            data.name = values.get("name").toString();
                            delete data.typeName;
                            delete data.className;

                            updateUserStore(id, data).then(() => {
                                dispatch(addAlert({
                                    description: "The Userstore has been updated successfully.",
                                    level: AlertLevels.SUCCESS,
                                    message: "Userstore updated successfully!"
                                }));
                                update();
                            }).catch((error) => {
                                dispatch(addAlert({
                                    description: error?.description ?? "An error occurred while updating the Userstore",
                                    level: AlertLevels.ERROR,
                                    message: error?.message ?? "Something went wrong"
                                }));
                            });
                        } }
                        submitState={ submit }
                    >
                        <Field
                            label="Name"
                            name="name"
                            type="text"
                            required={ false }
                            requiredErrorMessage="Name is a required field"
                            placeholder="Enter a name"
                            value={ userStore?.name }
                            disabled
                        />
                        <Field
                            label="Type"
                            name="type"
                            type="text"
                            disabled
                            required={ false }
                            requiredErrorMessage="Select a Type"
                            value={ userStore?.typeName }
                        />
                        <Field
                            label="Description"
                            name="description"
                            type="textarea"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Enter a description"
                            value={ userStore?.description }
                        />
                    </Forms>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <PrimaryButton onClick={ () => { setSubmit() } }>
                        Update
                        </PrimaryButton>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};
