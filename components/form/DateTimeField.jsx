import * as React from 'react';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from '@material-ui/pickers';
import { getIn } from 'formik';

export const fieldToTextField = ({
  field,
  form,
  disabled,
  ...props
}) => {
  const { name } = field;
  const { touched, errors, isSubmitting } = form;

  const fieldError = getIn(errors, name);
  const showError = getIn(touched, name) && !!fieldError;

  return {
    ...props,
    ...field,
    error: showError,
    helperText: showError ? fieldError : props.helperText,
    disabled: disabled !== undefined ? disabled : isSubmitting,
    onChange: (value) => { form.setFieldValue(field.name, value); },
  };
};

export const DateTimeField = ({
  children,
  ...props
}) => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <DateTimePicker {...fieldToTextField(props)}>{children}</DateTimePicker>
  </MuiPickersUtilsProvider>
);

DateTimeField.displayName = 'FormikMaterialUIDateTimeField';
