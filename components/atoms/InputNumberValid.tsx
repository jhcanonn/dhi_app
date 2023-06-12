import { ErrorText } from '.';
import { Controller, FieldValues } from 'react-hook-form';
import { classNames as cx } from 'primereact/utils';
import { InputNumber } from 'primereact/inputnumber';
import { FieldProps } from '@models';
import { errorMessages, invalidColor } from '@utils';

const InputNumberValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  icon,
  required,
  validate,
}: FieldProps<T>) => {
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
        field: { onChange, onBlur, value, name, ref },
        fieldState: { error },
      }) => (
        <>
          <div className="flex flex-col">
            <span
              className={cx('p-float-label', { 'p-input-icon-left': icon })}
            >
              {icon && (
                <i
                  className={cx(`pi pi-${icon}`)}
                  style={{ color: error ? invalidColor : '' }}
                />
              )}
              <InputNumber
                id={name}
                value={value}
                inputRef={ref}
                onBlur={onBlur}
                onChange={(e) => onChange(e.value)}
                inputClassName={cx({ 'p-invalid': error }, 'p-inputtext-sm')}
                useGrouping={false}
              />
              <label htmlFor={name} className={cx({ 'p-error': error })}>
                {label}
              </label>
            </span>
            <ErrorText name={name} errors={errors} />
          </div>
        </>
      )}
    />
  );
};

export default InputNumberValid;
