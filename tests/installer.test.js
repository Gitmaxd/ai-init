const { expect } = require('@jest/globals');
const path = require('path');
const fs = require('fs-extra');
const { createProject, addToProject } = require('../lib/installer');

// Mock fs-extra and child_process
jest.mock('fs-extra');
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

describe('Installer module', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup common mock behaviors
    fs.ensureDir.mockResolvedValue(undefined);
    fs.pathExists.mockResolvedValue(false);
    fs.readdir.mockResolvedValue(['file1', 'file2']);
    fs.copy.mockResolvedValue(undefined);
  });

  describe('createProject', () => {
    it('should create directories and copy template files', async () => {
      // Mock getAllFiles function result
      const mockFiles = [
        path.join('templates', 'default', 'file1'),
        path.join('templates', 'default', 'file2'),
      ];
      
      // Mock implementation for getAllFiles
      jest.spyOn(Object.getPrototypeOf(fs), 'readdir').mockImplementation(() => ['file1', 'file2']);
      
      // Execute the function
      const projectPath = await createProject('test-project');
      
      // Verify directory creation
      expect(fs.ensureDir).toHaveBeenCalledWith(expect.stringContaining('test-project'));
      
      // Verify file copying
      expect(fs.copy).toHaveBeenCalled();
    });
    
    it('should throw error with invalid project name', async () => {
      await expect(createProject('invalid@name')).rejects.toThrow();
    });
  });
  
  describe('addToProject', () => {
    it('should detect project type and add files', async () => {
      // Mock package.json content for a Next.js project
      fs.pathExists.mockImplementation((path) => {
        if (path.includes('package.json')) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
      
      fs.readFile.mockResolvedValue(JSON.stringify({
        dependencies: {
          next: '12.0.0'
        }
      }));
      
      // Execute the function
      const projectPath = await addToProject();
      
      // Verify directory creation
      expect(fs.ensureDir).toHaveBeenCalledWith(expect.stringContaining('.cursor/rules'));
      expect(fs.ensureDir).toHaveBeenCalledWith(expect.stringContaining('doc-files/adr'));
      expect(fs.ensureDir).toHaveBeenCalledWith(expect.stringContaining('memory-bank'));
      expect(fs.ensureDir).toHaveBeenCalledWith(expect.stringContaining('mem-scripts'));
    });
  });
});
