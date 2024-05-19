/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */
import { InternalError } from '@lib/errors';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

class Role {
  private readonly roleName: string;
  private readonly children: Role[] = [];

  constructor(roleName: string) {
    this.roleName = roleName;
  }

  getRoleName(): string {
    return this.roleName;
  }

  getChildren(): Role[] {
    return this.children;
  }

  addChildren(role: Role): Role {
    this.children.push(role);
    return this;
  }
}

export class RoleAuthorizer {
  private readonly roleBitValues: Map<string, number> = new Map();

  static createRole(roleName: string): Role {
    return new Role(roleName);
  }

  constructor(roles: Role[]) {
    if (roles.length === 0) throw new InternalError('There must be at least one role');
    this.initBitValues(roles);
  }

  private initBitValues(roles: Role[]): number {
    let score = 0;

    for (const role of roles) {
      const roleName = role.getRoleName();
      let roleScore = this.roleBitValues.get(roleName);
      if (roleScore !== undefined) {
        score |= roleScore;
        continue;
      }

      const children = role.getChildren();
      const childrenScore = this.initBitValues(children);
      const baseScore = 1 << this.roleBitValues.size;
      roleScore = baseScore | childrenScore;
      this.roleBitValues.set(roleName, roleScore);
      if (this.roleBitValues.size === 32) throw new InternalError('There can be at most 32 roles');
      score |= roleScore;
    }

    return score;
  }

  authorize(requiredRole: string, actualRole: string): boolean {
    const requiredScore = this.roleBitValues.get(requiredRole);
    if (requiredScore === undefined) throw new InternalError(`Role '${requiredRole}' not found`);

    const actualScore = this.roleBitValues.get(actualRole);
    if (actualScore === undefined) throw new InternalError(`Role '${actualRole}' not found`);

    return (actualScore & requiredScore) === requiredScore;
  }
}
