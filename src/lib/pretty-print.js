import React from 'react';
import prettyFormat from 'pretty-format';

import { toJSON } from './to-json';

const { ReactTestComponent, ReactElement } = prettyFormat.plugins;

function prettyPrint(element, maxLength, options = {}) {
  let plugins = [ReactTestComponent, ReactElement];
  const { formatting, ...rest } = options;

  if (formatting && formatting.removeProps) {
    const formatterPlugin = createFormatter(options.formatting.removeProps);
    plugins = [formatterPlugin, ...plugins];
  }

  const debugContent = prettyFormat(toJSON(element), {
    plugins: plugins,
    printFunctionName: false,
    highlight: true,
    ...rest,
  });

  return maxLength !== undefined && debugContent && debugContent.toString().length > maxLength
    ? `${debugContent.slice(0, maxLength)}...`
    : debugContent;
}

function createFormatter(propsToRemove) {
  const plugin = {
    test(val) {
      return val.props !== undefined;
    },
    serialize(element, config, indentation, depth, refs, printer) {
      Object.keys(element.props).map(prop => {
        if (propsToRemove.includes(prop)) {
          delete element.props[prop];
        }
      });

      return ReactTestComponent.serialize(element, config, indentation, depth, refs, printer);
    },
  };

  return plugin;
}

export { prettyPrint };
