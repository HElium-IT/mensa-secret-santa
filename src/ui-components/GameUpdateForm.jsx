/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getGame } from "./graphql/queries";
import { updateGame } from "./graphql/mutations";
const client = generateClient();
export default function GameUpdateForm(props) {
  const {
    id: idProp,
    game: gameModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    ownerId: "",
    name: "",
    description: "",
    secret: "",
    joinQrCode: "",
    phase: "",
  };
  const [ownerId, setOwnerId] = React.useState(initialValues.ownerId);
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [secret, setSecret] = React.useState(initialValues.secret);
  const [joinQrCode, setJoinQrCode] = React.useState(initialValues.joinQrCode);
  const [phase, setPhase] = React.useState(initialValues.phase);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = gameRecord
      ? { ...initialValues, ...gameRecord }
      : initialValues;
    setOwnerId(cleanValues.ownerId);
    setName(cleanValues.name);
    setDescription(cleanValues.description);
    setSecret(cleanValues.secret);
    setJoinQrCode(cleanValues.joinQrCode);
    setPhase(cleanValues.phase);
    setErrors({});
  };
  const [gameRecord, setGameRecord] = React.useState(gameModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getGame.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getGame
        : gameModelProp;
      setGameRecord(record);
    };
    queryData();
  }, [idProp, gameModelProp]);
  React.useEffect(resetStateValues, [gameRecord]);
  const validations = {
    ownerId: [{ type: "Required" }],
    name: [{ type: "Required" }],
    description: [{ type: "Required" }],
    secret: [{ type: "Required" }],
    joinQrCode: [],
    phase: [],
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
          ownerId,
          name,
          description,
          secret,
          joinQrCode: joinQrCode ?? null,
          phase: phase ?? null,
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
            query: updateGame.replaceAll("__typename", ""),
            variables: {
              input: {
                id: gameRecord.id,
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
      {...getOverrideProps(overrides, "GameUpdateForm")}
      {...rest}
    >
      <TextField
        label="Owner id"
        isRequired={true}
        isReadOnly={false}
        value={ownerId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerId: value,
              name,
              description,
              secret,
              joinQrCode,
              phase,
            };
            const result = onChange(modelFields);
            value = result?.ownerId ?? value;
          }
          if (errors.ownerId?.hasError) {
            runValidationTasks("ownerId", value);
          }
          setOwnerId(value);
        }}
        onBlur={() => runValidationTasks("ownerId", ownerId)}
        errorMessage={errors.ownerId?.errorMessage}
        hasError={errors.ownerId?.hasError}
        {...getOverrideProps(overrides, "ownerId")}
      ></TextField>
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerId,
              name: value,
              description,
              secret,
              joinQrCode,
              phase,
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
        label="Description"
        isRequired={true}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerId,
              name,
              description: value,
              secret,
              joinQrCode,
              phase,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="Secret"
        isRequired={true}
        isReadOnly={false}
        value={secret}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerId,
              name,
              description,
              secret: value,
              joinQrCode,
              phase,
            };
            const result = onChange(modelFields);
            value = result?.secret ?? value;
          }
          if (errors.secret?.hasError) {
            runValidationTasks("secret", value);
          }
          setSecret(value);
        }}
        onBlur={() => runValidationTasks("secret", secret)}
        errorMessage={errors.secret?.errorMessage}
        hasError={errors.secret?.hasError}
        {...getOverrideProps(overrides, "secret")}
      ></TextField>
      <TextField
        label="Join qr code"
        isRequired={false}
        isReadOnly={false}
        value={joinQrCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerId,
              name,
              description,
              secret,
              joinQrCode: value,
              phase,
            };
            const result = onChange(modelFields);
            value = result?.joinQrCode ?? value;
          }
          if (errors.joinQrCode?.hasError) {
            runValidationTasks("joinQrCode", value);
          }
          setJoinQrCode(value);
        }}
        onBlur={() => runValidationTasks("joinQrCode", joinQrCode)}
        errorMessage={errors.joinQrCode?.errorMessage}
        hasError={errors.joinQrCode?.hasError}
        {...getOverrideProps(overrides, "joinQrCode")}
      ></TextField>
      <SelectField
        label="Phase"
        placeholder="Please select an option"
        isDisabled={false}
        value={phase}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerId,
              name,
              description,
              secret,
              joinQrCode,
              phase: value,
            };
            const result = onChange(modelFields);
            value = result?.phase ?? value;
          }
          if (errors.phase?.hasError) {
            runValidationTasks("phase", value);
          }
          setPhase(value);
        }}
        onBlur={() => runValidationTasks("phase", phase)}
        errorMessage={errors.phase?.errorMessage}
        hasError={errors.phase?.hasError}
        {...getOverrideProps(overrides, "phase")}
      >
        <option
          children="Registration open"
          value="REGISTRATION_OPEN"
          {...getOverrideProps(overrides, "phaseoption0")}
        ></option>
        <option
          children="Lobby"
          value="LOBBY"
          {...getOverrideProps(overrides, "phaseoption1")}
        ></option>
        <option
          children="Started"
          value="STARTED"
          {...getOverrideProps(overrides, "phaseoption2")}
        ></option>
        <option
          children="Paused"
          value="PAUSED"
          {...getOverrideProps(overrides, "phaseoption3")}
        ></option>
        <option
          children="Finished"
          value="FINISHED"
          {...getOverrideProps(overrides, "phaseoption4")}
        ></option>
      </SelectField>
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
          isDisabled={!(idProp || gameModelProp)}
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
              !(idProp || gameModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
