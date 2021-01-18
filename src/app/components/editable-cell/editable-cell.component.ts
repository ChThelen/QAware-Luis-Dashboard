
import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditableCellComponent),
  multi: true
};

@Component({
  selector: 'app-editable-cell',
  templateUrl: './editable-cell.component.html',
  providers: [VALUE_ACCESSOR],
  styleUrls: ['./editable-cell.component.css']
})
export class EditableCellComponent implements ControlValueAccessor
{
  label: string = "Enter value here"; 
  @Output()
  changeEventEmitter = new EventEmitter<boolean>();
  newChange:boolean = false;
  @Input() required: boolean = true; 
  @Input() 
  private _value: string = ''; 
  private preValue: string = '';
   editing: boolean = false; 
  public onChange: any = Function.prototype; 
  public onTouched: any = Function.prototype; 

  get value(): any 
  {
    return this._value;
  }

  set value(v: any)
  {
    if (v !== this._value) 
    {
      this._value = v;
      this.newChange = true;
      this.onChange(v);
    }
  }

  writeValue(value: any) 
  {
    this._value = value;
  }

  public registerOnChange(fn: (_: any) => {}): void 
  {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void 
  {
    this.onTouched = fn;
  }

  onBlur($event: Event) 
  {
    this.editing = false;
    
    
  }

  beginEdit(value:any)
  {
    this.preValue = value;
    this.editing  = true;
  }
  valueChange()
  { 
    if(this.newChange)
      this.changeEventEmitter.emit(this.newChange);
  }
}
