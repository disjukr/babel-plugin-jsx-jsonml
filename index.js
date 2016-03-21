'use strict';

module.exports = function (babel) {
    var t = babel.types;
    function error(file, node, msg) {
        return file.buildCodeFrameError(node, msg);
    }
    function jsxNameToString(file, node) {
        return t.stringLiteral(node.name);
    }
    function jsxAttributesToObject(file, node) {
        if (node.length) {
            return t.objectExpression(node.map(function (attribute) {
                if (!t.isJSXAttribute(attribute)) {
                    throw error(file, attribute, 'spread attribute is not implemented yet');
                }
                if (!t.isJSXIdentifier(attribute.name)) {
                    throw error(file, attribute.name, 'member expression is not allowed');
                }
                attribute.name.type = 'Identifier';
                return t.inherits(t.objectProperty(
                    attribute.name,
                    jsxAttributeValue(file, attribute.value)
                ), attribute);
            }));
        } else {
            return t.objectExpression([]);
        }
    }
    function jsxAttributeValue(file, node) {
        if (!node) return t.booleanLiteral(true);
        if (t.isJSXExpressionContainer(node)) return node.expression;
        return node;
    }
    function jsxElementToJsonml(path, file) {
        var jsxElement = path.node;
        var openingElement = jsxElement.openingElement;
        var openingElementName = openingElement.name;
        if (!t.isJSXIdentifier(openingElementName)) {
            throw error(file, openingElementName, 'member expression is not allowed');
        }
        var openingElementAttributes = openingElement.attributes;
        var jsonml = t.arrayExpression([
            jsxNameToString(file, openingElementName),
            jsxAttributesToObject(file, openingElementAttributes)
        ].concat(t.react.buildChildren(jsxElement)));
        path.replaceWith(t.inherits(jsonml, jsxElement));
    }
    return {
        inherits: require('babel-plugin-syntax-jsx'),
        visitor: {
            JSXElement: { exit: jsxElementToJsonml }
        }
    };
};
