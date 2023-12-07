import { type FormioComponent, type IFormioHtmlElement } from 'experimental-forms/models';
import { registerPwflFormPlugin } from 'pwfl-forms';

import './lovely-text-field.style.scss';
import { LovelyTextFieldForm } from './lovely-text-field.form.ts';

declare var Formio: any;

const InputPlugin = Formio.Components.components.inputPlugin;

interface ITextFieldComponent extends FormioComponent {
  input: boolean;
}

const Template = {
  lovelyTextFieldTemplate: {
    form: `
      <input ref="inputRef" />
    `,
  },
};

export default class LovelyTextField extends InputPlugin<ITextFieldComponent, any, string> {
  static schema(...extend: any) {
    return InputPlugin.schema(
      {
        label: 'Lovely TextField',
        key: 'LovelyTextField',
        type: 'LovelyTextField',
        mask: false,
        inputType: 'text',
        inputFormat: 'plain',
        inputMask: '',
        tableView: true,
        spellcheck: true,
        validate: {
          minLength: '',
          maxLength: '',
          pattern: '',
        },
      } as any,
      ...extend,
    );
  }

  static supportedFunctions() {
    return null; // This will be defined in the docs - for now, leave it as null - HINT - bellow is how you could define supported functions
  }

  // This is the unsupported definition which you can use to enable features inside powerflow - eg - if you want to enable filtering of this component in table header, you can do it like this:
  // There is high change that this will work just fine, but we're not saying that it will work in all cases - if you want to be sure, you can always ask us for help
  /*
  static supportedFunctions(...sources) {
    return InputPlugin.supportedFunctions(
        {
          VIEWS_TABLE_FILTER_HEADER: {
            enabled: true,
            filterAsEqual: false, // if left empty - defaults to true - if you want to search via regex or equality
            config: {
              replaceWith: 'checkbox', // if left empty - defaults to yours component type - you can use any component type here
              createParams: (key, value) => {  // you can hook how the params are created - eg - if you want to create a filter for id__exists, you can do it like this:
                return { [`${key}.id__exists`]: value };
              },
              extraProperties: {} // you can extend properties of that filter component - eg - if you want to create select component with options - just extend it here with standard select component properties
              mapValue: (value, properties) => value; // this hooks just only for param value - key will be automatically created by powerflow
            },
          },
          VIEWS_TABLE_SORT_HEADER: {
            enabled: false,
          },
          ADVANCED_FILTER: {
            enabled: false,
          },
          QUICK_FILTER: {
            enabled: false,
          },
          STATIC_READONLY: {
            enabled: false,
          },
        },
        ...sources,
    );
  }*/

  static availableIn() { // Declare where this component can be used
    return {
      rtr: true,
      case: true,
      bds: true,
      enumeration: true,
      view: true,
      taskView: true,
      form: true,
    };
  }

  static supportedConfiguration() {
    return true;  // This should be defined in the docs - this is quite complex configuration - used to define which configuration is available where - you can leave it as true for now - so every edit form options will be available everywhere
  }

  static get builderInfo() {
    return {
      title: 'Love Text Field',
      icon: 'terminal', // Font awesome icon - there is also customIcon option for custom icons
      group: 'custom', // Please - use 'custom' group - HINT: if you use 'basic' group, your component will be available in all places, where you can work with component - THIS IS COMPLETELY unsupported by us - but it should work in most cases
      documentation: '/#', // nothing
      weight: 0, // Order in component selection list
      schema: LovelyTextField.schema(), // Reference to schema - this is required for powerflow to work properly
      supportedConfiguration: LovelyTextField.supportedConfiguration(), // Reference to supported configuration - this is required for powerflow to work properly
    };
  }

  get defaultSchema() {
    return LovelyTextField.schema();
  }

  get templateName() {
    return 'lovelyTextFieldTemplate'; // your template name which you defined in Template variable - 'lovelyTextFieldTemplate' in this case
  }

  get inputInfo() {
    const info = super.inputInfo;
    info.type = 'input'; // Change this to webcomponent name, if you use one - eg - if your webcomponent is called 'my-webcomponent', then change this to 'my-webcomponent' - it's required to extend HTML sanitization & custom web component destroy handler - thus layer system
    info.changeEvent = 'input'; // This is event that will be automatically listened to by the pwfl plugin system - default is 'valueChanges' - used to trigger value update changes

    return info;
  }

  init() {
    super.init(); // Almost no reason to use this hook - but you can use as component constructor - eg - if you want to create some custom properties, etc
  }

  get customReadonly(): boolean { // If you want to handle readonly by yourself - you can do it here - if you want to use standard readonly - just return false
    return false;
  }

  render() {
    return super.render(this.templateName, true); // The second argument is if you want to handle label (+ tooltip) rendering by yourself
  }

  attach(element: IFormioHtmlElement<ITextFieldComponent>) { // This is where you can work with the DOM element - eg - add event listeners, classes, etc - you SHOULD ALWAYS call super.attach(element) - & return its value (Promise)
    const superAttach = super.attach(element);

    return superAttach;
  }

  get emptyValue() { // Plugins should always have string value as empty value - please do not try to change this - it is somehow controlled by powerflow - but I feel it could be quite easily changed to any value from plugin itself
    return '';
  }

  getReadonlyValue(value) { // If you want to somehow parse value for readonly - you can return HTML string
    return value;
  }

  // This function has to be enabled in -   supportedConfiguration STATIC_READONLY
  // Used for high performance readonly rendering (in tables etc) - if you want to use standard readonly rendering - just ignore this function
  static getReadonlyValue(value, component, options) {
    return value;
  }


  // You can implement your own validation - if you want to use standard validation - just ignore this function
  // Dirty: true is when user clicks on submit button
  // Data is current value of component
  // Row is current row of component (in datagrid)
  // Options - no idea
  checkComponentValidity(data: any, dirty: boolean, row: any, options = {}): boolean {
    return super.checkComponentValidity(data, dirty, row, options);
  }

  // Quite obvious
  set disabled(value: boolean) {
    super.disabled = value;

    if (this.inputRef) {
      this.inputRef.disabled = value;
    }
  }

/*
  flagsInterface {
  fromSubmission?: boolean;
  resetValue?: boolean;
  noUpdateEvent?: boolean;
  async?: boolean;
  silentCheck?: boolean;
  noDefault?: boolean;

  [x: string]: any;
}
*/
  // If you use standard "value" is value setter - you can just remove this function - if you want to use custom value setter - you have to use this function
  // Also - do not forget to call updateValue and return its return - as it could result in infinite looping etc.
  setValue(value: string, flags: any = {}): boolean {
    if (this.options.builder) return false;

    if (this.isNativeReadonly) {
      return super.setValue(value, flags);
    }

    const changed: boolean = this.updateValue(value, flags);

    if (this.inputRef) {
      this.inputRef.value = this.transformValueToNg(value);
    }

    return changed;
  }


  // Used as hook to change value which is output from info.changeEvent = 'input' before it is passed to submission
  transformValueFromNg(value: any): string {
    return value;
  }

  // Used as hook between submission set & calling setValue function
  transformValueToNg(value: string): any {
    return value;
  }

}

registerPwflFormPlugin({
  name: 'LovelyTextField',
  component: LovelyTextField,
  template: Template,
  editForm: LovelyTextFieldForm,
});
