import {
  ariaDescribedByIds,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';

import { FancyMultiSelect } from '../components/ui/fancy-multi-select';
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
  value,
  multiple,
  autofocus,
  onChange,
  onBlur,
  onFocus,
  defaultValue,
  placeholder,
  rawErrors = [],
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled, emptyValue: optEmptyValue } = options;

  const _onFancyFocus = () => {
    onFocus(id, enumOptionsValueForIndex<S>(value, enumOptions, optEmptyValue));
  };

  const _onFancyBlur = () => {
    onBlur(id, enumOptionsValueForIndex<S>(value, enumOptions, optEmptyValue));
  };

  const items = (enumOptions as any)?.map(({ value, label }: any, index: number) => ({
    value: multiple ? value : index.toString(),
    label: label,
    index,
    disabled: Array.isArray(enumDisabled) && enumDisabled.includes(value),
  }));

  const currentValue = enumOptionsIndexForValue<S>(value ?? defaultValue, enumOptions, false) as unknown as string;

  return (
    <div className='p-0.5'>
      {!multiple ? (
        <Select
          items={items}
          onValueChange={(selectedValue) => {
            onChange(enumOptionsValueForIndex<S>(selectedValue as string, enumOptions, optEmptyValue));
          }}
          defaultValue={defaultValue}
          required={required}
        >
          <SelectTrigger
            className={cn('w-full', { 'border-destructive': rawErrors.length > 0 })}
            aria-describedby={ariaDescribedByIds<T>(id)}
          >
            <SelectValue>
              {currentValue ? undefined : <span className='text-muted-foreground'>{placeholder}</span>}
            </SelectValue>
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
      ) : (
        <FancyMultiSelect
          id={id}
          autoFocus={autofocus}
          disabled={disabled || readonly}
          multiple
          className={rawErrors.length > 0 ? 'border-destructive' : ''}
          items={items}
          selected={value}
          onValueChange={(values) => {
            onChange(enumOptionsValueForIndex<S>(values, enumOptions, optEmptyValue));
          }}
          onFocus={_onFancyFocus}
          onBlur={_onFancyBlur}
        />
      )}
    </div>
  );
}
