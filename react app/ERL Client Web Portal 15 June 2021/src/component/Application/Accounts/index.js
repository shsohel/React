import { approvalProcess, roles, users } from 'constants/PermissionsType';
import PageLoader from 'containers/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';

const Accounts = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasRoleCreatePermission = userPermission?.includes(roles.CREATE);
  const hasRoleEditPermission = userPermission?.includes(roles.EDIT);
  const hasRoleViewPermission = userPermission?.includes(roles.VIEW);
  const hasUserCreatePermission = userPermission?.includes(users.CREATE);
  const hasUserEditPermission = userPermission?.includes(users.EDIT);
  const hasUserViewPermission = userPermission?.includes(users.VIEW);
  const hasApprovalProcessViewPermission = userPermission?.includes(approvalProcess.VIEW);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}/role`} component={lazy(() => import('./Roles/RoleList'))} />

        <Route exact path={`${requestedUrl}/role/new`} component={lazy(() => import('./Roles/RoleForm'))} />
        <Route exact path={`${requestedUrl}/role/edit`} component={lazy(() => import('./Roles/RoleEdit'))} />
        <Route exact path={`${requestedUrl}/user`} component={lazy(() => import('./Users/UserList'))} />
        <Route exact path={`${requestedUrl}/profile`} component={lazy(() => import('./Profiles/ProfileView'))} />
        <Route exact path={`${requestedUrl}/profile-update`} component={lazy(() => import('./Profiles/ProfileUpdate'))} />
        <Route
          exact
          path={`${requestedUrl}/approval-process`}
          component={lazy(() => import('./ApprovalProcess/ApprovalProcessList'))}
        />
        <Route exact path={`${requestedUrl}/user-new`} component={lazy(() => import('./Users/UserForm'))} />
        <Route exact path={`${requestedUrl}/user-update`} component={lazy(() => import('./Users/UserEditForm'))} />
      </Switch>
    </Suspense>
  );
};

export default Accounts;
