import { useEffect, useState } from "react";
import {
  convertToApiError,
  type ApiError,
  type FieldErrors,
} from "../api/errors";

const useFieldError = (isError: boolean, error: any) => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const apiError: ApiError = convertToApiError(error);
  useEffect(() => {
    if (isError) {
      setFieldErrors(apiError?.fieldErrors);
    }
  }, [isError, error]);

  return { fieldErrors, apiError, setFieldErrors };
};

export default useFieldError;
