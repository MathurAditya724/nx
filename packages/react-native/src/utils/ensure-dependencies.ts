import {
  addDependenciesToPackageJson,
  detectPackageManager,
  GeneratorCallback,
  Tree,
} from '@nx/devkit';
import {
  babelCoreVersion,
  babelPresetReactVersion,
} from '@nx/react/src/utils/versions';
import {
  babelRuntimeVersion,
  jestReactNativeVersion,
  metroVersion,
  reactNativeMetroConfigVersion,
  reactNativeSvgTransformerVersion,
  reactNativeSvgVersion,
  reactTestRendererVersion,
  testingLibraryJestNativeVersion,
  testingLibraryReactNativeVersion,
  typesNodeVersion,
  typesReactVersion,
} from './versions';

export function ensureDependencies(tree: Tree): GeneratorCallback {
  const isPnpm = detectPackageManager(tree.root) === 'pnpm';

  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@types/node': typesNodeVersion,
      '@types/react': typesReactVersion,
      '@react-native/metro-config': reactNativeMetroConfigVersion,
      '@testing-library/react-native': testingLibraryReactNativeVersion,
      '@testing-library/jest-native': testingLibraryJestNativeVersion,
      'jest-react-native': jestReactNativeVersion,
      metro: metroVersion,
      'metro-config': metroVersion,
      'metro-resolver': metroVersion,
      'metro-babel-register': metroVersion,
      'metro-react-native-babel-preset': metroVersion,
      'metro-react-native-babel-transformer': metroVersion,
      'react-test-renderer': reactTestRendererVersion,
      'react-native-svg-transformer': reactNativeSvgTransformerVersion,
      'react-native-svg': reactNativeSvgVersion,
      '@babel/preset-react': babelPresetReactVersion,
      '@babel/core': babelCoreVersion,
      ...(isPnpm
        ? {
            '@babel/runtime': babelRuntimeVersion, // @babel/runtime is used by react-native-svg
          }
        : {}),
    }
  );
}
