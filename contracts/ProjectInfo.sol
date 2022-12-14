// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.13;

import "./Authorization.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./AuditorInfo.sol";

contract ProjectInfo is Authorization, ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum ProjectStatus {INACTIVE, ACTIVE}
    enum PackageStatus {INACTIVE, ACTIVE}
    enum PackageVersionStatus {AUDITING, AUDIT_PASSED, AUDIT_FAILED, VOIDED}

    struct ProjectVersion {
        uint256 projectId;
        uint256 version;
        string ipfsCid;
        ProjectStatus status;
        uint64 lastModifiedDate;
    }
    struct Package {
        uint256 projectId;
        uint256 currVersionIndex;
        PackageStatus status;
        string ipfsCid;
    }
    struct SemVer {
        uint256 major;
        uint256 minor;
        uint256 patch;        
    }
    struct PackageVersion {
        uint256 packageId;
        SemVer version;
        PackageVersionStatus status;
        string ipfsCid;
        string reportUri;
    }
    
    IERC20 public immutable token;
    AuditorInfo public auditorInfo;
    // active package list
    uint256 public projectCount;

    mapping(uint256 => uint256) public projectBalance; //projectBalance[projectId] = amount
    mapping(address => mapping(uint256 => uint256)) public projectBackerBalance; //projectBackerBalance[staker][projectId] = amount
    
    // project <-> owner / admin
    mapping(uint256 => address) public projectOwner; // projectOwner[projectId] = owner
    mapping(address => uint256[]) public ownersProjects; // ownersProjects[owner][ownersProjectsIdx] = projectId
    mapping(address => mapping(uint256 => uint256)) public ownersProjectsInv; // ownersProjectsInv[owner][projectId] = ownersProjectsIdx
    mapping(uint256 => address) public projectNewOwner; // projectNewOwner[projectId] = newOwner
    mapping(uint256 => address[]) public projectAdmin; // projectAdmin[projectId][idx] = admin
    mapping(uint256 => mapping(address => uint256)) public projectAdminInv; // projectAdminInv[projectId][admin] = idx

    // project meta
    ProjectVersion[] public projectVersions; // projectVersions[projectVersionIdx] = {projectId, version, ipfsCid, PackageVersionStatus}
    mapping(string => uint256) public projectVersionsInv; // projectVersionsInv[ipfsCid] = projectVersionIdx;
    mapping(uint256 => uint256) public projectCurrentVersion; // projectCurrentVersion[projectId] = projectVersionIdx;
    mapping(uint256 => uint256[]) public projectVersionList; // projectVersionList[projectId][idx] = projectVersionIdx

    // package
    Package[] public packages; // packages[packageId] = {projectId, currVersionIndex, status}
    PackageVersion[] public packageVersions; // packageVersions[packageVersionsId] = {packageId, version, status, ipfsCid}
    mapping(uint256 => uint256[]) public packageVersionsList; // packageVersionsList[packageId][idx] = packageVersionsId
    mapping(uint256 => PackageVersion) public latestAuditedPackageVersion; // latestAuditedPackageVersion[packageId] = {packageId, version, status, ipfsCid}

    // project <-> package
    mapping(uint256 => uint256[]) public projectPackages; // projectPackages[projectId][projectPackagesIdx] = packageId
    mapping(uint256 => mapping(uint256 => uint256)) public projectPackagesInv; // projectPackagesInv[projectId][packageId] = projectPackagesIdx

    event NewProject(uint256 indexed projectId, address indexed owner);
    event NewProjectVersion(uint256 indexed projectId, uint256 indexed projectVersionIdx, string ipfsCid);
    event VoidProjectVersion(uint256 indexed projectVersionIdx);
    event SetProjectCurrentVersion(uint256 indexed projectId, uint256 indexed projectVersionIdx);
    
    event TransferProjectOwnership(uint256 indexed projectId, address indexed newOwner);
    event AddAdmin(uint256 indexed projectId, address indexed admin);
    event RemoveAdmin(uint256 indexed projectId, address indexed admin);

    event NewPackage(uint256 indexed projectId, uint256 indexed packageId, string ipfsCid);
    event UpdatePackageIpfsCid(uint256 indexed packageId, string ipfsCid);
    event NewPackageVersion(uint256 indexed packageId, uint256 indexed packageVersionId, SemVer version);
    event SetPackageVersionStatus(uint256 indexed packageId, uint256 indexed packageVersionId, PackageVersionStatus status);
    // event AddProjectPackage(uint256 indexed projectId, uint256 indexed packageId);
    // event RemoveProjectPackage(uint256 indexed projectId, uint256 indexed packageId);

    event Stake(address indexed sender, uint256 indexed projectId, uint256 amount, uint256 newBalance);
    event Unstake(address indexed sender, uint256 indexed projectId, uint256 amount, uint256 newBalance);

    constructor(IERC20 _token, AuditorInfo _auditorInfo) {
        token = _token;
        auditorInfo = _auditorInfo;
    }

    modifier onlyProjectOwner(uint256 projectId) {
        require(projectOwner[projectId] == msg.sender, "not from owner");
        _;
    }

    modifier isProjectAdminOrOwner(uint256 projectId) {
        require(projectAdmin[projectId].length > 0 &&  
            projectAdmin[projectId][projectAdminInv[projectId][msg.sender]] == msg.sender 
            || projectOwner[projectId] == msg.sender
        , "not from admin");
        _;
    }

    modifier onlyActiveAuditor {
        require(auditorInfo.isActiveAuditor(msg.sender), "not from active auditor");
        _;
    }

    function ownersProjectsLength(address owner) external view returns (uint256 length) {
        length = ownersProjects[owner].length;
    }
    function projectAdminLength(uint256 projectId) external view returns (uint256 length) {
        length = projectAdmin[projectId].length;
    }
    function projectVersionsLength() external view returns (uint256 length) {
        length = projectVersions.length;
    }
    function projectVersionListLength(uint256 projectId) external view returns (uint256 length) {
        length = projectVersionList[projectId].length;
    }
    function packagesLength() external view returns (uint256 length) {
        length = packages.length;
    }
    function packageVersionsLength() external view returns (uint256 length) {
        length = packageVersions.length;
    }
    function packageVersionsListLength(uint256 packageId) external view returns (uint256 length) {
        length = packageVersionsList[packageId].length;
    }
    function projectPackagesLength(uint256 projectId) external view returns (uint256 length) {
        length = projectPackages[projectId].length;
    }

    //
    // functions called by project owners
    //
    function newProject(string calldata ipfsCid) external returns (uint256 projectId) {
        projectId = projectCount;
        projectOwner[projectId] = msg.sender;
        ownersProjectsInv[msg.sender][projectId] = ownersProjects[msg.sender].length;
        ownersProjects[msg.sender].push(projectId);
        projectCount++;
        emit NewProject(projectId, msg.sender);
        uint256 versionIdx = newProjectVersion(projectId, ipfsCid);
        projectCurrentVersion[projectId] = versionIdx;
    }
    function _removeProjectFromOwner(address owner, uint256 projectId) internal {
        // make sure the project ownership is checked !
        uint256 idx = ownersProjectsInv[owner][projectId];
        uint256 lastIdx = ownersProjects[owner].length - 1;
        if (idx < lastIdx) {
            uint256 lastProjectId = ownersProjects[owner][lastIdx];
            ownersProjectsInv[owner][lastProjectId] = idx;
            ownersProjects[owner][idx] = lastProjectId;
        }
        delete ownersProjectsInv[owner][projectId];
        ownersProjects[owner].pop();
    }
    function transferProjectOwnership(uint256 projectId, address newOwner) external onlyProjectOwner(projectId) {
        
        projectNewOwner[projectId] = newOwner;
    }
    function takeProjectOwnership(uint256 projectId) external {
        require(projectNewOwner[projectId] == msg.sender, "not from new owner");
        address prevOwner = projectOwner[projectId];
        projectOwner[projectId] = msg.sender;
        projectNewOwner[projectId] = address(0);

        _removeProjectFromOwner(prevOwner, projectId);

        emit TransferProjectOwnership(projectId, msg.sender);
    }
    function addProjectAdmin(uint256 projectId, address admin) external onlyProjectOwner(projectId) {
        require(projectAdmin[projectId].length == 0 || projectAdmin[projectId][projectAdminInv[projectId][admin]] != admin, "already a admin");
        projectAdminInv[projectId][admin] = projectAdmin[projectId].length;
        projectAdmin[projectId].push(admin);

        emit AddAdmin(projectId, admin);
    }
    function removeProjectAdmin(uint256 projectId, address admin) external onlyProjectOwner(projectId) {
        uint256 idx = projectAdminInv[projectId][admin];
        uint256 lastIdx = projectAdmin[projectId].length - 1;
        if (idx < lastIdx) {
            address lastAdmin = projectAdmin[projectId][lastIdx];
            projectAdminInv[projectId][lastAdmin] = idx;
            projectAdmin[projectId][idx] = lastAdmin;
        }
        delete projectAdminInv[projectId][admin];
        projectAdmin[projectId].pop();

        emit RemoveAdmin(projectId, admin);
    }
    function newProjectVersion(uint256 projectId, string calldata ipfsCid) public isProjectAdminOrOwner(projectId) returns (uint256 versionIdx) {
        versionIdx = projectVersions.length;
        projectVersionList[projectId].push(versionIdx); // start from 0

        projectVersionsInv[ipfsCid] = versionIdx;
        projectVersions.push(ProjectVersion({
            projectId: projectId,
            version: projectVersionList[projectId].length, // start from 1
            ipfsCid: ipfsCid,
            status: ProjectStatus.ACTIVE,
            lastModifiedDate: uint64(block.timestamp)
        }));
        emit NewProjectVersion(projectId, versionIdx, ipfsCid);
    }
    function setProjectCurrentVersion(uint256 projectId, uint256 versionIdx) external isProjectAdminOrOwner(projectId) {
        require(versionIdx < projectVersions.length, "project not exist");
        ProjectVersion storage version = projectVersions[versionIdx];
        require(version.projectId == projectId, "projectId/versionIdx not match");
        require(version.status == ProjectStatus.ACTIVE, "project not active");
        projectCurrentVersion[projectId] = versionIdx;
        emit SetProjectCurrentVersion(projectId, versionIdx);
    }
    function voidProjectVersion(uint256 projectId, uint256 versionIdx) external isProjectAdminOrOwner(projectId) {
        require(versionIdx < projectVersions.length, "project not exist");
        ProjectVersion storage version = projectVersions[versionIdx];
        require(version.projectId == projectId, "projectId/versionIdx not match");
        version.status = ProjectStatus.INACTIVE;
        version.lastModifiedDate = uint64(block.timestamp);
        emit VoidProjectVersion(versionIdx);
    }
    function newPackage(uint256 projectId, string calldata ipfsCid) external isProjectAdminOrOwner(projectId) returns (uint256 packageId) {
        packageId = packages.length;
        packages.push(Package({
            projectId: projectId,
            currVersionIndex: 0,
            status: PackageStatus.ACTIVE,
            ipfsCid: ipfsCid
        }));
        projectPackages[projectId].push(packageId);
        emit NewPackage(projectId, packageId, ipfsCid);
    }
    function updatePackageIpfsCid(uint256 projectId, uint256 packageId, string calldata ipfsCid) external isProjectAdminOrOwner(projectId) {
        require(packageId < packages.length, "invalid packageId");
        Package storage package = packages[packageId];
        require(package.projectId == projectId, "projectId/packageId not match");
        package.ipfsCid = ipfsCid;
        emit UpdatePackageIpfsCid(packageId, ipfsCid);
    }

    function newPackageVersion(uint256 projectId, uint256 packageId, SemVer memory version, string calldata ipfsCid) public isProjectAdminOrOwner(projectId) returns (uint256 packageVersionId) {
        require(packageId < packages.length, "invalid packageId");
        require(packages[packageId].projectId == projectId, "projectId/packageId not match");
        uint256 versionsLength = packageVersionsList[packageId].length;
        if (versionsLength > 0) {
            uint256 lastVersionId = packageVersionsList[packageId][versionsLength - 1];
            PackageVersion memory lastPackageVersion = packageVersions[lastVersionId];
            if (lastPackageVersion.version.major == version.major) {
                if (lastPackageVersion.version.minor == version.minor) {
                    require(version.patch > lastPackageVersion.version.patch, "patch version must be bumped");
                }
                else {
                    require(version.minor > lastPackageVersion.version.minor, "minor version must be bumped");
                }
            }
            else {
                require(version.major > lastPackageVersion.version.major, "major version must be bumped");
            }
        }        
        packageVersionId = packageVersions.length;
        packageVersionsList[packageId].push(packageVersionId);
        packageVersions.push(PackageVersion({
            packageId: packageId,
            version: version,
            status: PackageVersionStatus.AUDITING,
            ipfsCid: ipfsCid,
            reportUri: ""
        }));

        emit NewPackageVersion(packageId, packageVersionId, version);
    }

    function _setPackageVersionStatus(PackageVersion storage packageVersion, uint256 packageVersionId, PackageVersionStatus status) internal {
        packageVersion.status = status;
        emit SetPackageVersionStatus(packageVersion.packageId, packageVersionId, status);
    }

    function voidPackageVersion(uint256 packageVersionId) external {
        require(packageVersionId < packageVersions.length, "invalid packageVersionId");
        PackageVersion storage packageVersion = packageVersions[packageVersionId];
        require(packageVersion.status != PackageVersionStatus.VOIDED, "already voided");
        require(packageVersion.status != PackageVersionStatus.AUDIT_PASSED, "Audit passed version cannot be voided");
        _setPackageVersionStatus(packageVersion, packageVersionId, PackageVersionStatus.VOIDED);
    }
    function setPackageVersionToAuditPassed(uint256 packageVersionId, string calldata reportUri) external onlyActiveAuditor {
        require(packageVersionId < packageVersions.length, "invalid packageVersionId");
        PackageVersion storage packageVersion = packageVersions[packageVersionId];
        require(packageVersion.status == PackageVersionStatus.AUDITING, "not under auditing");
        latestAuditedPackageVersion[packageVersion.packageId] = packageVersion;
        packageVersion.reportUri = reportUri;
        _setPackageVersionStatus(packageVersion, packageVersionId, PackageVersionStatus.AUDIT_PASSED);
    } 
    function setPackageVersionToAuditFailed(uint256 packageVersionId, string calldata reportUri) external onlyActiveAuditor {
        require(packageVersionId < packageVersions.length, "invalid packageVersionId");
        PackageVersion storage packageVersion = packageVersions[packageVersionId];
        require(packageVersion.status == PackageVersionStatus.AUDITING, "not under auditing");
        packageVersion.reportUri = reportUri;
        _setPackageVersionStatus(packageVersion, packageVersionId, PackageVersionStatus.AUDIT_FAILED);
    }         
    // function addProjectPackage(uint256 projectId, uint256 packageId) external isProjectAdminOrOwner(projectId) {
    //     require(packageId < packages.length, "invalid packageId");
    //     projectPackagesInv[projectId][packageId] = projectPackages[projectId].length;
    //     projectPackages[projectId].push(packageId);

    //     emit AddProjectPackage(projectId, packageId);
    // }
    // function removeProjectPackage(uint256 projectId, uint256 packageId) external isProjectAdminOrOwner(projectId) {
    //     uint256 idx = projectPackagesInv[projectId][packageId];
    //     uint256 lastIdx = projectPackages[projectId].length - 1;
    //     if (idx < lastIdx) {
    //         uint256 lastPackageId = projectPackages[projectId][lastIdx];
    //         projectPackagesInv[projectId][lastPackageId] = idx;
    //         projectPackages[projectId][idx] = lastPackageId;
    //     }
    //     delete projectPackagesInv[projectId][packageId];
    //     projectPackages[projectId].pop();

    //     emit RemoveProjectPackage(projectId, packageId);        
    // }

    function stake(uint256 projectId, uint256 amount) external nonReentrant {
        require(amount > 0, "amount = 0");
        amount = _transferTokenFrom(amount);
        uint256 newBalance = projectBackerBalance[msg.sender][projectId] + amount;
        projectBackerBalance[msg.sender][projectId] = newBalance;
        projectBalance[projectId] += amount;
        emit Stake(msg.sender, projectId, amount, newBalance);
    }

    function unstake(uint256 projectId, uint256 amount) external nonReentrant {
        require(amount > 0, "amount = 0");
        uint256 newBalance = projectBackerBalance[msg.sender][projectId] - amount;
        projectBackerBalance[msg.sender][projectId] = newBalance;
        projectBalance[projectId] -= amount;
        token.safeTransfer(msg.sender, amount);
        emit Unstake(msg.sender, projectId, amount, newBalance);
    }

    function _transferTokenFrom(uint amount) internal returns (uint256 balance) {
        balance = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), amount);
        balance = token.balanceOf(address(this)) - balance;
    }
}