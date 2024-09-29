import { Types } from "mongoose"
import { ErrorMessages } from "../Error/ErrorsEnum"

const RequiredString = {
    type: String,
    required: true,
}

const RequiredUniqueString = {
    type: String,
    required: true,
    unique: true,
}

const NotRequiredString = {
    type: String,
    default: ""
}

const RequiredBoolean = {
    type: Boolean,
    required: true,
    default: false,
}

const RequiredNumber = {
    type: Number,
    required: true
}

const RequiredSpecificNumber = (specificNumber: number) => {
    return {
        type: Number,
        required: true,
        default: specificNumber
    }
}

const RequiredUniqueNumber = {
    type: Number,
    required: true,
    unique: true

}

const NotRequiredNumber = {
    type: Number
}

const RefType = (ref: string, required: boolean) => {
    return {
        type: Types.ObjectId,
        required,
        ref,
        default: null
    }
}

const StringValidation = (validation: RegExp, message: string) => {
    return {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return validation.test(v);
            },
            message
        }
    }
}



const EnumStringRequired = (enumValues: Array<string>, index: number = 0) => {
    return {
        type: String,
        required: true,
        enum: enumValues,
        default: enumValues[index]
    }
}

const EnumStringNotRequired = (enumValues: Array<string>) => {
    return {
        type: String,
        required: false,
        enum: enumValues,
        default: null
    }
}

export {
    RequiredString,
    NotRequiredString,
    RequiredBoolean,
    RequiredNumber,
    NotRequiredNumber,
    RequiredUniqueString,
    RequiredUniqueNumber,
    RequiredSpecificNumber,
    RefType,
    StringValidation,
    EnumStringRequired,
    EnumStringNotRequired
}