import { IWallet } from "@ijstech/eth-contract";
import * as Contracts from "./contracts/index";
export { Contracts };
export interface IDeployOptions {
    token: {
        address?: string;
        minter?: string;
        initSupplyTo?: string;
        initSupply?: string;
        totalSupply?: string;
    };
    auditorInfo: {
        cooldownPeriod: number;
        auditors?: string[];
    };
    projectInfo: {
        admins: string[];
    };
}
export interface IDeployResult {
    token: string;
    domain: string;
    auditor: string;
    project: string;
}
export declare var DefaultDeployOptions: IDeployOptions;
export declare function deploy(wallet: IWallet, Config: IDeployOptions, onProgress: (msg: string) => void): Promise<IDeployResult>;
declare const _default: {
    Contracts: typeof Contracts;
    deploy: typeof deploy;
    DefaultDeployOptions: IDeployOptions;
};
export default _default;
