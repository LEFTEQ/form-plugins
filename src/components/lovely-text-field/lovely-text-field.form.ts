import TextFieldEditData from './editForm/TextField.edit.data.ts';
import TextFieldEditDisplay from './editForm/TextField.edit.display.ts';
import TextFieldEditValidation from './editForm/TextField.edit.validation.ts';

export const LovelyTextFieldForm = [
  {
    key: 'display',
    components: TextFieldEditDisplay,
  },
  {
    key: 'data',
    components: TextFieldEditData,
  },
  {
    key: 'validation',
    components: TextFieldEditValidation,
  },
];
