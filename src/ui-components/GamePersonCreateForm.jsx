/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  SwitchField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createGamePerson } from "./graphql/mutations";
const client = generateClient();
export default function GamePersonCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    role: "",
    acceptedInvitation: false,
  };
  const [role, setRole] = React.useState(initialValues.role);
  const [acceptedInvitation, setAcceptedInvitation] = React.useState(
    initialValues.acceptedInvitation
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setRole(initialValues.role);
    setAcceptedInvitation(initialValues.acceptedInvitation);
    setErrors({});
  };
  const validations = {
    role: [],
    acceptedInvitation: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          role,
          acceptedInvitation,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createGamePerson.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "GamePersonCreateForm")}
      {...rest}
    >
      <SelectField
        label="Role"
        placeholder="Please select an option"
        isDisabled={false}
        value={role}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              role: value,
              acceptedInvitation,
            };
            const result = onChange(modelFields);
            value = result?.role ?? value;
          }
          if (errors.role?.hasError) {
            runValidationTasks("role", value);
          }
          setRole(value);
        }}
        onBlur={() => runValidationTasks("role", role)}
        errorMessage={errors.role?.errorMessage}
        hasError={errors.role?.hasError}
        {...getOverrideProps(overrides, "role")}
      >
        <option
          children="Creator"
          value="CREATOR"
          {...getOverrideProps(overrides, "roleoption0")}
        ></option>
        <option
          children="Admin"
          value="ADMIN"
          {...getOverrideProps(overrides, "roleoption1")}
        ></option>
        <option
          children="Player"
          value="PLAYER"
          {...getOverrideProps(overrides, "roleoption2")}
        ></option>
      </SelectField>
      <SwitchField
        label="Accepted invitation"
        defaultChecked={false}
        isDisabled={false}
        isChecked={acceptedInvitation}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              role,
              acceptedInvitation: value,
            };
            const result = onChange(modelFields);
            value = result?.acceptedInvitation ?? value;
          }
          if (errors.acceptedInvitation?.hasError) {
            runValidationTasks("acceptedInvitation", value);
          }
          setAcceptedInvitation(value);
        }}
        onBlur={() =>
          runValidationTasks("acceptedInvitation", acceptedInvitation)
        }
        errorMessage={errors.acceptedInvitation?.errorMessage}
        hasError={errors.acceptedInvitation?.hasError}
        {...getOverrideProps(overrides, "acceptedInvitation")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
