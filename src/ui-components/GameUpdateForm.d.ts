import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Game } from "./graphql/types";
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
export declare type GameUpdateFormInputValues = {
    creatorId?: string;
    name?: string;
    description?: string;
    secret?: string;
    joinQrCode?: string;
    phase?: string;
};
export declare type GameUpdateFormValidationValues = {
    creatorId?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    secret?: ValidationFunction<string>;
    joinQrCode?: ValidationFunction<string>;
    phase?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GameUpdateFormOverridesProps = {
    GameUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    creatorId?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    secret?: PrimitiveOverrideProps<TextFieldProps>;
    joinQrCode?: PrimitiveOverrideProps<TextFieldProps>;
    phase?: PrimitiveOverrideProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type GameUpdateFormProps = React.PropsWithChildren<{
    overrides?: GameUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    game?: Game;
    onSubmit?: (fields: GameUpdateFormInputValues) => GameUpdateFormInputValues;
    onSuccess?: (fields: GameUpdateFormInputValues) => void;
    onError?: (fields: GameUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: GameUpdateFormInputValues) => GameUpdateFormInputValues;
    onValidate?: GameUpdateFormValidationValues;
} & React.CSSProperties>;
export default function GameUpdateForm(props: GameUpdateFormProps): React.ReactElement;
