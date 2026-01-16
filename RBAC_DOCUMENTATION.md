## Role-Based Access Control (RBAC) Implementation

This document describes the RBAC system implemented in Aegis Flow.

### Architecture Overview

The RBAC system consists of three main components:

1. **Permissions Matrix** (`src/lib/permissions.ts`)
   - Master list of all permissions
   - Permission definitions for each role
   - Helper functions for permission checking

2. **PermissionGuard Component** (`src/components/PermissionGuard.tsx`)
   - Conditional rendering based on permissions
   - Supports single permission or multiple permissions
   - Can render fallback content if permission denied

3. **usePermissions Hook** (`src/hooks/usePermissions.ts`)
   - React hook for permission checking in components
   - Helper methods for common permission patterns
   - Role-specific checks (isAdmin, isSuperAdmin, etc.)

### Usage Examples

#### Using PermissionGuard Component

```tsx
import { PermissionGuard } from "@/components/PermissionGuard";

// Single permission
<PermissionGuard userRole={userRole} permission="payroll:approve">
  <ApprovePayrollButton />
</PermissionGuard>

// Multiple permissions (ALL required)
<PermissionGuard 
  userRole={userRole} 
  permissions={["payroll:run", "payroll:edit"]}
>
  <PayrollForm />
</PermissionGuard>

// Multiple permissions (ANY required)
<PermissionGuard 
  userRole={userRole} 
  permissions={["payroll:run", "compliance:file"]}
  requireAll={false}
>
  <ActionButtons />
</PermissionGuard>

// With fallback
<PermissionGuard 
  userRole={userRole} 
  permission="billing:manage"
  fallback={<div>You don't have permission to manage billing</div>}
>
  <BillingPanel />
</PermissionGuard>
```

#### Using usePermissions Hook

```tsx
import { usePermissions } from "@/hooks/usePermissions";

export function PayrollPage() {
  const { can, canAny, isAdmin } = usePermissions(userRole);

  return (
    <div>
      {can("payroll:run") && <RunPayrollButton />}
      {canAny(["payroll:edit", "payroll:approve"]) && <EditActions />}
      {isAdmin() && <AdminPanel />}
      {can("payroll:approve") ? (
        <ApproveButton />
      ) : (
        <LockedMessage />
      )}
    </div>
  );
}
```

### Permission Categories

#### Company Management
- `company:edit` - Edit company profile
- `company:view` - View company details
- `billing:manage` - Manage subscriptions and billing
- `billing:view` - View billing history

#### User Management
- `users:invite` - Invite new users
- `users:assign-roles` - Assign roles to users
- `users:remove` - Remove users
- `users:view` - View user list
- `users:edit` - Edit user details

#### Employee Management
- `employees:create` - Create new employees
- `employees:edit` - Edit employee information
- `employees:delete` - Delete employees
- `employees:view` - View employee records

#### Payroll
- `payroll:run` - Run payroll calculations
- `payroll:edit` - Edit payroll data
- `payroll:approve` - Approve payroll
- `payroll:view` - View payroll information
- `payroll:download-payslips` - Download payslips

#### Compliance
- `compliance:calculate` - Calculate tax obligations
- `compliance:file` - File compliance returns
- `compliance:upload-receipts` - Upload tax receipts
- `compliance:view` - View compliance information

#### Documents
- `documents:upload` - Upload documents
- `documents:download` - Download documents
- `documents:delete` - Delete documents
- `documents:view` - View documents

#### Reports
- `reports:generate` - Generate reports
- `reports:export` - Export report data

#### API
- `api:manage-keys` - Create/manage API keys
- `api:use` - Use API

#### System
- `system:audit-logs` - View audit logs
- `system:feature-flags` - Manage feature flags
- `system:override-limits` - Override subscription limits

### Role Permission Matrix

| Feature | Super Admin | Company Admin | Accountant | Staff | Read-Only |
|---------|:-----------:|:-------------:|:----------:|:-----:|:---------:|
| **Company Management** |
| Edit company profile | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage subscription | ✓ | ✓ | ✗ | ✗ | ✗ |
| View billing history | ✓ | ✓ | ✗ | ✗ | ✗ |
| **User Management** |
| Invite users | ✓ | ✓ | ✗ | ✗ | ✗ |
| Assign roles | ✓ | ✓ | ✗ | ✗ | ✗ |
| Remove users | ✓ | ✓ | ✗ | ✗ | ✗ |
| View users | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Employee Management** |
| Create employees | ✓ | ✓ | ✓ | ✗ | ✗ |
| Edit employees | ✓ | ✓ | ✓ | ✗ | ✗ |
| Delete employees | ✓ | ✓ | ✗ | ✗ | ✗ |
| View employees | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Payroll** |
| Run payroll | ✓ | ✓ | ✓ | ✗ | ✗ |
| Edit payroll | ✓ | ✓ | ✓ | ✗ | ✗ |
| Approve payroll | ✓ | ✓ | ✗ | ✗ | ✗ |
| View payroll | ✓ | ✓ | ✓ | ✓ | ✓ |
| Download payslips | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Compliance** |
| Calculate obligations | ✓ | ✓ | ✓ | ✗ | ✗ |
| File compliance | ✓ | ✓ | ✓ | ✗ | ✗ |
| Upload receipts | ✓ | ✓ | ✓ | ✗ | ✗ |
| View compliance | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Documents** |
| Upload documents | ✓ | ✓ | ✓ | ✗ | ✗ |
| Download documents | ✓ | ✓ | ✓ | ✓ | ⚙️ |
| Delete documents | ✓ | ✓ | ✗ | ✗ | ✗ |
| View documents | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Reports** |
| Generate reports | ✓ | ✓ | ✓ | ✓ | ✓ |
| Export data | ✓ | ✓ | ✓ | ⚙️ | ⚙️ |
| **API** |
| Manage API keys | ✓ | ⚙️ | ✗ | ✗ | ✗ |
| Use API | ✓ | ✓ | ✓ | ✗ | ✗ |
| **System** |
| View audit logs | ✓ | ✓ | ✓ | ✗ | ✗ |
| Manage feature flags | ✓ | ✗ | ✗ | ✗ | ✗ |

Legend: ✓ = Allowed, ✗ = Denied, ⚙️ = Can be configured by admin

### Implementing Permission Checks in Components

#### Dashboard Quick Actions
The Dashboard uses both `quickActionsConfig` for UI and `PermissionGuard` for rendering sections:

```tsx
// In Dashboard.tsx
const { can } = usePermissions(userRole);
const quickActions = quickActionsConfig[userRole];

// Render sections conditionally
<PermissionGuard userRole={userRole} permission="compliance:view">
  <ComplianceHealthCard />
</PermissionGuard>

<PermissionGuard userRole={userRole} permission="payroll:view">
  <PayrollSummaryCard />
</PermissionGuard>
```

#### Modal/Dialog Permissions
Use PermissionGuard to control button visibility:

```tsx
<PermissionGuard userRole={userRole} permission="payroll:approve">
  <Button onClick={approvePayroll}>Approve Payroll</Button>
</PermissionGuard>
```

#### Form Submission
Check permission before allowing form submission:

```tsx
const { can } = usePermissions(userRole);

if (!can("employees:create")) {
  return <div>You don't have permission to create employees</div>;
}

return <EmployeeForm />;
```

### Future Enhancements

1. **Permission Middleware** - Backend API middleware to enforce permissions server-side
2. **Audit Logging** - Log all permission-based actions
3. **Permission Customization** - Allow company admins to customize staff permissions
4. **Row-Level Security** - Restrict data based on user access level
5. **Feature Flags** - Combine permissions with feature flags for gradual rollouts
6. **Usage Analytics** - Track which permissions are most used

### Testing Permission Guards

When testing, you can manually change the `userRole` state in Dashboard or other components:

```tsx
const [userRole, setUserRole] = useState<UserRole>("company_admin");

// In dev environment, you could add a role switcher:
<select onChange={(e) => setUserRole(e.target.value as UserRole)}>
  <option value="super_admin">Super Admin</option>
  <option value="company_admin">Company Admin</option>
  <option value="accountant">Accountant</option>
  <option value="staff">Staff</option>
  <option value="read_only">Read-Only</option>
</select>
```
