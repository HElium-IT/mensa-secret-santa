/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getGift } from "./graphql/queries";
import { updateGift } from "./graphql/mutations";
const client = generateClient();
export default function GiftUpdateForm(props) {
  const {
    ownedGamePersonId: ownedGamePersonIdProp,
    gift: giftModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    attribute_1: "",
    attribute_2: "",
    attribute_3: "",
    number: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [attribute_1, setAttribute_1] = React.useState(
    initialValues.attribute_1
  );
  const [attribute_2, setAttribute_2] = React.useState(
    initialValues.attribute_2
  );
  const [attribute_3, setAttribute_3] = React.useState(
    initialValues.attribute_3
  );
  const [number, setNumber] = React.useState(initialValues.number);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = giftRecord
      ? { ...initialValues, ...giftRecord }
      : initialValues;
    setName(cleanValues.name);
    setAttribute_1(cleanValues.attribute_1);
    setAttribute_2(cleanValues.attribute_2);
    setAttribute_3(cleanValues.attribute_3);
    setNumber(cleanValues.number);
    setErrors({});
  };
  const [giftRecord, setGiftRecord] = React.useState(giftModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = ownedGamePersonIdProp
        ? (
            await client.graphql({
              query: getGift.replaceAll("__typename", ""),
              variables: { ownedGamePersonId: ownedGamePersonIdProp },
            })
          )?.data?.getGift
        : giftModelProp;
      setGiftRecord(record);
    };
    queryData();
  }, [ownedGamePersonIdProp, giftModelProp]);
  React.useEffect(resetStateValues, [giftRecord]);
  const validations = {
    name: [{ type: "Required" }],
    attribute_1: [{ type: "Required" }],
    attribute_2: [{ type: "Required" }],
    attribute_3: [{ type: "Required" }],
    number: [],
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
          name,
          attribute_1,
          attribute_2,
          attribute_3,
          number: number ?? null,
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
            query: updateGift.replaceAll("__typename", ""),
            variables: {
              input: {
                ownedGamePersonId: giftRecord.ownedGamePersonId,
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
      {...getOverrideProps(overrides, "GiftUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              attribute_1,
              attribute_2,
              attribute_3,
              number,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Attribute 1"
        isRequired={true}
        isReadOnly={false}
        value={attribute_1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              attribute_1: value,
              attribute_2,
              attribute_3,
              number,
            };
            const result = onChange(modelFields);
            value = result?.attribute_1 ?? value;
          }
          if (errors.attribute_1?.hasError) {
            runValidationTasks("attribute_1", value);
          }
          setAttribute_1(value);
        }}
        onBlur={() => runValidationTasks("attribute_1", attribute_1)}
        errorMessage={errors.attribute_1?.errorMessage}
        hasError={errors.attribute_1?.hasError}
        {...getOverrideProps(overrides, "attribute_1")}
      ></TextField>
      <TextField
        label="Attribute 2"
        isRequired={true}
        isReadOnly={false}
        value={attribute_2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              attribute_1,
              attribute_2: value,
              attribute_3,
              number,
            };
            const result = onChange(modelFields);
            value = result?.attribute_2 ?? value;
          }
          if (errors.attribute_2?.hasError) {
            runValidationTasks("attribute_2", value);
          }
          setAttribute_2(value);
        }}
        onBlur={() => runValidationTasks("attribute_2", attribute_2)}
        errorMessage={errors.attribute_2?.errorMessage}
        hasError={errors.attribute_2?.hasError}
        {...getOverrideProps(overrides, "attribute_2")}
      ></TextField>
      <TextField
        label="Attribute 3"
        isRequired={true}
        isReadOnly={false}
        value={attribute_3}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              attribute_1,
              attribute_2,
              attribute_3: value,
              number,
            };
            const result = onChange(modelFields);
            value = result?.attribute_3 ?? value;
          }
          if (errors.attribute_3?.hasError) {
            runValidationTasks("attribute_3", value);
          }
          setAttribute_3(value);
        }}
        onBlur={() => runValidationTasks("attribute_3", attribute_3)}
        errorMessage={errors.attribute_3?.errorMessage}
        hasError={errors.attribute_3?.hasError}
        {...getOverrideProps(overrides, "attribute_3")}
      ></TextField>
      <TextField
        label="Number"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={number}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              attribute_1,
              attribute_2,
              attribute_3,
              number: value,
            };
            const result = onChange(modelFields);
            value = result?.number ?? value;
          }
          if (errors.number?.hasError) {
            runValidationTasks("number", value);
          }
          setNumber(value);
        }}
        onBlur={() => runValidationTasks("number", number)}
        errorMessage={errors.number?.errorMessage}
        hasError={errors.number?.hasError}
        {...getOverrideProps(overrides, "number")}
      ></TextField>
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
          isDisabled={!(ownedGamePersonIdProp || giftModelProp)}
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
              !(ownedGamePersonIdProp || giftModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
