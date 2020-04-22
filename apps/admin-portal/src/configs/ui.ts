/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
    AlertIcon,
    AndroidLogo,
    AngularLogo,
    AppIcon,
    AppleLogo,
    ArrowRight,
    AuthenticationCapabilityIcon,
    BasicAuthIcon,
    BlockedMagnifierIcon,
    BoxIcon,
    CaretRightIcon,
    ClaimsIcon,
    CloseIcon,
    CodeIcon,
    CordovaLogo,
    CrossIcon,
    CSharpLogo,
    DashboardIcon,
    DatabaseIcon,
    DocumentIcon,
    DotNetLogo,
    DragIcon,
    DragSquaresIcon,
    DummyUser,
    EmailOTPIcon,
    EmptySearchResultsIllustration,
    ErrorIcon,
    FacebookIdPIcon,
    FacebookLogo,
    FIDOLogo,
    ForbiddenIcon,
    GearsIcon,
    GithubIdPIcon,
    GoogleIdPIcon,
    GoogleLogo,
    HomeTileIcons,
    HTMLLogo,
    InfoIcon,
    JavaLogo,
    JavaScriptLogo,
    LaunchIcon,
    Logo,
    MagnifierIcon,
    MaximizeIcon,
    MFAIconSet,
    MinimizeIcon,
    OIDCLogo,
    OIDCWebAppTemplateIllustration,
    OpenIDLogo,
    PassiveSTSTemplateIllustration,
    PinIcon,
    PlugIcon,
    ProvisionCapabilityIcon,
    ReactLogo,
    ReportIcon,
    SamlLogo,
    SAMLWebAppTemplateIllustration,
    SettigsSectionIconSet,
    SMSOTPIcon,
    SPATemplateIllustration,
    SpinWheelIcon,
    SuccessIcon,
    TOTPIcon,
    TwitterIdPIcon,
    TwitterLogo,
    UserIcon,
    VueLogo,
    WarningIcon,
    WebAppTemplateIllustration,
    WindowsTemplateIllustration,
    WSFedLogo,
    WSTrustLogo,
    WSTrustTemplateIllustration,
    CustomApplicationTemplateIllustration
} from "@wso2is/theme";
import { SupportedServices } from "../models";

type ImageType = string;

interface StylesType {
    appPrimaryColor?: string;
    appBackgroundColor?: string;
}

interface CustomCSSType {
    dark?: StylesType;
    light?: StylesType;
}

export const LogoImage = Logo;
export const UserImage: ImageType = DummyUser;
export const HomeTileIconImages = HomeTileIcons;

// Icon set for the side panel.
export const SidePanelIcons = {
    applications: AppIcon,
    childIcon: ArrowRight,
    claims: ClaimsIcon,
    connections: PlugIcon,
    overview: DashboardIcon,
    serverConfigurations: GearsIcon,
    userStore: DatabaseIcon,
    usersAndRoles: UserIcon
};

export const SidePanelMiscIcons = {
    caretRight: CaretRightIcon
};

export const GenericAppIcon = CodeIcon;
export const SettingsSectionIcons = SettigsSectionIconSet;
export const MFAIcons = MFAIconSet;

export const AdvancedSearchIcons = {
    clear: CrossIcon
};

export const TitleText = "Identity Server";
export const customCSS: CustomCSSType = {
    dark: {
        appPrimaryColor: "#ff5000"
    },
    light: {
        appPrimaryColor: "#ff5000"
    }
};

export const AlertIcons = {
    error: ErrorIcon,
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon
};

/**
 * Constant to handle desktop layout content top padding.
 * @type {number}
 */
export const DESKTOP_CONTENT_TOP_PADDING = 50;

/**
 * Constant to handle mobile layout content padding.
 * @type {string}
 */
export const MOBILE_CONTENT_PADDING = "2rem 1rem";

export const EmptyPlaceholderIllustrations = {
    alert: AlertIcon,
    emptyList: BoxIcon,
    emptySearch: MagnifierIcon,
    genericError: CloseIcon,
    loginError: ForbiddenIcon,
    newList: LaunchIcon,
    pageNotFound: BlockedMagnifierIcon,
    search: EmptySearchResultsIllustration
};

export const InboundProtocolLogos = {
    oidc: OIDCLogo,
    openid: OpenIDLogo,
    saml: SamlLogo,
    wsFed: WSFedLogo,
    wsTrust: WSTrustLogo
};

export const ApplicationTemplateIllustrations = {
    oidcWebApp: OIDCWebAppTemplateIllustration,
    passiveSTS: PassiveSTSTemplateIllustration,
    samlWebApp: SAMLWebAppTemplateIllustration,
    spa: SPATemplateIllustration,
    windowsNative: WindowsTemplateIllustration,
    wsTrust: WSTrustTemplateIllustration,
    customApp: CustomApplicationTemplateIllustration
};

export const TechnologyLogos = {
    android: AndroidLogo,
    angular: AngularLogo,
    apple: AppleLogo,
    cSharp: CSharpLogo,
    cordova: CordovaLogo,
    dotNet: DotNetLogo,
    html: HTMLLogo,
    java: JavaLogo,
    javascript: JavaScriptLogo,
    react: ReactLogo,
    vue: VueLogo
};

export const ApplicationWizardStepIcons = {
    general: DocumentIcon,
    protocolConfig: GearsIcon,
    protocolSelection: SpinWheelIcon,
    summary: ReportIcon
};

export const UserWizardStepIcons = {
    general: DocumentIcon,
    groups: GearsIcon,
    roles: SpinWheelIcon,
    summary: ReportIcon
};

export const IdentityProviderWizardStepIcons = {
    authenticatorSettings: GearsIcon,
    general: DocumentIcon,
    outboundProvisioningSettings: GearsIcon,
    summary: ReportIcon
};

export const AuthenticatorIcons = {
    basic: BasicAuthIcon,
    emailOTP: EmailOTPIcon,
    facebook: FacebookLogo,
    fido: FIDOLogo,
    google: GoogleLogo,
    smsOTP: SMSOTPIcon,
    totp: TOTPIcon,
    twitter: TwitterLogo
};

export const PlaceHolderIcons = {
    drag: DragIcon
};

export const IdPIcons = {
    facebook: FacebookIdPIcon,
    github: GithubIdPIcon,
    google: GoogleIdPIcon,
    twitter: TwitterIdPIcon,
    saml: SamlLogo,
    oidc: OIDCLogo,
    wsFed: WSFedLogo,
    smsOTP: SMSOTPIcon,
    emailOTP: EmailOTPIcon,
    microsoft: GoogleIdPIcon,
    yahoo: GoogleIdPIcon,
    iwaKerberos: GoogleIdPIcon,
    office365: GoogleIdPIcon
};

export const IdPCapabilityIcons = {
    [ SupportedServices.AUTHENTICATION ]: AuthenticationCapabilityIcon,
    [ SupportedServices.PROVISIONING ]: ProvisionCapabilityIcon
};

export const OperationIcons = {
    drag: DragSquaresIcon,
    maximize: MaximizeIcon,
    minimize: MinimizeIcon
};

export const HelpSidebarIcons = {
    actionPanel: {
        close: CrossIcon,
        pin: PinIcon
    },
    mini: {
        SDKs: BoxIcon,
        docs: DocumentIcon
    }
};
