import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@pages/Dashboard/Dashboard';
import CreateAgreement from '@pages/CreateAgreement/CreateAgreement';
import ModifyAgreement from '@pages/ModifyAgreement/ModifyAgreement';
import PendingModificationRequests from '@pages/PendingModificationRequests/PendingModificationRequests';
import AgreementDetails from '@pages/AgreementDetails/AgreementDetails';

interface AppRoutesProps {
  basePath?: string;
}

const AppRoutes = ({ basePath = '' }: AppRoutesProps) => {
  const getPath = (path: string) => `${basePath}${path}`;

  return (
    <Routes>
      <Route path={getPath('/')} element={<Navigate to={getPath('/dashboard')} replace />} />
      <Route path={getPath('/dashboard')} element={<Dashboard />} />
      <Route path={getPath('/agreements/create')} element={<CreateAgreement />} />
      <Route path={getPath('/agreements/:id')} element={<AgreementDetails />} />
      <Route path={getPath('/agreements/:id/modify')} element={<ModifyAgreement />} />
      <Route path={getPath('/pending-modifications')} element={<PendingModificationRequests />} />
      <Route path="*" element={<Navigate to={getPath('/dashboard')} replace />} />
    </Routes>
  );
};

export default AppRoutes;
