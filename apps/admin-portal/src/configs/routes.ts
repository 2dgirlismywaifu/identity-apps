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

import { RouteInterface } from "@wso2is/core/models";
import { SignIn, SignOut } from "../components";
import { AppConstants } from "../constants";
import { AppLayout, AuthLayout, DashboardLayout, DefaultLayout, ErrorLayout } from "../layouts";
import {
    OverviewPage,
    PageNotFound,
    PrivacyPage,
    UnauthorizedErrorPage
} from "../pages";

/**
 * Dashboard Layout Routes array.
 *
 * @remarks
 * Having a unique id for every route is mandatory.
 * Since there are checks performed inside the side
 * panel component to validate the exact clicked route,
 * selected route etc.
 * @example
 * A route can have children and still be clickable.
 * If so, define a path. If no path is defined, the
 * child routes section will be extended in the UI.
 *  {
 *      children: [ ... ],
 *     ...
 *     path: "/applications"
 *  }
 */
const DASHBOARD_LAYOUT_ROUTES: RouteInterface[] = [
    {
        component: OverviewPage,
        icon: "overview",
        id: "overview",
        name: "common:overview",
        path: AppConstants.PATHS.get("OVERVIEW"),
        protected: true,
        showOnSidePanel: true
    },
    {
        component: null,
        icon: null,
        id: "404",
        name: "404",
        path: "*",
        protected: true,
        redirectTo: AppConstants.PATHS.get("PAGE_NOT_FOUND"),
        showOnSidePanel: false
    }
];

/**
 * Default page layout routes array.
 */
const DEFAULT_LAYOUT_ROUTES: RouteInterface[] = [
    {
        component: PrivacyPage,
        icon: null,
        id: "privacy",
        name: "Privacy",
        path: AppConstants.PATHS.get("PRIVACY"),
        protected: true,
        showOnSidePanel: false
    }
];

/**
 * Error page layout routes array.
 */
const ERROR_LAYOUT_ROUTES: RouteInterface[] = [
    {
        component: UnauthorizedErrorPage,
        icon: null,
        id: "unauthorized",
        name: "Unauthorized",
        path: AppConstants.PATHS.get("UNAUTHORIZED"),
        protected: true,
        showOnSidePanel: false
    },
    {
        component: PageNotFound,
        icon: null,
        id: "pageNotFound",
        name: "404",
        path: AppConstants.PATHS.get("PAGE_NOT_FOUND"),
        protected: true,
        showOnSidePanel: false
    }
];

/**
 * Default page layout routes array.
 */
const AUTH_LAYOUT_ROUTES: RouteInterface[] = [
    {
        component: SignIn,
        icon: null,
        id: "authLayoutLogin",
        name: "Login",
        path: window[ "AppUtils" ].getConfig().routes.login,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: SignOut,
        icon: null,
        id: "authLayoutLogout",
        name: "Logout",
        path: window[ "AppUtils" ].getConfig().routes.logout,
        protected: false,
        showOnSidePanel: false
    }
];

/**
 * Default page layout routes array.
 */
const APP_ROUTES: RouteInterface[] = [
    {
        component: AuthLayout,
        icon: null,
        id: "appRouteLogin",
        name: "Login",
        path: window[ "AppUtils" ].getConfig().routes.login,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: AuthLayout,
        icon: null,
        id: "appRouteLogout",
        name: "Logout",
        path: window[ "AppUtils" ].getConfig().routes.logout,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: DefaultLayout,
        icon: null,
        id: "appRoutePrivacy",
        name: "Privacy",
        path: "/privacy",
        protected: true,
        showOnSidePanel: false
    },
    {
        component: ErrorLayout,
        exact: true,
        icon: null,
        id: "unauthorized",
        name: "Unauthorized",
        path: AppConstants.PATHS.get("UNAUTHORIZED"),
        protected: true,
        showOnSidePanel: false
    },
    {
        component: ErrorLayout,
        exact: true,
        icon: null,
        id: "appRoute404",
        name: "Error",
        path: "/404",
        protected: true,
        showOnSidePanel: false
    },
    {
        component: DashboardLayout,
        icon: null,
        id: "dashboard",
        name: "Dashboard",
        path: "/",
        protected: true,
        showOnSidePanel: false
    }
];

/**
 * Default page layout routes array.
 */
const BASE_ROUTES: RouteInterface[] = [
    {
        component: AppLayout,
        icon: null,
        id: "app",
        name: "App",
        path: "/",
        protected: false,
        showOnSidePanel: false
    }
];

export const appRoutes = APP_ROUTES;
export const baseRoutes = BASE_ROUTES;
export const authLayoutRoutes = AUTH_LAYOUT_ROUTES;
export const dashboardLayoutRoutes = DASHBOARD_LAYOUT_ROUTES;
export const defaultLayoutRoutes = DEFAULT_LAYOUT_ROUTES;
export const errorLayoutRoutes = ERROR_LAYOUT_ROUTES;
export const routes = [ ...DASHBOARD_LAYOUT_ROUTES ];
