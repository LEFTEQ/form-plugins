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
       <div class="screen"> 
            <div class="stage"><span class="animated">PowerFLOW</span></div>
      </div>
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
    return null;
  }

  static availableIn() {
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
    return true;
  }

  static get builderInfo() {
    return {
      title: 'Love Text Field',
      icon: 'terminal',
      group: 'custom',
      documentation: '/#',
      weight: 0,
      schema: LovelyTextField.schema(),
      supportedConfiguration: LovelyTextField.supportedConfiguration(),
    };
  }

  get defaultSchema() {
    return LovelyTextField.schema();
  }

  get templateName() {
    return 'lovelyTextFieldTemplate';
  }

  get inputInfo() {
    const info = super.inputInfo;
    info.type = 'input';

    return info;
  }

  init() {
    super.init();
  }

  render() {
    return super.render(this.templateName, true);
  }

  attach(element: IFormioHtmlElement<ITextFieldComponent>) {
    const superAttach = super.attach(element);

    return superAttach;
  }

  get emptyValue() {
    return '';
  }
}

registerPwflFormPlugin({
  name: 'LovelyTextField',
  component: LovelyTextField,
  template: Template,
  editForm: LovelyTextFieldForm,
});
