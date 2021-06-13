import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { COUNTRY_CAPITAL, getInputFieldValidation } from 'src/app/app-constants';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  countryCapitalForm: FormGroup;
  countryCapital: FormArray;
  filterCountryCapital;
  outsideClick: boolean;
  countryCapitals = COUNTRY_CAPITAL;
  showBanks: boolean = false;
  contextmenu: boolean = false;
  contextmenuX = 0;
  contextmenuY = 0;
  selectedIndex: number = 0;
  isSubmitted: boolean = false;
  recievedData;
  constructor(private fb: FormBuilder,
    private _elementRef: ElementRef,) { }

  ngOnInit() {
    this.recievedData = localStorage.getItem('CountryCapital');
    this.initForm();

    if (this.recievedData !== null) {
      const data = JSON.parse(this.recievedData);
      console.log(data);

      data.forEach(item => {
        console.log(item);

        var formGroup = this.fb.group({
          country: [item.country, [Validators.required]],
          countryDropDown: [false],
          capital: [item.capital, [Validators.required]],
          capitalDropDown: [false],
        })
        console.log(formGroup);
        const formArray = <FormArray>this.countryCapitalForm.controls.countryCapital;
        formArray.push(formGroup);
      });
      console.log(this.countryCapitalForm.value);
    }
    else {
      const formArray = <FormArray>this.countryCapitalForm.controls.countryCapital;
      formArray.push(this.countryCapitalArray())
    }
    this.filterCountryCapital = JSON.parse(JSON.stringify(this.countryCapitals));
  }

  initForm() {
    this.countryCapitalForm = this.fb.group({
      countryCapital: this.fb.array([]),
    })
  }


  countryCapitalArray(): FormGroup {
    return this.fb.group({
      country: ['', [Validators.required]],
      countryDropDown: [false],
      capital: ['', [Validators.required]],
      capitalDropDown: [false],
    })
  }



  deleteRow(index) {
    const deleteArray = <FormArray>this.countryCapitalForm.controls.countryCapital;
    deleteArray.removeAt(index)
  }

  addSideRow(index) {
    const addSideRow = <FormArray>this.countryCapitalForm.controls.emptyRow;
    addSideRow.push(new FormControl(''))
  }

  onRightClick(event, index) {
    this.selectedIndex = index;

    event.preventDefault();
    this.contextmenuX = event.clientX
    this.contextmenuY = event.clientY
    this.contextmenu = true;
  }

  countryValue(event, index) {
    this.outsideClick = true;
    this.countryCapitalForm.controls.countryCapital['controls'][index]['controls'].countryDropDown.setValue(true);
    this.countryCapitals = this.filterCountryCapital.filter(list => list.country.toLowerCase().includes(event.toLowerCase()));
  }

  setCountryDetails(value, index) {
    this.countryCapitalForm.controls.countryCapital['controls'][index]['controls'].countryDropDown.setValue(false);
    this.countryCapitalForm.controls.countryCapital['controls'][index]['controls'].country.setValue(value);
    Object.values(this.countryCapitals).forEach((element) => {
      if (element.country == value) {
        this.countryCapitalForm.controls.countryCapital['controls'][index]['controls'].capital.setValue(element.city);
      }
    })
  }

  capitalValue(event, index) {
    this.countryCapitalForm.controls.countryCapital['controls'][index]['controls'].capitalDropDown.setValue(true);
    this.countryCapitals = this.filterCountryCapital.filter(list => list.city.toLowerCase().includes(event.toLowerCase()));
  }

  setCapitalDetails(value, index) {
    this.countryCapitalForm.controls.countryCapital['controls'][index]['controls'].capitalDropDown.setValue(false);
    this.countryCapitalForm.controls.countryCapital['controls'][index]['controls'].capital.setValue(value);
    Object.values(this.countryCapitals).forEach((element) => {
      if (element.city == value) {
        this.countryCapitalForm.controls.countryCapital['controls'][index]['controls'].country.setValue(element.country)
      }
    })
  }


  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    this.contextmenu = false;
    Object.values(this.countryCapitalForm.controls).forEach((element) => {
      element['controls'].forEach(list => {
        list.controls.capitalDropDown.setValue(false);
        list.controls.countryDropDown.setValue(false)
      });
    })
  }

  disableContextMenu() {
    this.contextmenu = false;
  }

  addRowBelow() {
    console.log(this.selectedIndex);

    const array = <FormArray>this.countryCapitalForm.controls.countryCapital;
    array.insert(this.selectedIndex + 1, this.countryCapitalArray());
    this.contextmenu = false;
  }

  addRowAbove() {
    console.log(this.selectedIndex);

    const array = <FormArray>this.countryCapitalForm.controls.countryCapital;
    array.insert(this.selectedIndex, this.countryCapitalArray());
    this.contextmenu = false;
  }

  getValid(fieldName) {
    return getInputFieldValidation(this.countryCapitalForm, fieldName, this.isSubmitted);
  }


  removeRow() {
    const deleteArray = <FormArray>this.countryCapitalForm.controls.countryCapital;
    deleteArray.removeAt(this.selectedIndex)
    this.contextmenu = false;
  }

  saveCountryCapital() {
    this.isSubmitted = true;
    if (this.countryCapitalForm.valid) {
      this.isSubmitted = false;
      console.log(this.countryCapitalForm);
      const value = JSON.stringify(this.countryCapitalForm.controls.countryCapital.value)

      localStorage.setItem('CountryCapital', value)
    }
  }

}
