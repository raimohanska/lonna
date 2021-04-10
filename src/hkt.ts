export const HKT: unique symbol = null as any
                    
export interface HKT<SelfType> {
    [HKT]: SelfType
}