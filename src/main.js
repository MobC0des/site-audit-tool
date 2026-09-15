import './style.css';

import { checks } from './data/checks.js';
import { calculateProgress } from './utils/calculate-progress.js';
import { getCheckStatusLabel } from './utils/get-check-status-label.js';
import { getLaunchStatus } from './utils/get-launch-status.js';

const app = document.querySelector('#app');

let automatedChecks = [];
let isAuditing = false;
let auditError = '';

const project = {
  name: 'Northstar Growth Hub',
  type: 'Lovable',
  url: 'https://example.com',
};

const PROJECT_STORAGE_KEY = 'launchcheck-project';
const CHECKS_STORAGE_KEY = 'launchcheck-checks';

async function fetchAudit(url) {
  isAuditing = true;
  auditError = '';

  render();

  try {
    const response = await fetch(
      `/api/audit?url=${encodeURIComponent(url)}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Audit failed');
    }

    automatedChecks = data.auditResults;

    console.log('External audit:', data);
    console.log('Audit results:', automatedChecks);
  } catch (error) {
    console.error('Unable to run audit:', error);

    auditError = error.message;
  } finally {
    isAuditing = false;

    render();
  }
}

function loadData() {
  const savedProject = localStorage.getItem(PROJECT_STORAGE_KEY);
  const savedChecks = localStorage.getItem(CHECKS_STORAGE_KEY);

  if (savedProject) {
    const parsedProject = JSON.parse(savedProject);

    project.name = parsedProject.name;
    project.type = parsedProject.type;
    project.url = parsedProject.url;
  }

  if (savedChecks) {
    const parsedChecks = JSON.parse(savedChecks);

    checks.forEach((check) => {
      const savedCheck = parsedChecks.find(
        (item) => item.id === check.id,
      );

      if (savedCheck) {
        check.complete = savedCheck.complete;
      }
    });
  }
}

function saveData() {
  localStorage.setItem(
    PROJECT_STORAGE_KEY,
    JSON.stringify(project),
  );

  localStorage.setItem(
    CHECKS_STORAGE_KEY,
    JSON.stringify(checks),
  );
}

function render() {
  const progress = calculateProgress(checks);

  const completedChecks = checks.filter(
    (check) => check.complete,
  );

  const categories = [
    ...new Set(checks.map((check) => check.category)),
  ];

  const status = getLaunchStatus(progress);

  const passedAutomatedChecks = automatedChecks.filter(
    (check) => check.status === 'Passed',
  );

  const warningAutomatedChecks = automatedChecks.filter(
    (check) => check.status === 'Warning',
  );

  const failedAutomatedChecks = automatedChecks.filter(
    (check) => check.status === 'Failed',
  );

  const message = `You have completed ${completedChecks.length} out of ${checks.length} checks.`;

  app.innerHTML = `
    <div class="min-h-screen bg-slate-50 text-slate-900">

      <div class="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-6">

        <!-- Main content -->
        <main class="p-6 lg:col-span-6 lg:p-8">

          <!-- Header -->
          <header id="overview">

            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <div class="flex items-center gap-3">

                  <h2 class="text-3xl font-bold tracking-tight">
                    ${project.name}
                  </h2>

                  <span class="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium">
                    ${project.type}
                  </span>

                </div>

                <a
                  href="${project.url}"
                  target="_blank"
                  rel="noreferrer"
                  class="mt-2 inline-block text-sm text-slate-500 hover:text-slate-900"
                >
                  ${project.url}
                </a>

              </div>

            </div>

          </header>

          <!-- Summary cards -->
          <section class="mt-8 grid gap-4 md:grid-cols-3">

            <article class="rounded-xl border border-slate-200 bg-white p-6">

              <p class="text-sm font-medium text-slate-500">
                Project readiness
              </p>

              <p class="mt-3 text-4xl font-bold">
                ${progress}%
              </p>

              <p class="mt-2 text-sm text-slate-500">
                ${completedChecks.length} of ${checks.length} manual checks completed
              </p>

            </article>

            <article class="rounded-xl border border-slate-200 bg-white p-6">

              <p class="text-sm font-medium text-slate-500">
                Launch status
              </p>

              <p class="mt-3 text-2xl font-bold">
                ${status}
              </p>

              <p class="mt-2 text-sm text-slate-500">
                ${message}
              </p>

            </article>

            <article class="rounded-xl border border-slate-200 bg-white p-6">

              <p class="text-sm font-medium text-slate-500">
                Automated checks
              </p>

              <p class="mt-3 text-4xl font-bold">
                ${passedAutomatedChecks.length} / ${automatedChecks.length}
              </p>

              <div class="mt-3 flex flex-wrap gap-3 text-sm">

                <span class="text-emerald-700">
                  ${passedAutomatedChecks.length} passed
                </span>

                <span class="text-amber-700">
                  ${warningAutomatedChecks.length} warnings
                </span>

                <span class="text-red-700">
                  ${failedAutomatedChecks.length} failed
                </span>

              </div>

            </article>

          </section>

          <!-- Project details -->
          <section
            id="project-details"
            class="mt-6 rounded-xl border border-slate-200 bg-white p-6"
          >

            <div class="flex items-center justify-between">

              <div>

                <h2 class="text-xl font-semibold">
                  Project details
                </h2>

                <p class="mt-1 text-sm text-slate-500">
                  Update the project you are preparing to launch.
                </p>

              </div>

            </div>

            <form
              id="project-form"
              class="mt-6 grid gap-4 md:grid-cols-3"
            >

              <div>

                <label
                  for="project-name"
                  class="mb-2 block text-sm font-medium"
                >
                  Project name
                </label>

                <input
                  id="project-name"
                  type="text"
                  value="${project.name}"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
                />

              </div>

              <div>

                <label
                  for="project-type"
                  class="mb-2 block text-sm font-medium"
                >
                  Project type
                </label>

                <select
                  id="project-type"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
                >

                  <option
                    value="Lovable"
                    ${project.type === 'Lovable' ? 'selected' : ''}
                  >
                    Lovable
                  </option>

                  <option
                    value="HubSpot"
                    ${project.type === 'HubSpot' ? 'selected' : ''}
                  >
                    HubSpot
                  </option>

                  <option
                    value="Other"
                    ${project.type === 'Other' ? 'selected' : ''}
                  >
                    Other
                  </option>

                </select>

              </div>

              <div>

                <label
                  for="project-url"
                  class="mb-2 block text-sm font-medium"
                >
                  Project URL
                </label>

                <input
                  id="project-url"
                  type="url"
                  value="${project.url}"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
                />

              </div>

              <div class="flex gap-3 md:col-span-3">

                <button
                  type="submit"
                  class="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
                >
                  Save project
                </button>

                <button
                  id="run-audit"
                  type="button"
                  ${isAuditing ? 'disabled' : ''}
                  class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ${isAuditing ? 'Running audit...' : 'Run audit'}
                </button>

              </div>
              ${auditError
      ? `
                    <p class="text-sm text-red-600 md:col-span-3">
                      ${auditError}
                    </p>
                  `
      : ''
    }

            </form>

          </section>

          <!-- Automated checks -->
          <section
            id="automated-checks"
            class="mt-6 rounded-xl border border-slate-200 bg-white p-6"
          >

            <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <h2 class="text-xl font-semibold">
                  Automated checks
                </h2>

                <p class="mt-1 text-sm text-slate-500">
                  Technical checks that can catch common launch snags.
                </p>

              </div>

              <p class="text-sm font-medium text-slate-600">
                ${passedAutomatedChecks.length} of ${automatedChecks.length} passed
              </p>

            </div>

            <ul class="mt-6 divide-y divide-slate-200">

              ${automatedChecks
      .map(
        (check) => `
                    <li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p class="font-semibold">
                          ${check.name}
                        </p>

                        <p class="mt-1 text-sm text-slate-500">
                          ${check.message}
                        </p>

                      </div>

                      <span
                        class="
                          w-fit rounded-full px-3 py-1 text-sm font-medium
                          ${check.status === 'Passed'
            ? 'bg-emerald-100 text-emerald-800'
            : check.status === 'Warning'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-red-100 text-red-800'
          }
                        "
                      >
                        ${getCheckStatusLabel(check.status)}
                      </span>

                    </li>
                  `,
      )
      .join('')}

            </ul>

          </section>

          <!-- Manual checklist -->
          <section
            id="manual-checklist"
            class="mt-6"
          >

            <div>

              <h2 class="text-xl font-semibold">
                Manual checklist
              </h2>

              <p class="mt-1 text-sm text-slate-500">
                Final human checks before launch.
              </p>

            </div>

            <div class="mt-4 grid gap-4 md:grid-cols-2">

              ${categories
      .map((category) => {
        const categoryChecks = checks.filter(
          (check) => check.category === category,
        );

        const completedCategoryChecks =
          categoryChecks.filter(
            (check) => check.complete,
          );

        return `
                    <section class="rounded-xl border border-slate-200 bg-white p-6">

                      <div class="flex items-center justify-between">

                        <h3 class="text-lg font-semibold">
                          ${category}
                        </h3>

                        <span class="text-sm text-slate-500">
                          ${completedCategoryChecks.length}
                          /
                          ${categoryChecks.length}
                        </span>

                      </div>

                      <ul class="mt-4 space-y-3">

                        ${categoryChecks
            .map(
              (check) => `
                              <li>

                                <label
                                  class="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-slate-50"
                                >

                                  <input
                                    type="checkbox"
                                    data-id="${check.id}"
                                    ${check.complete ? 'checked' : ''}
                                    class="mt-1 h-4 w-4"
                                  />

                                  <span
                                    class="${check.complete
                  ? 'text-slate-400 line-through'
                  : 'text-slate-700'
                }"
                                  >
                                    ${check.name}
                                  </span>

                                </label>

                              </li>
                            `,
            )
            .join('')}

                      </ul>

                    </section>
                  `;
      })
      .join('')}

            </div>

          </section>

        </main>

      </div>

    </div>
  `;

  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]',
  );

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener(
      'change',
      handleCheckChange,
    );
  });

  const projectForm = document.querySelector(
    '#project-form',
  );

  projectForm.addEventListener(
    'submit',
    handleProjectSubmit,
  );

  const runAuditButton = document.querySelector(
    '#run-audit',
  );

  runAuditButton.addEventListener('click', () => {
    fetchAudit(project.url);
  });
}

function handleCheckChange(event) {
  const checkId = event.target.dataset.id;

  const check = checks.find(
    (item) => item.id === checkId,
  );

  if (!check) {
    return;
  }

  check.complete = event.target.checked;

  saveData();
  render();
}

function handleProjectSubmit(event) {
  event.preventDefault();

  const projectName = document.querySelector(
    '#project-name',
  );

  const projectType = document.querySelector(
    '#project-type',
  );

  const projectUrl = document.querySelector(
    '#project-url',
  );

  project.name = projectName.value;
  project.type = projectType.value;
  project.url = projectUrl.value;

  saveData();
  render();
}

loadData();
render();
