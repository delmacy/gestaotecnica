const { execSync } = require('child_process');

try {
  // Use pseudo-TTY to trick drizzle-kit into running non-interactively
  execSync('script -q -c "npm run db:generate" /dev/null', { stdio: 'inherit' });
} catch (error) {
  console.error("Failed to generate migration.", error);
}
