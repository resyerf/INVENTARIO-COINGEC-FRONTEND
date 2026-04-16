import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

export interface AutocompleteOption {
  id: string;
  nombre: string;
  display?: string;
}

@Component({
  selector: 'app-autocomplete-select',
  templateUrl: './autocomplete-select.component.html',
  styleUrls: ['./autocomplete-select.component.css']
})
export class AutocompleteSelectComponent implements OnInit, OnDestroy, OnChanges {
  @Input() label: string = '';
  @Input() placeholder: string = 'Escriba para buscar...';
  @Input() required: boolean = false;
  @Input() searchFn!: (termino: string) => Promise<AutocompleteOption[]>;
  @Input() selectedId: string | null = null;

  @Output() selectedItemChange = new EventEmitter<AutocompleteOption | null>();
  @Output() selectedIdChange = new EventEmitter<string | null>();
  @Output() validationChange = new EventEmitter<{ isValid: boolean; error?: string }>();

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

    this.loadAllOptions();
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
      this.filteredOptions = this.allOptions;
      return;
    }

    this.isLoading = true;
    try {
      this.filteredOptions = await this.searchFn(termino);
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
    this.validateSelection();
  }

  onOptionMouseDown(event: MouseEvent, option: AutocompleteOption): void {
    event.preventDefault();
    this.onSelectOption(option);
  }

  onBlur(): void {
    this.isOpen = false;

    // Validar si el valor existe en las opciones
    if (this.value.trim()) {
      const found = this.allOptions.find(
        opt => opt.nombre.toLowerCase() === this.value.trim().toLowerCase()
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
        this.errorMessage = `"${this.value}" no existe. Primero debe agregarlo en el menú de ${this.label.toLowerCase()}.`;
        this.selectedItem = null;
        this.selectedIdChange.emit(null);
        this.selectedItemChange.emit(null);
        this.validationChange.emit({ isValid: false, error: this.errorMessage });
      }
    } else {
      if (this.required) {
        this.errorMessage = `${this.label} es requerido`;
        this.validationChange.emit({ isValid: false, error: this.errorMessage });
      } else {
        this.selectedItem = null;
        this.selectedIdChange.emit(null);
        this.validationChange.emit({ isValid: true });
      }
    }
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

