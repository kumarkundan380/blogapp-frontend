export interface Address {

    readonly addressId?: number;  // ID should be immutable
    addressLine1: string;
    addressLine2?: string;  // Optional (backend allows null)
    city: string;
    state: string;
    country: string;
    postalCode: string;
    version?: number;
    
}
