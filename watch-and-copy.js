const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');

const SHARED_RESOURCES = [
  {
    name: 'dto',
    source: path.join(__dirname, 'shared-dto/src'),
    targetSubdir: 'dto',
    ignore: /\.(test|spec|e2e)\.ts$/, 
    projects: ['api', 'frontend', 'mobile']
  },
  {
    name: 'constants',
    source: path.join(__dirname, 'shared-constants/src'),
    targetSubdir: 'constants',
    ignore: /\.(test|spec|e2e)\.ts$/,
    projects: ['api', 'frontend', 'mobile']
  },
  {
    name: 'store',
    source: path.join(__dirname, 'shared-store/src'),
    targetSubdir: 'store',
    ignore: /\.(test|spec|e2e|mock)\.ts$/, 
    projects: ['frontend', 'mobile']
  }
];
const copyResource = async (resource) => {
  const { source, targetSubdir, ignore, projects } = resource;

  try {
    for (const project of projects) {
      const targetDir = path.join(__dirname, project, 'src', targetSubdir);
      
      await fs.emptyDir(targetDir);
      await fs.copy(source, targetDir, {
        filter: (src) => {
          const isTestFile = ignore.test(src) || path.basename(src).includes('.test.');
          return !isTestFile;
        }
      });
      console.log(`✅ [${resource.name}] → ${targetDir}`);
    }
  } catch (err) {
    console.error(`❌ [${resource.name}] Błąd:`, err);
  }
};

SHARED_RESOURCES.forEach(resource => {
  chokidar.watch(resource.source).on('all', (event, filePath) => {
    console.log(`🔄 [${resource.name}] Zmiana: ${path.basename(filePath)}`);
    copyResource(resource);
  });
});

console.log('👀 Rozpoczynam obserwację...');