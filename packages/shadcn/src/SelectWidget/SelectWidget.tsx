import { ariaDescribedByIds, FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { cn } from '../lib/utils';

/** The `SelectWidget` is a widget for rendering dropdowns.
 *  It is typically used with string properties constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function SelectWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  options,
  required,
  disabled,
  readonly,
  autofocus,
  onFocus,
  onBlur,
  value,
  multiple,
  onChange,
  placeholder,
  rawErrors = [],
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled, emptyValue, placeholder: optPlaceholder } = options;

  const items = (enumOptions as any)?.map(({ value, label }: any, index: number) => ({
    value: value,
    label: label,
    index,
    disabled: Array.isArray(enumDisabled) && enumDisabled.includes(value),
  }));

  const _onFocus = () => {
    onFocus(id, value);
  };

  const _onBlur = () => {
    onBlur(id, value);
  };

  function renderMultipleSelectedValues(value: unknown[]) {
    if (value.length === 0) {
      return <span className='text-muted-foreground'>{placeholder || optPlaceholder}</span>;
    }

    const firstValue = value[0];
    const additionalValues = value.length > 1 ? ` (+${value.length - 1} more)` : '';
    return firstValue + additionalValues;
  }

  return (
    <div className='p-0.5'>
      {!multiple ? (
        <Select
          id={id}
          disabled={disabled}
          readOnly={readonly}
          items={enumOptions}
          onValueChange={(selectedValue) => {
            onChange(selectedValue);
          }}
          value={value ?? null}
          required={required}
          defaultValue={emptyValue}
        >
          <SelectTrigger
            className={cn('w-full', {
              'border-destructive': rawErrors.length > 0 || (!value && required),
            })}
            aria-describedby={ariaDescribedByIds<T>(id)}
            autoFocus={autofocus}
            onFocus={_onFocus}
            onBlur={_onBlur}
          >
            <SelectValue>
              {(value) =>
                value ? value : <span className='text-muted-foreground'>{placeholder || optPlaceholder}</span>
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton />
            {items.map((item: { value: string; label: string; disabled: boolean }) => (
              <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </SelectItem>
            ))}
            <SelectScrollDownButton />
          </SelectContent>
        </Select>
      ) : (
        <Select
          id={id}
          disabled={disabled}
          readOnly={readonly}
          items={items}
          multiple
          onValueChange={(values) => {
            onChange(values);
          }}
          value={value}
          required={required}
          defaultValue={emptyValue}
        >
          <SelectTrigger
            className={cn('w-full', { 'border-destructive': rawErrors.length > 0 || (!value && required) })}
            aria-describedby={ariaDescribedByIds<T>(id)}
            autoFocus={autofocus}
            onFocus={_onFocus}
            onBlur={_onBlur}
          >
            <SelectValue>{renderMultipleSelectedValues}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton />
            {items.map((item: any) => (
              <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </SelectItem>
            ))}
            <SelectScrollDownButton />
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
