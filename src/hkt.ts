// For HKT type inference (to fool TS compiler):
// this symbol does not actually exist!!
export declare const HKT: unique symbol
                    
export interface HKT<SelfType> {
    [HKT]: SelfType
}