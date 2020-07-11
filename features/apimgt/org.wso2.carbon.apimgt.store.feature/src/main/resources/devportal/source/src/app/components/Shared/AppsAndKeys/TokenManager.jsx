/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Icon from '@material-ui/core/Icon';
import { FormattedMessage, injectIntl } from 'react-intl';
import Loading from 'AppComponents/Base/Loading/Loading';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Alert from 'AppComponents/Shared/Alert';
import ProvideOAuthKeys from 'AppComponents/Shared/AppsAndKeys/ProvideOAuthKeys';
import Application from 'AppData/Application';
import AuthManager from 'AppData/AuthManager';
import Settings from 'AppComponents/Shared/SettingsContext';
import API from 'AppData/api';
import KeyConfiguration from './KeyConfiguration';
import ViewKeys from './ViewKeys';
import WaitingForApproval from './WaitingForApproval';
import { ScopeValidation, resourceMethods, resourcePaths } from '../ScopeValidation';
import TokenMangerSummary from './TokenManagerSummary';
import Progress from '../Progress';

const styles = (theme) => ({
    root: {
        padding: theme.spacing(3),
        '& span, & h6, & label, & input': {
            color: theme.palette.getContrastText(theme.palette.background.paper),
        },
        '& input:disabled': {
            backgroundColor: '#f8f8f8',
            color: '#9d9d9d',
        },
    },
    button: {
        marginLeft: 0,
        '& span': {
            color: theme.palette.getContrastText(theme.palette.primary.main),
        },
    },
    cleanUpButton: {
        marginLeft: 15,
    },
    cleanUpInfoText: {
        padding: '10px 0px 10px 15px',
    },
    tokenSection: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    margin: {
        marginRight: theme.spacing(2),
    },
    keyConfigWrapper: {
        flexDirection: 'column',
        marginBottom: 0,
    },
    generateWrapper: {
        padding: '10px 0px',
        marginLeft: theme.spacing(1.25),
    },
    paper: {
        background: 'none',
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    muiFormGroupRoot: {
        flexDirection: 'row',
    },
    formControl: {
    },
    subTitle: {
        fontWeight: 400,
    },
    tabPanel: {
        paddingLeft: theme.spacing(2),
        '& .MuiBox-root': {
            padding: 0,
        }
    },
});

function TabPanel(props) {
    const {
        children, value, index, ...other
    } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const StyledTabs = withStyles({
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > span': {
            width: '98%',
            backgroundColor: '#ffffff',
        },
        transition: 'none',
    },
    flexContainer: {
        borderBottom: 'solid 1px #666',
        backgroundColor: '#efefef',
        '& button:first-child': {
            borderLeft: 'none',
        }
    },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);


const StyledTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        color: '#666',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        '&:focus': {
            opacity: 1,
        },
    },
    selected: {
        backgroundColor: '#fff',
        borderLeft: 'solid 1px #666',
        borderRight: 'solid 1px #666',
    }

}))((props) => <Tab disableRipple {...props} />);

/**
 *  @param {event} event event
 *  @param {String} value description
 */
class TokenManager extends React.Component {
    static contextType = Settings;

    /**
     *
     * @param {*} props props
     */
    constructor(props) {
        super(props);
        const { selectedApp, keyType } = this.props;
        this.state = {
            isLoading: false,
            keys: null,
            isKeyJWT: false,
            keyRequest: {
                keyType,
                selectedGrantTypes: null,
                callbackUrl: '',
                additionalProperties: {},
                keyManager: '',
            },
            keyManagers: [],
            selectedTab: null,
            providedConsumerKey: '',
            providedConsumerSecret: '',
            generateEnabled: true,
            validating: false,
        };
        this.keyStates = {
            COMPLETED: 'COMPLETED',
            APPROVED: 'APPROVED',
            CREATED: 'CREATED',
            REJECTED: 'REJECTED',
        };
        if (selectedApp) {
            this.appId = selectedApp.appId || selectedApp.value;
            this.application = Application.get(this.appId);
        }
        this.updateKeyRequest = this.updateKeyRequest.bind(this);
        this.generateKeys = this.generateKeys.bind(this);
        this.updateKeys = this.updateKeys.bind(this);
        this.cleanUpKeys = this.cleanUpKeys.bind(this);
        this.handleOnChangeProvidedOAuth = this.handleOnChangeProvidedOAuth.bind(this);
        this.provideOAuthKeySecret = this.provideOAuthKeySecret.bind(this);
    }

    /**
     *
     *
     * @memberof TokenManager
     */
    componentDidMount() {
        this.loadApplication();
    }

    setGenerateEnabled = (state) => {
        this.setState({ generateEnabled: state });
    }

    handleTabChange = (event, newSelectedTab) => {
        const {keys, keyManagers, keyRequest } = this.state;
        const { keyType } = this.props;

        if (keys.size > 0 && keys.get(newSelectedTab) && keys.get(newSelectedTab).keyType === keyType) {
            const { callbackUrl, supportedGrantTypes } = keys.get(newSelectedTab);
            const newRequest = {
                ...keyRequest, callbackUrl, selectedGrantTypes: supportedGrantTypes || [],
            };
            this.setState({ keyRequest: newRequest, selectedTab: newSelectedTab });
        } else {
            const selectdKMGrants = keyManagers.find(x => x.name === newSelectedTab).availableGrantTypes || [];

            this.setState({
                keyRequest: { ...keyRequest, selectedGrantTypes: selectdKMGrants },
                selectedTab: newSelectedTab,
            });
        }
    };

    /**
     * load application key generation ui
     */
    loadApplication = () => {
        const { keyType } = this.props;
        if (this.appId) {
            const api = new API();
            const promisedKeyManagers = api.getKeyManagers();
            const promisedGetKeys = this.application
                .then((application) => application.getKeys(keyType));
            Promise.all([promisedKeyManagers, promisedGetKeys])
                .then((response) => {
                    // processing promisedKeyManagers response
                    const responseKeyManagerList = [];
                    response[0].body.list.map((item) => responseKeyManagerList.push(item));
                    this.setState({});

                    // Selecting a key manager from the list of key managers.
                    let { selectedTab } = this.state;
                    if (!selectedTab && responseKeyManagerList.length > 0) {
                        selectedTab = !!responseKeyManagerList.find(x => x.name === 'Default') ? 'Default'
                            : responseKeyManagerList[0].name;
                    }

                    // processing promisedGetKeys response
                    const keys = response[1];
                    const { keyRequest } = this.state;

                    if (keys.size > 0 && keys.get(selectedTab) && keys.get(selectedTab).keyType === keyType) {
                        const { callbackUrl, supportedGrantTypes } = keys.get(selectedTab);
                        const newRequest = {
                            ...keyRequest, callbackUrl, selectedGrantTypes: supportedGrantTypes || [],
                        };
                        this.setState({ keys, keyRequest: newRequest, keyManagers: responseKeyManagerList, selectedTab});
                    } else {
                        const selectdKMGrants = responseKeyManagerList.find(x => x.name === selectedTab).availableGrantTypes || [];

                        this.setState({
                            keys,
                            keyRequest: { ...keyRequest, selectedGrantTypes: selectdKMGrants },
                            keyManagers: responseKeyManagerList,
                            selectedTab
                        });
                    }
                })
                .catch((error) => {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(error);
                    }
                    if (error.status === 404) {
                        this.setState({ notFound: true });
                    }
                });
        }
    }

    /**
     * Update keyRequest state
     * @param {Object} keyRequest parameters requried for key generation request
     */
    updateKeyRequest(keyRequest) {
        this.setState({ keyRequest });
    }

    /**
     * Generate keys for application,
     *
     * @memberof KeyConfiguration
     */
    generateKeys() {
        const { keyRequest, keys, selectedTab } = this.state;
        const {
            keyType, updateSubscriptionData, selectedApp: { tokenType, hashEnabled }, intl,
        } = this.props;

        if ((keyRequest.selectedGrantTypes.includes('implicit')
            || keyRequest.selectedGrantTypes.includes('authorization_code')) && keyRequest.callbackUrl === '') {
            Alert.error(intl.formatMessage({
                id: 'Shared.AppsAndKeys.TokenManager.key.generate.error.callbackempty',
                defaultMessage: 'Callback URL can not be empty when the Implicit or Application Code grant types selected',
            }));
            this.setValidating(true);
            return;
        }
        this.setState({ isLoading: true });

        this.application
            .then((application) => {
                return application.generateKeys(
                    keyType, keyRequest.selectedGrantTypes,
                    keyRequest.callbackUrl,
                    keyRequest.additionalProperties, selectedTab,
                );
            })
            .then((response) => {
                if (updateSubscriptionData) {
                    updateSubscriptionData();
                }
                const newKeys = new Map([...keys]);
                // in case token hashing is enabled, isKeyJWT is set to true even if the token type is JWT.
                // This is to mimic the behavior of JWT tokens (by showing the token in a dialog)
                const isKeyJWT = (tokenType === 'JWT') || hashEnabled;
                newKeys.set(selectedTab, response);
                this.setState({ keys: newKeys, isKeyJWT });
                Alert.info(intl.formatMessage({
                    id: 'Shared.AppsAndKeys.TokenManager.key.generate.success',
                    defaultMessage: 'Application keys generated successfully',
                }));
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                const { status } = error;
                if (status === 404) {
                    this.setState({ notFound: true });
                }
                Alert.error(intl.formatMessage({
                    id: 'Shared.AppsAndKeys.TokenManager.key.generate.error',
                    defaultMessage: 'Error occurred when generating application keys',
                }));
            }).finally(() => this.setState({ isLoading: false }));
    }

    /**
     *
     * @memberof KeyConfiguration
     */
    updateKeys() {
        this.setState({ isLoading: true });
        const { keys, keyRequest, selectedTab } = this.state;
        const { keyType, intl } = this.props;
        const applicationKey = (keys.get(selectedTab).keyType === keyType) && keys.get(selectedTab);
        this.application
            .then((application) => {
                return application.updateKeys(
                    applicationKey.tokenType,
                    keyType,
                    keyRequest.selectedGrantTypes,
                    keyRequest.callbackUrl,
                    applicationKey.consumerKey,
                    applicationKey.consumerSecret,
                    applicationKey.additionalProperties,
                    selectedTab,
                    applicationKey.keyMappingId,
                );
            })
            .then((response) => {
                const newKeys = new Map([...keys]);
                newKeys.set(selectedTab, response);
                this.setState({ keys: newKeys });
                Alert.info(intl.formatMessage({
                    id: 'Shared.AppsAndKeys.TokenManager.key.update.success',
                    defaultMessage: 'Application keys updated successfully',
                }));
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                const { status } = error;
                if (status === 404) {
                    this.setState({ notFound: true });
                }
                Alert.error(intl.formatMessage({
                    id: 'Shared.AppsAndKeys.TokenManager.key.update.error',
                    defaultMessage: 'Error occurred when updating application keys',
                }));
            }).finally(() => this.setState({ isLoading: false }));
    }

    /**
     * Cleanup application keys
     */
    cleanUpKeys(selectedTab, keyMappingId) {
        const { keyType, intl } = this.props;
        this.application
            .then((application) => {
                return application.cleanUpKeys(keyType, selectedTab, keyMappingId);
            })
            .then(() => {
                this.loadApplication();
                Alert.info(intl.formatMessage({
                    id: 'Shared.AppsAndKeys.TokenManager.key.cleanup.success',
                    defaultMessage: 'Application keys cleaned successfully',
                }));
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                const { status } = error;
                if (status === 404) {
                    this.setState({ notFound: true });
                }
                Alert.error(intl.formatMessage({
                    id: 'Shared.AppsAndKeys.TokenManager.key.cleanup.error',
                    defaultMessage: 'Error occurred while cleaning up application keys',
                }));
            });
    }

    /**
     * Handle on change of provided consumer key and consumer secret
     *
     * @param event onChange event
     */
    handleOnChangeProvidedOAuth(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    /**
     * Provide consumer key and secret of an existing OAuth app to an application
     */
    provideOAuthKeySecret(selectedTab) {
        const { keyType, intl } = this.props;
        const { providedConsumerKey, providedConsumerSecret } = this.state;

        this.application
            .then((application) => {
                return application.provideKeys(keyType, providedConsumerKey, providedConsumerSecret, selectedTab);
            })
            .then(() => {
                this.setState({ providedConsumerKey: '', providedConsumerSecret: '' });
                Alert.info(intl.formatMessage({
                    id: 'Shared.AppsAndKeys.TokenManager.key.provide.success',
                    defaultMessage: 'Application keys provided successfully',
                }));
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                const { status } = error;
                if (status === 404) {
                    this.setState({ notFound: true });
                }
                Alert.error(intl.formatMessage({
                    id: 'Shared.AppsAndKeys.TokenManager.key.provide.error',
                    defaultMessage: 'Error occurred when providing application keys',
                }));
            });
    }
    getKeyManagerDescription() {
        const { keyManagers, selectedTab } = this.state;
        const selectedKMObject = keyManagers.filter(item => item.name === selectedTab);
        if (selectedKMObject && selectedKMObject.length === 1) {
            return selectedKMObject[0].description;
        }
        return '';
    }
    setValidating(validatingState) {
        this.setState({ validating: validatingState });
    }
    toTitleCase = (str) => {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    };
    /**
     *  @returns {Component}
     * @memberof Tokenemanager
     */
    render() {
        const {
            classes, selectedApp, keyType, summary, selectedApp: { hashEnabled },
        } = this.props;
        const {
            keys, keyRequest, isLoading, isKeyJWT, providedConsumerKey,
            providedConsumerSecret, generateEnabled, selectedTab, keyManagers, validating,
        } = this.state;
        if (!keys || !selectedTab || !keyRequest.selectedGrantTypes) {
            return <Loading />;
        }
        const username = AuthManager.getUser().name;
        let isUserOwner = false;

        if (selectedApp.owner && username.toLowerCase() === selectedApp.owner.toLowerCase()) {
            isUserOwner = true;
        }
        const key = keys.size > 0 && keys.get(selectedTab) && (keys.get(selectedTab).keyType === keyType) && keys.get(selectedTab);

        if (summary) {
            if (keys) {
                return (
                    <TokenMangerSummary
                        keys={keys}
                        key={key}
                        keyStates={this.keyStates}
                        selectedApp={selectedApp}
                        selectedTab={selectedTab}
                        keyType={keyType}
                        isKeyJWT={isKeyJWT}
                        isUserOwner={isUserOwner}
                    />
                );
            } else {
                return (<Progress />);
            }
        }
        if (keys.size > 0 && keys.get(selectedTab) && keys.get(selectedTab).keyType === keyType && key && key.keyState === 'APPROVED' && !key.consumerKey) {
            return (
                <>
                    <Typography className={classes.cleanUpInfoText} variant='subtitle1'>
                        <FormattedMessage
                            id='Shared.AppsAndKeys.TokenManager.cleanup.text'
                            defaultMessage='Error! You have partially-created keys.
                            Please click `Clean Up` button and try again.'
                        />
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        className={classes.cleanUpButton}
                        onClick={this.cleanUpKeys(selectedTab, keys.get(selectedTab).keyMappingId)}
                    >
                        <FormattedMessage
                            defaultMessage='Clean up'
                            id='Shared.AppsAndKeys.TokenManager.cleanup'
                        />
                    </Button>
                </>
            );
        }
        if (key && (key.keyState === this.keyStates.CREATED || key.keyState === this.keyStates.REJECTED)) {
            return <WaitingForApproval keyState={key.keyState} states={this.keyStates} />;
        }
        const settingsContext = this.context;
        const { mapExistingAuthApps } = settingsContext.settings;

        return (
            <>
                <StyledTabs
                    value={selectedTab}
                    indicatorColor='primary'
                    textColor='primary'
                    onChange={this.handleTabChange}
                    aria-label='key manager tabs'
                >
                    {keyManagers.map((keymanager) => (
                        <StyledTab label={keymanager.displayName || keymanager.name} value={keymanager.name} disabled={!keymanager.enabled} />
                    ))}
                </StyledTabs>
                <div className={classes.root}>
                    <Box mb={1}>
                        <Typography variant='h5' className={classes.keyTitle}>
                            {this.toTitleCase(keyType)}
                            <FormattedMessage
                                id='Applications.Details.oauth2.keys.main.title'
                                defaultMessage=' OAuth2 Keys'
                            />
                        </Typography>
                    </Box>

                    {(keyManagers && keyManagers.length > 1) && keyManagers.map(keymanager => (
                        <TabPanel value={selectedTab} index={keymanager.name} className={classes.tabPanel}>
                            <Typography className={classes.heading} variant='h6' component='h6' className={classes.subTitle}>
                                <FormattedMessage
                                    defaultMessage='Key and Secret'
                                    id='Shared.AppsAndKeys.TokenManager.key.and.secret'
                                />
                            </Typography>
                            <Box m={2}>
                                <ViewKeys
                                    selectedApp={selectedApp}
                                    selectedTab={selectedTab}
                                    keyType={keyType}
                                    keys={keys}
                                    isKeyJWT={isKeyJWT}
                                    selectedGrantTypes={keyRequest.selectedGrantTypes}
                                    isUserOwner={isUserOwner}
                                    hashEnabled={keymanager.enableTokenHashing || hashEnabled}
                                    keyManagerConfig={keymanager}
                                />
                            </Box>
                            <Typography className={classes.heading} variant='h6' component='h6' className={classes.subTitle}>
                                {
                                    keys.size > 0 && keys.get(selectedTab) && keys.get(selectedTab).keyType === keyType
                                        ? (
                                            <FormattedMessage
                                                defaultMessage='Key Configurations'
                                                id='Shared.AppsAndKeys.TokenManager.update.configuration'
                                            />
                                        )
                                        : (
                                            <FormattedMessage
                                                defaultMessage='Key Configuration'
                                                id='Shared.AppsAndKeys.TokenManager.key.configuration'
                                            />
                                        )
                                }
                            </Typography>
                            <Box m={2}>
                                <KeyConfiguration
                                    keys={keys}
                                    key={key}
                                    selectedApp={selectedApp}
                                    selectedTab={selectedTab}
                                    keyType={keyType}
                                    updateKeyRequest={this.updateKeyRequest}
                                    keyRequest={keyRequest}
                                    isUserOwner={isUserOwner}
                                    isKeysAvailable={keys.size > 0 && keys.get(selectedTab) && keys.get(selectedTab).keyType === keyType}
                                    keyManagerConfig={keymanager}
                                    validating={validating}
                                />
                                <div className={classes.generateWrapper}>
                                    <ScopeValidation
                                        resourcePath={resourcePaths.APPLICATION_GENERATE_KEYS}
                                        resourceMethod={resourceMethods.POST}
                                    >
                                        {!isUserOwner ? (
                                            <>
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    className={classes.button}
                                                    onClick={
                                                        keys.size > 0 && keys.get(selectedTab) && keys.get(selectedTab).keyType === keyType ? this.updateKeys : this.generateKeys
                                                    }
                                                    disabled={!isUserOwner || isLoading || !keymanager.enableTokenGeneration}
                                                >
                                                    {keys.size > 0 && keys.get(selectedTab) && keys.get(selectedTab).keyType === keyType ? 'Update keys' : 'Generate Keys'}
                                                    {isLoading && <CircularProgress size={20} />}
                                                </Button>
                                                <Typography variant='caption'>
                                                    <FormattedMessage
                                                        defaultMessage='Only owner can generate or update keys'
                                                        id='Shared.AppsAndKeys.TokenManager.key.and.user.owner'
                                                    />
                                                </Typography>
                                            </>
                                        ) : (
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    className={classes.button}
                                                    onClick={keys.size > 0 && keys.get(selectedTab) && keys.get(selectedTab).keyType === keyType ? this.updateKeys : this.generateKeys}
                                                    disabled={!generateEnabled || isLoading || !keymanager.enableTokenGeneration}
                                                >
                                                    {keys.size > 0 && keys.get(selectedTab) && keys.get(selectedTab).keyType === keyType ? 'Update' : 'Generate Keys'}
                                                    {isLoading && <CircularProgress size={20} />}
                                                </Button>
                                            )}
                                    </ScopeValidation>
                                </div>
                                {
                                    mapExistingAuthApps && !(keys.get(selectedTab).keyType === keyType) && (
                                        <Paper className={classes.paper}>
                                            <ExpansionPanel defaultExpanded>
                                                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                                                    <Typography className={classes.heading} variant='subtitle1'>
                                                        <FormattedMessage
                                                            defaultMessage='Provide Existing OAuth Keys'
                                                            id='Shared.AppsAndKeys.TokenManager.provide.oauth'
                                                        />
                                                    </Typography>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails className={classes.keyConfigWrapper}>
                                                    <ProvideOAuthKeys
                                                        onChange={this.handleOnChangeProvidedOAuth}
                                                        consumerKey={providedConsumerKey}
                                                        consumerSecret={providedConsumerSecret}
                                                        isUserOwner={isUserOwner}
                                                    />
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                            <div className={classes.generateWrapper}>
                                                <ScopeValidation
                                                    resourcePath={resourcePaths.APPLICATION_GENERATE_KEYS}
                                                    resourceMethod={resourceMethods.POST}
                                                >
                                                    {!isUserOwner ? (
                                                        <>
                                                            <Button
                                                                variant='contained'
                                                                color='primary'
                                                                className={classes.button}
                                                                onClick={this.provideOAuthKeySecret(selectedTab, keys.get(selectedTab).keyMappingId)}
                                                                disabled={!isUserOwner}
                                                            >
                                                                {
                                                                    keys.size > 0 && keys.get(selectedTab) && keys.get(selectedTab).keyType === keyType
                                                                        ? (
                                                                            <FormattedMessage
                                                                                defaultMessage='Update'
                                                                                id='Shared.AppsAndKeys.TokenManager.provide.
                                                                                    oauth.button.update'
                                                                            />
                                                                        )
                                                                        : (
                                                                            <FormattedMessage
                                                                                defaultMessage='Provide'
                                                                                id='Shared.AppsAndKeys.TokenManager.
                                                                                    provide.oauth.button.provide'
                                                                            />
                                                                        )
                                                                }
                                                            </Button>
                                                            <Typography variant='caption'>
                                                                <FormattedMessage
                                                                    defaultMessage='Only owner can provide keys'
                                                                    id='Shared.AppsAndKeys.TokenManager.key.provide.user.owner'
                                                                />
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                            <Button
                                                                variant='contained'
                                                                color='primary'
                                                                className={classes.button}
                                                                onClick={this.provideOAuthKeySecret(selectedTab, keys.get(selectedTab).keyMappingId)}
                                                            >
                                                                {
                                                                    keys.size > 0 && keys.get(selectedTab) && keys.get(selectedTab).keyType === keyType
                                                                        ? (
                                                                            <FormattedMessage
                                                                                defaultMessage='Update'
                                                                                id='Shared.AppsAndKeys.TokenManager.
                                                                                provide.oauth.button.update'
                                                                            />
                                                                        )
                                                                        : (
                                                                            <FormattedMessage
                                                                                defaultMessage='Provide'
                                                                                id='Shared.AppsAndKeys.
                                                                                TokenManager.provide.oauth.button.provide'
                                                                            />
                                                                        )
                                                                }
                                                            </Button>
                                                        )}
                                                </ScopeValidation>
                                            </div>
                                        </Paper>
                                    )
                                }
                            </Box>
                        </TabPanel>
                    ))}
                </div>
            </>
        );
    }
}
TokenManager.defaultProps = {
    updateSubscriptionData: () => { },
    summary: false,
};
TokenManager.propTypes = {
    classes: PropTypes.instanceOf(Object).isRequired,
    selectedApp: PropTypes.shape({
        tokenType: PropTypes.string.isRequired,
        appId: PropTypes.string,
        value: PropTypes.string,
        owner: PropTypes.string,
        hashEnabled: PropTypes.bool,
    }).isRequired,
    keyType: PropTypes.string.isRequired,
    updateSubscriptionData: PropTypes.func,
    intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
    summary: PropTypes.bool,
};

export default injectIntl(withStyles(styles)(TokenManager));
