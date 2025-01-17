import { Button } from '@material-ui/core';
import { useCallback } from 'react';
import { useFormikContext } from 'formik';

export default function CancelButton({ label, disabled, onClick, ...props }) {
  const { isSubmitting, resetForm } = useFormikContext();

  const handleClick = useCallback(
    (e) => {
      resetForm();
      onClick && onClick(e);
    },
    [onClick, resetForm]
  );

  return !isSubmitting ? (
    <Button
      color="primary"
      disabled={disabled}
      {...props}
      onClick={handleClick}
    >
      {label}
    </Button>
  ) : null;
}
