import { ErrorText } from '.';
import { Controller, FieldValues } from 'react-hook-form';
import { classNames as cx } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { FieldProps } from '@models';
import { errorMessages, invalidColor } from '@utils';

const InputTextValid = <T extends FieldValues>({
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
        field: { value, name, ref, onBlur, onChange },
        fieldState: { error },
      }) => (
        <>
          <div className="flex flex-col">
            <span
              className={cx('p-float-label', { 'p-input-icon-left': icon })}
            >
              {icon && (
                <i
                  className={`pi pi-${icon}`}
                  style={{ color: error ? invalidColor : '' }}
                />
              )}
              <InputText
                id={name}
                value={value}
                ref={ref}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                className={cx({ 'p-invalid': error }, 'p-inputtext-sm')}
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

export default InputTextValid;
