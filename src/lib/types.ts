export interface PopupComponent {
    open: () => void,
    close: () => void
}

export interface IVariant {
    id: number
    saveDate: string
    c4: number
    c5: number
    c6: number
    c7: number
    c8: number
    c9: number
    c10: number
    c11: number
    c12: number
    c13: number
    c14: number
    c15: number
    c18: number
    c19: number
    c20: number
    c21: number
    c22: number
    c23: number
    c24: number
    c25: number
    c28: number
    c29: number
    c30: number
    c31: number
    c32: number
    c33: number
    c34: number
    c35: number
    c36: number
    c37: number
    c38: number
    c39: number
    c40: number
    c41: number
    c42: number
    c43: number
    c44: number
    c45: number
    c47: number
    c49: number
    c52: number
    c56: number
    c57: number
    c58: number
    c59: number
    c60: number
    c61: number
    c62: number
    c63: number
    c64: number
    c65: number
    c67: number
    c68: number
    c69: number
    i40: number
    j40: number
    k40: number
    l40: number
    m40: number
    i45: number
    j45: number
    k45: number
    l45: number
    j50: number
    k50: number
    l50: number
}

export interface IResult {
    c3: number
    c16: number
    c17: number
    c26: number
    c27: number
    c48: number
    c50: number
    c51: number
    c53: number
    c54: number
    c55: number
    n40: number
    m45: number
    m50: number
    h41: number
    h46: number
    h51: number
    b_C3: number
    b_C4: number
    b_C5: number
    b_C6: number
    b_C7: number
    b_C8: number
    b_C9: number
    b_C10: number
    b_C11: number
    b_C12: number
    b_C13: number
    b_C14: number
    b_C15: number
    b_C16: number
    b_C17: number
    b_C18: number
    b_C19: number
    b_C20: number
    b_C21: number
    b_C22: number
    b_C23: number
    b_C24: number
    b_C25: number
    b_C26: number
    b_C27: number
    b_C28: number
    b_C29: number
    b_C30: number
    b_C31: number
    b_C32: number
    b_C33: number
    b_C34: number
    b_C35: number
    b_C36: number
    b_C37: number
    b_C38: number
    b_C39: number
    b_C40: number
    b_C41: number
    b_C42: number
    b_C43: number
    b_C44: number
    b_C45: number
    b_C46: number
    b_C47: number
    b_C48: number
    b_C49: number
    b_C50: number
    b_C51: number
    b_C52: number
    b_C53: number
    b_C54: number
    b_C55: number
    b_C56: number
    b_C57: number
    b_C58: number
    b_C59: number
    b_C60: number
    b_C61: number
    b_C62: number
    b_C63: number
    b_C64: number
    b_C65: number
    b_C66: number
    b_C67: number
    b_C68: number
    b_C69: number
    b_C70: number
    b_C71: number
    b_C72: number
    b_C73: number
    b_C74: number
    b_C75: number
    b_C76: number
    b_C77: number
    b_C78: number
    b_C79: number
    b_C80: number
    b_C81: number
    b_C82: number
    b_C83: number
    b_C84: number
    b_C85: number
    b_C86: number
    b_C87: number
    b_C88: number
    b_C89: number
    b_C90: number
    b_C91: number
    b_C92: number
    b_C93: number
    b_C94: number
    b_C95: number
    b_C96: number
    b_C97: number
    b_C98: number
    b_C99: number
    b_C100: number
    b_C101: number
    b_C102: number
    b_C103: number
    b_C104: number
    b_C105: number
    b_C106: number
    b_C110: number
    b_C111: number
    b_C112: number
    b_C113: number
    b_C114: number
    b_C115: number
    b_C116: number
    b_C117: number
    b_C118: number
    b_C119: number
    b_E46: number
    b_E47: number
    b_G48: number
}

export interface IFullResult {
    inputData: IVariant
    resultData: IResult
}

export interface IFullProgResult {
    inputData: IVariant
    resultData: IResult
    inputProgData: any
    resultProgData: any
}

export interface IUnionFullResult {
    baseResult: IFullResult
    comparativeResult: IFullResult
}

export interface IUnionProgFullResult {
    baseResult: IFullProgResult
    comparativeResult: IFullProgResult
}

export interface ICoefficients {
    ironMassFractionIncreaseInOreRash: number
    shareCrudeOreReductionCharge: number
    temperatureIncreaseInRangeOf800to900: number
    temperatureIncreaseInRangeOf901to1000: number
    temperatureIncreaseInRangeOf1001to1100: number
    temperatureIncreaseInRangeOf1101to1200: number
    increaseGasPressureUnderGrate: number
    reductionMassFractionOfSiliciumInChugun: number
    reductionMassFractionOfSeraInChugun: number
    increaseMassFractionOfPhosphorusInChugun: number
    increaseMassFractionOfManganeseInChugun: number
    increaseMassFractionOfTitanInChugun: number
    increaseBlastHumidity: number
    increaseNaturalGasCunsimption: number
    outputFromLimestoneCharge: number
    increaseVolumeFractionOxygenInBlast: number
    reductionMassFractionTrifles: number
    reductionMassFractionAshInCokeInRangeOf11to12Percent: number
    reductionMassFractionAshInCokeInRangeOf12to13Percent: number
    reductionMassFractionOfSera: number
}

export interface IReference {
    cokeCunsumptionReference: ICoefficients
    furnaceCapacityReference: ICoefficients
}

export interface IMaterial {
    id: number;
    name: string
    moisture: number
    fe2O3: number
    fe: number
    feO: number
    caO: number
    siO2: number
    mgO: number
    al2O3: number
    tiO2: number
    mnO: number
    p: number
    s: number
    zn: number
    mn: number
    cr: number
    fiveZero: number
    baseOne: number
}

export interface IModal {
    open: () => void,
    close: () => void,
    toggle: () => void
}

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface IResponse {
    success: boolean
    errorMsg: string
    code: number
    successMsg: string
    result: any
}