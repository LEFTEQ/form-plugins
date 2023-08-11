import FormioDiffEditForm from './formio-diff.form';
import diff from './formio-diff.matcher';
import { registerPwflFormPlugin, findComponentByKey } from 'pwfl-forms';
import { IFormioHtmlElement } from 'experimental-forms/models';

import './formio-diff.style.scss';

declare const Formio: any;

const InputPlugin = Formio.Components.components.inputPlugin;

const Template = {
  formioDiff: {
    form: `
<div class="row formio-diff">
<div class="col">
<h4 class="mat-h4">Original document</h4>
<div class="diff-card system-generated" ref="outputNew"></div>
</div>

 <div class="col">
 <h4 class="mat-h4">Document with changes</h4>
<div class="diff-card current-document" ref="output"></div>
</div>


</div>

`,
  },
};

export class FormioDiffComponent extends InputPlugin<any> {
  static schema(...extend: any[]) {
    return InputPlugin.schema(
      {
        label: 'Diff',
        type: 'diff',
        key: 'diff',
        input: false,
        placeholder: '',
        multiple: false,
        persistent: false,
        hideLabel: true,
        diffInput: '',
        diffInputNew: '',
      },
      ...extend,
    );
  }

  static supportedFunctions() {
    return null;
  }

  static supportedConfiguration() {
    return {
      resource: {},
      form: {
        display: true,
        data: false,
        conditional: true,
        validation: false,
        layout: false,
        logic: false,
      },
      view: {},
    };
  }

  static get builderInfo() {
    return {
      title: 'Diff',
      icon: 'laptop-code',
      group: 'custom',
      weight: 0,
      schema: FormioDiffComponent.schema(),
      supportedConfiguration: FormioDiffComponent.supportedConfiguration(),
      supportedVisibility: {
        EDITABLE: true,
        READONLY: false,
        REQUIRED: false,
        DISABLED: false,
        HIDDEN: false,
      },
    };
  }

  init() {
    this._initDiff();

    return super.init();
  }

  get templateName() {
    return 'formioDiff';
  }

  render() {
    return super.render(this.templateName, true);
  }

  attach(element: IFormioHtmlElement<any>) {
    const superAttach = super.attach(element);

    this.loadRefs(element, {
      output: 'single',
      outputNew: 'single',
    });

    return superAttach;
  }

  getValue() {
    return null;
  }

  setValue() {
    return false;
  }

  private _initDiff() {
    if (this.options.builder || !this.root || this.options.preview) return;

    this.root.ready.then(() => {
      this._listenToChanges();
    });
  }

  private _listenToChanges() {
    const diffInput: any = findComponentByKey(
      this.root.components,
      this.component.diffInput.split('.').pop(), // fixme - configuration contains path instead of intended key - use findComponentByPath when available
      true,
      true,
    );
    const diffInputNew: any = findComponentByKey(
      this.root.components,
      this.component.diffInputNew.split('.').pop(), // fixme - configuration contains path instead of intended key - use findComponentByPath when available
      true,
      true,
    );

    console.log(diffInput, diffInputNew, this.component, this.root.components);

    diffInput?.on('componentChange', () => {
      this._writeDiff(diffInput.dataValue, diffInputNew.dataValue);
    });
    diffInputNew?.on('componentChange', () => {
      this._writeDiff(diffInput.dataValue, diffInputNew.dataValue);
    });
  }

  private _writeDiff(originalHTML: string, newHTML: string) {
    const output = diff(originalHTML, newHTML);
    const input = diff(newHTML, originalHTML);

    if (this.refs.output) {
      this.refs.output.innerHTML = output;
      this.refs.outputNew.innerHTML = input;
    }
  }
}

registerPwflFormPlugin({
  name: 'diff',
  component: FormioDiffComponent,
  template: Template,
  editForm: FormioDiffEditForm,
});
