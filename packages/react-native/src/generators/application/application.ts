import {
  formatFiles,
  GeneratorCallback,
  joinPathFragments,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { initGenerator as jsInitGenerator } from '@nx/js';

import { runSymlink } from '../../utils/symlink-task';
import { addLinting } from '../../utils/add-linting';
import { addJest } from '../../utils/add-jest';
import { chmodAndroidGradlewFilesTask } from '../../utils/chmod-android-gradle-files';
import { runPodInstall } from '../../utils/pod-install-task';

import { normalizeOptions } from './lib/normalize-options';
import initGenerator from '../init/init';
import { addProject } from './lib/add-project';
import { createApplicationFiles } from './lib/create-application-files';
import { addDetox } from './lib/add-detox';
import { Schema } from './schema';
import { ensureDependencies } from '../../utils/ensure-dependencies';

export async function reactNativeApplicationGenerator(
  host: Tree,
  schema: Schema
): Promise<GeneratorCallback> {
  return await reactNativeApplicationGeneratorInternal(host, {
    projectNameAndRootFormat: 'derived',
    ...schema,
  });
}

export async function reactNativeApplicationGeneratorInternal(
  host: Tree,
  schema: Schema
): Promise<GeneratorCallback> {
  const options = await normalizeOptions(host, schema);

  const tasks: GeneratorCallback[] = [];
  const jsInitTask = await jsInitGenerator(host, {
    ...schema,
    skipFormat: true,
  });
  tasks.push(jsInitTask);
  const initTask = await initGenerator(host, { ...options, skipFormat: true });
  tasks.push(initTask);

  if (!options.skipPackageJson) {
    tasks.push(ensureDependencies(host));
  }

  createApplicationFiles(host, options);
  addProject(host, options);

  const lintTask = await addLinting(host, {
    ...options,
    projectRoot: options.appProjectRoot,
    tsConfigPaths: [
      joinPathFragments(options.appProjectRoot, 'tsconfig.app.json'),
    ],
  });
  tasks.push(lintTask);

  const jestTask = await addJest(
    host,
    options.unitTestRunner,
    options.projectName,
    options.appProjectRoot,
    options.js,
    options.skipPackageJson
  );
  tasks.push(jestTask);
  const detoxTask = await addDetox(host, options);
  tasks.push(detoxTask);
  const symlinkTask = runSymlink(host.root, options.appProjectRoot);
  tasks.push(symlinkTask);
  const chmodTaskGradlewTask = chmodAndroidGradlewFilesTask(
    joinPathFragments(host.root, options.androidProjectRoot)
  );
  tasks.push(chmodTaskGradlewTask);

  const podInstallTask = runPodInstall(
    joinPathFragments(host.root, options.iosProjectRoot)
  );
  if (options.install) {
    tasks.push(podInstallTask);
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default reactNativeApplicationGenerator;
