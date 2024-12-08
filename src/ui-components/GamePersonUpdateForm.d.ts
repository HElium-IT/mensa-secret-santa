import * as React from "react";
import { GridProps, SelectFieldProps, SwitchFieldProps } from "@aws-amplify/ui-react";
import { GamePerson } from "./graphql/types";
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
export declare type GamePersonUpdateFormInputValues = {
    role?: string;
    acceptedInvitation?: boolean;
};
export declare type GamePersonUpdateFormValidationValues = {
    role?: ValidationFunction<string>;
    acceptedInvitation?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GamePersonUpdateFormOverridesProps = {
    GamePersonUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    role?: PrimitiveOverrideProps<SelectFieldProps>;
    acceptedInvitation?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type GamePersonUpdateFormProps = React.PropsWithChildren<{
    overrides?: GamePersonUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    gamePerson?: GamePerson;
    onSubmit?: (fields: GamePersonUpdateFormInputValues) => GamePersonUpdateFormInputValues;
    onSuccess?: (fields: GamePersonUpdateFormInputValues) => void;
    onError?: (fields: GamePersonUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: GamePersonUpdateFormInputValues) => GamePersonUpdateFormInputValues;
    onValidate?: GamePersonUpdateFormValidationValues;
} & React.CSSProperties>;
export default function GamePersonUpdateForm(props: GamePersonUpdateFormProps): React.ReactElement;
