import './style.css';

import { automatedChecks } from './data/automated-checks.js';
import { checks } from './data/checks.js';
import { calculateProgress } from './utils/calculate-progress.js';
import { getCheckStatusLabel } from './utils/get-check-status-label.js';
import { getLaunchStatus } from './utils/get-launch-status.js';

const app = document.querySelector('#app');

const project = {
  name: 'Northstar Growth Hub',
  type: 'Lovable',
  url: 'https://example.com',
};

const PROJECT_STORAGE_KEY = 'launchcheck-project';
const CHECKS_STORAGE_KEY = 'launchcheck-checks';

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

  const message = `You have completed ${completedChecks.length} out of ${checks.length} checks.`;

  app.innerHTML = `
    <main class="mx-auto max-w-4xl p-6">

      <h1 class="text-4xl font-bold">
        LaunchCheck
      </h1>

      <section class="mt-6 rounded-xl border p-4">

        <h2 class="text-2xl font-semibold">
          Project details
        </h2>

        <form
          id="project-form"
          class="mt-4 space-y-4"
        >

          <input
            id="project-name"
            type="text"
            value="${project.name}"
            class="w-full rounded-md border p-2"
          />

          <select
            id="project-type"
            class="w-full rounded-md border p-2"
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

          <input
            id="project-url"
            type="url"
            value="${project.url}"
            class="w-full rounded-md border p-2"
          />

          <button
            type="submit"
            class="rounded-md border px-4 py-2"
          >
            Save project
          </button>

        </form>

        <div class="mt-4">
          <h3 class="text-xl font-semibold">
            ${project.name}
          </h3>

          <p>${project.type}</p>

          <a
            href="${project.url}"
            target="_blank"
            rel="noreferrer"
          >
            ${project.url}
          </a>
        </div>

      </section>

      <section class="mt-6 rounded-xl border p-4">

        <h2 class="text-2xl font-semibold">
          Readiness
        </h2>

        <p class="mt-2">
          Project readiness: ${progress}%
        </p>

        <p>${message}</p>

        <p>
          Launch status: ${status}
        </p>

      </section>

      <section class="mt-6 rounded-xl border p-4">

        <h2 class="text-2xl font-semibold">
          Automated checks
        </h2>
        <p>${passedAutomatedChecks.length} out of ${automatedChecks.length} checks passed.</p>

        <ul class="mt-4 space-y-3">

          ${automatedChecks
      .map(
        (check) => `
                <li>
                  <p class="font-semibold">
                    ${check.name}
                  </p>

                  <p>
                    ${check.message}
                  </p>

                  <p>
                    Status:
                    ${getCheckStatusLabel(check.status)}
                  </p>
                </li>
              `,
      )
      .join('')}

        </ul>

      </section>

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
            <section class="mt-6 rounded-xl border p-4">

              <h2 class="text-2xl font-semibold">
                ${category}
              </h2>

              <p>
                ${completedCategoryChecks.length}
                of
                ${categoryChecks.length}
                complete
              </p>

              <ul class="mt-4 space-y-3">

                ${categoryChecks
            .map(
              (check) => `
                      <li>
                        <label class="flex items-center gap-3">

                          <input
                            type="checkbox"
                            data-id="${check.id}"
                            ${check.complete ? 'checked' : ''}
                          />

                          ${check.name}

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

    </main>
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
