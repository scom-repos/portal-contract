"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectInfo = void 0;
const eth_contract_1 = require("@ijstech/eth-contract");
const ProjectInfo_json_1 = __importDefault(require("./ProjectInfo.json"));
class ProjectInfo extends eth_contract_1.Contract {
    constructor(wallet, address) {
        super(wallet, address, ProjectInfo_json_1.default.abi, ProjectInfo_json_1.default.bytecode);
        this.assign();
    }
    deploy(params, options) {
        return this.__deploy([params.token, params.auditorInfo], options);
    }
    parseAddAdminEvent(receipt) {
        return this.parseEvents(receipt, "AddAdmin").map(e => this.decodeAddAdminEvent(e));
    }
    decodeAddAdminEvent(event) {
        let result = event.data;
        return {
            projectId: new eth_contract_1.BigNumber(result.projectId),
            admin: result.admin,
            _event: event
        };
    }
    parseAuthorizeEvent(receipt) {
        return this.parseEvents(receipt, "Authorize").map(e => this.decodeAuthorizeEvent(e));
    }
    decodeAuthorizeEvent(event) {
        let result = event.data;
        return {
            user: result.user,
            _event: event
        };
    }
    parseDeauthorizeEvent(receipt) {
        return this.parseEvents(receipt, "Deauthorize").map(e => this.decodeDeauthorizeEvent(e));
    }
    decodeDeauthorizeEvent(event) {
        let result = event.data;
        return {
            user: result.user,
            _event: event
        };
    }
    parseNewPackageEvent(receipt) {
        return this.parseEvents(receipt, "NewPackage").map(e => this.decodeNewPackageEvent(e));
    }
    decodeNewPackageEvent(event) {
        let result = event.data;
        return {
            projectId: new eth_contract_1.BigNumber(result.projectId),
            packageId: new eth_contract_1.BigNumber(result.packageId),
            ipfsCid: result.ipfsCid,
            _event: event
        };
    }
    parseNewPackageVersionEvent(receipt) {
        return this.parseEvents(receipt, "NewPackageVersion").map(e => this.decodeNewPackageVersionEvent(e));
    }
    decodeNewPackageVersionEvent(event) {
        let result = event.data;
        return {
            packageId: new eth_contract_1.BigNumber(result.packageId),
            packageVersionId: new eth_contract_1.BigNumber(result.packageVersionId),
            version: {
                major: new eth_contract_1.BigNumber(result.version.major),
                minor: new eth_contract_1.BigNumber(result.version.minor),
                patch: new eth_contract_1.BigNumber(result.version.patch)
            },
            _event: event
        };
    }
    parseNewProjectEvent(receipt) {
        return this.parseEvents(receipt, "NewProject").map(e => this.decodeNewProjectEvent(e));
    }
    decodeNewProjectEvent(event) {
        let result = event.data;
        return {
            projectId: new eth_contract_1.BigNumber(result.projectId),
            owner: result.owner,
            _event: event
        };
    }
    parseNewProjectVersionEvent(receipt) {
        return this.parseEvents(receipt, "NewProjectVersion").map(e => this.decodeNewProjectVersionEvent(e));
    }
    decodeNewProjectVersionEvent(event) {
        let result = event.data;
        return {
            projectId: new eth_contract_1.BigNumber(result.projectId),
            projectVersionIdx: new eth_contract_1.BigNumber(result.projectVersionIdx),
            ipfsCid: result.ipfsCid,
            _event: event
        };
    }
    parseRemoveAdminEvent(receipt) {
        return this.parseEvents(receipt, "RemoveAdmin").map(e => this.decodeRemoveAdminEvent(e));
    }
    decodeRemoveAdminEvent(event) {
        let result = event.data;
        return {
            projectId: new eth_contract_1.BigNumber(result.projectId),
            admin: result.admin,
            _event: event
        };
    }
    parseSetPackageVersionStatusEvent(receipt) {
        return this.parseEvents(receipt, "SetPackageVersionStatus").map(e => this.decodeSetPackageVersionStatusEvent(e));
    }
    decodeSetPackageVersionStatusEvent(event) {
        let result = event.data;
        return {
            packageId: new eth_contract_1.BigNumber(result.packageId),
            packageVersionId: new eth_contract_1.BigNumber(result.packageVersionId),
            status: new eth_contract_1.BigNumber(result.status),
            _event: event
        };
    }
    parseSetProjectCurrentVersionEvent(receipt) {
        return this.parseEvents(receipt, "SetProjectCurrentVersion").map(e => this.decodeSetProjectCurrentVersionEvent(e));
    }
    decodeSetProjectCurrentVersionEvent(event) {
        let result = event.data;
        return {
            projectId: new eth_contract_1.BigNumber(result.projectId),
            projectVersionIdx: new eth_contract_1.BigNumber(result.projectVersionIdx),
            _event: event
        };
    }
    parseStakeEvent(receipt) {
        return this.parseEvents(receipt, "Stake").map(e => this.decodeStakeEvent(e));
    }
    decodeStakeEvent(event) {
        let result = event.data;
        return {
            sender: result.sender,
            projectId: new eth_contract_1.BigNumber(result.projectId),
            amount: new eth_contract_1.BigNumber(result.amount),
            newBalance: new eth_contract_1.BigNumber(result.newBalance),
            _event: event
        };
    }
    parseStartOwnershipTransferEvent(receipt) {
        return this.parseEvents(receipt, "StartOwnershipTransfer").map(e => this.decodeStartOwnershipTransferEvent(e));
    }
    decodeStartOwnershipTransferEvent(event) {
        let result = event.data;
        return {
            user: result.user,
            _event: event
        };
    }
    parseTransferOwnershipEvent(receipt) {
        return this.parseEvents(receipt, "TransferOwnership").map(e => this.decodeTransferOwnershipEvent(e));
    }
    decodeTransferOwnershipEvent(event) {
        let result = event.data;
        return {
            user: result.user,
            _event: event
        };
    }
    parseTransferProjectOwnershipEvent(receipt) {
        return this.parseEvents(receipt, "TransferProjectOwnership").map(e => this.decodeTransferProjectOwnershipEvent(e));
    }
    decodeTransferProjectOwnershipEvent(event) {
        let result = event.data;
        return {
            projectId: new eth_contract_1.BigNumber(result.projectId),
            newOwner: result.newOwner,
            _event: event
        };
    }
    parseUnstakeEvent(receipt) {
        return this.parseEvents(receipt, "Unstake").map(e => this.decodeUnstakeEvent(e));
    }
    decodeUnstakeEvent(event) {
        let result = event.data;
        return {
            sender: result.sender,
            projectId: new eth_contract_1.BigNumber(result.projectId),
            amount: new eth_contract_1.BigNumber(result.amount),
            newBalance: new eth_contract_1.BigNumber(result.newBalance),
            _event: event
        };
    }
    parseUpdatePackageIpfsCidEvent(receipt) {
        return this.parseEvents(receipt, "UpdatePackageIpfsCid").map(e => this.decodeUpdatePackageIpfsCidEvent(e));
    }
    decodeUpdatePackageIpfsCidEvent(event) {
        let result = event.data;
        return {
            packageId: new eth_contract_1.BigNumber(result.packageId),
            ipfsCid: result.ipfsCid,
            _event: event
        };
    }
    parseVoidProjectVersionEvent(receipt) {
        return this.parseEvents(receipt, "VoidProjectVersion").map(e => this.decodeVoidProjectVersionEvent(e));
    }
    decodeVoidProjectVersionEvent(event) {
        let result = event.data;
        return {
            projectVersionIdx: new eth_contract_1.BigNumber(result.projectVersionIdx),
            _event: event
        };
    }
    assign() {
        let auditorInfo_call = async (options) => {
            let result = await this.call('auditorInfo', [], options);
            return result;
        };
        this.auditorInfo = auditorInfo_call;
        let isPermitted_call = async (param1, options) => {
            let result = await this.call('isPermitted', [param1], options);
            return result;
        };
        this.isPermitted = isPermitted_call;
        let latestAuditedPackageVersion_call = async (param1, options) => {
            let result = await this.call('latestAuditedPackageVersion', [this.wallet.utils.toString(param1)], options);
            return {
                packageId: new eth_contract_1.BigNumber(result.packageId),
                version: {
                    major: new eth_contract_1.BigNumber(result.version.major),
                    minor: new eth_contract_1.BigNumber(result.version.minor),
                    patch: new eth_contract_1.BigNumber(result.version.patch)
                },
                status: new eth_contract_1.BigNumber(result.status),
                ipfsCid: result.ipfsCid,
                reportUri: result.reportUri
            };
        };
        this.latestAuditedPackageVersion = latestAuditedPackageVersion_call;
        let newOwner_call = async (options) => {
            let result = await this.call('newOwner', [], options);
            return result;
        };
        this.newOwner = newOwner_call;
        let owner_call = async (options) => {
            let result = await this.call('owner', [], options);
            return result;
        };
        this.owner = owner_call;
        let ownersProjectsParams = (params) => [params.param1, this.wallet.utils.toString(params.param2)];
        let ownersProjects_call = async (params, options) => {
            let result = await this.call('ownersProjects', ownersProjectsParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.ownersProjects = ownersProjects_call;
        let ownersProjectsInvParams = (params) => [params.param1, this.wallet.utils.toString(params.param2)];
        let ownersProjectsInv_call = async (params, options) => {
            let result = await this.call('ownersProjectsInv', ownersProjectsInvParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.ownersProjectsInv = ownersProjectsInv_call;
        let ownersProjectsLength_call = async (owner, options) => {
            let result = await this.call('ownersProjectsLength', [owner], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.ownersProjectsLength = ownersProjectsLength_call;
        let packageVersions_call = async (param1, options) => {
            let result = await this.call('packageVersions', [this.wallet.utils.toString(param1)], options);
            return {
                packageId: new eth_contract_1.BigNumber(result.packageId),
                version: {
                    major: new eth_contract_1.BigNumber(result.version.major),
                    minor: new eth_contract_1.BigNumber(result.version.minor),
                    patch: new eth_contract_1.BigNumber(result.version.patch)
                },
                status: new eth_contract_1.BigNumber(result.status),
                ipfsCid: result.ipfsCid,
                reportUri: result.reportUri
            };
        };
        this.packageVersions = packageVersions_call;
        let packageVersionsLength_call = async (options) => {
            let result = await this.call('packageVersionsLength', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.packageVersionsLength = packageVersionsLength_call;
        let packageVersionsListParams = (params) => [this.wallet.utils.toString(params.param1), this.wallet.utils.toString(params.param2)];
        let packageVersionsList_call = async (params, options) => {
            let result = await this.call('packageVersionsList', packageVersionsListParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.packageVersionsList = packageVersionsList_call;
        let packageVersionsListLength_call = async (packageId, options) => {
            let result = await this.call('packageVersionsListLength', [this.wallet.utils.toString(packageId)], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.packageVersionsListLength = packageVersionsListLength_call;
        let packages_call = async (param1, options) => {
            let result = await this.call('packages', [this.wallet.utils.toString(param1)], options);
            return {
                projectId: new eth_contract_1.BigNumber(result.projectId),
                currVersionIndex: new eth_contract_1.BigNumber(result.currVersionIndex),
                status: new eth_contract_1.BigNumber(result.status),
                ipfsCid: result.ipfsCid
            };
        };
        this.packages = packages_call;
        let packagesLength_call = async (options) => {
            let result = await this.call('packagesLength', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.packagesLength = packagesLength_call;
        let projectAdminParams = (params) => [this.wallet.utils.toString(params.param1), this.wallet.utils.toString(params.param2)];
        let projectAdmin_call = async (params, options) => {
            let result = await this.call('projectAdmin', projectAdminParams(params), options);
            return result;
        };
        this.projectAdmin = projectAdmin_call;
        let projectAdminInvParams = (params) => [this.wallet.utils.toString(params.param1), params.param2];
        let projectAdminInv_call = async (params, options) => {
            let result = await this.call('projectAdminInv', projectAdminInvParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectAdminInv = projectAdminInv_call;
        let projectAdminLength_call = async (projectId, options) => {
            let result = await this.call('projectAdminLength', [this.wallet.utils.toString(projectId)], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectAdminLength = projectAdminLength_call;
        let projectBackerBalanceParams = (params) => [params.param1, this.wallet.utils.toString(params.param2)];
        let projectBackerBalance_call = async (params, options) => {
            let result = await this.call('projectBackerBalance', projectBackerBalanceParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectBackerBalance = projectBackerBalance_call;
        let projectBalance_call = async (param1, options) => {
            let result = await this.call('projectBalance', [this.wallet.utils.toString(param1)], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectBalance = projectBalance_call;
        let projectCount_call = async (options) => {
            let result = await this.call('projectCount', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectCount = projectCount_call;
        let projectCurrentVersion_call = async (param1, options) => {
            let result = await this.call('projectCurrentVersion', [this.wallet.utils.toString(param1)], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectCurrentVersion = projectCurrentVersion_call;
        let projectNewOwner_call = async (param1, options) => {
            let result = await this.call('projectNewOwner', [this.wallet.utils.toString(param1)], options);
            return result;
        };
        this.projectNewOwner = projectNewOwner_call;
        let projectOwner_call = async (param1, options) => {
            let result = await this.call('projectOwner', [this.wallet.utils.toString(param1)], options);
            return result;
        };
        this.projectOwner = projectOwner_call;
        let projectPackagesParams = (params) => [this.wallet.utils.toString(params.param1), this.wallet.utils.toString(params.param2)];
        let projectPackages_call = async (params, options) => {
            let result = await this.call('projectPackages', projectPackagesParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectPackages = projectPackages_call;
        let projectPackagesInvParams = (params) => [this.wallet.utils.toString(params.param1), this.wallet.utils.toString(params.param2)];
        let projectPackagesInv_call = async (params, options) => {
            let result = await this.call('projectPackagesInv', projectPackagesInvParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectPackagesInv = projectPackagesInv_call;
        let projectPackagesLength_call = async (projectId, options) => {
            let result = await this.call('projectPackagesLength', [this.wallet.utils.toString(projectId)], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectPackagesLength = projectPackagesLength_call;
        let projectVersionListParams = (params) => [this.wallet.utils.toString(params.param1), this.wallet.utils.toString(params.param2)];
        let projectVersionList_call = async (params, options) => {
            let result = await this.call('projectVersionList', projectVersionListParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectVersionList = projectVersionList_call;
        let projectVersionListLength_call = async (projectId, options) => {
            let result = await this.call('projectVersionListLength', [this.wallet.utils.toString(projectId)], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectVersionListLength = projectVersionListLength_call;
        let projectVersions_call = async (param1, options) => {
            let result = await this.call('projectVersions', [this.wallet.utils.toString(param1)], options);
            return {
                projectId: new eth_contract_1.BigNumber(result.projectId),
                version: new eth_contract_1.BigNumber(result.version),
                ipfsCid: result.ipfsCid,
                status: new eth_contract_1.BigNumber(result.status),
                lastModifiedDate: new eth_contract_1.BigNumber(result.lastModifiedDate)
            };
        };
        this.projectVersions = projectVersions_call;
        let projectVersionsInv_call = async (param1, options) => {
            let result = await this.call('projectVersionsInv', [param1], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectVersionsInv = projectVersionsInv_call;
        let projectVersionsLength_call = async (options) => {
            let result = await this.call('projectVersionsLength', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.projectVersionsLength = projectVersionsLength_call;
        let token_call = async (options) => {
            let result = await this.call('token', [], options);
            return result;
        };
        this.token = token_call;
        let addProjectAdminParams = (params) => [this.wallet.utils.toString(params.projectId), params.admin];
        let addProjectAdmin_send = async (params, options) => {
            let result = await this.send('addProjectAdmin', addProjectAdminParams(params), options);
            return result;
        };
        let addProjectAdmin_call = async (params, options) => {
            let result = await this.call('addProjectAdmin', addProjectAdminParams(params), options);
            return;
        };
        this.addProjectAdmin = Object.assign(addProjectAdmin_send, {
            call: addProjectAdmin_call
        });
        let deny_send = async (user, options) => {
            let result = await this.send('deny', [user], options);
            return result;
        };
        let deny_call = async (user, options) => {
            let result = await this.call('deny', [user], options);
            return;
        };
        this.deny = Object.assign(deny_send, {
            call: deny_call
        });
        let newPackageParams = (params) => [this.wallet.utils.toString(params.projectId), params.ipfsCid];
        let newPackage_send = async (params, options) => {
            let result = await this.send('newPackage', newPackageParams(params), options);
            return result;
        };
        let newPackage_call = async (params, options) => {
            let result = await this.call('newPackage', newPackageParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.newPackage = Object.assign(newPackage_send, {
            call: newPackage_call
        });
        let newPackageVersionParams = (params) => [this.wallet.utils.toString(params.projectId), this.wallet.utils.toString(params.packageId), [this.wallet.utils.toString(params.version.major), this.wallet.utils.toString(params.version.minor), this.wallet.utils.toString(params.version.patch)], params.ipfsCid];
        let newPackageVersion_send = async (params, options) => {
            let result = await this.send('newPackageVersion', newPackageVersionParams(params), options);
            return result;
        };
        let newPackageVersion_call = async (params, options) => {
            let result = await this.call('newPackageVersion', newPackageVersionParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.newPackageVersion = Object.assign(newPackageVersion_send, {
            call: newPackageVersion_call
        });
        let newProject_send = async (ipfsCid, options) => {
            let result = await this.send('newProject', [ipfsCid], options);
            return result;
        };
        let newProject_call = async (ipfsCid, options) => {
            let result = await this.call('newProject', [ipfsCid], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.newProject = Object.assign(newProject_send, {
            call: newProject_call
        });
        let newProjectVersionParams = (params) => [this.wallet.utils.toString(params.projectId), params.ipfsCid];
        let newProjectVersion_send = async (params, options) => {
            let result = await this.send('newProjectVersion', newProjectVersionParams(params), options);
            return result;
        };
        let newProjectVersion_call = async (params, options) => {
            let result = await this.call('newProjectVersion', newProjectVersionParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.newProjectVersion = Object.assign(newProjectVersion_send, {
            call: newProjectVersion_call
        });
        let permit_send = async (user, options) => {
            let result = await this.send('permit', [user], options);
            return result;
        };
        let permit_call = async (user, options) => {
            let result = await this.call('permit', [user], options);
            return;
        };
        this.permit = Object.assign(permit_send, {
            call: permit_call
        });
        let removeProjectAdminParams = (params) => [this.wallet.utils.toString(params.projectId), params.admin];
        let removeProjectAdmin_send = async (params, options) => {
            let result = await this.send('removeProjectAdmin', removeProjectAdminParams(params), options);
            return result;
        };
        let removeProjectAdmin_call = async (params, options) => {
            let result = await this.call('removeProjectAdmin', removeProjectAdminParams(params), options);
            return;
        };
        this.removeProjectAdmin = Object.assign(removeProjectAdmin_send, {
            call: removeProjectAdmin_call
        });
        let setPackageVersionToAuditFailedParams = (params) => [this.wallet.utils.toString(params.packageVersionId), params.reportUri];
        let setPackageVersionToAuditFailed_send = async (params, options) => {
            let result = await this.send('setPackageVersionToAuditFailed', setPackageVersionToAuditFailedParams(params), options);
            return result;
        };
        let setPackageVersionToAuditFailed_call = async (params, options) => {
            let result = await this.call('setPackageVersionToAuditFailed', setPackageVersionToAuditFailedParams(params), options);
            return;
        };
        this.setPackageVersionToAuditFailed = Object.assign(setPackageVersionToAuditFailed_send, {
            call: setPackageVersionToAuditFailed_call
        });
        let setPackageVersionToAuditPassedParams = (params) => [this.wallet.utils.toString(params.packageVersionId), params.reportUri];
        let setPackageVersionToAuditPassed_send = async (params, options) => {
            let result = await this.send('setPackageVersionToAuditPassed', setPackageVersionToAuditPassedParams(params), options);
            return result;
        };
        let setPackageVersionToAuditPassed_call = async (params, options) => {
            let result = await this.call('setPackageVersionToAuditPassed', setPackageVersionToAuditPassedParams(params), options);
            return;
        };
        this.setPackageVersionToAuditPassed = Object.assign(setPackageVersionToAuditPassed_send, {
            call: setPackageVersionToAuditPassed_call
        });
        let setProjectCurrentVersionParams = (params) => [this.wallet.utils.toString(params.projectId), this.wallet.utils.toString(params.versionIdx)];
        let setProjectCurrentVersion_send = async (params, options) => {
            let result = await this.send('setProjectCurrentVersion', setProjectCurrentVersionParams(params), options);
            return result;
        };
        let setProjectCurrentVersion_call = async (params, options) => {
            let result = await this.call('setProjectCurrentVersion', setProjectCurrentVersionParams(params), options);
            return;
        };
        this.setProjectCurrentVersion = Object.assign(setProjectCurrentVersion_send, {
            call: setProjectCurrentVersion_call
        });
        let stakeParams = (params) => [this.wallet.utils.toString(params.projectId), this.wallet.utils.toString(params.amount)];
        let stake_send = async (params, options) => {
            let result = await this.send('stake', stakeParams(params), options);
            return result;
        };
        let stake_call = async (params, options) => {
            let result = await this.call('stake', stakeParams(params), options);
            return;
        };
        this.stake = Object.assign(stake_send, {
            call: stake_call
        });
        let takeOwnership_send = async (options) => {
            let result = await this.send('takeOwnership', [], options);
            return result;
        };
        let takeOwnership_call = async (options) => {
            let result = await this.call('takeOwnership', [], options);
            return;
        };
        this.takeOwnership = Object.assign(takeOwnership_send, {
            call: takeOwnership_call
        });
        let takeProjectOwnership_send = async (projectId, options) => {
            let result = await this.send('takeProjectOwnership', [this.wallet.utils.toString(projectId)], options);
            return result;
        };
        let takeProjectOwnership_call = async (projectId, options) => {
            let result = await this.call('takeProjectOwnership', [this.wallet.utils.toString(projectId)], options);
            return;
        };
        this.takeProjectOwnership = Object.assign(takeProjectOwnership_send, {
            call: takeProjectOwnership_call
        });
        let transferOwnership_send = async (newOwner, options) => {
            let result = await this.send('transferOwnership', [newOwner], options);
            return result;
        };
        let transferOwnership_call = async (newOwner, options) => {
            let result = await this.call('transferOwnership', [newOwner], options);
            return;
        };
        this.transferOwnership = Object.assign(transferOwnership_send, {
            call: transferOwnership_call
        });
        let transferProjectOwnershipParams = (params) => [this.wallet.utils.toString(params.projectId), params.newOwner];
        let transferProjectOwnership_send = async (params, options) => {
            let result = await this.send('transferProjectOwnership', transferProjectOwnershipParams(params), options);
            return result;
        };
        let transferProjectOwnership_call = async (params, options) => {
            let result = await this.call('transferProjectOwnership', transferProjectOwnershipParams(params), options);
            return;
        };
        this.transferProjectOwnership = Object.assign(transferProjectOwnership_send, {
            call: transferProjectOwnership_call
        });
        let unstakeParams = (params) => [this.wallet.utils.toString(params.projectId), this.wallet.utils.toString(params.amount)];
        let unstake_send = async (params, options) => {
            let result = await this.send('unstake', unstakeParams(params), options);
            return result;
        };
        let unstake_call = async (params, options) => {
            let result = await this.call('unstake', unstakeParams(params), options);
            return;
        };
        this.unstake = Object.assign(unstake_send, {
            call: unstake_call
        });
        let updatePackageIpfsCidParams = (params) => [this.wallet.utils.toString(params.projectId), this.wallet.utils.toString(params.packageId), params.ipfsCid];
        let updatePackageIpfsCid_send = async (params, options) => {
            let result = await this.send('updatePackageIpfsCid', updatePackageIpfsCidParams(params), options);
            return result;
        };
        let updatePackageIpfsCid_call = async (params, options) => {
            let result = await this.call('updatePackageIpfsCid', updatePackageIpfsCidParams(params), options);
            return;
        };
        this.updatePackageIpfsCid = Object.assign(updatePackageIpfsCid_send, {
            call: updatePackageIpfsCid_call
        });
        let voidPackageVersion_send = async (packageVersionId, options) => {
            let result = await this.send('voidPackageVersion', [this.wallet.utils.toString(packageVersionId)], options);
            return result;
        };
        let voidPackageVersion_call = async (packageVersionId, options) => {
            let result = await this.call('voidPackageVersion', [this.wallet.utils.toString(packageVersionId)], options);
            return;
        };
        this.voidPackageVersion = Object.assign(voidPackageVersion_send, {
            call: voidPackageVersion_call
        });
        let voidProjectVersionParams = (params) => [this.wallet.utils.toString(params.projectId), this.wallet.utils.toString(params.versionIdx)];
        let voidProjectVersion_send = async (params, options) => {
            let result = await this.send('voidProjectVersion', voidProjectVersionParams(params), options);
            return result;
        };
        let voidProjectVersion_call = async (params, options) => {
            let result = await this.call('voidProjectVersion', voidProjectVersionParams(params), options);
            return;
        };
        this.voidProjectVersion = Object.assign(voidProjectVersion_send, {
            call: voidProjectVersion_call
        });
    }
}
exports.ProjectInfo = ProjectInfo;
ProjectInfo._abi = ProjectInfo_json_1.default.abi;
