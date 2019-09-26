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
jest
  .mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
  .doMock('react-native/Libraries/Renderer/shims/ReactNative', () => {
    const ReactNative = jest.requireActual('react-native/Libraries/Renderer/shims/ReactNative');
    const NativeMethodsMixin =
      ReactNative.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.NativeMethodsMixin;

    Object.assign(NativeMethodsMixin, mockNativeMethods);
    Object.assign(ReactNative.NativeComponent.prototype, mockNativeMethods);

    return ReactNative;
  });
