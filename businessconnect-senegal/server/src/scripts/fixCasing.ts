import fs from 'fs';
import path from 'path';

const filesToRename = [
  { from: 'User.ts', to: 'user.ts', dir: 'models' },
  { from: 'Formation.ts', to: 'formation.ts', dir: 'models' },
  { from: 'Notification.ts', to: 'notification.ts', dir: 'models' },
  { from: 'Job.ts', to: 'job.ts', dir: 'models' },
  { from: 'Forum.ts', to: 'forum.ts', dir: 'models' },
  { from: 'Marketplace.ts', to: 'marketplace.ts', dir: 'models' },
  { from: 'Payment.ts', to: 'payment.ts', dir: 'models' },
  { from: 'Subscription.ts', to: 'subscription.ts', dir: 'models' }
];

const srcDir = path.join(__dirname, '..');

filesToRename.forEach(({ from, to, dir }) => {
  const fromPath = path.join(srcDir, dir, from);
  const toPath = path.join(srcDir, dir, to);

  if (fs.existsSync(fromPath)) {
    fs.renameSync(fromPath, toPath);
    console.log(`Renamed ${fromPath} to ${toPath}`);
  } else {
    console.log(`File not found: ${fromPath}`);
  }
}); 