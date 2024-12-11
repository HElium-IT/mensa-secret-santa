/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getPerson } from "./graphql/queries";
import { updatePerson } from "./graphql/mutations";
const client = generateClient();
export default function PersonUpdateForm(props) {
  const {
    ownerLoginId: ownerLoginIdProp,
    person: personModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    ownerLoginId: "",
    isAdmin: false,
  };
  const [ownerLoginId, setOwnerLoginId] = React.useState(
    initialValues.ownerLoginId
  );
  const [isAdmin, setIsAdmin] = React.useState(initialValues.isAdmin);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = personRecord
      ? { ...initialValues, ...personRecord }
      : initialValues;
    setOwnerLoginId(cleanValues.ownerLoginId);
    setIsAdmin(cleanValues.isAdmin);
    setErrors({});
  };
  const [personRecord, setPersonRecord] = React.useState(personModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = ownerLoginIdProp
        ? (
            await client.graphql({
              query: getPerson.replaceAll("__typename", ""),
              variables: { ownerLoginId: ownerLoginIdProp },
            })
          )?.data?.getPerson
        : personModelProp;
      setPersonRecord(record);
    };
    queryData();
  }, [ownerLoginIdProp, personModelProp]);
  React.useEffect(resetStateValues, [personRecord]);
  const validations = {
    ownerLoginId: [{ type: "Required" }],
    isAdmin: [],
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
          ownerLoginId,
          isAdmin: isAdmin ?? null,
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
            query: updatePerson.replaceAll("__typename", ""),
            variables: {
              input: {
                ownerLoginId: personRecord.ownerLoginId,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "PersonUpdateForm")}
      {...rest}
    >
      <TextField
        label="Owner login id"
        isRequired={true}
        isReadOnly={true}
        value={ownerLoginId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerLoginId: value,
              isAdmin,
            };
            const result = onChange(modelFields);
            value = result?.ownerLoginId ?? value;
          }
          if (errors.ownerLoginId?.hasError) {
            runValidationTasks("ownerLoginId", value);
          }
          setOwnerLoginId(value);
        }}
        onBlur={() => runValidationTasks("ownerLoginId", ownerLoginId)}
        errorMessage={errors.ownerLoginId?.errorMessage}
        hasError={errors.ownerLoginId?.hasError}
        {...getOverrideProps(overrides, "ownerLoginId")}
      ></TextField>
      <SwitchField
        label="Is admin"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isAdmin}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              ownerLoginId,
              isAdmin: value,
            };
            const result = onChange(modelFields);
            value = result?.isAdmin ?? value;
          }
          if (errors.isAdmin?.hasError) {
            runValidationTasks("isAdmin", value);
          }
          setIsAdmin(value);
        }}
        onBlur={() => runValidationTasks("isAdmin", isAdmin)}
        errorMessage={errors.isAdmin?.errorMessage}
        hasError={errors.isAdmin?.hasError}
        {...getOverrideProps(overrides, "isAdmin")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(ownerLoginIdProp || personModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(ownerLoginIdProp || personModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
