import { PluginObj } from '@babel/core';
import { getStableKey, getStableValue } from './stableString';
import {
  hasStringLiteralArguments,
  hasStringLiteralJSXAttribute,
  isSvgElementAttribute
} from "./visitorChecks";
import { NodePath } from "ast-types";
import { JSXElement } from "ast-types/gen/nodes";
import jsx from "ast-types/def/jsx";

let keyMaxLength = 40;
let phrases: string[] = [];
let i18nMap = {};

const addPhrase = (displayText: string, keyText?: string, isPlural?: boolean) => {
  const key = getStableKey(keyText ? keyText: displayText, keyMaxLength);
  const value = getStableValue(displayText);
  if (!key || !value) {
    return null;
  }

  if (isPlural) {
    const keySingle = `${key}_one`;
    const keyMultiple =`${key}_other`;
    const valueSingle = getStableValue(displayText);
    const valueMultiple = getStableValue(displayText);

    i18nMap[keySingle] = valueSingle;
    i18nMap[keyMultiple] = `${valueMultiple}s`;

    phrases = [
      ...phrases,
      valueSingle,
      valueMultiple,
    ];

  } else {
    i18nMap[key] = value;
    phrases = [
      ...phrases,
      value,
    ];

    return { key, value };
  }


};

function BabelPluginI18n(): PluginObj {
  return {
    name: 'i18n',
    visitor: {
      JSXAttribute(path) {
        const { node } = path;

        if (hasStringLiteralJSXAttribute(path) && !isSvgElementAttribute(path)) {
          addPhrase(node.value.value);
        }
      },
      JSXElement(path) {
        const { node } = path;
        const jsxContentNodes =  node.children;
        extractArguments(jsxContentNodes)
          .forEach(({textWithArgs, textWithoutArgs}) =>
            addPhrase(textWithArgs, textWithoutArgs));

      },
      JSXExpressionContainer(path) {
        const { node } = path;

        if (node.expression.type === 'StringLiteral') {
          addPhrase(path.node.expression.value);
        } else if (node.expression.type === 'ConditionalExpression') {
          let expression = path.node.expression;
          if (expression.consequent.type === 'StringLiteral') {
            addPhrase(expression.consequent.value)
          }
          if (expression.alternate.type === 'StringLiteral') {
            addPhrase(expression.alternate.value);
          }
        }
      },
      CallExpression(path) {

        if (hasStringLiteralArguments(path)) {
          for (const arg of path.node.arguments) {
            if (arg.type === 'StringLiteral') {

              const isPlural = path.node.callee.name === 'pluralise';

              addPhrase(arg.value, arg.value, isPlural)

            }

            if (arg.type === 'ObjectExpression') {
              if (arg.properties.length === 0) {
                continue;
              }

              for (const prop of arg.properties) {
                if (prop.value && prop.value.type === 'StringLiteral') {
                  addPhrase(prop.value.value);
                }
              }
            }
          }
        }
      }
    }
  }
}

function extractArguments(jsxContentNodes: NodePath<any>[]) {
  let textWithArgs = '';
  let textWithoutArgs = '';
  let argIndex = 0;
  let hasText = false;
  const texts = [];
  for(let i = 0; i < jsxContentNodes.length; i++) {
    const element = jsxContentNodes[i];
    if (element.type === 'JSXText') {
      hasText = true;
      textWithArgs += element.value;
      textWithoutArgs += element.value;
    } else if (element.type === 'JSXExpressionContainer') {
      textWithArgs += `{arg${argIndex}}`;
      argIndex++;
    } else {
      if (hasText) {
        texts.push({ textWithArgs, textWithoutArgs });
        textWithArgs = '';
        textWithoutArgs = ''
      }
    }
  }
  if (hasText) {
    texts.push({ textWithArgs, textWithoutArgs });
  }
  return texts;
}

BabelPluginI18n.clear = () => {
  phrases = [];
  i18nMap = {};
};
BabelPluginI18n.setMaxKeyLength = (maxLength: number) => {
  keyMaxLength = maxLength;
};
BabelPluginI18n.getExtractedStrings = () => phrases;
BabelPluginI18n.getI18Map = () => i18nMap;

export default BabelPluginI18n;
