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

import { SignInUtil } from "@wso2is/authentication";
import { AxiosHttpClient } from "@wso2is/http";
import axios from "axios";
import _ from "lodash";
import { BasicProfileInterface, HttpMethods, ProfileSchema } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Retrieve the user information through user id.
 *
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getUserDetails = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.users + "/" + id
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as BasicProfileInterface);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve user information - ${error}`);
        });
};

/**
 *  Get gravatar image using email address
 * @param email
 */
export const getGravatarImage = (email: string): Promise<string> => {
    const url: string = SignInUtil.getGravatar(email);
    return new Promise((resolve, reject) => {
        axios
            .get(url)
            .then(() => {
                resolve(url.split("?")[0]);
            })
            .catch(() => {
                reject();
            });
    });
};

/**
 * Retrieve the user profile details of the currently authenticated user.
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the user profile details.
 */
export const getProfileInfo = (): Promise<BasicProfileInterface> => {
    const orgKey = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.me
    };

    return httpClient
        .request(requestConfig)
        .then(async (response) => {
            let gravatar = "";
            if (_.isEmpty(response.data.userImage)) {
                try {
                    gravatar = await getGravatarImage(
                        typeof response.data.emails[0] === "string"
                            ? response.data.emails[0]
                            : response.data.emails[0].value
                    );
                } catch (error) {
                    gravatar = "";
                }
            }
            const profileResponse: BasicProfileInterface = {
                emails: response.data.emails || "",
                id: response.data.id || "",
                name: response.data.name || { givenName: "", familyName: "" },
                organisation: response.data[orgKey] ? response.data[orgKey].organization : "",
                phoneNumbers: response.data.phoneNumbers || [],
                profileUrl: response.data.profileUrl || "",
                responseStatus: response.status || null,
                roles: response.data.roles || [],
                userName: response.data.userName || "",
                userimage: response.data.userImage || gravatar
            };
            return Promise.resolve(profileResponse);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve user profile information - ${error}`);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param {object} user.
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateProfileInfo = (data: object): Promise<any> => {

    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.me
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to update the profile info - ${error}`);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param {object} user.
 * @return {Promise<any>} a promise containing the response.
 */
export const updateUserInfo = (userId: string, data: object): Promise<any> => {

    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.users + "/" + userId
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as BasicProfileInterface);
        })
        .catch((error) => {
            return Promise.reject(`Failed to update the profile info - ${error}`);
        });
};


/**
 * Retrieve the profile schemas of the user claims of the currently authenticated user.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getProfileSchemas = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.profileSchemas
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get user schemas"));
            }
            return Promise.resolve(response.data[0].attributes as ProfileSchema[]);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
