import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Gift } from "./graphql/types";
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
export declare type GiftUpdateFormInputValues = {
    ownerGamePersonId?: string;
    winnerGamePersonId?: string;
    name?: string;
    attribute_1?: string;
    attribute_2?: string;
    attribute_3?: string;
    number?: number;
};
export declare type GiftUpdateFormValidationValues = {
    ownerGamePersonId?: ValidationFunction<string>;
    winnerGamePersonId?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    attribute_1?: ValidationFunction<string>;
    attribute_2?: ValidationFunction<string>;
    attribute_3?: ValidationFunction<string>;
    number?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GiftUpdateFormOverridesProps = {
    GiftUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    ownerGamePersonId?: PrimitiveOverrideProps<TextFieldProps>;
    winnerGamePersonId?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    attribute_1?: PrimitiveOverrideProps<TextFieldProps>;
    attribute_2?: PrimitiveOverrideProps<TextFieldProps>;
    attribute_3?: PrimitiveOverrideProps<TextFieldProps>;
    number?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type GiftUpdateFormProps = React.PropsWithChildren<{
    overrides?: GiftUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    gift?: Gift;
    onSubmit?: (fields: GiftUpdateFormInputValues) => GiftUpdateFormInputValues;
    onSuccess?: (fields: GiftUpdateFormInputValues) => void;
    onError?: (fields: GiftUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: GiftUpdateFormInputValues) => GiftUpdateFormInputValues;
    onValidate?: GiftUpdateFormValidationValues;
} & React.CSSProperties>;
export default function GiftUpdateForm(props: GiftUpdateFormProps): React.ReactElement;
