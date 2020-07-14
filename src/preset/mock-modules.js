import { getConfig } from '../lib';
import { mockComponent } from './mock-component';
import { mockNativeMethods } from './mock-native-methods';

// Un-mock the react-native components so we can do it ourselves
getConfig('coreComponents').forEach(component => {
  try {
    // try to un-mock the component
    jest.unmock(component);
  } catch (e) {
    // do nothing if we can't
  }
});

// Un-mock ReactNative so we can hide annoying `console.warn`s
jest.unmock('react-native/Libraries/Renderer/shims/ReactNative');

// Mock the components we want mocked
getConfig('coreComponents').forEach(component => {
  try {
    jest.doMock(component, () => mockComponent(component));
  } catch (e) {}
});

// Mock the Picker one-off because it's kinda weird
jest.doMock('react-native/Libraries/Components/Picker/Picker', () => {
  const React = jest.requireActual('react');
  const Picker = mockComponent('react-native/Libraries/Components/Picker/Picker');
  Picker.Item = ({ children, ...props }) => React.createElement('Picker.Item', props, children);
  return Picker;
});

// Re-mock ReactNative with native methods mocked
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
