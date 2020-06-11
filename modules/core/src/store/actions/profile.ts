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

import _ from "lodash";
import { setProfileInfoRequestLoadingStatus, setProfileSchemaRequestLoadingStatus } from "./loaders";
import {
    CommonProfileActionTypes,
    SetProfileInfoActionInterface, SetProfileLinkedAccountsActionInterface,
    SetProfileSchemasActionInterface,
    ToggleSCIMEnabledActionInterface
} from "./types";
import { getProfileInfo, getProfileSchemas } from "../../api";
import { ProfileInfoInterface, ProfileSchemaInterface } from "../../models";

/**
 * Redux action to set profile info.
 *
 * @param {T} info - Profile information.
 * @return {SetProfileInfoActionInterface<T>}
 */
export const setProfileInfo = <T = {}>(info: T): SetProfileInfoActionInterface<T> => ({
    payload: info,
    type: CommonProfileActionTypes.SET_PROFILE_INFO
});

/**
 * Redux action to set profile schemas.
 *
 * @param {T} schemas - Profile schemas.
 * @return {SetProfileSchemasActionInterface<T>}
 */
export const setSCIMSchemas = <T = {}>(schemas: T): SetProfileSchemasActionInterface<T> => ({
    payload: schemas,
    type: CommonProfileActionTypes.SET_PROFILE_SCHEMAS
});

/**
 * Redux action to set profile linked accounts.
 *
 * @param {T} accounts - Profile schemas.
 * @return {SetProfileSchemasActionInterface<T>}
 */
export const setProfileLinkedAccounts = <T = {}>(accounts: T): SetProfileLinkedAccountsActionInterface => ({
    payload: accounts,
    type: CommonProfileActionTypes.SET_PROFILE_LINKED_ACCOUNTS
});

/**
 * Redux action to toggle SCIM enabled.
 *
 * @param {boolean} isEnabled - Flag to determine if SCIM is enabled.
 * @return {ToggleSCIMEnabledActionInterface} An action of type `TOGGLE_SCIM_ENABLED`
 */
export const toggleSCIMEnabled = (isEnabled: boolean): ToggleSCIMEnabledActionInterface => ({
    payload: isEnabled,
    type: CommonProfileActionTypes.TOGGLE_SCIM_ENABLED
});

/**
 * Redux action to get the profile schemas for a specific user.
 * Makes an API call to the SCIM endpoint and retrieves the profile schemas.
 *
 * @param {ProfileInfoInterface} profileInfo - Profile information.
 * @param {(info: ProfileInfoInterface, schemas: ProfileSchema[]) => void} onProfileCompletionUpdate - Callback to be
 * fired to calculate the profile completion.
 * @return {(dispatch) => void}
 */
export const getSCIMSchemas = (
    profileInfo?: ProfileInfoInterface,
    onProfileCompletionUpdate?: (info: ProfileInfoInterface, schemas: ProfileSchemaInterface[]) => void
) => (dispatch) => {

    dispatch(setProfileSchemaRequestLoadingStatus(true));

    getProfileSchemas()
        .then((response: ProfileSchemaInterface[]) => {
            dispatch(setSCIMSchemas(response));

            if (profileInfo) {
                onProfileCompletionUpdate(profileInfo, response);
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((error) => {
            // TODO: show error page
        })
        .finally(() => {
            dispatch(setProfileSchemaRequestLoadingStatus(false));
        });
    };

/**
 * Redux action to get profile information.
 * Makes an API request to the SCIM endpoint and retrieves the user information.
 *
 * @param {boolean} updateProfileCompletion - Flag to determine whether profile completion should be updated or not.
 * @param {ProfileSchemaInterface[]} profileSchemas - Profile schemas.
 * @param {() => void} onSCIMDisabled - Callback to be fired if SCIM is disabled.
 * @param {(error: string) => void} onRequestError - Callback to be fired on request error.
 * @param {() => void} onRequestGenericError - Callback to be fired to handle generic error.
 * @param {(info: ProfileInfoInterface, schemas: ProfileSchema[]) => void} onProfileCompletionUpdate - Callback to be
 * fired to calculate the profile completion.
 * @return {(dispatch) => void}
 */
export const getProfileInformation = (
    updateProfileCompletion = false,
    profileSchemas?: ProfileSchemaInterface[],
    onSCIMDisabled?: () => void,
    onRequestError?: (error: string) => void,
    onRequestGenericError?: () => void,
    onProfileCompletionUpdate?: (info: ProfileInfoInterface, schemas: ProfileSchemaInterface[]) => void
) => (dispatch) => {

    let isCompletionCalculated = false;

    dispatch(setProfileInfoRequestLoadingStatus(true));

    // Get the profile info
    getProfileInfo(onSCIMDisabled)
        .then((infoResponse) => {
            if (infoResponse.responseStatus === 200) {
                dispatch(
                    setProfileInfo({
                        ...infoResponse
                    })
                );

                // If the schemas in the redux store is empty, fetch the SCIM schemas from the API.
                if (profileSchemas && _.isEmpty(profileSchemas)) {
                    isCompletionCalculated = true;
                    dispatch(getSCIMSchemas(infoResponse));
                }

                // If `updateProfileCompletion` flag is enabled, update the profile completion.
                if (updateProfileCompletion && !isCompletionCalculated) {
                    onProfileCompletionUpdate(infoResponse, profileSchemas);
                }

                return;
            }

            onRequestGenericError();
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.detail) {
                onRequestError(error.response.data.detail);
                return;
            }

            onRequestGenericError();
        })
        .finally(() => {
            dispatch(setProfileInfoRequestLoadingStatus(false));
        });
};
