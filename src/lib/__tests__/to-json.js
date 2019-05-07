import React from 'react';
import { Text, View } from 'react-native';

import { prettyPrint, render } from '../../';
import { toJSON } from '../to-json';

test('it converts to json', () => {
  function ParentComponent({ children }) {
    return <View>{children}</View>;
  }

  function MiddleComponent({ children }) {
    return (
      <View>
        <Text>{children}</Text>
      </View>
    );
  }

  const { container } = render(
    <ParentComponent>
      <View>
        <MiddleComponent>hello</MiddleComponent>
        <View>
          <Text>world</Text>
          <Text>foo bar</Text>
        </View>
        <View />
      </View>
    </ParentComponent>,
  );

  expect(prettyPrint(toJSON(container))).toMatchSnapshot();
});