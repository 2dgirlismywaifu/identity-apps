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

import { PrimaryButton } from "@wso2is/react-components";
import _ from "lodash";
import React, { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { deleteRoleById, getRolesList, getUserStoreList, searchRoleList } from "../api";
import { RoleList, RoleSearch } from "../components/roles";
import { CreateRoleWizard } from "../components/roles/create-role-wizard";
import { UserConstants } from "../constants";
import { ListLayout, PageLayout } from "../layouts";
import { AlertInterface, AlertLevels, RoleListInterface, RolesInterface, SearchRoleInterface } from "../models"
import { addAlert } from "../store/actions";

const ROLES_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: "Name",
        value: "name"
    },
    {
        key: 3,
        text: "Created date",
        value: "createdDate"
    },
    {
        key: 4,
        text: "Last updated",
        value: "lastUpdated"
    }
];

/**
 * React component to list User Groups.
 * 
 * @return {ReactElement}
 */
export const GroupsPage = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ roleList, setRoleList ] = useState<RoleListInterface>();
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState(undefined);

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(ROLES_SORTING_OPTIONS[ 0 ]);

    useEffect(() => {
        setListItemLimit(UserConstants.DEFAULT_ROLE_LIST_ITEM_LIMIT);
    }, []);

    useEffect(() => {
        getGroups();
    },[ listOffset, listItemLimit ]);

    useEffect(() => {
        getGroups();
        setListUpdated(false);
    }, [ isListUpdated ]);

    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        getGroups();
    }, [ userStore ]);

    const getGroups = () => {
        getRolesList(userStore).then((response)=> {
            if (response.status === 200) {
                const roleResources = response.data.Resources
                if (roleResources && roleResources instanceof Array) {
                    const updatedResources = roleResources.filter((role: RolesInterface) => {
                        return !role.displayName.includes("Application/") && !role.displayName.includes("Internal/");
                    })
                    response.data.Resources = updatedResources;
                }
                setRoleList(response.data);
            }
        });
    };

    /**
     * The following function fetch the user store list and set it to the state.
     */
    const getUserStores = () => {
        const storeOptions = [
                {
                    key: -2,
                    text: "All user stores",
                    value: null
                },
                {
                    key: -1,
                    text: "Primary",
                    value: "primary"
                }
            ];

        let storeOption = {
            key: null,
            text: "", 
            value: ""
        };

        getUserStoreList()
            .then((response) => {
                if (storeOptions === []) {
                    storeOptions.push(storeOption);
                }
                response.data.map((store, index) => {
                        storeOption = {
                            key: index,
                            text: store.name,
                            value: store.name
                        };
                        storeOptions.push(storeOption);
                    }
                );

                setUserStoresList(storeOptions);
            });

        setUserStoresList(storeOptions);
    };

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(_.find(ROLES_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    const searchRoleListHandler = (searchQuery: string) => {
        const searchData: SearchRoleInterface = {
            filter: searchQuery,
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
            ],
            startIndex: 1
        }

        searchRoleList(searchData).then(response => {
            if (response.status === 200) {
                setRoleList(response.data);
            }
        })
    }

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setUserStore(data.value as string);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle role deletion action.
     * 
     * @param id - Role ID which needs to be deleted
     */
    const handleOnDelete = (role: RolesInterface): void => {
        deleteRoleById(role.id).then(() => {
            handleAlerts({
                description: t(
                    "devPortal:components.roles.notifications.deleteRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.roles.notifications.deleteRole.success.message"
                )
            });
            setListUpdated(true);
        });
    };

    /**
     * Handles the `onFilter` callback action from the
     * roles search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        if (query === null || query === "displayName sw ") {
            getGroups();
            return;
        }

        searchRoleListHandler(query);
    };

    return (
        <PageLayout
            title="Groups"
            description="Create and manage user groups, assign permissions for groups."
            showBottomDivider={ true } 
        >
            <ListLayout
                advancedSearch={ <RoleSearch onFilter={ handleUserFilter }/> }
                currentListSize={ roleList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                sortStrategy={ listSortingStrategy }
                rightActionPanel={
                    (
                        <PrimaryButton onClick={ () => setShowWizard(true) }>
                            <Icon name="add"/>
                            New Group
                        </PrimaryButton>
                    )
                }
                leftActionPanel={
                    <Dropdown
                        selection
                        options={ userStoreOptions && userStoreOptions }
                        placeholder="Select User Store"
                        value={ userStore && userStore }
                        onChange={ handleDomainChange }
                    />
                }
                showPagination={ true }
                totalPages={ Math.ceil(roleList?.totalResults / listItemLimit) }
                totalListSize={ roleList?.totalResults }
            >
                <RoleList 
                    roleList={ roleList?.Resources }
                    handleRoleDelete={ handleOnDelete }
                />
                {
                    showWizard && (
                        <CreateRoleWizard
                            isAddGroup
                            closeWizard={ () => setShowWizard(false) }
                            updateList={ () => setListUpdated(true) }
                        />
                    ) 
                }
            </ListLayout>
        </PageLayout>
    );
}
