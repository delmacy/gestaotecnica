import "dotenv/config";
import { parseArgs } from "util";
import { getTaskKit } from "../services/task-kit";
import { closeAgentWorkDb } from "../db";
import fs from "fs/promises";
import path from "path";

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      worker: {
        type: "string",
      },
    },
  });

  if (!values.worker) {
    console.error("Usage: npm run agent-work:task-kit -- --worker <worker-key>");
    process.exit(1);
  }

  try {
    const kit = await getTaskKit(values.worker);

    let md = `# Task Kit — ${kit.worker.key}\n\n`;
    md += `## Worker\n`;
    md += `- Role: ${kit.worker.role}\n`;
    md += `- Domain: ${kit.worker.domainKey}\n`;
    md += `- Active Claims: ${kit.activeClaims.length}\n\n`;

    md += `## Jobs\n\n`;

    for (const { job, boxes, dependencies, allowedPaths, forbiddenPaths, promptSummary, instructionsMd } of kit.jobs) {
        md += `### ${job.key} — ${job.title}\n`;
        md += `- Status: ${job.status}\n`;
        md += `- Priority: ${job.priority}\n`;
        md += `- Branch: ${job.branchName || 'N/A'}\n`;
        md += `- PR: ${job.githubPr || 'N/A'}\n\n`;

        if (instructionsMd) {
            md += `#### Instructions\n${instructionsMd}\n\n`;
        }

        if (allowedPaths && allowedPaths.length > 0) {
            md += `#### Allowed Paths\n${allowedPaths.map((p: any) => `- ${p}`).join('\n')}\n\n`;
        }

        if (forbiddenPaths && forbiddenPaths.length > 0) {
            md += `#### Forbidden Paths\n${forbiddenPaths.map((p: any) => `- ${p}`).join('\n')}\n\n`;
        }

        if (dependencies && dependencies.length > 0) {
             md += `#### Dependencies\n${dependencies.map((d: any) => `- ${d.dependsOnJobKey} (${d.dependencyType})`).join('\n')}\n\n`;
        }

        if (boxes.length > 0) {
            md += `#### Task Boxes\n\n`;
            for (const { box, tasks } of boxes) {
                md += `##### Box: ${box.title}\n`;
                md += `| Task | Status | Priority |\n`;
                md += `|---|---|---|\n`;
                for (const t of tasks) {
                    md += `| ${t.title} | ${t.status} | ${t.priority} |\n`;
                }
                md += `\n`;
            }
        }
    }

    md += `## Commands to use\n\n`;
    md += `\`\`\`bash\n`;
    md += `npm run agent-work:claim -- --worker ${kit.worker.key} --job <JOB_KEY>\n`;
    md += `npm run agent-work:update-task -- --worker ${kit.worker.key} --job <JOB_KEY> --task <TASK_KEY> --status in_progress\n`;
    md += `npm run agent-work:append-event -- --worker ${kit.worker.key} --job <JOB_KEY> --message "..."\n`;
    md += `npm run agent-work:dump\n`;
    md += `\`\`\`\n`;

    console.log(md);

    const dumpsDir = path.resolve(process.cwd(), "docs/agent-work/dumps/workers");
    await fs.mkdir(dumpsDir, { recursive: true });
    await fs.writeFile(path.join(dumpsDir, `${kit.worker.key}_TASK_KIT.md`), md);

  } catch (error: any) {
    console.error("Error generating task kit:", error.message);
  } finally {
    await closeAgentWorkDb();
  }
}

main();
