declare namespace API {
    export interface Gold {
        id: string;
        name?: string;
        imgUrl?: string;
        gold?: number;
        interval?: any;
        timeout?: number;
        finish: boolean;
        expireGold?: number;
    }
    export interface GoldData {
        data: Gold;
        msg?: string;
        code: string;
    }
    export interface Direction {
        name: string;
        value: string;
    }
    export interface ContractType {
        name: string;
        value: string;
    }
    export interface Position {
        name: string;
        status: string;
        directions: Direction[];
        contractTypes: ContractType[];
        icon?: any;
    }
    export interface PositionData {
        data: Position[];
        code: string;
    }
}