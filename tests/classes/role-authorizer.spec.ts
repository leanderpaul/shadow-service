/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */
import { InternalError, RoleAuthorizer } from 'shadow-service';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('Role Authorizer', () => {
  let roleAuthorizer: RoleAuthorizer;

  describe('init', () => {
    it('should throw an error if the roles are not provided', () => {
      const error = new InternalError('There must be at least one role');
      expect(() => new RoleAuthorizer([])).toThrow(error);
    });

    it('should throw an error if there are more than 32 roles', () => {
      const roles = Array.from({ length: 33 }, (_, i) => RoleAuthorizer.createRole(`role-${i}`));
      const error = new InternalError('There can be at most 32 roles');
      expect(() => new RoleAuthorizer(roles)).toThrow(error);
    });

    it('should initialize the role authorizer with the given roles', () => {
      /**
       *            A
       *          /   \
       *         B     C
       *      /  \   /  \
       *    D    E F    G
       *        |  |    |
       *       H   |   I
       *           |  /
       *            J
       */

      const A = RoleAuthorizer.createRole('A');
      const B = RoleAuthorizer.createRole('B');
      const C = RoleAuthorizer.createRole('C');
      const D = RoleAuthorizer.createRole('D');
      const E = RoleAuthorizer.createRole('E');
      const F = RoleAuthorizer.createRole('F');
      const G = RoleAuthorizer.createRole('G');
      const H = RoleAuthorizer.createRole('H');
      const I = RoleAuthorizer.createRole('I');
      const J = RoleAuthorizer.createRole('J');
      A.addChildren(B).addChildren(C);
      B.addChildren(D).addChildren(E);
      C.addChildren(F).addChildren(G);
      E.addChildren(H);
      F.addChildren(J);
      G.addChildren(I);
      I.addChildren(J);

      roleAuthorizer = new RoleAuthorizer([A, B, C]);
      expect(roleAuthorizer).toBeInstanceOf(RoleAuthorizer);
    });
  });

  describe('authorize', () => {
    it('should throw an error if the required role is not found', () => {
      const error = new InternalError("Role 'Z' not found");
      expect(() => roleAuthorizer.authorize('Z', 'A')).toThrow(error);
    });

    it('should throw an error if the actual role is not found', () => {
      const error = new InternalError("Role 'Z' not found");
      expect(() => roleAuthorizer.authorize('A', 'Z')).toThrow(error);
    });

    it('should return true if the role is authorized', () => {
      expect(roleAuthorizer.authorize('A', 'A')).toBe(true);
      expect(roleAuthorizer.authorize('H', 'B')).toBe(true);
      expect(roleAuthorizer.authorize('J', 'F')).toBe(true);
      expect(roleAuthorizer.authorize('J', 'G')).toBe(true);
      expect(roleAuthorizer.authorize('J', 'A')).toBe(true);
      expect(roleAuthorizer.authorize('F', 'C')).toBe(true);
      expect(roleAuthorizer.authorize('D', 'B')).toBe(true);
    });

    it('should return false if the role is not authorized', () => {
      expect(roleAuthorizer.authorize('J', 'B')).toBe(false);
      expect(roleAuthorizer.authorize('A', 'B')).toBe(false);
      expect(roleAuthorizer.authorize('C', 'B')).toBe(false);
      expect(roleAuthorizer.authorize('J', 'H')).toBe(false);
      expect(roleAuthorizer.authorize('E', 'F')).toBe(false);
    });
  });
});
