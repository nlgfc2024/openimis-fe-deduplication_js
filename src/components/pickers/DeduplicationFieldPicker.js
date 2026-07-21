import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations, Autocomplete } from "@openimis/fe-core";
import { fetchIndividualBasicFields } from "../../actions";

function DeduplicationFieldPicker({
  readOnly,
  benefitPlan,
  value,
  onChange,
  required,
  multiple = true,
  placeholder,
  withLabel,
  withPlaceholder,
  label,
  filterOptions,
  filterSelectedOptions,
}) {
  const dispatch = useDispatch();
  const individualBasicFields = useSelector(
    (state) => state.deduplication.individualBasicFields ?? [],
  );
  const fetchingIndividualBasicFields = useSelector(
    (state) => state.deduplication.fetchingIndividualBasicFields,
  );

  useEffect(() => {
    if (!fetchingIndividualBasicFields && individualBasicFields.length === 0) {
      dispatch(fetchIndividualBasicFields());
    }
  }, [dispatch, fetchingIndividualBasicFields, individualBasicFields.length]);

  const [searchString, setSearchString] = useState();
  const { formatMessage } = useTranslations("deduplication");

  const beneficiaryDataSchema = JSON.parse(benefitPlan?.beneficiaryDataSchema);
  const schemaFields = Object.keys(beneficiaryDataSchema?.properties ?? {});
  const schemaFieldsList = schemaFields.map((key) => ({ id: key, name: key }));
  const possibleFields = [...schemaFieldsList, ...individualBasicFields];

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={
        placeholder ??
        formatMessage("deduplication.deduplicate.fields.placeholder")
      }
      label={label ?? formatMessage("deduplication.deduplicate.fields")}
      error={[]}
      withLabel={withLabel}
      withPlaceholder={withPlaceholder}
      readOnly={readOnly}
      options={possibleFields}
      isLoading={false}
      value={value}
      getOptionLabel={(o) => o?.name}
      onChange={(option) => onChange(option, option?.name)}
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={() => setSearchString(searchString)}
    />
  );
}

export default DeduplicationFieldPicker;
