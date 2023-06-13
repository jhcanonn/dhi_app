import { ErrorText } from '.';
import { Controller, FieldValues } from 'react-hook-form';
import { classNames as cx } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { FieldCommonProps } from '@models';
import { errorMessages } from '@utils';

export type Props<T> = FieldCommonProps<T> & {
  list: any[];
  showClear?: boolean;
  label?: string;
};

const DropdownValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  list,
  showClear = false,
  required,
  validate,
}: Props<T>) => {
  const {
    formState: { errors },
    control,
  } = handleForm;

  return (
    <Controller
      name={name as any}
      control={control}
      rules={{
        required: required ? errorMessages.mandatoryField : false,
        validate: (value) =>
          validate ? validate(value) || errorMessages.invalidValue : true,
      }}
      render={({
        field: { value, name, ref, onBlur, onChange },
        fieldState: { error },
      }) => (
        <div className="flex flex-col">
          <span className="p-float-label">
            <Dropdown
              id={name}
              value={value}
              optionLabel="name"
              options={list}
              focusInputRef={ref}
              onBlur={onBlur}
              onChange={(e) => onChange(e.value)}
              className={cx(
                { 'p-invalid': error },
                { '[&_.p-dropdown-trigger]:!text-[#dc3545]': error }
              )}
              filter
              showClear={showClear}
            />
            <label htmlFor={name} className={cx({ 'p-error': error })}>
              {label}
            </label>
          </span>
          <ErrorText name={name} errors={errors} />
        </div>
      )}
    />
  );
};

export default DropdownValid;
