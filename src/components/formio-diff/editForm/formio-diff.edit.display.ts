export default [
  {
    type: 'select',
    input: true,
    key: 'diffInput',
    label: 'Input',
    weight: 1,
    dataSrc: 'custom',
    valueProperty: 'value',
    data: {
      custom(context: any): any[] {
        const values: { label: string; value: string }[] = [];

        context.utils.eachComponent(
          context.instance.options.editForm.components,
          function (component, path) {
            if (component.key !== context.data.key) {
              values.push({
                label: component.label || component.key,
                value: path,
              });
            }
          },
          {},
        );
        return values;
      },
    },
  },
  {
    type: 'select',
    input: true,
    key: 'diffInputNew',
    label: 'Input New',
    weight: 1,
    dataSrc: 'custom',
    valueProperty: 'value',
    data: {
      custom(context: any): any[] {
        const values: { label: string; value: string }[] = [];

        context.utils.eachComponent(
          context.instance.options.editForm.components,
          function (component, path) {
            if (component.key !== context.data.key) {
              values.push({
                label: component.label || component.key,
                value: path,
              });
            }
          },
          {},
        );
        return values;
      },
    },
  },
];
