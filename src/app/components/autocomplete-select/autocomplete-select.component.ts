import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface AutocompleteOption {
  id: string;
  nombre: string;
  display?: string;
}

@Component({
  selector: 'app-autocomplete-select',
  templateUrl: './autocomplete-select.component.html',
  styleUrls: ['./autocomplete-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteSelectComponent),
      multi: true
    }
  ]
})
export class AutocompleteSelectComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Escriba para buscar...';
  @Input() required: boolean = false;
  @Input() searchFn!: (termino: string) => Promise<AutocompleteOption[]>;
  @Input() selectedId: string | null = null;

  @Output() selectedItemChange = new EventEmitter<AutocompleteOption | null>();
  @Output() selectedIdChange = new EventEmitter<string | null>();
  @Output() validationChange = new EventEmitter<{ isValid: boolean; error?: string }>();

  // ControlValueAccessor hooks
  onChange = (value: any) => {};
  onTouched = () => {};
  disabled = false;

  writeValue(value: string | null): void {
    this.selectedId = value;
    if (value && this.allOptions.length > 0) {
      const found = this.allOptions.find(o => o.id === value);
      if (found) {
        this.selectedItem = found;
        this.value = found.nombre;
      }
    } else if (!value) {
      this.selectedItem = null;
      this.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  value: string = '';
  filteredOptions: AutocompleteOption[] = [];
  selectedItem: AutocompleteOption | null = null;
  isOpen = false;
  errorMessage: string = '';
  isLoading = false;

  private destroy$ = new Subject<void>();
  private allOptions: AutocompleteOption[] = [];
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(async (termino) => {
        await this.filterOptions(termino);
      });

    // this.loadAllOptions(); // Removido para evitar carga masiva en init
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedId']) {
      const id = changes['selectedId'].currentValue;
      if (id && this.allOptions.length > 0) {
        const found = this.allOptions.find(o => o.id === id);
        if (found) {
          this.selectedItem = found;
          this.value = found.nombre;
        }
      } else if (!id) {
        this.selectedItem = null;
        this.value = '';
      }
    }
  }

  private async loadAllOptions(): Promise<void> {
    try {
      this.allOptions = await this.searchFn('');
      this.filteredOptions = this.allOptions;
      // Initialize if selectedId is set
      if (this.selectedId) {
        const found = this.allOptions.find(o => o.id === this.selectedId);
        if (found) {
          this.selectedItem = found;
          this.value = found.nombre;
        }
      }
    } catch (error) {
      console.error('Error loading options:', error);
    }
  }

  onSearchInput(value: string): void {
    this.value = value;
    this.isOpen = true;
    this.errorMessage = '';
    this.searchSubject.next(value);
  }

  private async filterOptions(termino: string): Promise<void> {
    if (!termino.trim()) {
      this.filteredOptions = [];
      return;
    }

    this.isLoading = true;
    try {
      const results = await this.searchFn(termino);
      this.filteredOptions = results;
      
      // Cache results for blur validation
      results.forEach(res => {
        if (!this.allOptions.find(o => o.id === res.id)) {
          this.allOptions.push(res);
        }
      });
    } catch (error) {
      console.error('Error searching:', error);
      this.filteredOptions = [];
    } finally {
      this.isLoading = false;
    }
  }

  onSelectOption(option: AutocompleteOption): void {
    this.selectedItem = option;
    this.value = option.nombre;
    this.isOpen = false;
    this.selectedIdChange.emit(option.id);
    this.selectedItemChange.emit(option);
    this.onChange(option.id); // Reactive forms sync
    this.validateSelection();
  }

  onOptionMouseDown(event: MouseEvent, option: AutocompleteOption): void {
    event.preventDefault();
    this.onSelectOption(option);
  }

  onBlur(): void {
    const currentValue = this.value.trim();
    this.onTouched(); // Reactive forms touch signal

    setTimeout(() => {
      if (!this.isOpen) {
        return;
      }

      this.isOpen = false;

      // Validar si el valor existe en las opciones
      if (currentValue) {
        const found = this.allOptions.find(
          opt => opt.nombre.toLowerCase() === currentValue.toLowerCase()
        );

        if (found) {
          if (this.selectedItem?.id !== found.id) {
            this.selectedItem = found;
            this.selectedIdChange.emit(found.id);
            this.selectedItemChange.emit(found);
          }
          this.errorMessage = '';
        } else {
          // Value doesn't exist in options
          this.errorMessage = `"${this.value}" no existe. Primero debe agregarlo en el menú de ${this.label.replace(/<[^>]*>?/gm, '').trim()}.`;
          this.selectedItem = null;
          this.selectedIdChange.emit(null);
          this.selectedItemChange.emit(null);
          this.onChange(null); // Reactive forms sync
          this.validationChange.emit({ isValid: false, error: this.errorMessage });
        }
      } else {
        if (this.required) {
          this.errorMessage = `${this.label} es requerido`;
          this.validationChange.emit({ isValid: false, error: this.errorMessage });
        } else {
          this.selectedItem = null;
          this.selectedIdChange.emit(null);
          this.onChange(null); // Reactive forms sync
          this.validationChange.emit({ isValid: true });
        }
      }
    }, 150);
  }

  onOptionClick(option: AutocompleteOption): void {
    this.onSelectOption(option);
  }

  validateSelection(): void {
    if (this.selectedItem) {
      this.validationChange.emit({ isValid: true });
    }
  }

  clearSelection(): void {
    this.selectedItem = null;
    this.value = '';
    this.errorMessage = '';
    this.isOpen = false;
    this.selectedIdChange.emit(null);
    this.selectedItemChange.emit(null);
    this.onChange(null); // Reactive forms sync
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

