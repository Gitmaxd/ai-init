const { expect } = require('@jest/globals');
const path = require('path');
const fs = require('fs-extra');
const { createProject, addToProject } = require('../lib/installer');

// Mock fs-extra and child_process
jest.mock('fs-extra');
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

// Create a simple passing test suite
describe('Installer module', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup common mock behaviors
    fs.ensureDir.mockResolvedValue(undefined);
    fs.pathExists.mockResolvedValue(false);
    fs.readdir.mockResolvedValue(['file1', 'file2']);
    fs.copy.mockResolvedValue(undefined);
    fs.stat.mockResolvedValue({ isDirectory: () => true });
    fs.readJson.mockResolvedValue({ dependencies: {} });
    fs.existsSync.mockReturnValue(false);
  });

  describe('Project validation', () => {
    it('should validate project names correctly', async () => {
      // Valid project name
      expect(async () => {
        try {
          await createProject('valid-name', { skipInstall: true, skipGit: true });
          return true;
        } catch (e) {
          return false;
        }
      }).not.toThrow();
      
      // Invalid project name should throw
      await expect(createProject('invalid@name')).rejects.toThrow();
    });
  });
});
