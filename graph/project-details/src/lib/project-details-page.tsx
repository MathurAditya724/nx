/* eslint-disable @nx/enforce-module-boundaries */
// nx-ignore-next-line
import { ProjectGraphProjectNode } from '@nx/devkit';
import {
  Link,
  ScrollRestoration,
  useLocation,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import ProjectDetails from './project-details';
import {
  fetchProjectGraph,
  getProjectGraphDataService,
  useEnvironmentConfig,
  useIntervalWhen,
  useRouteConstructor,
} from '@nx/graph/shared';
import { ThemePanel } from '@nx/graph/ui-theme';

export function ProjectDetailsPage() {
  const { project, sourceMap, hash } = useRouteLoaderData(
    'selectedProjectDetails'
  ) as {
    hash: string;
    project: ProjectGraphProjectNode;
    sourceMap: Record<string, string[]>;
  };

  const { environment, watch, appConfig } = useEnvironmentConfig();

  const projectGraphDataService = getProjectGraphDataService();
  const params = useParams();

  useIntervalWhen(
    async () => {
      fetchProjectGraph(projectGraphDataService, params, appConfig).then(
        (data) => {
          if (data?.hash !== hash) {
            window.location.reload();
          }
          return;
        }
      );
    },
    1000,
    watch
  );

  const routeConstructor = useRouteConstructor();

  return (
    <div className="flex flex-col justify-center w-full text-slate-700 dark:text-slate-400">
      <ScrollRestoration />
      {environment !== 'nx-console' ? (
        <header className="flex w-full justify-center items-center px-4 py-2 border-b-2 border-slate-900/10 mb-16 dark:border-slate-300/10">
          <div className="flex flex-grow items-center justify-between max-w-6xl">
            <svg
              className="h-10 w-auto text-slate-900 dark:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Nx</title>
              <path d="M11.987 14.138l-3.132 4.923-5.193-8.427-.012 8.822H0V4.544h3.691l5.247 8.833.005-3.998 3.044 4.759zm.601-5.761c.024-.048 0-3.784.008-3.833h-3.65c.002.059-.005 3.776-.003 3.833h3.645zm5.634 4.134a2.061 2.061 0 0 0-1.969 1.336 1.963 1.963 0 0 1 2.343-.739c.396.161.917.422 1.33.283a2.1 2.1 0 0 0-1.704-.88zm3.39 1.061c-.375-.13-.8-.277-1.109-.681-.06-.08-.116-.17-.176-.265a2.143 2.143 0 0 0-.533-.642c-.294-.216-.68-.322-1.18-.322a2.482 2.482 0 0 0-2.294 1.536 2.325 2.325 0 0 1 4.002.388.75.75 0 0 0 .836.334c.493-.105.46.36 1.203.518v-.133c-.003-.446-.246-.55-.75-.733zm2.024 1.266a.723.723 0 0 0 .347-.638c-.01-2.957-2.41-5.487-5.37-5.487a5.364 5.364 0 0 0-4.487 2.418c-.01-.026-1.522-2.39-1.538-2.418H8.943l3.463 5.423-3.379 5.32h3.54l1.54-2.366 1.568 2.366h3.541l-3.21-5.052a.7.7 0 0 1-.084-.32 2.69 2.69 0 0 1 2.69-2.691h.001c1.488 0 1.736.89 2.057 1.308.634.826 1.9.464 1.9 1.541a.707.707 0 0 0 1.066.596zm.35.133c-.173.372-.56.338-.755.639-.176.271.114.412.114.412s.337.156.538-.311c.104-.231.14-.488.103-.74z" />
            </svg>
            <ul className="flex items-center">
              <li>
                <Link
                  to={routeConstructor(
                    `/projects/${encodeURIComponent(project.name)}`,
                    true
                  )}
                  title="View in Graph"
                >
                  Graph
                </Link>
              </li>
              <li className="ml-4">
                <ThemePanel />
              </li>
            </ul>
          </div>
        </header>
      ) : null}
      <div className="flex-grow mx-auto w-full max-w-6xl px-8 mb-8">
        <ProjectDetails
          project={project}
          sourceMap={sourceMap}
        ></ProjectDetails>
      </div>
    </div>
  );
}