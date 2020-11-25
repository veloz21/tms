import { routes } from './app-routing.module';

describe('AppRoutingModule', () => {
  describe('validate routes', () => {
    it('should have auth as path', () => {
      expect(routes.find(r => r.path === 'auth')).toBeTruthy();
    });
    it('should have empty as path', () => {
      expect(routes.find(r => r.path === '')).toBeTruthy();
    });
    it('should have children with dashboard as path', () => {
      const emptyPath = routes.find(r => r.path === '');
      expect(emptyPath.children.find(c => c.path === 'dashboard')).toBeTruthy();
    });
    it('should have children with workshop as path', () => {
      const emptyPath = routes.find(r => r.path === '');
      expect(emptyPath.children.find(c => c.path === 'workshop')).toBeTruthy();
    });
    it('should have children with paysheet as path', () => {
      const emptyPath = routes.find(r => r.path === '');
      expect(emptyPath.children.find(c => c.path === 'paysheet')).toBeTruthy();
    });
    it('should have children with travel as path', () => {
      const emptyPath = routes.find(r => r.path === '');
      expect(emptyPath.children.find(c => c.path === 'travel')).toBeTruthy();
    });
  });
});
