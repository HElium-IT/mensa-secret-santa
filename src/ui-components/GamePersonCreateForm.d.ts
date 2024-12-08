import * as React from "react";
import { GridProps, SelectFieldProps, SwitchFieldProps } from "@aws-amplify/ui-react";
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
export declare type GamePersonCreateFormInputValues = {
    role?: string;
    acceptedInvitation?: boolean;
};
export declare type GamePersonCreateFormValidationValues = {
    role?: ValidationFunction<string>;
    acceptedInvitation?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GamePersonCreateFormOverridesProps = {
    GamePersonCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    role?: PrimitiveOverrideProps<SelectFieldProps>;
    acceptedInvitation?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type GamePersonCreateFormProps = React.PropsWithChildren<{
    overrides?: GamePersonCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: GamePersonCreateFormInputValues) => GamePersonCreateFormInputValues;
    onSuccess?: (fields: GamePersonCreateFormInputValues) => void;
    onError?: (fields: GamePersonCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: GamePersonCreateFormInputValues) => GamePersonCreateFormInputValues;
    onValidate?: GamePersonCreateFormValidationValues;
} & React.CSSProperties>;
export default function GamePersonCreateForm(props: GamePersonCreateFormProps): React.ReactElement;
