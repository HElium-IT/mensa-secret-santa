import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type GiftCreateFormInputValues = {
    ownerPersonId?: string;
    ownerGameId?: string;
    name?: string;
    attribute_1?: string;
    attribute_2?: string;
    attribute_3?: string;
    number?: number;
    isSelected?: boolean;
};
export declare type GiftCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    attribute_1?: ValidationFunction<string>;
    attribute_2?: ValidationFunction<string>;
    attribute_3?: ValidationFunction<string>;
    number?: ValidationFunction<number>;
    isSelected?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GiftCreateFormOverridesProps = {
    GiftCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    attribute_1?: PrimitiveOverrideProps<TextFieldProps>;
    attribute_2?: PrimitiveOverrideProps<TextFieldProps>;
    attribute_3?: PrimitiveOverrideProps<TextFieldProps>;
    number?: PrimitiveOverrideProps<TextFieldProps>;
    isSelected?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type GiftCreateFormProps = React.PropsWithChildren<{
    overrides?: GiftCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: GiftCreateFormInputValues) => GiftCreateFormInputValues;
    onSuccess?: (fields: GiftCreateFormInputValues) => void;
    onError?: (fields: GiftCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: GiftCreateFormInputValues) => GiftCreateFormInputValues;
    onValidate?: GiftCreateFormValidationValues;
} & React.CSSProperties>;
export default function GiftCreateForm(props: GiftCreateFormProps): React.ReactElement;
